import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Button, Stack, Typography, Tab, Tabs, IconButton, Backdrop, Pagination, Divider } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import Moment from 'react-moment';
import { userVar } from '../../apollo/store';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ChatIcon from '@mui/icons-material/Chat';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import { CommentInput, CommentsInquiry } from '../../libs/types/comment/comment.input';
import { Comment } from '../../libs/types/comment/comment';
import dynamic from 'next/dynamic';
import { CommentGroup, CommentStatus } from '../../libs/enums/comment.enum';
import { T } from '../../libs/types/common';
import EditIcon from '@mui/icons-material/Edit';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { BoardArticle } from '../../libs/types/board-article/board-article';
import { CREATE_COMMENT, LIKE_TARGET_BOARD_ARTICLE, UPDATE_COMMENT } from '../../apollo/user/mutation';
import { GET_BOARD_ARTICLE, GET_COMMENTS } from '../../apollo/user/query';
import NewspaperOutlinedIcon from '@mui/icons-material/NewspaperOutlined';
import {
	sweetConfirmAlert,
	sweetMixinErrorAlert,
	sweetMixinSuccessAlert,
	sweetTopSmallSuccessAlert,
} from '../../libs/sweetAlert';
import { Message } from '../../libs/enums/common.enum';
import { Messages } from '../../libs/config';
import { CommentUpdate } from '../../libs/types/comment/comment.update';
const ToastViewerComponent = dynamic(() => import('../../libs/components/community/TViewer'), { ssr: false });

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const CommunityDetail: NextPage = ({ initialInput, ...props }: T) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const { query } = router;

	const articleId = query?.id as string;
	const articleCategory = query?.articleCategory as string;

	const [comment, setComment] = useState<string>('');
	const [wordsCnt, setWordsCnt] = useState<number>(0);
	const [updatedCommentWordsCnt, setUpdatedCommentWordsCnt] = useState<number>(0);
	const user = useReactiveVar(userVar);
	const [comments, setComments] = useState<Comment[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [searchFilter, setSearchFilter] = useState<CommentsInquiry>({
		...initialInput,
	});
	const [memberImage, setMemberImage] = useState<string>('/img/community/articleImg.png');
	const [anchorEl, setAnchorEl] = useState<any | null>(null);
	const open = Boolean(anchorEl);
	const id = open ? 'simple-popover' : undefined;
	const [openBackdrop, setOpenBackdrop] = useState<boolean>(false);
	const [updatedComment, setUpdatedComment] = useState<string>('');
	const [updatedCommentId, setUpdatedCommentId] = useState<string>('');
	const [likeLoading, setLikeLoading] = useState<boolean>(false);
	const [boardArticle, setBoardArticle] = useState<BoardArticle>();

	/** APOLLO REQUESTS **/
	const [likeTargetBoardArticle] = useMutation(LIKE_TARGET_BOARD_ARTICLE);
	const [createComment] = useMutation(CREATE_COMMENT);
	const [updateComment] = useMutation(UPDATE_COMMENT);

	const {
		loading: boardArticleLoading,
		data: boardArticleData,
		error: boardArticleError,
		refetch: boardArticleRefetch,
	} = useQuery(GET_BOARD_ARTICLE, {
		fetchPolicy: 'network-only',
		variables: { input: articleId },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setBoardArticle(data.getBoardArticle);
			if (data.getBoardArticle?.memberData?.memberImage)
				setMemberImage(`${process.env.REACT_APP_API_URL}/${data.getBoardArticle?.memberData?.memberImage}`);
		},
	});

	const {
		loading: getCommentsLoading,
		data: getCommentsData,
		error: getCommentsError,
		refetch: getCommentsRefetch,
	} = useQuery(GET_COMMENTS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: searchFilter },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setComments(data.getComments.list);
			setTotal(data.getComments.metaCounter[0].total || 0);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (articleId) setSearchFilter({ ...searchFilter, search: { commentRefId: articleId } });
	}, [articleId]);

	/** HANDLERS **/
	const tabChangeHandler = (event: React.SyntheticEvent, value: string) => {
		router.replace(
			{
				pathname: '/community',
				query: { articleCategory: value },
			},
			'/community',
			{ shallow: true },
		);
	};

	const likeBoArticleHandler = async (user: T, id: string) => {
		try {
			if (likeLoading) return;
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			setLikeLoading(true);

			await likeTargetBoardArticle({
				variables: { input: id },
			});
			await boardArticleRefetch({ input: articleId });

			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('ERROR, likePropertyHandler:', err.message);
			sweetMixinErrorAlert(err.message).then();
		} finally {
			setLikeLoading(false);
		}
	};

	const creteCommentHandler = async () => {
		if (!comment) return;
		try {
			if (!user?._id) throw new Error(Messages.error2);
			const commentInput: CommentInput = {
				commentGroup: CommentGroup.ARTICLE,
				commentRefId: articleId,
				commentContent: comment,
			};
			await createComment({
				variables: { input: commentInput },
			});
			await getCommentsRefetch({ input: searchFilter });
			await boardArticleRefetch({ input: articleId });
			setComment('');
			await sweetMixinSuccessAlert('Successfully commented!', 800);
		} catch (err: any) {
			console.log('ERROR, creteCommentHandler:', err.message);
			await sweetMixinErrorAlert(err.message);
		}
	};

	const updateButtonHandler = async (commentId: string, commentStatus?: CommentStatus.DELETE) => {
		try {
			if (!user?._id) throw new Error(Messages.error2);
			if (!commentId) throw new Error('Select a comment to update');
			if (updatedComment === comments?.find((comment) => comment?._id === commentId)?.commentContent) return;
			const updateData: CommentUpdate = {
				_id: commentId,
				...(commentStatus && { commentStatus: commentStatus }),
				...(updatedComment && { commentContent: updatedComment }),
			};

			if (!updateData?.commentContent && !updateData?.commentStatus)
				throw new Error('Provide data to updaet your comment');
			if (commentStatus) {
				if (await sweetConfirmAlert('Do you want to delete the comment?')) {
					await updateComment({
						variables: { input: updateData },
					});
					await sweetMixinSuccessAlert('Successfully deleted!', 800);
				} else return;
			} else {
				await updateComment({
					variables: { input: updateData },
				});
				await sweetMixinSuccessAlert('Successfully updated!', 800);
			}
			await getCommentsRefetch({ input: searchFilter });
		} catch (err: any) {
			console.log('ERROR, updateButtonHandler:', err.message);
			await sweetMixinErrorAlert(err.message);
		} finally {
			setOpenBackdrop(false);
			setUpdatedComment('');
			setUpdatedCommentWordsCnt(0);
			setUpdatedCommentId('');
		}
	};

	const getCommentMemberImage = (imageUrl: string | undefined) => {
		if (imageUrl) return `${process.env.REACT_APP_API_URL}/${imageUrl}`;
		else return '/img/community/articleImg.png';
	};

	const goMemberPage = (id: any) => {
		if (id === user?._id) router.push('/mypage');
		else router.push(`/member?memberId=${id}`);
	};

	const cancelButtonHandler = () => {
		setOpenBackdrop(false);
		setUpdatedComment('');
		setUpdatedCommentWordsCnt(0);
	};

	const updateCommentInputHandler = (value: string) => {
		if (value.length > 100) return;
		setUpdatedCommentWordsCnt(value.length);
		setUpdatedComment(value);
	};

	const paginationHandler = (e: T, value: number) => {
		setSearchFilter({ ...searchFilter, page: value });
	};

	if (device === 'mobile') {
		return <div>COMMUNITY DETAIL PAGE MOBILE</div>;
	} else {
		return (
			<div id="community-detail-page">
				<div className="container">
					<Stack className="main-box border border-solid border-neutral-300 dark:border-neutral-600 rounded-lg dark:bg-slate-950/50 bg-neutral-50/50">
						<Stack className="left-config dark:bg-slate-900 bg-neutral-50 border border-solid border-neutral-300 dark:border-neutral-600">
							<Stack className={'image-info'}>
								<Stack className={'community-name'}>
									<Typography className={'name text-neutral-900 dark:text-neutral-200 font-openSans'}>
										Article Category <NewspaperOutlinedIcon className="text-amber-400 ml-2" />
									</Typography>
								</Stack>
							</Stack>
							<Tabs
								orientation="vertical"
								aria-label="lab API tabs example"
								TabIndicatorProps={{
									style: { display: 'none' },
								}}
								onChange={tabChangeHandler}
								value={articleCategory}
							>
								<Tab
									value={'FREE'}
									label={'Free Board'}
									className={`tab-button ${
										articleCategory === 'FREE' ? 'active' : ''
									} border border-solid border-neutral-600`}
								/>
								<Tab
									value={'RECOMMEND'}
									label={'Recommendation'}
									className={`tab-button ${
										articleCategory === 'RECOMMEND' ? 'active' : ''
									} border border-solid border-neutral-600`}
								/>
								<Tab
									value={'NEWS'}
									label={'News'}
									className={`tab-button ${
										articleCategory === 'NEWS' ? 'active' : ''
									} border border-solid border-neutral-600`}
								/>
								<Tab
									value={'HUMOR'}
									label={'Humor'}
									className={`tab-button ${
										articleCategory === 'HUMOR' ? 'active' : ''
									} border border-solid border-neutral-600`}
								/>
							</Tabs>
							<Divider />
							<Button
								variant="contained"
								onClick={() =>
									router.push({
										pathname: '/mypage',
										query: {
											category: 'writeArticle',
										},
									})
								}
								className="rounded-md mt-10 p-3 border border-solid border-neutral-600 text-neutral-200 bg-neutral-900 hover:bg-neutral-700 font-openSans font-meduim"
							>
								Write new article
							</Button>
						</Stack>
						<div className="community-detail-config">
							<Stack className="title-box">
								<Stack className="left">
									<Typography className="title text-neutral-900 dark:text-neutral-200">
										{articleCategory} BOARD
									</Typography>
									<Typography className="sub-title">
										Express your opinions freely here without content restrictions
									</Typography>
								</Stack>
							</Stack>
							<div className="config">
								<Stack className="first-box-config p-4 dark:bg-slate-900 bg-neutral-50 rounded-lg border border-solid border-neutral-300 dark:border-neutral-600">
									<Stack className="content-and-info">
										<Stack className="content">
											<Typography className="content-data text-neutral-900 dark:text-neutral-200">
												{boardArticle?.articleTitle}
											</Typography>
											<Stack className="member-info">
												<img
													src={memberImage}
													alt=""
													className="member-img"
													onClick={() => goMemberPage(boardArticle?.memberData?._id)}
												/>
												<div className="flex flex-col">
													<Typography
														className="member-nick text-neutral-900 dark:text-neutral-200"
														onClick={() => goMemberPage(boardArticle?.memberData?._id)}
													>
														{boardArticle?.memberData?.memberNick}
													</Typography>
													<Moment className={'time-added space-x-2 text-gray-500'} format={'DD MMM, YYYY HH:mm'}>
														{boardArticle?.createdAt}
													</Moment>
												</div>
											</Stack>
										</Stack>
										<Stack className="info">
											<Stack className="icon-info cursor-pointer">
												{boardArticle?.meLiked && boardArticle?.meLiked[0]?.myFavorite ? (
													<ThumbUpAltIcon
														className="text-neutral-900 dark:text-neutral-200"
														onClick={() => likeBoArticleHandler(user, boardArticle?._id)}
													/>
												) : (
													<ThumbUpOffAltIcon
														onClick={() => boardArticle?._id && likeBoArticleHandler(user, boardArticle._id)}
													/>
												)}

												<Typography className="text text-neutral-900 dark:text-neutral-200">
													{boardArticle?.articleLikes}
												</Typography>
											</Stack>
											<Stack className="divider"></Stack>
											<Stack className="icon-info">
												<VisibilityIcon className="text-neutral-900 dark:text-neutral-200" />
												<Typography className="text text-neutral-900 dark:text-neutral-200">
													{boardArticle?.articleViews}
												</Typography>
											</Stack>
											<Stack className="divider"></Stack>
											<Stack className="icon-info cursor-pointer">
												{total > 0 ? (
													<ChatIcon className="text-neutral-900 dark:text-neutral-200" />
												) : (
													<ChatBubbleOutlineRoundedIcon className="text-neutral-900 dark:text-neutral-200" />
												)}
												<Typography className="text text-neutral-900 dark:text-neutral-200">{total}</Typography>
											</Stack>
										</Stack>
									</Stack>
									<Stack>
										<ToastViewerComponent
											markdown={boardArticle?.articleContent}
											className={'ytb_play text-neutral-900 dark:text-neutral-200'}
										/>
									</Stack>
									<Stack className="like-and-dislike">
										<Stack className="top">
											<Button variant="outlined" className="dark:text-neutral-100 text-neutral-800" color="inherit">
												{boardArticle?.meLiked && boardArticle?.meLiked[0]?.myFavorite ? (
													<ThumbUpAltIcon onClick={() => likeBoArticleHandler(user, boardArticle?._id)} />
												) : (
													<ThumbUpOffAltIcon
														onClick={() => boardArticle?._id && likeBoArticleHandler(user, boardArticle?._id)}
													/>
												)}
												<Typography className="text">{boardArticle?.articleLikes}</Typography>
											</Button>
										</Stack>
									</Stack>
								</Stack>
								<Stack className="second-box-config mt-10 dark:bg-slate-900 bg-neutral-50 rounded-lg border border-solid border-neutral-300 dark:border-neutral-600">
									<Typography className="title-text text-neutral-900 dark:text-neutral-200">
										Comments ( {total} )
									</Typography>
									<Stack className="leave-comment">
										<input
											className="border border-solid border-neutral-300"
											type="text"
											placeholder="Leave a comment"
											value={comment}
											onChange={(e) => {
												if (e.target.value.length > 100) return;
												setWordsCnt(e.target.value.length);
												setComment(e.target.value);
											}}
										/>
										<Stack className="button-box">
											<Typography className="text-neutral-900 dark:text-neutral-200">{wordsCnt}/100</Typography>
											<Button variant="contained" color="success" onClick={creteCommentHandler}>
												comment
											</Button>
										</Stack>
									</Stack>
								</Stack>
								{total > 0 && (
									<Stack className="comments mt-10">
										<Typography className="comments-title">Comments</Typography>
									</Stack>
								)}
								{comments?.map((commentData, index) => {
									return (
										<Stack className="comments-box p-2" key={commentData?._id}>
											<Stack className="main-comment space-y-2 dark:bg-slate-900 bg-neutral-50 rounded-lg border border-solid border-neutral-300 dark:border-neutral-600">
												<Stack className="member-info">
													<Stack
														className="name-date"
														onClick={() => goMemberPage(commentData?.memberData?._id as string)}
													>
														<img src={getCommentMemberImage(commentData?.memberData?.memberImage)} alt="" />
														<Stack className="name-date-column">
															<Typography className="name text-neutral-900 dark:text-neutral-200">
																{commentData?.memberData?.memberNick}
															</Typography>
															<Typography className="date">
																<Moment className={'time-added'} format={'DD.MM.YY HH:mm'}>
																	{commentData?.createdAt}
																</Moment>
															</Typography>
														</Stack>
													</Stack>
													{commentData?.memberId === user?._id && (
														<Stack className="buttons">
															<IconButton
																onClick={() => {
																	setUpdatedCommentId(commentData?._id);
																	updateButtonHandler(commentData?._id, CommentStatus.DELETE);
																}}
															>
																<DeleteForeverIcon sx={{ color: '#757575', cursor: 'pointer' }} />
															</IconButton>
															<IconButton
																onClick={() => {
																	setUpdatedComment(commentData?.commentContent);
																	setUpdatedCommentWordsCnt(commentData?.commentContent?.length);
																	setUpdatedCommentId(commentData?._id);
																	setOpenBackdrop(true);
																}}
															>
																<EditIcon sx={{ color: '#757575' }} />
															</IconButton>
															<Backdrop
																sx={{
																	top: '40%',
																	right: '25%',
																	left: '25%',
																	width: '1000px',
																	height: 'fit-content',
																	borderRadius: '10px',
																	color: '#ffffff',
																	zIndex: 999,
																}}
																open={openBackdrop}
															>
																<Stack
																	sx={{
																		width: '100%',
																		height: '100%',
																		background: 'white',
																		border: '1px solid #b9b9b9',
																		padding: '15px',
																		gap: '10px',
																		borderRadius: '10px',
																		boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
																	}}
																>
																	<Typography variant="h4" color={'#b9b9b9'}>
																		Update comment
																	</Typography>
																	<Stack gap={'20px'}>
																		<input
																			autoFocus
																			value={updatedComment}
																			onChange={(e) => updateCommentInputHandler(e.target.value)}
																			type="text"
																			style={{
																				border: '1px solid #b9b9b9',
																				outline: 'none',
																				height: '40px',
																				padding: '0px 10px',
																				borderRadius: '5px',
																				color: '#000000',
																			}}
																		/>
																		<Stack width={'100%'} flexDirection={'row'} justifyContent={'space-between'}>
																			<Typography variant="subtitle1" color={'#b9b9b9'}>
																				{updatedCommentWordsCnt}/100
																			</Typography>
																			<Stack sx={{ flexDirection: 'row', alignSelf: 'flex-end', gap: '10px' }}>
																				<Button
																					variant="outlined"
																					color="error"
																					className="rounded-lg"
																					onClick={() => cancelButtonHandler()}
																				>
																					Cancel
																				</Button>
																				<Button
																					variant="contained"
																					color="info"
																					className="rounded-lg"
																					onClick={() => updateButtonHandler(updatedCommentId, undefined)}
																				>
																					Update
																				</Button>
																			</Stack>
																		</Stack>
																	</Stack>
																</Stack>
															</Backdrop>
														</Stack>
													)}
												</Stack>
												<Stack className="content">
													<Typography className="text-neutral-900 dark:text-neutral-200">
														{commentData?.commentContent}
													</Typography>
												</Stack>
											</Stack>
										</Stack>
									);
								})}
								{total > 0 && (
									<Stack className="pagination-box">
										<Pagination
											variant="outlined"
											count={Math.ceil(total / searchFilter.limit) || 1}
											page={searchFilter.page}
											shape="circular"
											color="primary"
											onChange={paginationHandler}
										/>
									</Stack>
								)}
							</div>
						</div>
					</Stack>
				</div>
			</div>
		);
	}
};
CommunityDetail.defaultProps = {
	initialInput: {
		page: 1,
		limit: 5,
		sort: 'createdAt',
		direction: 'DESC',
		search: { commentRefId: '' },
	},
};

export default withLayoutBasic(CommunityDetail);
