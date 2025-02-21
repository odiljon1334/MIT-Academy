import React from 'react';
import { Stack, Box, Divider, Typography, Chip } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Property } from '../../types/property/property';
import { REACT_APP_API_URL, topPropertyRank } from '../../config';
import { formatterStr } from '../../utils';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { useRouter } from 'next/router';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { PropertyStatus } from '../../enums/property.enum';
import { ArrowUpRight, BookMarked, Clock, Trophy } from 'lucide-react';

interface PropertyBigCardProps {
	property: Property;
	likePropertyHandler?: any;
}

const PropertyBigCard = (props: PropertyBigCardProps) => {
	const { property, likePropertyHandler } = props;
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const router = useRouter();

	/** HANDLERS **/
	const goPropertyDetatilPage = (propertyId: string) => {
		router.push(`/property/detail?id=${propertyId}`);
	};

	if (device === 'mobile') {
		return <div>APARTMEND BIG CARD</div>;
	} else {
		return (
			<Stack className="property-big-card-box" onClick={() => goPropertyDetatilPage(property?._id)}>
				<Box
					component={'div'}
					className={'card-img border border-solid border-slate-600 border-b-0'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${property?.propertyImages?.[0]})` }}
				>
					{property && property?.propertyRank >= topPropertyRank && (
						<div className={'status'}>
							<img src="/img/icons/electricity.svg" alt="" />
							<span>Best Seller</span>
						</div>
					)}

					<div className={'price text-green-600'}>${formatterStr(property?.propertyPrice)}</div>
				</Box>
				<Box component={'div'} className={'info border border-solid border-slate-600 bg-white dark:bg-slate-900'}>
					<div className="flex flex-row items-center justify-between">
						<p
							onClick={() => {
								goPropertyDetatilPage(property._id);
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
					<Divider sx={{ mt: '15px', mb: '15px' }} />
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

export default PropertyBigCard;
