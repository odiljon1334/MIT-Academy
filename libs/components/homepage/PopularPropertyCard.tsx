import React from 'react';
import { Stack, Box, Divider, Typography, Button, Chip } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Property } from '../../types/property/property';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { REACT_APP_API_URL, topPropertyRank } from '../../config';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { ArrowUpRight, BookMarked, ChevronRight, Clock, Trophy } from 'lucide-react';
import { PropertyStatus } from '../../enums/property.enum';

interface PopularPropertyCardProps {
	property: Property;
}

const PopularPropertyCard = (props: PopularPropertyCardProps) => {
	const { property } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);

	/** HANDLERS **/
	const pushDetailHandler = async (propertyId: string) => {
		console.log('propertyId:', propertyId);
		await router.push({ pathname: '/property/detail', query: { id: propertyId } });
	};

	if (device === 'mobile') {
		return (
			<Stack className="popular-card-box">
				<Box
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${property?.propertyImages[0]})` }}
					onClick={() => {
						pushDetailHandler(property._id);
					}}
				>
					{property && property?.propertyRank >= topPropertyRank ? (
						<div className={'status'}>
							<img src="/img/icons/electricity.svg" alt="" />
							<span>top</span>
						</div>
					) : (
						''
					)}

					<div className={'price text-green-600'}>${property.propertyPrice}</div>
				</Box>
				<Box component={'div'} className={'info'}>
					<strong
						onClick={() => {
							pushDetailHandler(property._id);
						}}
						className={'title'}
					>
						{property.propertyTitle}
					</strong>
					<p className={'desc'}>{property.propertyAddress}</p>
					<div className={'options'}>
						<div className="flex items-center flex-row">
							<Clock className="text-gray-500 w-5 h-5 mr-1" />
							<span className="text-sm font-normal font-openSans flex items-center dark:text-gray-200 text-gray-700">
								{' '}
								22hr 30min
							</span>
						</div>
						<div className="flex flex-row space-x-1">
							<BookMarked className="text-gray-500 w-5 h-5" />
							<span className="text-sm font-normal font-openSans dark:text-gray-200 text-gray-700 flex items-center">
								Lesson: 2{property.propertyRooms}
							</span>
						</div>
						<div className="flex flex-row space-x-1">
							<Trophy className="text-gray-500 w-5 h-5" />
							<span className="text-sm font-normal font-openSans dark:text-gray-200 text-gray-700 flex items-center">
								Beginner
							</span>
						</div>
					</div>
					<Divider sx={{ mt: '15px', mb: '17px' }} />
					<div className={'bott'}>
						<p>{property?.propertyRent ? 'rent' : 'sale'}</p>
						<div className="view-like-box">
							<IconButton>
								<RemoveRedEyeIcon className="text-slate-600 dark:text-gray-200" />
							</IconButton>
							<Typography className="">{property?.propertyViews}</Typography>
						</div>
					</div>
				</Box>
			</Stack>
		);
	} else {
		return (
			<Stack className="popular-card-box">
				<Box
					component={'div'}
					className={'card-img border border-solid border-slate-600 border-b-0'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${property?.propertyImages[0]})` }}
					onClick={() => {
						pushDetailHandler(property._id);
					}}
				>
					{property && property?.propertyRank >= topPropertyRank ? (
						<div className={'status'}>
							<img src="/img/icons/electricity.svg" alt="" />
							<span>Best</span>
						</div>
					) : (
						''
					)}

					<div className={'price text-green-600'}>${property.propertyPrice}</div>
				</Box>
				<Box component={'div'} className={'info border border-solid border-slate-600 bg-white dark:bg-slate-900'}>
					<div className="flex flex-row items-center justify-between">
						<p
							onClick={() => {
								pushDetailHandler(property._id);
							}}
							className="flex items-center gap-1 text-md font-openSans font-semibold text-slate-950 dark:text-slate-200 hover:underline"
						>
							{property.propertyTitle}
							<ArrowUpRight className="text-slate-950 dark:text-slate-200 w-5 h-5" />
						</p>
						<Chip
							className="w-[60px] h-5"
							size="small"
							label={property?.propertyStatus === PropertyStatus.ACTIVE ? 'Active' : 'Inactive'}
							color={PropertyStatus.ACTIVE ? 'success' : 'default'}
						/>
					</div>
					<p className={'desc'}>{property.propertyAddress}</p>
					<div className={'options'}>
						<div className="flex items-center flex-row">
							<Clock className="text-gray-500 w-5 h-5 mr-1" />
							<span className="text-sm font-normal font-openSans flex items-center dark:text-gray-200 text-gray-700">
								{' '}
								22hr 30min
							</span>
						</div>
						<div className="flex flex-row space-x-1">
							<BookMarked className="text-gray-500 w-5 h-5" />
							<span className="text-sm font-normal font-openSans dark:text-gray-200 text-gray-700 flex items-center">
								Lesson: 2{property.propertyRooms}
							</span>
						</div>
						<div className="flex flex-row space-x-1">
							<Trophy className="text-gray-500 w-5 h-5" />
							<span className="text-sm font-normal font-openSans dark:text-gray-200 text-gray-700 flex items-center">
								Beginner
							</span>
						</div>
					</div>
					<Divider sx={{ mt: '15px', mb: '17px' }} />
					<div className={'bott'}>
						<div className="flex flex-row space-x-2">
							<img
								className="w-[42px] h-[42px] rounded-full object-cover"
								src={`${REACT_APP_API_URL}/${property.memberData?.memberImage}`}
								alt=""
							/>
							<div className="flex flex-col">
								<span className="text-sm font-normal">{property?.memberData?.memberNick}</span>
								<p className="text-sm font-openSans text-slate-500">{property?.memberData?.memberType}</p>
							</div>
						</div>
						<div className="view-like-box">
							<IconButton className="text-slate-600 dark:text-gray-200">
								<RemoveRedEyeIcon />
							</IconButton>
							<span className="text-sm font-normal text-slate-600 dark:text-gray-100">{property?.propertyViews}</span>
						</div>
					</div>
				</Box>
			</Stack>
		);
	}
};

export default PopularPropertyCard;
