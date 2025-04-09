'use client';

import { useEffect, useMemo, useState } from 'react';
import { useQuery, useReactiveVar } from '@apollo/client';
import { CirclePlay, ChevronUp, ChevronDown } from 'lucide-react';
import { Typography, IconButton, Collapse } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import MapsUgcIcon from '@mui/icons-material/MapsUgc';
import { userVar } from '../../../apollo/store';
import { Course } from '../../types/course/course';
import { GET_COURSE } from '../../../apollo/user/query';
import { REACT_APP_API_URL } from '../../config';
import { T } from '../../types/common';
import { Message } from '../../enums/common.enum';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';

const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

interface CourseSidebarProps {
	courseId: string | null;
	selectedModuleIndex: number;
	selectedLessonIndex: number;
	formatTime: (seconds: number) => string;
	onModuleSelect: (moduleIndex: number) => void;
	onLessonSelect: (moduleIndex: number, lessonIndex: number) => void;
}

export const CourseSidebar = ({
	courseId,
	selectedModuleIndex,
	selectedLessonIndex,
	formatTime,
	onModuleSelect,
	onLessonSelect,
}: CourseSidebarProps) => {
	const user = useReactiveVar(userVar);
	const [course, setCourse] = useState<Course | null>(null);
	const [expandedModules, setExpandedModules] = useState<Record<number, boolean>>({});

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

	console.log('getCourseData:', getCourseData);
	// Update property when GraphQL query completes
	useEffect(() => {
		if (getCourseData?.getCourse) {
			setCourse(getCourseData.getCourse);

			// Initialize expanded state - default to expanding the selected module
			const initialExpandedState: Record<number, boolean> = {};
			if (getCourseData.getCourse.courseModuls) {
				getCourseData.getCourse.courseModuls.forEach((_: any, index: number) => {
					initialExpandedState[index] = index === selectedModuleIndex;
				});
				setExpandedModules(initialExpandedState);
			}
		}
	}, [getCourseData, selectedModuleIndex]);

	// Get property image path
	const imagePath = useMemo(
		() => (course?.courseImage ? `${REACT_APP_API_URL}/${course?.courseImage}` : '/img/banner/header1.svg'),
		[course?.courseImage],
	);

	// Toggle module expansion
	const toggleModule = (moduleIndex: number) => {
		setExpandedModules((prev) => ({
			...prev,
			[moduleIndex]: !prev[moduleIndex],
		}));
	};

	// Like property handler
	const likeCourseHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			// Execute likeTargetProperty Mutation
			await window.likeTargetProperty({
				variables: { input: id },
			});
			await getCoursesRefetch({ input: courseId });

			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('ERROR, likeCourseHandler:', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	if (getCourseLoading) {
		return (
			<div className="w-[440px] h-screen bg-slate-900 rounded-lg p-5 flex items-center justify-center">
				<Typography variant="body1" className="text-white">
					Loading course data...
				</Typography>
			</div>
		);
	}

	if (getCourseError) {
		return (
			<div className="w-[440px] h-screen bg-slate-900 rounded-lg p-5 flex items-center justify-center">
				<Typography variant="body1" className="text-red-500">
					Error loading course data
				</Typography>
			</div>
		);
	}

	return (
		<div className="w-[440px] bg-slate-800 dark:bg-slate-900 relative p-5 pb-24 rounded-lg">
			{/* Course Image */}
			<div className="relative pb-6">
				<div className="flex flex-col items-center w-full">
					<img
						src={imagePath || '/placeholder.svg?height=230&width=340'}
						alt="property"
						className="rounded-xl w-full h-[200px] object-fill"
					/>
				</div>

				{/* Course Info Card */}
				<div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 w-[270px] bg-slate-800 rounded-lg shadow-lg px-4 py-3">
					<Typography variant="subtitle1" className="text-slate-100 font-semibold text-center mb-3">
						{course?.courseTitle
							? course.courseTitle.length > 25
								? course.courseTitle.substring(0, 15) + ' ...'
								: course.courseTitle
							: 'No title available'}
					</Typography>

					<div className="flex flex-row justify-around items-center w-full h-[40px] rounded-lg">
						<div className="flex items-center space-x-2">
							<VisibilityIcon className="w-5 h-5 text-white" />
							<span className="text-white">{course?.courseViews || 0}</span>
						</div>
						<div className="flex items-center">
							<IconButton
								onClick={() => courseId && user && likeCourseHandler(user, courseId)}
								size="small"
								className="text-white p-1"
							>
								{course?.meLiked && course?.meLiked[0]?.myFavorite ? (
									<ThumbUpIcon className="w-5 h-5 text-white" />
								) : (
									<ThumbUpOutlinedIcon className="w-5 h-5 text-white" />
								)}
							</IconButton>
							<span className="text-white">{course?.courseLikes || 0}</span>
						</div>
						<div className="flex items-center">
							<MapsUgcIcon className="w-5 h-5 text-white" />
							<span className="text-white ml-1">{course?.courseComments || 0}</span>
						</div>
					</div>
				</div>
			</div>

			{/* Module and Lesson Navigation */}
			<div
				className="flex flex-col relative text-white overflow-y-auto custom-scrollbar pb-24"
				style={{
					height: 'calc(100vh - auto - 100px)',
					marginTop: '100px',
				}}
			>
				<Typography
					variant="h6"
					className="font-semibold mb-4 pl-2 text-white sticky top-0 bg-slate-900 rounded py-2 z-10"
				>
					강의목차 {/* Course Contents in Korean */}
				</Typography>

				{course?.courseModuls?.map((module, moduleIndex) => (
					<div key={module._id} className="flex flex-col w-full h-auto mb-2 rounded-lg">
						<div
							className={`w-full p-3 rounded-t-lg cursor-pointer bg-slate-600 dark:bg-slate-800 hover:bg-slate-700 transition-colors flex justify-between items-center`}
							onClick={() => toggleModule(moduleIndex)}
						>
							<div className="flex items-center gap-2">
								<div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-700 text-white font-semibold">
									{moduleIndex + 1}
								</div>
								<Typography variant="subtitle1" className="font-medium truncate max-w-[250px]">
									Part {moduleIndex + 1}.{' '}
									{module.moduleTitle
										? module.moduleTitle.length > 13
											? module.moduleTitle.substring(0, 13) + ' '
											: module.moduleTitle
										: 'Untitled Module'}
								</Typography>
							</div>

							<div className="flex flex-row items-center gap-1">
								<Typography variant="caption" className="text-slate-400">
									{module.lessons.length > 0 ? `${module.lessons.length} / ${module.lessons.length}` : '0 / 0'}
								</Typography>
								{expandedModules[moduleIndex] ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
							</div>
						</div>

						<Collapse in={expandedModules[moduleIndex]}>
							<div className="bg-slate-700 px-2 py-3 rounded-b-lg">
								{module.lessons.map((lesson, lessonIndex) => (
									<div
										key={lessonIndex}
										className={`my-2 p-3 rounded-lg flex items-center cursor-pointer transition-colors ${
											moduleIndex === selectedModuleIndex && lessonIndex === selectedLessonIndex
												? 'bg-blue-600'
												: 'bg-slate-800 hover:bg-slate-600'
										}`}
										onClick={() => onLessonSelect(moduleIndex, lessonIndex)}
									>
										<div className="flex items-center gap-3 w-full">
											<div className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-700 text-white text-sm">
												{lessonIndex + 1}
											</div>
											<div className="flex-1 min-w-0">
												<Typography variant="body2" className="truncate">
													Ch {lessonIndex + 1}. {lesson.lessonTitle || 'Untitled Lesson'}
												</Typography>
											</div>
											<div className="flex items-center justify-end">
												{moduleIndex === selectedModuleIndex && lessonIndex === selectedLessonIndex ? (
													<CirclePlay className="w-5 h-5 text-white" />
												) : (
													<Typography variant="caption" className="text-slate-400">
														({formatDuration(lesson.lessonDuration || 0)}){/* Format duration from seconds to MM:SS */}
													</Typography>
												)}
											</div>
										</div>
									</div>
								))}
							</div>
						</Collapse>
					</div>
				))}
			</div>
		</div>
	);
};

// Format duration from seconds to MM:SS
// Format duration from seconds to MM:SS
function formatDuration(seconds: number): string {
	if (!seconds) return '00:00';

	// Проверяем, если значение уже в минутах (меньше 60), то конвертируем в секунды
	if (seconds < 60) {
		// Предполагаем, что значение в минутах, а не в секундах
		seconds = seconds * 60;
	}

	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = Math.floor(seconds % 60);

	return `${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}
