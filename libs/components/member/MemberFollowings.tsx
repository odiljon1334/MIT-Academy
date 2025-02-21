import React, { ChangeEvent, useEffect, useState } from 'react';
import { Box, Button, Pagination, Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useRouter } from 'next/router';
import { FollowInquiry } from '../../types/follow/follow.input';
import { useQuery, useReactiveVar } from '@apollo/client';
import { Following } from '../../types/follow/follow';
import { REACT_APP_API_URL } from '../../config';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { userVar } from '../../../apollo/store';
import { GET_MEMBER_FOLLOWINGS } from '../../../apollo/user/query';
import { T } from '../../types/common';
import { Card, CardContent, CardMedia, Paper } from '@mui/material';

interface MemberFollowingsProps {
	initialInput: FollowInquiry;
	subscribeHandler: any;
	unsubscribeHandler: any;
	redirectToMemberPageHandler: any;
	likeMemberHandler?: any;
}

const MemberFollowings = (props: MemberFollowingsProps) => {
	const { likeMemberHandler, initialInput, subscribeHandler, unsubscribeHandler, redirectToMemberPageHandler } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const [total, setTotal] = useState<number>(0);
	const category: any = router.query?.category ?? 'properties';
	const [followInquiry, setFollowInquiry] = useState<FollowInquiry>(initialInput);
	const [memberFollowings, setMemberFollowings] = useState<Following[]>([]);
	const user = useReactiveVar(userVar);

	/** APOLLO REQUESTS **/
	const {
		loading: getMemberFollowingsLoading,
		data: getMemberFollowingsData,
		error: getMemberFollowingsError,
		refetch: getMemberFollowingsRefetch,
	} = useQuery(GET_MEMBER_FOLLOWINGS, {
		fetchPolicy: 'network-only',
		variables: { input: followInquiry },
		skip: !followInquiry?.search?.followerId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setMemberFollowings(data.getMemberFollowings?.list);
			setTotal(data.getMemberFollowings?.metaCounter[0]?.total ?? 0);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (router.query.memberId)
			setFollowInquiry({ ...followInquiry, search: { followerId: router.query.memberId as string } });
		else setFollowInquiry({ ...followInquiry, search: { followerId: user?._id } });
	}, [router]);

	useEffect(() => {}, [followInquiry]);

	/** HANDLERS **/
	const paginationHandler = async (event: ChangeEvent<unknown>, value: number) => {
		followInquiry.page = value;
		setFollowInquiry({ ...followInquiry });
	};

	if (device === 'mobile') {
		return <div>NESTAR FOLLOWS MOBILE</div>;
	} else {
		return (
			<>
				<div id="member-follows-page">
					<Stack className="main-title-box">
						<Stack className="right-box">
							<Typography className="main-title">{category === 'followers' ? 'Followers' : 'Followings'}</Typography>
						</Stack>
					</Stack>
					<Stack className="follows-list-box">
						<Stack className="listing-title-box bg-neutral-200 border border-solid border-neutral-300">
							<Typography className="title-text">Name</Typography>
							<Typography className="title-text">Details</Typography>
							<Typography className="title-text">Subscription</Typography>
						</Stack>
						{memberFollowings?.length === 0 && (
							<div className={'no-data'}>
								<img src="/img/icons/icoAlert.svg" alt="" />
								<p>No Followings yet!</p>
							</div>
						)}
						<Box className="w-full flex flex-col justify-center space-y-4">
							{memberFollowings.map((follower: Following) => {
								const imagePath: string = follower?.followingData?.memberImage
									? `${REACT_APP_API_URL}/${follower?.followingData?.memberImage}`
									: '/img/profile/defaultUser.svg';
								return (
									<Card
										key={follower._id}
										className="flex flex-row rounded-md shadow-lg w-[100%] p-4 bg-neutral-50 dark:bg-slate-900 border border-solid dark:border-neutral-600 border-neutral-300"
									>
										<CardMedia
											component="img"
											sx={{ width: 182, height: 182, borderRadius: '8px', objectFit: 'cover' }}
											image={imagePath}
											alt="User Image"
										/>
										<CardContent className="flex flex-col w-full">
											<Typography variant="h6" className="font-semibold">
												{follower?.followingData?.memberNick}
											</Typography>
											<Typography variant="body2" color="text.secondary" className="font-medium">
												Senior Journalist
											</Typography>
											<Paper
												elevation={3}
												className="p-3 my-3 flex justify-between rounded-lg dark:bg-slate-800 bg-gray-100"
											>
												<Box className="text-center">
													<Typography variant="caption" className="font-medium">
														Properties
													</Typography>
													<Typography variant="body1" className="font-bold">
														{follower?.followingData?.memberProperties}
													</Typography>
												</Box>
												<Box className="text-center">
													<Typography variant="caption" className="font-medium">
														Followers
													</Typography>
													<Typography variant="body1" className="font-bold">
														{follower?.followingData?.memberFollowers}
													</Typography>
												</Box>
												<Box className="text-center">
													<Typography variant="caption" className="font-medium">
														Followings
													</Typography>
													<Typography variant="body1" className="font-bold">
														{follower?.followingData?.memberFollowings}
													</Typography>
												</Box>
												<Box className="text-center">
													<Typography variant="caption" className="font-medium">
														Rating
													</Typography>
													<Typography variant="body1" className="font-bold">
														{follower?.followingData?.memberRank}
													</Typography>
												</Box>
											</Paper>
											<Box className="flex justify-end">
												{user?._id !== follower?.followingId && (
													<Stack className="action-box">
														{follower.meFollowed && follower.meFollowed[0]?.myFollowing ? (
															<>
																<Button
																	variant="contained"
																	color="primary"
																	className="flex rounded-md"
																	onClick={() =>
																		unsubscribeHandler(
																			follower?.followingData?._id,
																			getMemberFollowingsRefetch,
																			followInquiry,
																		)
																	}
																>
																	unfollow
																</Button>
															</>
														) : (
															<Button
																variant="contained"
																sx={{ background: '#60eb60d4', ':hover': { background: '#60eb60d4' } }}
																onClick={() =>
																	subscribeHandler(
																		follower?.followingData?._id,
																		getMemberFollowingsRefetch,
																		followInquiry,
																	)
																}
															>
																Follow
															</Button>
														)}
													</Stack>
												)}
											</Box>
										</CardContent>
									</Card>
								);
							})}
						</Box>
					</Stack>
					{memberFollowings.length !== 0 && (
						<Stack className="pagination-config">
							<Stack className="pagination-box">
								<Pagination
									page={followInquiry.page}
									count={Math.ceil(total / followInquiry.limit)}
									onChange={paginationHandler}
									shape="circular"
									color="primary"
								/>
							</Stack>
							<Stack className="total-result">
								<Typography>{total} followings</Typography>
							</Stack>
						</Stack>
					)}
				</div>
			</>
		);
	}
};

MemberFollowings.defaultProps = {
	initialInput: {
		page: 1,
		limit: 5,
		search: {
			followerId: '',
		},
	},
};

export default MemberFollowings;
