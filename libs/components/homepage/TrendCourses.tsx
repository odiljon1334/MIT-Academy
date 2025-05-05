import React, { useState } from 'react';
import { Stack, Box, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import { Course } from '../../types/course/course';
import { CoursesInquiry } from '../../types/course/course.input';
import { useMutation, useQuery } from '@apollo/client';
import { GET_COURSES } from '../../../apollo/user/query';
import { T } from '../../types/common';
import { LIKE_TARGET_COURSE } from '../../../apollo/user/mutation';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import { Message } from '../../enums/common.enum';
import { PackageOpen } from 'lucide-react';
import TrendCourseCard from './TrendCourseCard';

interface TrendCourseProps {
	initialInput: CoursesInquiry;
}

const TrendCourses = (props: TrendCourseProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const [trendCourses, setTrendCourses] = useState<Course[]>([]);

	/** APOLLO REQUESTS **/
	const [likeTargetCourse] = useMutation(LIKE_TARGET_COURSE);
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
			setTrendCourses(data.getCourses.list);
		},
	});
	/** HANDLERS **/
	const likeCourseHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			// executed likeTargetProperty Mutation
			await likeTargetCourse({
				variables: { input: id },
			});
			await getCoursesRefetch({ input: initialInput });

			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('ERROR, likePropertyHandler:', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	if (trendCourses) console.log('trendCourses:', trendCourses);
	if (!trendCourses) return null;

	if (device === 'mobile') {
		return (
			<Stack className={'trend-properties'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<span>Trend Courses</span>
					</Stack>
					<Stack className={'card-box'}>
						{trendCourses.length === 0 ? (
							<Box component={'div'} className={'empty-list'}>
								<div className="flex flex-col items-center justify-center p-12 text-center min-h-[600px]">
									<div className="relative">
										<div className="absolute inset-0 -m-10 bg-blue-100/50 rounded-full blur-3xl opacity-30 animate-pulse"></div>
										<div className="relative rounded-full bg-white p-6 mb-6 shadow-lg border border-indigo-100 transform transition-all duration-300 hover:scale-105">
											<PackageOpen className="h-14 w-14 text-indigo-500" />
										</div>
									</div>
									<Typography variant="h4" className="text-neutral-800 dark:text-slate-200 font-semibold mb-3 mt-2">
										Trends Courses Empty!
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
								className={'trend-property-swiper'}
								slidesPerView={'auto'}
								centeredSlides={true}
								spaceBetween={15}
								modules={[Autoplay]}
							>
								{trendCourses.map((course: Course) => {
									return (
										<SwiperSlide key={course._id} className={'trend-property-slide'}>
											<TrendCourseCard course={course} likeCourseHandler={likeCourseHandler} />
										</SwiperSlide>
									);
								})}
							</Swiper>
						)}
					</Stack>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'trend-properties'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'}>
							<span className="font-openSans font-semibold text-[34px] text-slate-950 dark:text-slate-200">
								Trend Courses
							</span>
							<p className="font-openSans font-normal text-slate-500">Trend is based on likes</p>
						</Box>
						<Box component={'div'} className={'right'}>
							<div className={'pagination-box'}>
								<WestIcon
									className={
										'swiper-trend-prev dark:bg-slate-800 dark:text-slate-400 rounded-full w-[50px] h-[50px] p-3'
									}
								/>
								<div className="swiper-trend-pagination space-x-2"></div>
								<EastIcon
									className={
										'swiper-trend-next dark:bg-slate-800 dark:text-slate-400 rounded-full w-[50px] h-[50px] p-3'
									}
								/>
							</div>
						</Box>
					</Stack>
					<Stack className={'card-box'}>
						{trendCourses.length === 0 ? (
							<Box component={'div'} className={'empty-list'}>
								<div className="flex flex-col items-center justify-center p-12 text-center min-h-[600px]">
									<div className="relative">
										<div className="absolute inset-0 -m-10 bg-blue-100/50 rounded-full blur-3xl opacity-30 animate-pulse"></div>
										<div className="relative rounded-full bg-white p-6 mb-6 shadow-lg border border-indigo-100 transform transition-all duration-300 hover:scale-105">
											<PackageOpen className="h-14 w-14 text-indigo-500" />
										</div>
									</div>
									<Typography variant="h4" className="dark:text-slate-300 text-slate-950 font-semibold mb-3 mt-2">
										Trends Courses Empty!
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
								className={'trend-property-swiper'}
								slidesPerView={4}
								modules={[Autoplay, Navigation, Pagination]}
								navigation={{
									nextEl: '.swiper-trend-next',
									prevEl: '.swiper-trend-prev',
								}}
								pagination={{
									el: '.swiper-trend-pagination',
									clickable: true,
									bulletActiveClass: 'swiper-pagination-bullet-active custom-bullet-active',
								}}
							>
								{trendCourses.map((course: Course) => {
									return (
										<SwiperSlide key={course._id} className={'trend-property-slide p-4 shadow-none'}>
											<TrendCourseCard course={course} likeCourseHandler={likeCourseHandler} />
										</SwiperSlide>
									);
								})}
							</Swiper>
						)}
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

TrendCourses.defaultProps = {
	initialInput: {
		page: 1,
		limit: 8,
		sort: 'courseLikes',
		direction: 'DESC',
		search: {},
	},
};

export default TrendCourses;
