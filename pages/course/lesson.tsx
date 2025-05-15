'use client';

import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { Divider } from '@mui/material';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { userVar } from '../../apollo/store';
import { Course } from '../../libs/types/course/course';
import { LIKE_TARGET_COURSE } from '../../apollo/user/mutation';
import { GET_COURSE } from '../../apollo/user/query';
import { CourseSidebar } from '../../libs/components/course/CourseSidebar';
import withLayoutFull from '../../libs/components/layout/LayoutFull';
import { useTranslation } from 'react-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

// Declare YouTube API types
declare global {
	interface Window {
		YT: any;
		onYouTubeIframeAPIReady: () => void;
		likeTargetProperty: any;
	}
}

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const LessonVideo = () => {
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const { t, i18n } = useTranslation('common');
	const [duration, setDuration] = useState(0);
	const playerRef = useRef<any>(null);
	const [courseId, setCourseId] = useState<string | null>(null);
	const [course, setCourse] = useState<Course | null>(null);
	const [selectedModuleIndex, setSelectedModuleIndex] = useState(0);
	const [selectedLessonIndex, setSelectedLessonIndex] = useState(0);
	const [apiLoaded, setApiLoaded] = useState(false);
	const [playerError, setPlayerError] = useState<string | null>(null);
	const [videoId, setVideoId] = useState<string | null>(null);
	const [isVideoChanged, setIsVideoChanged] = useState(false);

	// Track if component is mounted to prevent state updates after unmount
	const isMounted = useRef(true);

	// Get current module and lesson using useMemo to prevent unnecessary recalculations
	const currentModule = useMemo(
		() => course?.courseModuls?.[selectedModuleIndex] || null,
		[course, selectedModuleIndex],
	);

	const currentLesson = useMemo(
		() => currentModule?.lessons?.[selectedLessonIndex] || null,
		[currentModule, selectedLessonIndex],
	);

	// Extract propertyId from router.query.id
	useEffect(() => {
		if (router.query.id && typeof router.query.id === 'string' && router.query.id !== courseId) {
			setCourseId(router.query.id);
		}
	}, [router.query.id, courseId]);

	/** LIFECYCLES **/
	useEffect(() => {
		if (!user._id) router.push('/').then();
	}, [user]);

	// Set isMounted when component mounts and false when unmounts
	useEffect(() => {
		isMounted.current = true;

		return () => {
			isMounted.current = false;

			// Clean up player if it exists
			if (playerRef.current) {
				try {
					playerRef.current.destroy();
				} catch (e) {
					console.error('Error destroying player during unmount:', e);
				} finally {
					playerRef.current = null;
				}
			}
		};
	}, []);

	/** APOLLO REQUESTS **/
	const [likeTargetCourse] = useMutation(LIKE_TARGET_COURSE);
	// Make the mutation available globally for the sidebar
	useEffect(() => {
		window.likeTargetProperty = likeTargetCourse;
	}, [likeTargetCourse]);

	// GraphQL query for property data
	const {
		loading: getCourseLoading,
		data: getCourseData,
		error: getCourseError,
		refetch: getCoursesRefetch,
	} = useQuery(GET_COURSE, {
		fetchPolicy: 'cache-and-network',
		variables: { input: courseId },
		skip: !courseId,
		notifyOnNetworkStatusChange: true,
	});

	// Update property when GraphQL query completes
	useEffect(() => {
		if (getCourseData?.getCourse && isMounted.current) {
			setCourse(getCourseData.getCourse);
		}
	}, [getCourseData]);

	// Add a function to check if the video URL is valid and extract the ID more reliably
	const getYouTubeVideoId = useCallback((url: string): string | null => {
		if (!url) return null;

		try {
			// Try multiple regex patterns to extract YouTube video ID
			const patterns = [
				/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/i,
				/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/i,
			];

			for (const regex of patterns) {
				const match = url.match(regex);
				if (match && match[1]) {
					return match[1];
				} else if (match && match[2]) {
					return match[2];
				}
			}

			// If the URL is already just the ID (11 characters)
			if (url.length === 11 && /^[a-zA-Z0-9_-]{11}$/.test(url)) {
				return url;
			}

			// Try to extract from a URL with searchParams
			try {
				const urlObj = new URL(url);
				const videoId = urlObj.searchParams.get('v');
				if (videoId) {
					return videoId;
				}
			} catch (e) {
				// Not a valid URL
			}
		} catch (error) {
			console.error('Error extracting video ID:', error);
		}

		return null;
	}, []);

	// Format time (mm:ss)
	const formatTime = useCallback((seconds: number): string => {
		if (isNaN(seconds) || seconds < 0) return '0:00';

		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = Math.floor(seconds % 60);
		return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
	}, []);

	// Navigation functions
	const goToNextLesson = useCallback(() => {
		if (currentModule?.lessons && currentModule.lessons.length > selectedLessonIndex + 1) {
			const nextLessonIndex = selectedLessonIndex + 1;
			const nextVideoId = getYouTubeVideoId(currentModule.lessons[nextLessonIndex].lessonVideo);

			// Set flag to indicate video is changing
			setIsVideoChanged(true);
			setSelectedLessonIndex(nextLessonIndex);
			setVideoId(nextVideoId);
		} else if (course?.courseModuls && course.courseModuls.length > selectedModuleIndex + 1) {
			const nextModuleIndex = selectedModuleIndex + 1;
			const nextVideoId = getYouTubeVideoId(course.courseModuls[nextModuleIndex].lessons[0].lessonVideo);

			// Set flag to indicate video is changing
			setIsVideoChanged(true);
			setSelectedModuleIndex(nextModuleIndex);
			setSelectedLessonIndex(0);
			setVideoId(nextVideoId);
		}
	}, [currentModule?.lessons, course?.courseModuls, selectedLessonIndex, selectedModuleIndex, getYouTubeVideoId]);

	const goToPreviousLesson = useCallback(() => {
		if (selectedLessonIndex > 0) {
			const prevLessonIndex = selectedLessonIndex - 1;
			const prevVideoId = getYouTubeVideoId(currentModule?.lessons[prevLessonIndex]?.lessonVideo || '');

			// Set flag to indicate video is changing
			setIsVideoChanged(true);
			setSelectedLessonIndex(prevLessonIndex);
			setVideoId(prevVideoId);
		} else if (selectedModuleIndex > 0) {
			const prevModuleIndex = selectedModuleIndex - 1;
			const prevModuleLessons = course?.courseModuls[prevModuleIndex]?.lessons || [];
			const prevLessonIndex = Math.max(0, prevModuleLessons.length - 1);
			const prevVideoId = getYouTubeVideoId(prevModuleLessons[prevLessonIndex]?.lessonVideo);

			// Set flag to indicate video is changing
			setIsVideoChanged(true);
			setSelectedModuleIndex(prevModuleIndex);
			setSelectedLessonIndex(prevLessonIndex);
			setVideoId(prevVideoId);
		}
	}, [course?.courseModuls, selectedLessonIndex, selectedModuleIndex, currentModule?.lessons, getYouTubeVideoId]);

	// Handler for lesson selection from sidebar
	const handleLessonSelect = useCallback(
		(moduleIndex: number, lessonIndex: number) => {
			if (
				moduleIndex >= 0 &&
				course?.courseModuls &&
				moduleIndex < course.courseModuls.length &&
				lessonIndex >= 0 &&
				lessonIndex < course.courseModuls[moduleIndex].lessons.length
			) {
				const newVideoId = getYouTubeVideoId(course.courseModuls[moduleIndex].lessons[lessonIndex].lessonVideo);
				setIsVideoChanged(true);
				setSelectedModuleIndex(moduleIndex);
				setSelectedLessonIndex(lessonIndex);
				setVideoId(newVideoId);
			}
		},
		[course?.courseModuls, getYouTubeVideoId],
	);

	// Handler for module selection from sidebar
	const handleModuleSelect = useCallback(
		(moduleIndex: number) => {
			if (moduleIndex >= 0 && course?.courseModuls && moduleIndex < course.courseModuls.length) {
				const newVideoId = getYouTubeVideoId(course.courseModuls[moduleIndex].lessons[0].lessonVideo);
				setIsVideoChanged(true);
				setSelectedModuleIndex(moduleIndex);
				setSelectedLessonIndex(0);
				setVideoId(newVideoId);
			}
		},
		[course?.courseModuls, getYouTubeVideoId],
	);

	// Update videoId when lesson changes
	useEffect(() => {
		if (currentLesson?.lessonVideo) {
			const newVideoId = getYouTubeVideoId(currentLesson.lessonVideo);
			if (newVideoId !== videoId) {
				setVideoId(newVideoId);
				setIsVideoChanged(true);
			}
		}
	}, [currentLesson, getYouTubeVideoId, videoId]);

	// Load YouTube API
	useEffect(() => {
		// Global callback function for when YouTube API is ready
		window.onYouTubeIframeAPIReady = () => {
			if (isMounted.current) {
				setApiLoaded(true);
			}
		};

		// Check if API is already loaded
		if (window.YT && window.YT.Player) {
			setApiLoaded(true);
			return;
		}

		// Check if script is already being loaded
		if (document.getElementById('youtube-api')) {
			return;
		}

		// Load the API
		const tag = document.createElement('script');
		tag.src = 'https://www.youtube.com/iframe_api';
		tag.id = 'youtube-api';

		const firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
	}, []);

	// Handle YouTube player events
	const handleYouTubePlayer = useCallback(() => {
		// Avoid trying to access iframe if component is unmounted
		if (!isMounted.current) return;

		// Wait a bit to ensure iframe is fully loaded
		setTimeout(() => {
			if (!isMounted.current) return;

			try {
				const iframe = document.querySelector('iframe');
				if (!iframe) return;

				// Clean up previous player instance
				if (playerRef.current) {
					try {
						playerRef.current.destroy();
						playerRef.current = null;
					} catch (e) {
						console.error('Error destroying previous player:', e);
					}
				}

				// Create new player instance with error handling
				if (window.YT && window.YT.Player) {
					playerRef.current = new window.YT.Player(iframe, {
						events: {
							onReady: (event: any) => {
								try {
									if (!isMounted.current) return;
									const duration = event.target.getDuration();
									setDuration(duration);
								} catch (e) {
									console.error('Error in onReady:', e);
								}
							},
							onStateChange: (event: any) => {
								try {
									if (!isMounted.current) return;
									if (event.data === window.YT.PlayerState.ENDED) {
										// Auto-navigate to next lesson
										if (currentModule?.lessons && currentModule?.lessons.length > selectedLessonIndex + 1) {
											setTimeout(() => {
												if (isMounted.current) {
													goToNextLesson();
												}
											}, 1500);
										} else if (course?.courseModuls && course.courseModuls.length > selectedModuleIndex + 1) {
											setTimeout(() => {
												if (isMounted.current) {
													goToNextLesson();
												}
											}, 1500);
										}
									}
								} catch (e) {
									console.error('Error in onStateChange:', e);
								}
							},
							onError: (e: any) => {
								console.error('YouTube player error:', e);
								setPlayerError('Error loading video');
							},
						},
					});
				}
			} catch (e) {
				console.error('Error initializing YouTube player:', e);
			}
		}, 300); // Add a delay to ensure iframe is ready
	}, [currentModule?.lessons, course?.courseModuls, selectedLessonIndex, selectedModuleIndex, goToNextLesson]);

	// Reset isVideoChanged flag after rendering
	useEffect(() => {
		if (isVideoChanged) {
			setIsVideoChanged(false);
		}
	}, [isVideoChanged]);

	// Suppress console errors from YouTube iframe
	useEffect(() => {
		// Store original console.error
		const originalConsoleError = console.error;

		// Create a filtered console.error
		console.error = (...args) => {
			// Filter out known YouTube iframe errors
			const errorMessage = args[0]?.toString() || '';
			if (
				errorMessage.includes('The message port closed') ||
				errorMessage.includes('Failed to execute') ||
				errorMessage.includes('third-party cookies')
			) {
				// Ignore these errors
				return;
			}

			// Pass through other errors to original console.error
			originalConsoleError.apply(console, args);
		};

		// Restore original on cleanup
		return () => {
			console.error = originalConsoleError;
		};
	}, []);

	return (
		<div className="flex flex-row p-24 mt-[50px] min-h-screen overflow-hidden gap-4">
			{/* Sidebar */}
			<CourseSidebar
				courseId={courseId}
				selectedModuleIndex={selectedModuleIndex}
				selectedLessonIndex={selectedLessonIndex}
				onModuleSelect={handleModuleSelect}
				onLessonSelect={handleLessonSelect}
				formatTime={formatTime}
			/>

			{/* Main Content */}
			<div className="container  bg-white dark:bg-slate-800 rounded p-6 ">
				<div className="flex flex-col w-full h-full">
					{/* Video Title and Navigation */}
					<div className="mb-6">
						<div className="flex justify-between items-center">
							<h1 className="text-2xl font-semibold dark:text-white">
								{currentLesson?.lessonTitle || 'Lesson Title'}
								<span className="text-sm text-gray-500 dark:text-gray-400 ml-2">({formatTime(duration)})</span>
							</h1>

							<div className="flex gap-3">
								<button
									onClick={goToPreviousLesson}
									className="flex items-center px-4 py-2 rounded bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-white disabled:opacity-50"
									disabled={selectedModuleIndex === 0 && selectedLessonIndex === 0}
								>
									<ChevronLeft className="w-4 h-4 mr-1" />
									Previous
								</button>
								<button
									onClick={goToNextLesson}
									className="flex items-center px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
									disabled={
										selectedModuleIndex === (course?.courseModuls.length || 0) - 1 &&
										selectedLessonIndex === (currentModule?.lessons.length || 0) - 1
									}
								>
									Next
									<ChevronRight className="w-4 h-4 ml-1" />
								</button>
							</div>
						</div>
						<Divider className="my-4" />
					</div>

					{/* Video Player */}
					<div className="w-full aspect-video rounded-lg overflow-hidden bg-black shadow-lg">
						{!apiLoaded && (
							<div className="flex items-center justify-center h-full text-white">Loading YouTube API...</div>
						)}
						{apiLoaded && !videoId && (
							<div className="flex items-center justify-center h-full text-white">No video available</div>
						)}
						{apiLoaded && videoId && (
							<iframe
								key={`video-${videoId}-${isVideoChanged ? 'changed' : 'same'}`}
								width="100%"
								height="100%"
								src={`https://www.youtube-nocookie.com/embed/${videoId}?enablejsapi=1&modestbranding=1&rel=0&origin=${window.location.origin}&iv_load_policy=3&disablekb=1`}
								title={currentLesson?.lessonTitle || 'Video Player'}
								frameBorder="0"
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
								allowFullScreen
								onLoad={handleYouTubePlayer}
							/>
						)}
						{playerError && (
							<div className="flex items-center justify-center h-full text-red-500">Error: {playerError}</div>
						)}
					</div>

					{/* Lesson Description Area */}
					<div className="mt-10 bg-gray-50 dark:bg-slate-700 rounded-lg p-6">
						<h2 className="text-xl font-semibold mb-4 dark:text-white">About this lesson</h2>
						<p className="text-gray-700 dark:text-gray-200">
							{currentLesson?.lessonTitle
								? `Learn about ${currentLesson.lessonTitle} in this comprehensive video tutorial.`
								: 'Watch this lesson to improve your skills and knowledge.'}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default withLayoutFull(LessonVideo);
