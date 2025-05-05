import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { Pagination, Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { PropertyCard } from '../mypage/PropertyCard';
import { Course } from '../../types/course/course';
import { CoursesInquiry } from '../../types/course/course.input';
import { T } from '../../types/common';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { GET_COURSES } from '../../../apollo/user/query';
import { PackageSearch } from 'lucide-react';

const MyCourses: NextPage = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const { memberId } = router.query;
	const [searchFilter, setSearchFilter] = useState<CoursesInquiry>({ ...initialInput });
	const [instructorCourses, setInstructorCourses] = useState<Course[]>([]);
	const [total, setTotal] = useState<number>(0);

	/** APOLLO REQUESTS **/
	const {
		loading: getCoursesLoading,
		data: getCoursesData,
		error: getCoursesError,
		refetch: getCoursesRefetch,
	} = useQuery(GET_COURSES, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		skip: !searchFilter?.search?.memberId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setInstructorCourses(data?.getCourses?.list);
			setTotal(data?.getCourses?.metaCounter[0]?.total ?? 0);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		getCoursesRefetch().then();
	}, [searchFilter]);

	useEffect(() => {
		if (memberId)
			setSearchFilter({ ...initialInput, search: { ...initialInput.search, memberId: memberId as string } });
	}, [memberId]);

	/** HANDLERS **/
	const paginationHandler = (e: T, value: number) => {
		setSearchFilter({ ...searchFilter, page: value });
	};

	if (device === 'mobile') {
		return <div>NESTAR COURSES MOBILE</div>;
	} else {
		return (
			<div id="member-properties-page">
				<Stack className="main-title-box">
					<Stack className="right-box">
						<Typography className="main-title dark:text-slate-50 text-slate-950">Courses</Typography>
					</Stack>
				</Stack>
				<Stack className="properties-list-box">
					<Stack className="list-box">
						{instructorCourses?.length > 0 && (
							<Stack className="listing-title-box bg-neutral-50 dark:bg-slate-900 border border-solid dark:border-neutral-600 border-neutral-300">
								<Typography className="title-text dark:text-slate-200 text-slate-950">Listing title</Typography>
								<Typography className="title-text dark:text-slate-200 text-slate-950">Date Published</Typography>
								<Typography className="title-text dark:text-slate-200 text-slate-950">Status</Typography>
								<Typography className="title-text dark:text-slate-200 text-slate-950">View</Typography>
							</Stack>
						)}
						{instructorCourses?.length === 0 && (
							<div className={'no-data space-y-2'}>
								<div className="flex flex-col items-center justify-center p-12 text-center min-h-[600px]">
									<div className="relative">
										<div className="absolute inset-0 -m-10 bg-blue-100/50 rounded-full blur-3xl opacity-30 animate-pulse"></div>
										<div className="relative rounded-full bg-white p-6 mb-6 shadow-lg border border-indigo-100 transform transition-all duration-300 hover:scale-105">
											<PackageSearch className="h-14 w-14 text-indigo-500" />
										</div>
									</div>
									<Typography variant="h4" className="font-semibold mb-3 mt-2 text-neutral-900 dark:text-slate-200">
										No Courses yet!
									</Typography>
									<Typography variant="body1" className="text-gray-600 max-w-md mb-8 leading-relaxed">
										We don't have any followers to display at the moment. Check back soon as our list is updated
										regularly.
									</Typography>
									<div className="w-full max-w-xs h-1 bg-gradient-to-r from-transparent via-indigo-200 to-transparent rounded-full"></div>
								</div>
							</div>
						)}
						{instructorCourses?.map((course: Course) => {
							return <PropertyCard course={course} memberPage={true} key={course?._id} />;
						})}

						{instructorCourses.length !== 0 && (
							<Stack className="pagination-config">
								<Stack className="pagination-box">
									<Pagination
										variant="outlined"
										count={Math.ceil(total / searchFilter.limit)}
										page={searchFilter.page}
										shape="circular"
										color="primary"
										onChange={paginationHandler}
									/>
								</Stack>
								<Stack className="total-result dark:text-slate-400 text-slate-950">
									<Typography>{total} courses available</Typography>
								</Stack>
							</Stack>
						)}
					</Stack>
				</Stack>
			</div>
		);
	}
};

MyCourses.defaultProps = {
	initialInput: {
		page: 1,
		limit: 5,
		sort: 'createdAt',
		search: {
			memberId: '',
		},
	},
};

export default MyCourses;
