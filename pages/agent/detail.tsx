import React, { ChangeEvent, useEffect, useState } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import PropertyBigCard from '../../libs/components/common/PropertyBigCard';
import ReviewCard from '../../libs/components/agent/ReviewCard';
import { Box, Button, Pagination, Stack, Typography } from '@mui/material';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import StarIcon from '@mui/icons-material/Star';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { useRouter } from 'next/router';
import { Property } from '../../libs/types/property/property';
import { Member } from '../../libs/types/member/member';
import { sweetErrorHandling, sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import { userVar } from '../../apollo/store';
import { PropertiesInquiry } from '../../libs/types/property/property.input';
import { CommentInput, CommentsInquiry } from '../../libs/types/comment/comment.input';
import { Comment } from '../../libs/types/comment/comment';
import { CommentGroup } from '../../libs/enums/comment.enum';
import { Messages, REACT_APP_API_URL } from '../../libs/config';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GET_COMMENTS, GET_MEMBER, GET_PROPERTIES } from '../../apollo/user/query';
import { T } from '../../libs/types/common';
import { CREATE_COMMENT, LIKE_TARGET_PROPERTY } from '../../apollo/user/mutation';
import { Message } from '../../libs/enums/common.enum';
import PhoneIcon from '@mui/icons-material/Phone';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const AgentDetail: NextPage = ({ initialInput, initialComment, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const [mbId, setMbId] = useState<string | null>(null);
	const [agent, setAgent] = useState<Member | null>(null);
	const [searchFilter, setSearchFilter] = useState<PropertiesInquiry>(initialInput);
	const [agentProperties, setAgentProperties] = useState<Property[]>([]);
	const [propertyTotal, setPropertyTotal] = useState<number>(0);
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
	const [likeTargetProperty] = useMutation(LIKE_TARGET_PROPERTY);

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
			setAgent(data.getMember);
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
		loading: getPropertiesLoading,
		data: getPropertiesData,
		error: getPropertiesError,
		refetch: getPropertiesRefetch,
	} = useQuery(GET_PROPERTIES, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		skip: !searchFilter.search?.memberId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setAgentProperties(data.getProperties.list);
			setPropertyTotal(data.getProperties.metaCounter[0]?.total ?? 0);
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
		if (router.query.agentId) setMbId(router.query.agentId as string);
	}, [router]);

	useEffect(() => {
		if (searchFilter.search.memberId) {
			getPropertiesRefetch({ variables: { input: searchFilter } }).then();
		}
	}, [searchFilter]);

	useEffect(() => {
		if (commentInquiry.search.commentRefId) {
			getCommentsRefetch({ variables: { input: commentInquiry } }).then();
		}
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

	const propertyPaginationChangeHandler = async (event: ChangeEvent<unknown>, value: number) => {
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

	const likePropertyHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			// executed likeTargetProperty Mutation
			await likeTargetProperty({
				variables: { input: id },
			});
			await getPropertiesRefetch({ input: searchFilter });

			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('ERROR, likePropertyHandler:', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	if (device === 'mobile') {
		return <div>AGENT DETAIL PAGE MOBILE</div>;
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
										agent?.memberImage ? `${REACT_APP_API_URL}/${agent?.memberImage}` : '/img/profile/defaultUser.svg'
									}
									alt="Member Image"
								/>
								<CardContent>
									<Typography
										variant="h6"
										component="div"
										className="hover:underline"
										onClick={() => redirectToMemberPageHandler(agent?._id as string)}
									>
										{agent?.memberFullName ?? agent?.memberNick}
									</Typography>
									<Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
										<Link href="#" underline="none" color="inherit">
											<PhoneIcon fontSize="small" />
											<span className="font-openSans font-normal dark:text-slate-300 text-slate-800 text-[15px] ml-1">
												{agent?.memberPhone}
											</span>
										</Link>
									</Typography>
									<span className="font-openSans font-normal text-md text-slate-500">UI/UX Design</span>
								</CardContent>
							</Card>
						</Stack>
						<Stack
							className={
								'agent-home-list dark:bg-slate-900/50 bg-slate-100/50 border border-solid border-gray-300 dark:border-gray-700'
							}
						>
							<Stack className={'card-wrap'}>
								{agentProperties.map((property: Property) => {
									return (
										<div className={'wrap-main'} key={property?._id}>
											<PropertyBigCard
												property={property}
												key={property?._id}
												likePropertyHandler={likePropertyHandler}
											/>
										</div>
									);
								})}
							</Stack>
							<Stack className={'pagination'}>
								{propertyTotal ? (
									<>
										<Stack className="pagination-box">
											<Pagination
												variant="outlined"
												page={searchFilter.page}
												count={Math.ceil(propertyTotal / searchFilter.limit) || 1}
												onChange={propertyPaginationChangeHandler}
												shape="circular"
											/>
										</Stack>
										<span>
											Total {propertyTotal} propert{propertyTotal > 1 ? 'ies' : 'y'} available
										</span>
									</>
								) : (
									<div className={'no-data'}>
										<img src="/img/icons/icoAlert.svg" alt="" />
										<p>No properties found!</p>
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
								<span>Reviews</span>
								<p>we are glad to see you again</p>
							</Stack>
							{commentTotal !== 0 && (
								<Stack
									className={
										'review-wrap dark:bg-slate-800 bg-white border border-solid border-gray-300 dark:border-gray-500'
									}
								>
									<Box component={'div'} className={'title-box'}>
										<StarIcon />
										<span>
											{commentTotal} review{commentTotal > 1 ? 's' : ''}
										</span>
									</Box>
									{agentComments?.map((comment: Comment) => {
										return <ReviewCard comment={comment} key={comment?._id} />;
									})}
									<Box component={'div'} className={'pagination-box'}>
										<Pagination
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
								<Typography className={'main-title'}>Leave A Review</Typography>
								<Typography className={'review-title'}>Review</Typography>
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

AgentDetail.defaultProps = {
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

export default withLayoutBasic(AgentDetail);
