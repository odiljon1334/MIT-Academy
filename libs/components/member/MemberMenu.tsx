import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Stack, Typography, Box, List, ListItem, Button, Chip } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import Link from 'next/link';
import { Member } from '../../types/member/member';
import { REACT_APP_API_URL } from '../../config';
import { useQuery } from '@apollo/client';
import { GET_MEMBER } from '../../../apollo/user/query';
import { T } from '../../types/common';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import FollowTheSignsRoundedIcon from '@mui/icons-material/FollowTheSignsRounded';
import ExploreIcon from '@mui/icons-material/Explore';
import FaceIcon from '@mui/icons-material/Face';

interface MemberMenuProps {
	subscribeHandler: any;
	unsubscribeHandler: any;
}

const MemberMenu = (props: MemberMenuProps) => {
	const { subscribeHandler, unsubscribeHandler } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const category: any = router.query?.category;
	const [member, setMember] = useState<Member | null>(null);
	const { memberId } = router.query;

	/** APOLLO REQUESTS **/
	const {
		loading: getMemberLoading,
		data: getMemberData,
		error: getMemberError,
		refetch: getMemberRefetch,
	} = useQuery(GET_MEMBER, {
		fetchPolicy: 'network-only',
		variables: { input: memberId },
		skip: !memberId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setMember(data?.getMember);
		},
	});

	if (device === 'mobile') {
		return <div>MEMBER MENU MOBILE</div>;
	} else {
		return (
			<Stack width={'100%'} padding={'30px 24px'}>
				<Stack className={'profile'}>
					<Box component={'div'} className={'profile-img'}>
						<img
							src={member?.memberImage ? `${REACT_APP_API_URL}/${member?.memberImage}` : '/img/profile/defaultUser.svg'}
							alt={'member-photo'}
						/>
					</Box>
					<Stack className={'user-info'}>
						<Typography className={'user-name dark:text-slate-200 text-slate-950'}>{member?.memberNick}</Typography>
						<Box component={'div'} className={'user-phone dark:text-slate-400 text-slate-950'}>
							<PhoneIcon className="w-5 h-5" />
							<Typography className={'p-number'}>{member?.memberPhone}</Typography>
						</Box>
						{member?._id && member?.memberType === 'ADMIN' ? (
							<a href="/_admin/users" target={'_blank'}>
								<Chip color="success" icon={<FaceIcon />} label={`${member?.memberType}`} variant="outlined" />
							</a>
						) : null}
						{member?._id && member?.memberType === 'INSTRUCTOR' ? (
							<Chip
								className="w-[110px] h-7 mt-2"
								color="success"
								icon={<FaceIcon />}
								label={'Instructor'}
								variant="outlined"
							/>
						) : null}
					</Stack>
				</Stack>
				<Stack className="follow-button-box">
					{member?.meFollowed && member?.meFollowed[0]?.myFollowing ? (
						<>
							<Button
								variant="contained"
								color="error"
								onClick={() => unsubscribeHandler(member?._id, getMemberRefetch, memberId)}
							>
								Unfollow
							</Button>
							<Typography>Following</Typography>
						</>
					) : (
						<Button
							variant="contained"
							color="success"
							onClick={() => subscribeHandler(member?._id, getMemberRefetch, memberId)}
						>
							Follow
						</Button>
					)}
				</Stack>
				<Stack className={'sections'}>
					<Stack className={'section'}>
						<Typography className="title mb-2 dark:text-slate-400 text-slate-950">Details</Typography>
						<List className={'sub-section'}>
							{member?.memberType === 'INSTRUCTOR' && (
								<ListItem
									className={
										category === 'courses'
											? 'focus border border-solid border-neutral-300 dark:border-neutral-600'
											: 'border border-solid border-neutral-300 dark:border-neutral-600 h-10 p-6'
									}
								>
									<Link
										href={{
											pathname: '/member',
											query: { ...router.query, category: 'courses' },
										}}
										scroll={false}
										style={{ width: '100%' }}
									>
										<div className={'flex-box dark:text-slate-200 text-slate-950'}>
											<HomeIcon />
											<Typography className={'sub-title'} variant={'subtitle1'} component={'p'}>
												Courses
											</Typography>
										</div>
									</Link>
								</ListItem>
							)}
							<ListItem
								className={
									category === 'followers'
										? 'focus border border-solid border-neutral-300 dark:border-neutral-600'
										: 'border border-solid border-neutral-300 dark:border-neutral-600 h-10 p-6'
								}
							>
								<Link
									href={{
										pathname: '/member',
										query: { ...router.query, category: 'followers' },
									}}
									scroll={false}
									style={{ width: '100%' }}
								>
									<div className={'flex-box dark:text-slate-200 text-slate-950'}>
										<FollowTheSignsRoundedIcon />
										<Typography className={'sub-title'} variant={'subtitle1'} component={'p'}>
											Followers
										</Typography>
									</div>
								</Link>
							</ListItem>
							<ListItem
								className={
									category === 'followings'
										? 'focus border border-solid border-neutral-300 dark:border-neutral-600'
										: 'border border-solid border-neutral-300 dark:border-neutral-600 h-10 p-6'
								}
							>
								<Link
									href={{
										pathname: '/member',
										query: { ...router.query, category: 'followings' },
									}}
									scroll={false}
									style={{ width: '100%' }}
								>
									<div className={'flex-box space-x-2 dark:text-slate-200 text-slate-950'}>
										<FollowTheSignsRoundedIcon />
										<Typography className={'sub-title'} variant={'subtitle1'} component={'p'}>
											Followings
										</Typography>
									</div>
								</Link>
							</ListItem>
						</List>
					</Stack>
					<Stack className={'section'} sx={{ marginTop: '10px' }}>
						<div>
							<Typography className="title mb-4 dark:text-slate-400 text-slate-950" variant={'h5'}>
								Community
							</Typography>
							<List className={'sub-section'}>
								<ListItem
									className={
										category === 'articles'
											? 'focus border border-solid border-neutral-300 dark:border-neutral-600'
											: 'border border-solid border-neutral-300 dark:border-neutral-600 h-10 p-6'
									}
								>
									<Link
										href={{
											pathname: '/member',
											query: { ...router.query, category: 'articles' },
										}}
										scroll={false}
										style={{ width: '100%' }}
									>
										<div className={'flex-box dark:text-slate-200 text-slate-950'}>
											<ExploreIcon />
											<Typography className={'sub-title'} variant={'subtitle1'} component={'p'}>
												Articles
											</Typography>
										</div>
									</Link>
								</ListItem>
							</List>
						</div>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default MemberMenu;
