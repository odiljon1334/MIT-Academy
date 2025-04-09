import React, { useState } from 'react';
import { NextPage } from 'next';
import { Pagination, Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { PropertyCard } from './PropertyCard';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { Course } from '../../types/course/course';
import { T } from '../../types/common';
import { CourseStatus } from '../../enums/property.enum';
import { userVar } from '../../../apollo/store';
import { useRouter } from 'next/router';
import { UPDATE_COURSE } from '../../../apollo/user/mutation';
import { GET_INTRUCTOR_COURSES } from '../../../apollo/user/query';
import { sweetConfirmAlert, sweetErrorHandling } from '../../sweetAlert';
import { InstructorCoursesInquiry } from '../../types/course/course.input';
import { Home } from 'lucide-react';

const MyCourses: NextPage = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const [searchFilter, setSearchFilter] = useState<InstructorCoursesInquiry>(initialInput);
	const [instructorCourses, setInstructorCourses] = useState<Course[]>([]);
	const [total, setTotal] = useState<number>(0);
	const user = useReactiveVar(userVar);
	const router = useRouter();

	/** APOLLO REQUESTS **/
	const [updateCourse] = useMutation(UPDATE_COURSE);

	const {
		loading: getIntructorCoursesLoading,
		data: getIntructorCoursesData,
		error: getIntructorCoursesError,
		refetch: getIntructorCoursesRefetch,
	} = useQuery(GET_INTRUCTOR_COURSES, {
		fetchPolicy: 'cache-and-network',
		variables: { input: searchFilter },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			const courses = data?.getInstructorCourses?.list;
			const total = data?.getInstructorCourses?.metaCounter?.[0]?.total ?? 0;

			if (Array.isArray(courses)) {
				setInstructorCourses(courses);
				setTotal(total);
			} else {
				setInstructorCourses([]);
				setTotal(0);
				console.error('No Instructor data:', data);
			}
		},
	});

	/** HANDLERS **/
	const paginationHandler = (e: T, value: number) => {
		setSearchFilter({ ...searchFilter, page: value });
	};

	const changeStatusHandler = (value: CourseStatus) => {
		setSearchFilter({ ...searchFilter, search: { courseStatus: value } });
	};

	const deleteCourseHandler = async (id: string) => {
		try {
			if (await sweetConfirmAlert('Are you sure to delete this course?')) {
				await updateCourse({
					variables: { input: { _id: id, courseStatus: 'DELETE' } },
				});
				await getIntructorCoursesRefetch({ input: searchFilter });
			}
		} catch (err: any) {
			await sweetErrorHandling(err);
		}
	};

	const updateCourseHandler = async (status: string, id: string) => {
		try {
			if (await sweetConfirmAlert(`Are you sure to change to ${status} status?`)) {
				await updateCourse({
					variables: {
						input: {
							_id: id,
							courseStatus: status,
						},
					},
				});
				await getIntructorCoursesRefetch({ input: searchFilter });
			}
		} catch (err) {
			await sweetErrorHandling(err);
		}
	};

	if (user?.memberType !== 'INSTRUCTOR') {
		router.back();
	}

	if (device === 'mobile') {
		return <div>EDUcampus COURSES MOBILE</div>;
	} else {
		return (
			<div id="my-property-page">
				<Stack className="main-title-box">
					<Stack className="right-box">
						<Typography className="main-title text-neutral-800 dark:text-slate-200">My Properties</Typography>
						<Typography className="sub-title text-slate-500">We are glad to see you again!</Typography>
					</Stack>
				</Stack>
				<Stack className="property-list-box">
					<Stack className="tab-name-box bg-neutral-100 dark:bg-slate-800 border border-solid dark:border-neutral-600 border-neutral-300">
						<Typography
							onClick={() => changeStatusHandler(CourseStatus.ACTIVE)}
							className={
								searchFilter.search.courseStatus === 'ACTIVE'
									? 'active-tab-name'
									: 'tab-name text-neutral-800 dark:text-slate-200'
							}
						>
							On Sale
						</Typography>
						<Typography
							onClick={() => changeStatusHandler(CourseStatus.SOLD)}
							className={
								searchFilter.search.courseStatus === 'SOLD'
									? 'active-tab-name'
									: 'tab-name text-neutral-800 dark:text-slate-200'
							}
						>
							On Sold
						</Typography>
					</Stack>
					<Stack className="list-box bg-neutral-50 dark:bg-slate-900 border border-solid dark:border-neutral-600 border-neutral-300">
						<Stack className="listing-title-box bg-neutral-100 dark:bg-slate-700 border border-solid dark:border-neutral-600 border-neutral-300">
							<Typography className="title-text text-neutral-800 dark:text-slate-200">Listing title</Typography>
							<Typography className="title-text text-neutral-800 dark:text-slate-200">Date Published</Typography>
							<Typography className="title-text text-neutral-800 dark:text-slate-200">Status</Typography>
							<Typography className="title-text text-neutral-800 dark:text-slate-200">View</Typography>
							<Typography className="title-text text-neutral-800 dark:text-slate-200">Action</Typography>
						</Stack>

						{instructorCourses?.length === 0 ? (
							<div className={'no-data space-y-2'}>
								<div className="flex flex-col items-center justify-center p-12 text-center min-h-[600px]">
									<div className="relative">
										<div className="absolute inset-0 -m-10 bg-blue-100/50 rounded-full blur-3xl opacity-30 animate-pulse"></div>
										<div className="relative rounded-full bg-white p-6 mb-6 shadow-lg border border-indigo-100 transform transition-all duration-300 hover:scale-105">
											<Home className="h-14 w-14 text-indigo-500" />
										</div>
									</div>
									<Typography variant="h4" className="text-neutral-900 dark:text-slate-200 font-semibold mb-3 mt-2">
										No Courses found!
									</Typography>
									<Typography variant="body1" className="text-gray-600 max-w-md mb-8 leading-relaxed">
										We don't have any courses to display at the moment. Check back soon as our listings are updated
										regularly.
									</Typography>
									<div className="w-full max-w-xs h-1 bg-gradient-to-r from-transparent via-indigo-200 to-transparent rounded-full"></div>
								</div>
							</div>
						) : (
							instructorCourses?.map((course: Course) => {
								return (
									<PropertyCard
										course={course}
										deleteCourseHandler={deleteCourseHandler}
										updateCourseHandler={updateCourseHandler}
										key={course._id}
									/>
								);
							})
						)}

						{instructorCourses?.length !== 0 && (
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
								<Stack className="total-result">
									<Typography className="dark:text-slate-200">Total ( {total} ) Course available</Typography>
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
			courseStatus: 'ACTIVE',
		},
	},
};

export default MyCourses;
