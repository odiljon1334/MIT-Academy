import React, { ChangeEvent, useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, CircularProgress, Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutFull from '../../libs/components/layout/LayoutFull';
import { NextPage } from 'next';
import Review from '../../libs/components/course/Review';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Autoplay, Navigation, Pagination } from 'swiper';
import CourseBigCard from '../../libs/components/common/CourseBigCard';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { useRouter } from 'next/router';
import { Course } from '../../libs/types/course/course';
import moment from 'moment';
import { formatterStr } from '../../libs/utils';
import { REACT_APP_API_URL } from '../../libs/config';
import { userVar } from '../../apollo/store';
import { CommentInput, CommentsInquiry } from '../../libs/types/comment/comment.input';
import { Comment } from '../../libs/types/comment/comment';
import { CommentGroup } from '../../libs/enums/comment.enum';
import { Pagination as MuiPagination } from '@mui/material';
import Link from 'next/link';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import { AlignHorizontalDistributeCenter, PhoneIcon } from 'lucide-react';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import StarsIcon from '@mui/icons-material/Stars';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import 'swiper/css';
import 'swiper/css/pagination';
import { CREATE_COMMENT, LIKE_TARGET_COURSE } from '../../apollo/user/mutation';
import { GET_COMMENTS, GET_COURSES, GET_COURSE } from '../../apollo/user/query';
import { T } from '../../libs/types/common';
import { Direction, Message } from '../../libs/enums/common.enum';
import { sweetErrorHandling, sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import { MemberPosition } from '../../libs/enums/member.enum';

SwiperCore.use([Autoplay, Navigation, Pagination]);

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const learningSteps = [
	{
		id: 1,
		image: '/img/property/3094293.jpg', // Rasm manzili o'zgartiring
		title: 'We have learned theory-based coding',
		description: 'So far, we have been learning Korean-style coding, focusing only on theory and syntax.',
	},
	{
		id: 2,
		image: '/img/property/3426526.jpg',
		title: 'Difficult to apply knowledge',
		description: 'The knowledge gained this way is hard to apply directly in real-world projects.',
	},
	{
		id: 3,
		image: '/img/property/10951137.jpg',
		title: 'Learn by building real services',
		description: 'By creating actual services and features, you can fully master skills as your own.',
	},
];

const CourseDetail: NextPage<{ initialComment?: CommentsInquiry }> = ({
	initialComment = {
		page: 1,
		limit: 5,
		sort: 'createdAt',
		direction: 'DESC',
		search: {
			commentRefId: '',
		},
	},
	...props
}: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const [courseId, setCourseId] = useState<string | null>(null);
	const [course, setCourse] = useState<Course | null>(null);
	const [destinationCourse, setDestinationCourse] = useState<Course[]>([]);
	const [commentInquiry, setCommentInquiry] = useState<CommentsInquiry>(initialComment);
	const [propertyComments, setPropertyComments] = useState<Comment[]>([]);
	const [commentTotal, setCommentTotal] = useState<number>(0);
	const [insertCommentData, setInsertCommentData] = useState<CommentInput>({
		commentGroup: CommentGroup.COURSE,
		commentContent: '',
		commentRefId: '',
	});

	/** APOLLO REQUESTS **/
	const [likeTargetCourse] = useMutation(LIKE_TARGET_COURSE);
	const [createComment] = useMutation(CREATE_COMMENT);

	const {
		loading: getCourseLoading,
		data: getCourseData,
		error: getCourseError,
		refetch: getCourseRefetch,
	} = useQuery(GET_COURSE, {
		fetchPolicy: 'network-only',
		variables: { input: courseId },
		skip: !courseId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setCourse(data.getCourse);
		},
	});

	const {
		loading: getCoursesLoading,
		data: getCoursesData,
		error: getCoursesError,
		refetch: getCoursesRefetch,
	} = useQuery(GET_COURSES, {
		fetchPolicy: 'cache-and-network',
		variables: {
			input: {
				page: 1,
				limit: 4,
				sort: 'createdAt',
				direction: Direction.DESC,
				search: {
					categoryList: course?.courseCategory ? [course?.courseCategory] : [],
				},
			},
		},
		skip: !courseId && !course,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setDestinationCourse(data.getCourses.list);
		},
	});

	const {
		loading: getCommentsLoading,
		data: getCommentsData,
		error: getCommentsError,
		refetch: getCommentsRefetch,
	} = useQuery(GET_COMMENTS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: initialComment },
		skip: !commentInquiry.search.commentRefId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setPropertyComments(data.getComments.list);
			setCommentTotal(data.getComments.metaCounter[0].total ?? 0);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		const id = router.query.id as string;
		if (id) {
			setCourseId(id);
			setCommentInquiry({
				...commentInquiry,
				search: {
					commentRefId: id,
				},
			});
			setInsertCommentData({
				...insertCommentData,
				commentRefId: id,
			});
		}
	}, [router.query.id]);

	useEffect(() => {
		if (commentInquiry.search.commentRefId) {
			getCommentsRefetch({ input: commentInquiry });
		}
	}, [commentInquiry]);
	console.log('commentInquiry:', commentInquiry);

	/** HANDLERS **/
	const likeCoursesHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			// executed likeTargetProperty Mutation
			await likeTargetCourse({
				variables: { input: id },
			});
			await getCourseRefetch({ inpur: id });
			await getCoursesRefetch({
				input: {
					page: 1,
					limit: 4,
					sort: 'createdAt',
					direction: Direction.DESC,
					search: {
						categoryList: [course?.courseCategory],
					},
				},
			});

			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('ERROR, likePropertyHandler:', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const commentPaginationChangeHandler = async (event: ChangeEvent<unknown>, value: number) => {
		commentInquiry.page = value;
		setCommentInquiry({ ...commentInquiry });
	};

	const createCommantHandler = async () => {
		try {
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);
			await createComment({ variables: { input: insertCommentData } });

			setInsertCommentData({ ...insertCommentData, commentContent: '' });

			await getCommentsRefetch({ input: commentInquiry });
		} catch (err: any) {
			await sweetErrorHandling(err).then();
		}
	};

	if (getCourseLoading) {
		return (
			<Stack sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '1080px' }}>
				<CircularProgress size={'4rem'} />
			</Stack>
		);
	}

	if (device === 'mobile') {
		return <div>COURSE DETAIL PAGE</div>;
	} else {
		return (
			<div id={'property-detail-page'}>
				<div className={'container'}>
					<Stack className={'property-detail-config'}>
						<div className="bg-inherit py-24">
							<div>
								<dl className="flex flex-row text-center">
									<div className="mx-auto flex items-center flex-col bg-slate-50 border border-solid border-neutral-300 dark:border-neutral-600 dark:bg-slate-900 shadow-lg rounded-md p-4 w-[400px]">
										<dd className="flex items-center text-3xl font-semibold tracking-tight space-x-2">
											<span>
												<FormatListNumberedIcon className="w-20 h-20 text-neutral-800 dark:text-slate-200" />
											</span>{' '}
											<span className="flex flex-col text-neutral-800 dark:text-slate-200">
												Modules <p>{course?.courseModuls.length} 개</p>
											</span>
										</dd>
									</div>
									<div className="mx-auto flex items-center flex-col bg-slate-50 border border-solid border-neutral-300 dark:border-neutral-600 dark:bg-slate-900 shadow-lg rounded-md p-4 w-[400px]">
										<dd className="flex items-center text-3xl font-semibold tracking-tight space-x-2">
											<span>
												<AccessAlarmIcon className="w-20 h-20 text-neutral-800 dark:text-slate-200" />
											</span>{' '}
											<span className="flex flex-col text-neutral-800 dark:text-slate-200">
												시간{' '}
												<p>
													{' '}
													{(() => {
														const totalMinutes = Array.isArray(course?.courseModuls)
															? course.courseModuls.reduce(
																	(totalDuration, module) =>
																		totalDuration +
																		(Array.isArray(module.lessons)
																			? module.lessons.reduce((sum, lesson) => sum + lesson.lessonDuration, 0)
																			: 0),
																	0,
															  )
															: 0;

														const hours = Math.floor(totalMinutes / 60); // Soat
														const minutes = totalMinutes % 60; // Qolgan daqiqa

														return `${hours > 0 ? `${hours}h ` : ''}${minutes > 0 ? `${minutes}min` : ''}`.trim();
													})()}
												</p>
											</span>
										</dd>
									</div>
									<div className="mx-auto flex items-center flex-col bg-slate-50 border border-solid border-neutral-300 dark:border-neutral-600 dark:bg-slate-900 shadow-lg rounded-md p-4 w-[400px]">
										<dd className="flex items-center text-3xl font-semibold tracking-tight space-x-2">
											<span>
												<AlignHorizontalDistributeCenter className="w-20 h-20 text-neutral-800 dark:text-slate-200" />
											</span>{' '}
											<span className="flex flex-col text-md font-openSans space-y-2 text-neutral-800 dark:text-slate-200">
												레벨{' '}
												<p className="text-[20px] font-openSans font-normal text-orange-400">{course?.courseType}</p>
											</span>
										</dd>
									</div>
								</dl>
							</div>
						</div>
						<Stack className={'property-desc-config'}>
							<Stack className={'left-config'}>
								<Stack className={'options-config'}>
									<Stack className={'option'}>
										<Stack
											className={
												'svg-box border border-solid border-neutral-300 dark:border-neutral-600 dark:bg-slate-900 shadow-lg'
											}
										>
											<FormatListNumberedIcon className="w-10 h-10 text-neutral-800 dark:text-slate-200" />
										</Stack>
										<span className="flex flex-col text-lg font-openSans font-semibold text-neutral-800 dark:text-slate-200">
											Modules <p>{course?.courseModuls.length} 개</p>
										</span>
									</Stack>
									<Stack className={'option'}>
										<Stack
											className={
												'svg-box border border-solid border-neutral-300 dark:border-neutral-600 dark:bg-slate-900 shadow-lg'
											}
										>
											<AccessAlarmIcon className="w-10 h-10 text-neutral-800 dark:text-slate-200" />
										</Stack>
										<div className="flex flex-col">
											<span className="text-lg font-openSans font-semibold text-neutral-800 dark:text-slate-200">
												Time
											</span>{' '}
											<p className="flex flex-col text-lg font-openSans font-semibold text-neutral-800 dark:text-slate-200">
												{' '}
												{(() => {
													const totalMinutes = Array.isArray(course?.courseModuls)
														? course.courseModuls.reduce(
																(totalDuration, module) =>
																	totalDuration +
																	(Array.isArray(module.lessons)
																		? module.lessons.reduce((sum, lesson) => sum + lesson.lessonDuration, 0)
																		: 0),
																0,
														  )
														: 0;

													const hours = Math.floor(totalMinutes / 60); // Soat
													const minutes = totalMinutes % 60; // Qolgan daqiqa

													return `${hours > 0 ? `${hours}h ` : ''}${minutes > 0 ? `${minutes}min` : ''}`.trim();
												})()}
											</p>
										</div>
									</Stack>
									<Stack className={'option'}>
										<Stack
											className={
												'svg-box border border-solid border-neutral-300 dark:border-neutral-600 dark:bg-slate-900 shadow-lg'
											}
										>
											<CalendarMonthIcon className="w-10 h-10 text-neutral-800 dark:text-slate-200" />
										</Stack>
										<Stack className={'option-includes'}>
											<Typography
												className={'text-lg font-openSans font-semibold text-neutral-800 dark:text-slate-200'}
											>
												Year Build
											</Typography>
											<Typography
												className={'text-lg font-openSans font-semibold text-neutral-800 dark:text-slate-200'}
											>
												{moment(course?.createdAt).format('YYYY')}
											</Typography>
										</Stack>
									</Stack>
									<Stack className={'option'}>
										<Stack
											className={
												'svg-box border border-solid border-neutral-300 dark:border-neutral-600 dark:bg-slate-900 shadow-lg'
											}
										>
											<AlignHorizontalDistributeCenter className="w-10 h-10 text-neutral-800 dark:text-slate-200" />
										</Stack>
										<Stack className={'option-includes'}>
											<Typography
												className={'text-lg font-openSans font-semibold text-neutral-800 dark:text-slate-200'}
											>
												Level
											</Typography>
											<Typography className={'text-lg font-openSans text-orange-400'}>{course?.courseType}</Typography>
										</Stack>
									</Stack>
								</Stack>
								<Stack
									className={
										'prop-desc-config bg-neutral-50 dark:bg-slate-900 border border-solid dark:border-neutral-600 border-neutral-300'
									}
								>
									<Stack className={'top'}>
										<Typography
											className={'text-[24px] font-openSans font-semibold text-neutral-800 dark:text-slate-200'}
										>
											Course Description
										</Typography>
										<Typography className={'text-lg font-openSans text-neutral-800 dark:text-slate-200'}>
											{course?.courseDesc ?? 'No Description!'}
										</Typography>
									</Stack>
									<Stack className={'bottom'}>
										<Typography
											className={'text-[24px] font-openSans font-semibold text-neutral-800 dark:text-slate-200'}
										>
											Course Details
										</Typography>
										<Stack className={'info-box'}>
											<Stack className={'left'}>
												<Box component={'div'} className={'info'}>
													<Typography
														className={
															'flex items-center text-[18px] font-openSans font-semibold text-neutral-800 dark:text-slate-200'
														}
													>
														Price
													</Typography>
													<Typography className={'data text-neutral-800 dark:text-slate-200'}>
														${formatterStr(course?.coursePrice)}.00
													</Typography>
												</Box>
												<Box component={'div'} className={'info'}>
													<Typography
														className={
															'flex items-center text-[18px] font-openSans font-semibold text-neutral-800 dark:text-slate-200'
														}
													>
														Category
													</Typography>
													<Typography className={'data text-neutral-800 dark:text-slate-200'}>
														{course?.courseCategory}
													</Typography>
												</Box>
												<Box component={'div'} className={'info'}>
													<Typography
														className={
															'flex items-center text-[18px] font-openSans font-semibold text-neutral-800 dark:text-slate-200'
														}
													>
														Views
													</Typography>
													<Typography className={'data text-neutral-800 dark:text-slate-200'}>
														{course?.courseViews}
													</Typography>
												</Box>
											</Stack>
											<Stack className={'right'}>
												<Box component={'div'} className={'info'}>
													<Typography
														className={
															'flex items-center text-[18px] font-openSans font-semibold text-neutral-800 dark:text-slate-200'
														}
													>
														Year Built
													</Typography>
													<Typography className={'data text-neutral-800 dark:text-slate-200'}>
														{moment(course?.createdAt).format('YYYY')}
													</Typography>
												</Box>
												<Box component={'div'} className={'info text-neutral-800 dark:text-slate-200'}>
													<Typography className={'flex items-center text-[18px] font-openSans font-semibold'}>
														Level
													</Typography>
													<Typography className={'data'}>{course?.courseType}</Typography>
												</Box>
											</Stack>
										</Stack>
									</Stack>
								</Stack>
								<Stack
									className={
										'floor-plans-config bg-neutral-50 dark:bg-slate-900 border border-solid dark:border-neutral-600 border-neutral-300 py-24'
									}
								>
									<div className="flex flex-col items-center">
										<h2 className="text-5xl font-bold mb-5 text-center text-neutral-800 dark:text-slate-200">
											Start Practical Coding
										</h2>
										<p className="text-gray-400 mb-6 text-center">
											Why should you learn by building? Does it really become real knowledge?
										</p>
										<div className="flex flex-row gap-4 mt-5">
											{learningSteps.map((step) => (
												<Card key={step.id} className="bg-[#1E293B] text-white w-[300px] shadow-lg rounded-lg">
													<CardContent className="flex flex-col items-center">
														<img src={step.image} alt={step.title} className="w-full h-auto object-cover mb-4" />
														<h3 className="text-[18px] font-semibold font-openSans mb-2">{step.title}</h3>
														<p className="font-openSans text-gray-400">{step.description}</p>
													</CardContent>
												</Card>
											))}
										</div>
									</div>
								</Stack>
								{commentTotal !== 0 && (
									<Stack
										className={
											'reviews-config bg-neutral-50 dark:bg-slate-900 border border-solid dark:border-neutral-600 border-neutral-300'
										}
									>
										<Stack className={'filter-box'}>
											<Stack className={'review-cnt text-neutral-800 dark:text-slate-200'}>
												<StarsIcon className="text-amber-500" />
												<Typography className={'reviews'}>{commentTotal} reviews</Typography>
											</Stack>
										</Stack>
										<Stack className={'review-list'}>
											{propertyComments?.map((comment: Comment) => {
												return <Review comment={comment} key={comment?._id} />;
											})}
											<Box component={'div'} className={'pagination-box'}>
												<MuiPagination
													variant="outlined"
													page={commentInquiry.page}
													count={Math.ceil(commentTotal / commentInquiry.limit)}
													onChange={commentPaginationChangeHandler}
													shape="circular"
													color="primary"
												/>
											</Box>
										</Stack>
									</Stack>
								)}
								<Stack
									className={
										'leave-review-config bg-neutral-50 dark:bg-slate-900 border border-solid dark:border-neutral-600 border-neutral-300'
									}
								>
									<Typography className={'main-title text-neutral-800 dark:text-slate-200'}>Leave A Review</Typography>
									<Typography className={'review-title text-slate-500'}>Review</Typography>
									<textarea
										onChange={({ target: { value } }: any) => {
											setInsertCommentData({ ...insertCommentData, commentContent: value });
										}}
										value={insertCommentData.commentContent}
									></textarea>
									<Box className={'submit-btn'} component={'div'}>
										<Button
											variant="contained"
											color="success"
											className={'submit-review'}
											disabled={insertCommentData.commentContent === '' || user?._id === ''}
											onClick={createCommantHandler}
										>
											<Typography className={'title'}>Submit Review</Typography>
											<ArrowOutwardIcon fontSize="small" className="text-slate-950" />
										</Button>
									</Box>
								</Stack>
							</Stack>
							<Stack
								className={
									'right-config bg-neutral-50 dark:bg-slate-900 border border-solid dark:border-neutral-600 border-neutral-300 sticky'
								}
								style={{
									position: 'sticky',
									top: '1rem',
									maxHeight: 'calc(100vh - 2rem)',
									overflowY: 'auto',
								}}
							>
								<Stack className={'info-box'}>
									<Typography className={'main-title text-neutral-800 dark:text-slate-200'}>
										Get More Information
									</Typography>
									<Stack
										className={
											'image-info p-2 rounded-md border border-solid border-neutral-300 dark:border-neutral-600'
										}
									>
										<img
											className={'member-image'}
											src={
												course?.memberData?.memberImage
													? `${REACT_APP_API_URL}/${course?.memberData?.memberImage}`
													: '/img/profile/defaultUser.svg'
											}
										/>
										<Stack className={'name-phone-listings'}>
											<Link href={`/member?memberId=${course?.memberData?._id}`}>
												<Typography className={'name text-neutral-800 dark:text-slate-200'}>
													{course?.memberData?.memberNick}
												</Typography>
											</Link>
											<Stack className={'phone-number'}>
												<Typography className="font-openSans font-normal text-slate-400">
													{course?.memberData?.memberPosition === MemberPosition.UI_UX_DESIGNER
														? 'UI/UX Designer'
														: course?.memberData?.memberPosition === MemberPosition.SOFTWARE_ENGINEER
														? 'Software Engineer'
														: course?.memberData?.memberPosition === MemberPosition.FRONTEND_DEVELOPER
														? 'Frontend Developer'
														: course?.memberData?.memberPosition === MemberPosition.BACKEND_DEVELOPER
														? 'Backend Developer'
														: course?.memberData?.memberPosition === MemberPosition.FULLSTACK_DEVELOPER
														? 'Fullstack Developer'
														: course?.memberData?.memberPosition === MemberPosition.DATA_SCIENTIST
														? 'Data Scientist'
														: course?.memberData?.memberPosition === MemberPosition.WEB_DEVELOPER
														? 'Web Developer'
														: course?.memberData?.memberPosition === MemberPosition.MOBILE_DEVELOPER
														? 'Mobile Developer'
														: course?.memberData?.memberPosition === MemberPosition.MACHINE_LEARNING_ENGINEER
														? 'Machine Learning Eng'
														: course?.memberData?.memberPosition === MemberPosition.DEVOPS_ENGINEER
														? 'DevOps Engineer'
														: course?.memberData?.memberPosition === MemberPosition.GAME_DEVELOPER
														? 'Game Developer'
														: course?.memberData?.memberPosition === MemberPosition.GRAPHIC_DESIGNER
														? 'Graphic Designer'
														: null}
												</Typography>
											</Stack>
											<Typography className={'listings text-neutral-500'}>View Listings</Typography>
										</Stack>
									</Stack>
								</Stack>
								<Stack className={'info-box'}>
									{course && course._id && (
										<Button
											variant="contained"
											color="success"
											className="send-message flex flex-row items-center justify-center w-full cursor-pointer gap-2"
											disabled={!user?._id}
											onClick={() => {
												if (!user?._id) return;
												router.push({
													pathname: '/course/lesson',
													query: { id: course._id },
												});
											}}
										>
											<div className="flex items-center gap-2">
												<Typography className="title text-[13px] font-semibold whitespace-nowrap">
													PAY FOR A LIFETIME PASS
												</Typography>
												<ArrowOutwardIcon fontSize="small" className="text-white" />
											</div>
										</Button>
									)}
								</Stack>
							</Stack>
						</Stack>
						{destinationCourse.length !== 0 && (
							<Stack className={'similar-properties-config'}>
								<Stack className={'title-pagination-box'}>
									<Stack className={'title-box'}>
										<Typography className={'main-title text-neutral-800 dark:text-slate-200'}>
											Destination Course
										</Typography>
										<Typography className={'sub-title text-slate-500'}>
											Learn Anytime, Anywhere with EDUcampus
										</Typography>
									</Stack>
									<Stack className={'pagination-box'}>
										<WestIcon
											className={
												'swiper-similar-prev dark:bg-slate-800 dark:text-slate-400 rounded-full w-[50px] h-[50px] p-3'
											}
										/>
										<div className={'swiper-similar-pagination'}></div>
										<EastIcon
											className={
												'swiper-similar-next dark:bg-slate-800 dark:text-slate-400 rounded-full w-[50px] h-[50px] p-3'
											}
										/>
									</Stack>
								</Stack>
								<Stack className={'cards-box'}>
									<Swiper
										className={'similar-homes-swiper'}
										slidesPerView={'auto'}
										spaceBetween={35}
										modules={[Autoplay, Navigation, Pagination]}
										navigation={{
											nextEl: '.swiper-similar-next',
											prevEl: '.swiper-similar-prev',
										}}
										pagination={{
											el: '.swiper-similar-pagination',
										}}
									>
										{destinationCourse.map((course: Course) => {
											return (
												<SwiperSlide className={'similar-homes-slide'} key={course.courseTitle}>
													<CourseBigCard course={course} likeCourseHandler={likeCoursesHandler} key={course?._id} />
												</SwiperSlide>
											);
										})}
									</Swiper>
								</Stack>
							</Stack>
						)}
					</Stack>
				</div>
			</div>
		);
	}
};

export default withLayoutFull(CourseDetail);
