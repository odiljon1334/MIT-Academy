import React, { useState } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Pagination, Stack, Typography } from '@mui/material';
import PropertyCard from '../course/PropertyCard';
import { Course } from '../../types/course/course';
import { T } from '../../types/common';
import { useQuery } from '@apollo/client';
import { GET_VISITED } from '../../../apollo/user/query';
import { FolderSearch } from 'lucide-react';

const RecentlyVisited: NextPage = () => {
	const device = useDeviceDetect();
	const [recentlyVisited, setRecentlyVisited] = useState<Course[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [searchVisited, setSearchVisited] = useState<T>({ page: 1, limit: 6 });

	/** APOLLO REQUESTS **/
	const {
		loading: getVisitedLoading,
		data: getVisitedData,
		error: getVisitedError,
		refetch: getVisitedRefetch,
	} = useQuery(GET_VISITED, {
		fetchPolicy: 'network-only',
		variables: {
			input: searchVisited,
		},
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setRecentlyVisited(data.getVisited?.list);
			setTotal(data.getVisited?.metaCounter[0]?.total ?? 0);
		},
	});

	/** HANDLERS **/
	const paginationHandler = (e: T, value: number) => {
		setSearchVisited({ ...searchVisited, page: value });
	};

	if (device === 'mobile') {
		return <div>Course MY FAVORITES MOBILE</div>;
	} else {
		return (
			<div id="my-favorites-page">
				<Stack className="main-title-box">
					<Stack className="right-box">
						<Typography className="main-title text-neutral-900 dark:text-slate-200">Recently Visited</Typography>
						<Typography className="sub-title text-slate-500">We are glad to see you again!</Typography>
					</Stack>
				</Stack>
				<Stack className="favorites-list-box">
					{recentlyVisited?.length ? (
						recentlyVisited?.map((course: Course) => {
							return <PropertyCard key={course._id} course={course} recentlyVisited={true} />;
						})
					) : (
						<div className={'no-data space-y-2'}>
							<div className="flex flex-col items-center justify-center p-12 text-center min-h-[600px]">
								<div className="relative">
									<div className="absolute inset-0 -m-10 bg-blue-100/50 rounded-full blur-3xl opacity-30 animate-pulse"></div>
									<div className="relative rounded-full bg-white p-6 mb-6 shadow-lg border border-indigo-100 transform transition-all duration-300 hover:scale-105">
										<FolderSearch className="h-14 w-14 text-indigo-500" />
									</div>
								</div>
								<Typography variant="h4" className="font-semibold mb-3 mt-2 dark:text-slate-200 text-neutral-900">
									No Recently Visited Courses found!
								</Typography>
								<Typography variant="body1" className="text-gray-600 max-w-md mb-8 leading-relaxed">
									We don't have any Recently visited to display at the moment. Check back soon as our listings are
									updated regularly.
								</Typography>
								<div className="w-full max-w-xs h-1 bg-gradient-to-r from-transparent via-indigo-200 to-transparent rounded-full"></div>
							</div>
						</div>
					)}
				</Stack>
				{recentlyVisited?.length ? (
					<Stack className="pagination-config">
						<Stack className="pagination-box">
							<Pagination
								variant="outlined"
								count={Math.ceil(total / searchVisited.limit)}
								page={searchVisited.page}
								shape="circular"
								color="primary"
								onChange={paginationHandler}
							/>
						</Stack>
						<Stack className="total-result">
							<Typography className="text-neutral-900 dark:text-slate-200">
								Total ({total}) recently visited cour{total > 1 ? 'ses' : 'se'}
							</Typography>
						</Stack>
					</Stack>
				) : null}
			</div>
		);
	}
};

export default RecentlyVisited;
