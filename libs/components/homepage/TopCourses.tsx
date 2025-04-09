import React, { useState } from 'react';
import { Stack, Box, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import TopPropertyCard from './TopCourseCard';
import { CoursesInquiry } from '../../types/course/course.input';
import { Course } from '../../types/course/course';
import { useMutation, useQuery } from '@apollo/client';
import { GET_COURSES } from '../../../apollo/user/query';
import { T } from '../../types/common';
import { LIKE_TARGET_COURSE } from '../../../apollo/user/mutation';
import { Message } from '../../enums/common.enum';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import { PackageOpen } from 'lucide-react';

interface TopCoursesProps {
	initialInput: CoursesInquiry;
}

const TopCourses = (props: TopCoursesProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const [topCourses, setTopCourses] = useState<Course[]>([]);

	const [likeTargetCourse] = useMutation(LIKE_TARGET_COURSE);
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
			setTopCourses(data?.getCourses?.list);
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
			console.log('ERROR, likeCourseHandler:', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	if (device === 'mobile') {
		return (
			<Stack className={'top-properties'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<span>Top courses</span>
					</Stack>
					<Stack className={'card-box'}>
						<Swiper
							className={'top-property-swiper'}
							slidesPerView={'auto'}
							centeredSlides={true}
							spaceBetween={15}
							modules={[Autoplay]}
						>
							{topCourses.map((course: Course) => {
								return (
									<SwiperSlide className={'top-property-slide'} key={course?._id}>
										<TopPropertyCard course={course} likeCourseHandler={likeCourseHandler} />
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
			<Stack className={'top-properties'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className="space-y-2 mt-5">
							<span className="font-openSans font-semibold text-[34px] text-slate-950 dark:text-slate-200">
								Top courses
							</span>
							<p className="font-openSans font-normal text-slate-500">Check out our Top Courses</p>
						</Box>
						<Box component={'div'} className="flex flex-row items-center">
							<div className={'pagination-box relative top-6 flex flex-row space-x-4  items-center'}>
								<WestIcon
									className={'swiper-top-prev dark:bg-slate-800 dark:text-slate-400 rounded-full w-[50px] h-[50px] p-3'}
								/>
								<div className={'swiper-top-pagination'}></div>
								<EastIcon
									className={'swiper-top-next dark:bg-slate-800 dark:text-slate-400 rounded-full w-[50px] h-[50px] p-3'}
								/>
							</div>
						</Box>
					</Stack>
					<Stack className={'card-box'}>
						{topCourses.length === 0 ? (
							<Box component={'div'} className={'w-full flex items-center justify-center'}>
								<div className="flex flex-col items-center justify-center p-12 text-center min-h-[600px]">
									<div className="relative">
										<div className="absolute inset-0 -m-10 bg-blue-100/50 rounded-full blur-3xl opacity-30 animate-pulse"></div>
										<div className="relative rounded-full bg-white p-6 mb-6 shadow-lg border border-indigo-100 transform transition-all duration-300 hover:scale-105">
											<PackageOpen className="h-14 w-14 text-indigo-500" />
										</div>
									</div>
									<Typography variant="h4" className="text-neutral-800 dark:text-slate-200 font-semibold mb-3 mt-2">
										Top Courses Empty!
									</Typography>
									<Typography variant="body1" className="text-gray-600 max-w-md mb-8 leading-relaxed">
										We don't have any courses to display at the moment. Check back soon as our listings are updated
										regularly.
									</Typography>
									<div className="w-full max-w-xs h-1 bg-gradient-to-r from-transparent via-indigo-200 to-transparent rounded-full"></div>
								</div>
							</Box>
						) : (
							<Swiper
								className={'top-property-swiper'}
								slidesPerView={4}
								modules={[Autoplay, Navigation, Pagination]}
								navigation={{
									nextEl: '.swiper-top-next',
									prevEl: '.swiper-top-prev',
								}}
								autoplay={{ delay: 4000 }}
								pagination={{
									el: '.swiper-top-pagination',
									clickable: true,
									bulletActiveClass: 'swiper-pagination-bullet-active custom-bullet-active',
								}}
							>
								{topCourses.map((course: Course) => {
									return (
										<SwiperSlide className={'top-property-slide'} key={course?._id}>
											<TopPropertyCard course={course} likeCourseHandler={likeCourseHandler} />
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

TopCourses.defaultProps = {
	initialInput: {
		page: 1,
		limit: 8,
		sort: 'courseRank',
		direction: 'DESC',
		search: {},
	},
};

export default TopCourses;
