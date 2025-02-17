import React, { useState } from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import PopularPropertyCard from './PopularPropertyCard';
import { Property } from '../../types/property/property';
import Link from 'next/link';
import { PropertiesInquiry } from '../../types/property/property.input';
import { GET_PROPERTIES } from '../../../apollo/user/query';
import { useQuery } from '@apollo/client';
import { T } from '../../types/common';
import { ArrowUpRight } from 'lucide-react';

interface PopularPropertiesProps {
	initialInput: PropertiesInquiry;
}

const PopularProperties = (props: PopularPropertiesProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const [popularProperties, setPopularProperties] = useState<Property[]>([]);

	/** APOLLO REQUESTS **/
	const {
		loading: getPropertiesLoading,
		data: getPropertiesData,
		error: getPropertiesError,
		refetch: getPropertiesRefetch,
	} = useQuery(GET_PROPERTIES, {
		fetchPolicy: 'cache-and-network',
		variables: { input: initialInput },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			if (data?.getProperties?.list) {
				setPopularProperties(data.getProperties.list);
			} else {
				console.error('No properties list found:', data);
			}
		},
	});
	/** HANDLERS **/

	if (!popularProperties) return null;

	if (device === 'mobile') {
		return (
			<Stack className={'popular-properties'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<span>Popular properties</span>
					</Stack>
					<Stack className={'card-box'}>
						<Swiper
							className={'popular-property-swiper'}
							slidesPerView={'auto'}
							centeredSlides={true}
							spaceBetween={25}
							modules={[Autoplay]}
						>
							{popularProperties.map((property: Property) => {
								return (
									<SwiperSlide key={property._id} className={'popular-property-slide'}>
										<PopularPropertyCard property={property} />
									</SwiperSlide>
								);
							})}
						</Swiper>
					</Stack>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'popular-properties'}>
				<Stack className={'container relative'}>
					<Stack className={'info-box mb-10'}>
						<Box component={'div'}>
							<span className="font-openSans font-semibold text-[34px] text-slate-950 dark:text-slate-200">
								Popular courses
							</span>
							<p className="font-openSans font-normal text-slate-500">Popularity is based on views</p>
						</Box>
						<Box component={'div'} className={'flex items-center mr-10 mt-5'}>
							<div className={'flex'}>
								<Link href={'/property'} className={'flex flex-row items-center space-x-2'}>
									<span className="text-md font-openSans font-semibold text-slate-950 dark:text-slate-200">
										See All Courses
									</span>
									<ArrowUpRight className="text-slate-950 dark:text-slate-200" />
								</Link>
							</div>
						</Box>
					</Stack>
					<Stack className={'card-box'}>
						<Swiper
							className={'popular-property-swiper'}
							slidesPerView={3}
							modules={[Autoplay, Navigation, Pagination]}
							navigation={{
								nextEl: '.swiper-popular-next',
								prevEl: '.swiper-popular-prev',
							}}
							pagination={{
								el: '.swiper-popular-pagination',
								clickable: true,
								bulletActiveClass: 'swiper-pagination-bullet-active custom-bullet-active',
							}}
							autoplay={{ delay: 4000 }}
							breakpoints={{
								640: { slidesPerView: 2 },
								768: { slidesPerView: 3 },
							}}
						>
							{popularProperties.map((property: Property) => {
								return (
									<SwiperSlide key={property._id} className={'popular-property-slide shadow-none'}>
										<PopularPropertyCard property={property} />
									</SwiperSlide>
								);
							})}
						</Swiper>
					</Stack>
					<Stack className={'pagination-box'}>
						<WestIcon className={'swiper-popular-prev dark:bg-slate-800 rounded-full w-[50px] h-[50px] p-3'} />
						<div className={'swiper-popular-pagination'}></div>
						<EastIcon className={'swiper-popular-next dark:bg-slate-800 rounded-full w-[50px] h-[50px] p-3'} />
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

PopularProperties.defaultProps = {
	initialInput: {
		page: 1,
		limit: 7,
		sort: 'propertyViews',
		direction: 'DESC',
		search: {},
	},
};

export default PopularProperties;
