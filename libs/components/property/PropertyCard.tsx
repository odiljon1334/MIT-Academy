import React from 'react';
import { Stack, Typography, Box, Chip, Divider } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Property } from '../../types/property/property';
import Link from 'next/link';
import { formatterStr } from '../../utils';
import { REACT_APP_API_URL, topPropertyRank } from '../../config';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import IconButton from '@mui/material/IconButton';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { ArrowUpRight, BookMarked, Clock, Trophy } from 'lucide-react';
import { PropertyStatus } from '../../enums/property.enum';

interface PropertyCardType {
	property: Property;
	likePropertyHandler?: any;
	myFavorites?: boolean;
	recentlyVisited?: boolean;
}

const PropertyCard = (props: PropertyCardType) => {
	const { property, likePropertyHandler, myFavorites, recentlyVisited } = props;
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const imagePath: string = property?.propertyImages[0]
		? `${REACT_APP_API_URL}/${property?.propertyImages[0]}`
		: '/img/banner/header1.svg';

	if (device === 'mobile') {
		return <div>PROPERTY CARD</div>;
	} else {
		return (
			<Stack className="card-config">
				<Stack className="top border border-b-0 border-slate-600 rounded-t-[12px] border-solid">
					{property && property._id && (
						<Link
							href={{
								pathname: '/property/detail',
								query: { id: property._id },
							}}
						>
							<img src={imagePath} alt="" />
						</Link>
					)}
					{property && property?.propertyRank > topPropertyRank && (
						<Box component={'div'} className={'top-badge space-x-1'}>
							<img src="/img/icons/electricity.svg" alt="" />
							<Typography className="text-sm font-openSans font-medium">Best Seller</Typography>
						</Box>
					)}
					<Box component={'div'} className={'price-box'}>
						<Typography className="text-green-600">${formatterStr(property?.propertyPrice)}</Typography>
					</Box>
				</Stack>
				<Stack className="bottom border border-t-0 rounded-b-[10px] border-solid border-slate-600 bg-white dark:bg-slate-900">
					<Stack className="name-address">
						<Stack className="name ">
							{property?._id && (
								<>
									<div className="flex flex-row items-center justify-between">
										<Link
											href={{
												pathname: '/property/detail',
												query: { id: property._id },
											}}
										>
											<Typography className="flex items-center text-md font-openSans font-semibold text-slate-950 dark:text-slate-300 hover:underline">
												{property?.propertyTitle || 'No title available'}
												<ArrowUpRight className="text-slate-950 dark:text-slate-300 w-5 h-5" />
											</Typography>
										</Link>
										<Chip
											className="w-[60px] h-5"
											size="small"
											label={property?.propertyStatus === PropertyStatus.ACTIVE ? 'Active' : 'Inactive'}
											color={PropertyStatus.ACTIVE ? 'success' : 'default'}
										/>
									</div>
								</>
							)}
						</Stack>
						<Stack className="address">
							<Typography>
								{property.propertyAddress}, {property.propertyLocation}
							</Typography>
						</Stack>
					</Stack>
					<div className={'flex items-center flex-row justify-between'}>
						<div className="flex items-center flex-row">
							<Clock className="text-gray-500 w-5 h-5 mr-1" />
							<span className="text-[11px] font-bold font-openSans flex items-center dark:text-gray-200 text-gray-700">
								{' '}
								22hr 30min
							</span>
						</div>
						<div className="flex flex-row space-x-1">
							<BookMarked className="text-gray-500 w-5 h-5" />
							<span className="text-[11px] font-bold font-openSans dark:text-gray-200 text-gray-700 flex items-center">
								Lesson: 2{property.propertyRooms}
							</span>
						</div>
						<div className="flex flex-row space-x-1">
							<Trophy className="text-gray-500 w-5 h-5" />
							<span className="text-[11px] font-bold font-openSans dark:text-gray-200 text-gray-700 flex items-center">
								Beginner
							</span>
						</div>
					</div>
					<Divider sx={{ mt: '17px', mb: '10px' }} />
					<Stack className="type-buttons">
						<div className="flex flex-row items-center space-x-2">
							<Link
								href={{
									pathname: '/agent/detail',
									query: { agentId: property?.memberData?._id },
								}}
								className="flex flex-row cursor-pointer space-x-2"
							>
								<img
									className="w-[42px] h-[42px] rounded-full object-cover"
									src={`${REACT_APP_API_URL}/${property.memberData?.memberImage}`}
									alt=""
								/>
								<div className="flex flex-col">
									<span className="text-sm font-normal hover:underline">{property?.memberData?.memberNick}</span>
									<p className="text-[13px] font-openSans text-slate-500">{property?.memberData?.memberType}</p>
								</div>
							</Link>
						</div>
						{!recentlyVisited && (
							<Stack className="buttons">
								<IconButton className="text-slate-600 dark:text-gray-200">
									<RemoveRedEyeIcon />
								</IconButton>
								<Typography className="text-sm font-normal text-slate-600 dark:text-gray-100">
									{property?.propertyViews}
								</Typography>
								<IconButton color={'default'} onClick={() => likePropertyHandler(user, property?._id)}>
									{myFavorites ? (
										<FavoriteIcon color="primary" />
									) : property?.meLiked && property?.meLiked[0]?.myFavorite ? (
										<FavoriteIcon color="primary" />
									) : (
										<FavoriteBorderIcon />
									)}
								</IconButton>
								<Typography className="text-sm font-normal text-slate-600 dark:text-gray-100">
									{property?.propertyLikes}
								</Typography>
							</Stack>
						)}
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default PropertyCard;
