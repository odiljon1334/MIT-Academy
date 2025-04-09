import React, { useState } from 'react';
import { Stack, Box, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import PopularCourseCard from './PopularCourseCard';
import { Course } from '../../types/course/course';
import Link from 'next/link';
import { CoursesInquiry } from '../../types/course/course.input';
import { GET_COURSES } from '../../../apollo/user/query';
import { useQuery } from '@apollo/client';
import { T } from '../../types/common';
import { ArrowUpRight, PackageOpen } from 'lucide-react';

interface PopularCoursesProps {
	initialInput: CoursesInquiry;
}

const PopularCourses = (props: PopularCoursesProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const [popularCourses, setPopularCourses] = useState<Course[]>([]);

	/** APOLLO REQUESTS **/
	const {
		loading: getCoursesLoading,
		data: getCoursesData,
		error: getCoursesError,
		refetch: getCoursesRefetch,
	} = useQuery(GET_COURSES, {
		fetchPolicy: 'cache-and-network',
		variables: { input: initialInput },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			if (data?.getCourses?.list) {
				setPopularCourses(data.getCourses.list);
			} else {
				console.error('No Courses list found:', data);
			}
		},
	});
	/** HANDLERS **/

	if (!popularCourses) return null;

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
							{popularCourses.map((course: Course) => {
								return (
									<SwiperSlide key={course._id} className={'popular-property-slide'}>
										<PopularCourseCard course={course} />
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
						{popularCourses.length === 0 ? (
							<Box component={'div'} className={'w-full flex items-center justify-center'}>
								<div className="flex flex-col items-center justify-center p-12 text-center min-h-[600px]">
									<div className="relative">
										<div className="absolute inset-0 -m-10 bg-blue-100/50 rounded-full blur-3xl opacity-30 animate-pulse"></div>
										<div className="relative rounded-full bg-white p-6 mb-6 shadow-lg border border-indigo-100 transform transition-all duration-300 hover:scale-105">
											<PackageOpen className="h-14 w-14 text-indigo-500" />
										</div>
									</div>
									<Typography variant="h4" className="text-neutral-800 dark:text-slate-200 font-semibold mb-3 mt-2">
										Popular Courses Empty!
									</Typography>
									<Typography variant="body1" className="text-gray-600 max-w-md mb-8 leading-relaxed">
										We don't have any Courses to display at the moment. Check back soon as our listings are updated
										regularly.
									</Typography>
									<div className="w-full max-w-xs h-1 bg-gradient-to-r from-transparent via-indigo-200 to-transparent rounded-full"></div>
								</div>
							</Box>
						) : (
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
								{popularCourses.map((course: Course) => {
									return (
										<SwiperSlide key={course._id} className={'popular-property-slide shadow-none'}>
											<PopularCourseCard course={course} />
										</SwiperSlide>
									);
								})}
							</Swiper>
						)}
					</Stack>
					<Stack className={'pagination-box'}>
						<WestIcon
							className={'swiper-popular-prev dark:bg-slate-800 dark:text-slate-400 rounded-full w-[50px] h-[50px] p-3'}
						/>
						<div className={'swiper-popular-pagination'}></div>
						<EastIcon
							className={'swiper-popular-next dark:bg-slate-800 dark:text-slate-400 rounded-full w-[50px] h-[50px] p-3'}
						/>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

PopularCourses.defaultProps = {
	initialInput: {
		page: 1,
		limit: 7,
		sort: 'courseViews',
		direction: 'DESC',
		search: {},
	},
};

export default PopularCourses;
