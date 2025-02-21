import React from 'react';
import { useRouter } from 'next/router';
import { Stack, Typography, Box, List, ListItem, Chip } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import Link from 'next/link';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import PortraitIcon from '@mui/icons-material/Portrait';
import IconButton from '@mui/material/IconButton';
import { REACT_APP_API_URL } from '../../config';
import { logOut } from '../../auth';
import { sweetConfirmAlert } from '../../sweetAlert';
import FaceIcon from '@mui/icons-material/Face';
import PhoneIcon from '@mui/icons-material/Phone';
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import SavedSearchIcon from '@mui/icons-material/SavedSearch';
import PersonAddAltSharpIcon from '@mui/icons-material/PersonAddAltSharp';
import GroupAddSharpIcon from '@mui/icons-material/GroupAddSharp';
import ExploreSharpIcon from '@mui/icons-material/ExploreSharp';
import QueueIcon from '@mui/icons-material/Queue';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';

const MyMenu = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const pathname = router.query.category ?? 'myProfile';
	const category: any = router.query?.category ?? 'myProfile';
	const user = useReactiveVar(userVar);

	/** HANDLERS **/
	const logoutHandler = async () => {
		try {
			if (await sweetConfirmAlert('Do you want to logout?')) logOut();
		} catch (err: any) {
			console.log('ERROR, logoutHandler:', err.message);
		}
	};

	if (device === 'mobile') {
		return <div>MY MENU</div>;
	} else {
		return (
			<Stack width={'100%'} padding={'30px 22px'}>
				<Stack className={'profile  p-2 border border-solid dark:border-neutral-600 border-neutral-300'}>
					<Box component={'div'} className={'profile-img'}>
						<img
							src={user?.memberImage ? `${REACT_APP_API_URL}/${user?.memberImage}` : '/img/profile/defaultUser.svg'}
							alt={'member-photo'}
						/>
					</Box>
					<Stack className={'user-info'}>
						<Typography className={'user-name font-openSans'}>{user?.memberNick}</Typography>
						<Box component={'div'} className={'user-phone space-x-1'}>
							{user?._id && user?.memberPhone ? <PhoneIcon /> : null}
							<Typography className={'p-number mb-2'}>{user?.memberPhone}</Typography>
						</Box>
						{user._id && user?.memberType === 'ADMIN' ? (
							<a href="/_admin/users" target={'_blank'}>
								<Chip color="success" icon={<FaceIcon />} label={`${user?.memberType}`} variant="outlined" />
							</a>
						) : null}
						{user?._id && user?.memberType === 'AGENT' ? (
							<Chip color="success" icon={<FaceIcon />} label={`${user?.memberType}`} variant="outlined" />
						) : null}
					</Stack>
				</Stack>
				<Stack className={'sections'}>
					<Stack className={'section'} style={{ height: user.memberType === 'AGENT' ? '228px' : '153px' }}>
						<Typography className="title text-lg mb-2 font-openSans font-semibold text-neutral-600 dark:text-neutral-400">
							MANAGE LISTINGS
						</Typography>
						<List className={'sub-section'}>
							{user.memberType === 'AGENT' && (
								<>
									<ListItem className={pathname === 'addProperty' ? 'focus' : ''}>
										<Link
											href={{
												pathname: '/mypage',
												query: { category: 'addProperty' },
											}}
											scroll={false}
										>
											<div className={'flex-box'}>
												<LibraryAddCheckIcon
													fontSize="medium"
													className={
														category === 'addProperty' ? 'text-slate-100' : 'text-slate-900 dark:text-slate-50'
													}
												/>
												<Typography className={'sub-title'} variant={'subtitle1'} component={'p'}>
													Add Property
												</Typography>
												<IconButton aria-label="delete" sx={{ ml: '40px' }}>
													<PortraitIcon style={{ color: 'red' }} />
												</IconButton>
											</div>
										</Link>
									</ListItem>
									<ListItem className={pathname === 'myProperties' ? 'focus' : ''}>
										<Link
											href={{
												pathname: '/mypage',
												query: { category: 'myProperties' },
											}}
											scroll={false}
										>
											<div className={'flex-box'}>
												<HomeRoundedIcon
													fontSize="medium"
													className={
														category === 'myProperties' ? 'text-slate-100' : 'text-slate-900 dark:text-slate-50'
													}
												/>
												<Typography className={'sub-title'} variant={'subtitle1'} component={'p'}>
													My Properties
												</Typography>
												<IconButton aria-label="delete" sx={{ ml: '36px' }}>
													<PortraitIcon style={{ color: 'red' }} />
												</IconButton>
											</div>
										</Link>
									</ListItem>
								</>
							)}
							<ListItem className={pathname === 'myFavorites' ? 'focus' : ''}>
								<Link
									href={{
										pathname: '/mypage',
										query: { category: 'myFavorites' },
									}}
									scroll={false}
								>
									<div className={'flex-box'}>
										<FavoriteBorderIcon
											fontSize="medium"
											className={category === 'myFavorites' ? 'text-slate-100' : 'text-slate-900 dark:text-slate-50'}
										/>
										<Typography className={'sub-title'} variant={'subtitle1'} component={'p'}>
											My Favorites
										</Typography>
									</div>
								</Link>
							</ListItem>
							<ListItem className={pathname === 'recentlyVisited' ? 'focus' : ''}>
								<Link
									href={{
										pathname: '/mypage',
										query: { category: 'recentlyVisited' },
									}}
									scroll={false}
								>
									<div className={'flex-box'}>
										<SavedSearchIcon
											fontSize="medium"
											className={
												category === 'recentlyVisited' ? 'text-slate-100' : 'text-slate-900 dark:text-slate-50'
											}
										/>
										<Typography className={'sub-title'} variant={'subtitle1'} component={'p'}>
											Recently Visited
										</Typography>
									</div>
								</Link>
							</ListItem>
							<ListItem className={pathname === 'followers' ? 'focus' : ''}>
								<Link
									href={{
										pathname: '/mypage',
										query: { category: 'followers' },
									}}
									scroll={false}
								>
									<div className={'flex-box'}>
										<PersonAddAltSharpIcon
											fontSize="medium"
											className={category === 'followers' ? 'text-slate-100' : 'text-slate-900 dark:text-slate-50'}
										/>
										<Typography className={'sub-title'} variant={'subtitle1'} component={'p'}>
											My Followers
										</Typography>
									</div>
								</Link>
							</ListItem>
							<ListItem className={pathname === 'followings' ? 'focus' : ''}>
								<Link
									href={{
										pathname: '/mypage',
										query: { category: 'followings' },
									}}
									scroll={false}
								>
									<div className={'flex-box'}>
										<GroupAddSharpIcon
											fontSize="medium"
											className={category === 'followings' ? 'text-slate-100' : 'text-slate-900 dark:text-slate-50'}
										/>
										<Typography className={'sub-title'} variant={'subtitle1'} component={'p'}>
											My Followings
										</Typography>
									</div>
								</Link>
							</ListItem>
						</List>
					</Stack>
					<Stack className={'section'} sx={{ marginTop: '10px' }}>
						<div>
							<Typography className="mt-2 text-lg mb-2 font-openSans font-semibold text-neutral-600 dark:text-neutral-400">
								COMMUNITY
							</Typography>
							<List className={'sub-section'}>
								<ListItem className={pathname === 'myArticles' ? 'focus' : ''}>
									<Link
										href={{
											pathname: '/mypage',
											query: { category: 'myArticles' },
										}}
										scroll={false}
									>
										<div className={'flex-box'}>
											<ExploreSharpIcon
												fontSize="medium"
												className={category === 'myArticles' ? 'text-slate-100' : 'text-slate-900 dark:text-slate-50'}
											/>
											<Typography className={'sub-title'} variant={'subtitle1'} component={'p'}>
												Articles
											</Typography>
										</div>
									</Link>
								</ListItem>
								<ListItem className={pathname === 'writeArticle' ? 'focus' : ''}>
									<Link
										href={{
											pathname: '/mypage',
											query: { category: 'writeArticle' },
										}}
										scroll={false}
									>
										<div className={'flex-box'}>
											<QueueIcon
												fontSize="medium"
												className={category === 'writeArticle' ? 'text-slate-100' : 'text-slate-900 dark:text-slate-50'}
											/>
											<Typography className={'sub-title'} variant={'subtitle1'} component={'p'}>
												Write Article
											</Typography>
										</div>
									</Link>
								</ListItem>
							</List>
						</div>
					</Stack>
					<Stack className={'section'} sx={{ marginTop: '30px' }}>
						<Typography className="mb-2 text-lg font-openSans font-semibold text-neutral-600 dark:text-neutral-400">
							MANAGE ACCOUNT
						</Typography>
						<List className={'sub-section'}>
							<ListItem className={pathname === 'myProfile' ? 'focus' : ''}>
								<Link
									href={{
										pathname: '/mypage',
										query: { category: 'myProfile' },
									}}
									scroll={false}
								>
									<div className={'flex-box'}>
										<AccountCircleOutlinedIcon
											fontSize="medium"
											className={category === 'myProfile' ? 'text-slate-100' : 'text-slate-900 dark:text-slate-50'}
										/>
										<Typography className={'sub-title'} variant={'subtitle1'} component={'p'}>
											My Profile
										</Typography>
									</div>
								</Link>
							</ListItem>
							<ListItem onClick={logoutHandler}>
								<div className={'flex-box'}>
									<LoginOutlinedIcon fontSize="medium" className={'dark:text-slate-100 text-slate-900'} />
									<Typography className={'sub-title'} variant={'subtitle1'} component={'p'}>
										Logout
									</Typography>
								</div>
							</ListItem>
						</List>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default MyMenu;
