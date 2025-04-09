import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Stack, Box, Link } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import { Member } from '../../types/member/member';
import { InstructorInquiry } from '../../types/member/member.input';
import { GET_INSTRUCTOR } from '../../../apollo/user/query';
import { useQuery } from '@apollo/client';
import { T } from '../../types/common';
import { ArrowUpRight } from 'lucide-react';
import TopInstructorCard from './TopInstructorCard';

interface TopInstructorProps {
	initialInput: InstructorInquiry;
}

const TopInstructor = (props: TopInstructorProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const [topInstructor, setTopInstructor] = useState<Member[]>([]);

	/** APOLLO REQUESTS **/
	const {
		loading: getInstructorLoading,
		data: getInstructorData,
		error: getInstructorError,
		refetch: getInstructorRefetch,
	} = useQuery(GET_INSTRUCTOR, {
		fetchPolicy: 'cache-and-network',
		variables: { input: initialInput },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			if (data?.getInstructor?.list) {
				setTopInstructor(data.getInstructor.list);
			} else {
				console.error('No Instructor data:', data);
			}
		},
	});
	/** HANDLERS **/
	const pushInstructorDetailHandler = async () => {
		const input: any = initialInput;
		await router.push({ pathname: '/instructor', query: input });
	};

	if (device === 'mobile') {
		return (
			<Stack className={'top-agents'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<span>Top Instructor</span>
					</Stack>
					<Stack className={'wrapper'}>
						<Swiper
							className={'top-agents-swiper'}
							slidesPerView={'auto'}
							centeredSlides={true}
							spaceBetween={29}
							modules={[Autoplay]}
						>
							{topInstructor.map((instructor: Member) => {
								return (
									<SwiperSlide className={'top-agents-slide'} key={instructor?._id}>
										<TopInstructorCard instructor={instructor} key={instructor?.memberNick} />
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
			<Stack className={'top-agents'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className="space-y-2">
							<span className="font-openSans font-semibold text-[34px] text-slate-950 dark:text-slate-200">
								Top Instructor
							</span>
							<p className="font-openSans font-normal text-slate-500">Our Top Instructors always ready to serve you</p>
						</Box>
						<Box component={'div'} className="flex flex-row items-center mr-10 space-x-2">
							<div className={'flex'}>
								<Link
									href={'#'}
									onClick={() => {
										pushInstructorDetailHandler();
									}}
									className={'flex flex-row items-center space-x-2'}
								>
									<span className="text-md font-openSans font-semibold text-slate-950 dark:text-slate-200">
										See All Instructors
									</span>
									<ArrowUpRight className="text-slate-950 dark:text-slate-200" />
								</Link>
							</div>
						</Box>
					</Stack>
					<Stack className={'wrapper'}>
						<Box component={'div'} className={'switch-btn swiper-agents-prev dark:bg-slate-200 bg-slate-300'}>
							<ArrowBackIosNewIcon className="w-5 h-5 dark:text-slate-950" />
						</Box>
						<Box component={'div'} className={'card-wrapper'}>
							<Swiper
								className={'top-agents-swiper'}
								slidesPerView={4}
								spaceBetween={15}
								modules={[Autoplay, Navigation, Pagination]}
								navigation={{
									nextEl: '.swiper-agents-next',
									prevEl: '.swiper-agents-prev',
								}}
							>
								{topInstructor.map((instructor: Member) => {
									return (
										<SwiperSlide className={'top-agents-slide'} key={instructor?._id}>
											<TopInstructorCard instructor={instructor} key={instructor?.memberNick} />
										</SwiperSlide>
									);
								})}
							</Swiper>
						</Box>
						<Box component={'div'} className={'switch-btn swiper-agents-next dark:bg-slate-200 bg-slate-300'}>
							<ArrowBackIosNewIcon className="w-5 h-5 dark:text-slate-950 transform rotate-180" />
						</Box>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

TopInstructor.defaultProps = {
	initialInput: {
		page: 1,
		limit: 10,
		sort: 'memberRank',
		direction: 'DESC',
		search: {},
	},
};

export default TopInstructor;
