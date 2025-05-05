import React, { ChangeEvent, useEffect, useState } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import PropertyBigCard from '../../libs/components/common/CourseBigCard';
import ReviewCard from '../../libs/components/instructor/ReviewCard';
import { Box, Button, Pagination, Stack, Typography } from '@mui/material';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { useRouter } from 'next/router';
import { Course } from '../../libs/types/course/course';
import { Member } from '../../libs/types/member/member';
import { sweetErrorHandling, sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import { userVar } from '../../apollo/store';
import { CoursesInquiry } from '../../libs/types/course/course.input';
import { CommentInput, CommentsInquiry } from '../../libs/types/comment/comment.input';
import { Comment } from '../../libs/types/comment/comment';
import { CommentGroup } from '../../libs/enums/comment.enum';
import { Messages, REACT_APP_API_URL } from '../../libs/config';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GET_COMMENTS, GET_MEMBER, GET_COURSES } from '../../apollo/user/query';
import { T } from '../../libs/types/common';
import { CREATE_COMMENT, LIKE_TARGET_COURSE } from '../../apollo/user/mutation';
import { Message } from '../../libs/enums/common.enum';
import PhoneIcon from '@mui/icons-material/Phone';
import { PackageOpen } from 'lucide-react';
import StarsIcon from '@mui/icons-material/Stars';
import { MemberPosition } from '../../libs/enums/member.enum';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const InstructorDetail: NextPage = ({ initialInput, initialComment, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const [mbId, setMbId] = useState<string | null>(null);
	const [instructor, setInstructor] = useState<Member | null>(null);
	const [searchFilter, setSearchFilter] = useState<CoursesInquiry>(initialInput);
	const [instructorCourses, setInstructorCourses] = useState<Course[]>([]);
	const [courseTotal, setCourseTotal] = useState<number>(0);
	const [commentInquiry, setCommentInquiry] = useState<CommentsInquiry>(initialComment);
	const [agentComments, setAgentComments] = useState<Comment[]>([]);
	const [commentTotal, setCommentTotal] = useState<number>(0);
	const [insertCommentData, setInsertCommentData] = useState<CommentInput>({
		commentGroup: CommentGroup.MEMBER,
		commentContent: '',
		commentRefId: '',
	});

	/** APOLLO REQUESTS **/
	const [createComment] = useMutation(CREATE_COMMENT);
	const [likeTargetCourse] = useMutation(LIKE_TARGET_COURSE);

	const {
		loading: getMemberLoading,
		data: getMemberData,
		error: getMemberError,
		refetch: getMemberRefetch,
	} = useQuery(GET_MEMBER, {
		fetchPolicy: 'network-only',
		variables: { input: mbId },
		skip: !mbId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setInstructor(data.getMember);
			setSearchFilter({
				...searchFilter,
				search: {
					memberId: data?.getMember?._id,
				},
			});
			setCommentInquiry({
				...commentInquiry,
				search: {
					commentRefId: data?.getMember?._id,
				},
			});
			setInsertCommentData({
				...insertCommentData,
				commentRefId: data?.getMember?._id,
			});
		},
	});

	const {
		loading: getCoursesLoading,
		data: getCoursesData,
		error: getCoursesError,
		refetch: getCoursesRefetch,
	} = useQuery(GET_COURSES, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		skip: !searchFilter.search?.memberId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setInstructorCourses(data.getCourses.list);
			setCourseTotal(data.getCourses.metaCounter[0]?.total ?? 0);
		},
	});

	const {
		loading: getCommentsLoading,
		data: getCommentsData,
		error: getCommentsError,
		refetch: getCommentsRefetch,
	} = useQuery(GET_COMMENTS, {
		fetchPolicy: 'network-only',
		variables: { input: commentInquiry },
		skip: !commentInquiry?.search?.commentRefId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setAgentComments(data.getComments.list);
			setCommentTotal(data.getComments.metaCounter[0]?.total ?? 0);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (router.query.instructorId) setMbId(router.query.instructorId as string);
	}, [router]);

	useEffect(() => {
		if (searchFilter.search.memberId) {
			getCoursesRefetch({ variables: { input: searchFilter } }).then();
		}
	}, [searchFilter]);

	useEffect(() => {
		getCommentsRefetch({ variables: { input: commentInquiry } });
	}, [commentInquiry]);

	/** HANDLERS **/
	const redirectToMemberPageHandler = async (memberId: string) => {
		try {
			if (memberId === user?._id) await router.push(`/mypage?memberId=${memberId}`);
			else await router.push(`/member?memberId=${memberId}`);
		} catch (error) {
			await sweetErrorHandling(error);
		}
	};

	const coursePaginationChangeHandler = async (event: ChangeEvent<unknown>, value: number) => {
		searchFilter.page = value;
		setSearchFilter({ ...searchFilter });
	};

	const commentPaginationChangeHandler = async (event: ChangeEvent<unknown>, value: number) => {
		commentInquiry.page = value;
		setCommentInquiry({ ...commentInquiry });
	};

	const createCommentHandler = async () => {
		try {
			if (!user._id) throw new Error(Messages.error2);
			if (user._id === mbId) throw new Error('Cannot write a review for yourself!');
			createComment({
				variables: {
					input: insertCommentData,
				},
			});

			setInsertCommentData({ ...insertCommentData, commentContent: '' });
			await getCommentsRefetch({ input: commentInquiry });
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};

	const likeCourseHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			// executed likeTargetCourse Mutation
			await likeTargetCourse({
				variables: { input: id },
			});
			await getCoursesRefetch({ input: searchFilter });

			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('ERROR, likeTargetCourse:', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	if (device === 'mobile') {
		return <div>INSTRUCTOR DETAIL PAGE MOBILE</div>;
	} else {
		return (
			<>
				<Stack className={'agent-detail-page'}>
					<Stack className={'container'}>
						<Stack className={'agent-info'}>
							<Card
								className="dark:bg-slate-950/50 rounded-md cursor-pointer boder border-solid dark:border-slate-600"
								variant="outlined"
								sx={{
									width: 352,
									display: 'flex',
									flexDirection: 'row',
									alignItems: 'center',
								}}
							>
								<CardMedia
									component="img"
									className="rounded-full ml-5"
									sx={{ width: 100, height: 100, objectFit: 'cover' }}
									image={
										instructor?.memberImage
											? `${REACT_APP_API_URL}/${instructor?.memberImage}`
											: '/img/profile/defaultUser.svg'
									}
									alt="Member Image"
								/>
								<CardContent>
									<Typography
										variant="h6"
										component="div"
										className="hover:underline"
										onClick={() => redirectToMemberPageHandler(instructor?._id as string)}
									>
										{instructor?.memberFullName ?? instructor?.memberNick}
									</Typography>
									<Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
										<Link href="#" underline="none" color="inherit">
											<PhoneIcon fontSize="small" />
											<span className="font-openSans font-normal dark:text-slate-300 text-slate-800 text-[15px] ml-1">
												{instructor?.memberPhone}
											</span>
										</Link>
									</Typography>
									<span className="font-openSans font-normal text-md text-slate-500">
										{' '}
										{instructor?.memberPosition === MemberPosition.UI_UX_DESIGNER
											? 'UI/UX Designer'
											: instructor?.memberPosition === MemberPosition.SOFTWARE_ENGINEER
											? 'Software Engineer'
											: instructor?.memberPosition === MemberPosition.FRONTEND_DEVELOPER
											? 'Frontend Developer'
											: instructor?.memberPosition === MemberPosition.BACKEND_DEVELOPER
											? 'Backend Developer'
											: instructor?.memberPosition === MemberPosition.FULLSTACK_DEVELOPER
											? 'Fullstack Developer'
											: instructor?.memberPosition === MemberPosition.DATA_SCIENTIST
											? 'Data Scientist'
											: instructor?.memberPosition === MemberPosition.WEB_DEVELOPER
											? 'Web Developer'
											: instructor?.memberPosition === MemberPosition.MOBILE_DEVELOPER
											? 'Mobile Developer'
											: instructor?.memberPosition === MemberPosition.MACHINE_LEARNING_ENGINEER
											? 'Machine Learning Eng'
											: instructor?.memberPosition === MemberPosition.DEVOPS_ENGINEER
											? 'DevOps Engineer'
											: instructor?.memberPosition === MemberPosition.GAME_DEVELOPER
											? 'Game Developer'
											: instructor?.memberPosition === MemberPosition.GRAPHIC_DESIGNER
											? 'Graphic Designer'
											: null}
									</span>
								</CardContent>
							</Card>
						</Stack>
						<Stack
							className={
								'agent-home-list dark:bg-slate-900/50 bg-slate-100/50 border border-solid border-gray-300 dark:border-gray-700'
							}
						>
							<Stack className={'card-wrap'}>
								{instructorCourses.map((course: Course) => {
									return (
										<div className={'wrap-main'} key={course?._id}>
											<PropertyBigCard course={course} key={course?._id} likeCourseHandler={likeCourseHandler} />
										</div>
									);
								})}
							</Stack>
							<Stack className={'pagination'}>
								{courseTotal ? (
									<>
										<Stack className="pagination-box">
											<Pagination
												variant="outlined"
												page={searchFilter.page}
												count={Math.ceil(courseTotal / searchFilter.limit) || 1}
												onChange={coursePaginationChangeHandler}
												shape="circular"
												color="primary"
											/>
										</Stack>
										<span className="text-slate-500 font-openSans font-normal text-md">
											Total {courseTotal} propert{courseTotal > 1 ? 'ies' : 'y'} available
										</span>
									</>
								) : (
									<div className={'no-data'}>
										<div className="flex flex-col items-center justify-center p-12 text-center min-h-[600px]">
											<div className="relative">
												<div className="absolute inset-0 -m-10 bg-blue-100/50 rounded-full blur-3xl opacity-30 animate-pulse"></div>
												<div className="relative rounded-full bg-white p-6 mb-6 shadow-lg border border-indigo-100 transform transition-all duration-300 hover:scale-105">
													<PackageOpen className="h-14 w-14 text-indigo-500" />
												</div>
											</div>
											<Typography variant="h4" className="dark:text-slate-200 text-slate-950 font-semibold mb-3 mt-2">
												No Courses found!
											</Typography>
											<Typography variant="body1" className="text-gray-600 max-w-md mb-8 leading-relaxed">
												We don't have any courses to display at the moment. Check back soon as our listings are updated
												regularly.
											</Typography>
											<div className="w-full max-w-xs h-1 bg-gradient-to-r from-transparent via-indigo-200 to-transparent rounded-full"></div>
										</div>
									</div>
								)}
							</Stack>
						</Stack>
						<Stack
							className={
								'review-box dark:bg-slate-900/50 bg-slate-100/50 border border-solid border-gray-300 dark:border-gray-700'
							}
						>
							<Stack className={'main-intro'}>
								<span className="dark:text-slate-200 text-slate-950">Reviews</span>
								<p className="text-slate-600">Glad you're back at EduCampus!</p>
							</Stack>
							{commentTotal !== 0 && (
								<Stack
									className={
										'review-wrap dark:bg-slate-800 bg-white border border-solid border-gray-300 dark:border-gray-500'
									}
								>
									<Box
										component={'div'}
										className={'flex flex-row items-center title-box text-neutral-800 dark:text-slate-200'}
									>
										<StarsIcon className="text-amber-500" />
										<span>
											{commentTotal} review{commentTotal > 1 ? 's' : ''}
										</span>
									</Box>
									{agentComments?.map((comment: Comment) => {
										return <ReviewCard comment={comment} key={comment?._id} />;
									})}
									<Box component={'div'} className={'pagination-box'}>
										<Pagination
											variant="outlined"
											page={commentInquiry.page}
											count={Math.ceil(commentTotal / commentInquiry.limit) || 1}
											onChange={commentPaginationChangeHandler}
											shape="circular"
											color="primary"
										/>
									</Box>
								</Stack>
							)}

							<Stack
								className={
									'leave-review-config dark:bg-slate-800 bg-white border border-solid border-gray-300 dark:border-gray-500'
								}
							>
								<Typography className={'main-title dark:text-slate-200 text-slate-950'}>Leave A Review</Typography>
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
										onClick={createCommentHandler}
									>
										<Typography className={'title'}>Submit Review</Typography>
										<ArrowOutwardIcon fontSize="medium" />
									</Button>
								</Box>
							</Stack>
						</Stack>
					</Stack>
				</Stack>
			</>
		);
	}
};

InstructorDetail.defaultProps = {
	initialInput: {
		page: 1,
		limit: 9,
		search: {
			memberId: '',
		},
	},
	initialComment: {
		page: 1,
		limit: 5,
		sort: 'createdAt',
		direction: 'ASC',
		search: {
			commentRefId: '',
		},
	},
};

export default withLayoutBasic(InstructorDetail);
