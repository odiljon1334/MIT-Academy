import React, { ChangeEvent, MouseEvent, useEffect, useRef, useState } from 'react';
import { NextPage } from 'next';
import { Box, Button, Card, Menu, MenuItem, Pagination, Stack, Typography } from '@mui/material';
import PropertyCard from '../../libs/components/course/PropertyCard';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import Filter from '../../libs/components/course/Filter';
import { useRouter } from 'next/router';
import { CoursesInquiry } from '../../libs/types/course/course.input';
import { Course } from '../../libs/types/course/course';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { Direction, Message } from '../../libs/enums/common.enum';
import { useMutation, useQuery } from '@apollo/client';
import { GET_COURSES } from '../../apollo/user/query';
import { T } from '../../libs/types/common';
import { LIKE_TARGET_COURSE } from '../../apollo/user/mutation';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import { Home } from 'lucide-react';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const CourseList: NextPage = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const [searchFilter, setSearchFilter] = useState<CoursesInquiry>(
		router?.query?.input ? JSON.parse(router?.query?.input as string) : initialInput,
	);
	const [courses, setCourses] = useState<Course[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [sortingOpen, setSortingOpen] = useState(false);
	const [filterSortName, setFilterSortName] = useState('New');

	const canvasRef = useRef<HTMLCanvasElement>(null);

	/** APOLLO REQUESTS **/
	const [likeTargetCourse] = useMutation(LIKE_TARGET_COURSE);

	const {
		loading: getCoursesLoading,
		data: getCoursesData,
		error: getCoursesError,
		refetch: getCoursesRefetch,
	} = useQuery(GET_COURSES, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setCourses(data.getCourses.list);
			setTotal(data.getCourses.metaCounter[0].total);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (router.query.input) {
			const inputObj = JSON.parse(router?.query?.input as string);
			setSearchFilter(inputObj);
		}

		setCurrentPage(searchFilter.page === undefined ? 1 : searchFilter.page);
	}, [router]);

	useEffect(() => {
		if (searchFilter) {
			getCoursesRefetch({ input: searchFilter });
		}
	}, [searchFilter]);

	/** HANDLERS **/
	const likeCourseHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			// executed likeTargetCourse Mutation
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

	const handlePaginationChange = async (event: ChangeEvent<unknown>, value: number) => {
		searchFilter.page = value;
		await router.push(
			`/course?input=${JSON.stringify(searchFilter)}`,
			`/course?input=${JSON.stringify(searchFilter)}`,
			{
				scroll: false,
			},
		);
		setCurrentPage(value);
	};

	const sortingClickHandler = (e: MouseEvent<HTMLElement>) => {
		setAnchorEl(e.currentTarget);
		setSortingOpen(true);
	};

	const sortingCloseHandler = () => {
		setSortingOpen(false);
		setAnchorEl(null);
	};

	const sortingHandler = (e: React.MouseEvent<HTMLLIElement>) => {
		switch (e.currentTarget.id) {
			case 'new':
				setSearchFilter({ ...searchFilter, sort: 'createdAt', direction: Direction.ASC });
				setFilterSortName('New');
				break;
			case 'lowest':
				setSearchFilter({ ...searchFilter, sort: 'coursePrice', direction: Direction.ASC });
				setFilterSortName('Lowest Price');
				break;
			case 'highest':
				setSearchFilter({ ...searchFilter, sort: 'coursePrice', direction: Direction.DESC });
				setFilterSortName('Highest Price');
		}
		setSortingOpen(false);
		setAnchorEl(null);
	};

	if (device === 'mobile') {
		return <h1>COURSES MOBILE</h1>;
	} else {
		return (
			<div id="property-list-page" style={{ position: 'relative' }} className="relative">
				<div className="container py-24">
					<Box component={'div'} className={'right'}>
						<span className="text-sm font-openSans font-semibold text-slate-950 dark:text-slate-200">Sort by:</span>
						<div className="">
							<Button
								onClick={sortingClickHandler}
								endIcon={<KeyboardArrowDownRoundedIcon className="dark:text-slate-200" />}
							>
								<span className="dark:text-slate-200 font-openSans">{filterSortName}</span>
							</Button>
							<Menu
								anchorEl={anchorEl}
								open={sortingOpen}
								onClose={sortingCloseHandler}
								sx={{ paddingTop: '5px', borderRadius: '10px' }}
							>
								<MenuItem
									className="dark:bg-slate-100 dark:text-slate-950 mb-1"
									onClick={sortingHandler}
									id={'new'}
									disableRipple
									sx={{ boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}
								>
									New
								</MenuItem>
								<MenuItem
									className="dark:bg-slate-100 dark:text-slate-950 mb-1"
									onClick={sortingHandler}
									id={'lowest'}
									disableRipple
									sx={{ boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}
								>
									Lowest Price
								</MenuItem>
								<MenuItem
									className="dark:bg-slate-100 dark:text-slate-950"
									onClick={sortingHandler}
									id={'highest'}
									disableRipple
									sx={{ boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}
								>
									Highest Price
								</MenuItem>
							</Menu>
						</div>
					</Box>
					<Stack className={'property-page'}>
						<Stack className={'filter-config'}>
							{/* @ts-ignore */}
							<Filter searchFilter={searchFilter} setSearchFilter={setSearchFilter} initialInput={initialInput} />
						</Stack>
						<Stack className="main-config" mb={'76px'}>
							<Stack className={'list-config'}>
								{courses?.length === 0 ? (
									<Card className="w-full max-w-4xl bg-inherit shadow-none rounded-xl">
										<div className="flex flex-col items-center justify-center p-12 text-center min-h-[600px]">
											<div className="relative">
												<div className="absolute inset-0 -m-10 bg-blue-100/50 rounded-full blur-3xl opacity-30 animate-pulse"></div>
												<div className="relative rounded-full bg-white p-6 mb-6 shadow-lg border border-indigo-100 transform transition-all duration-300 hover:scale-105">
													<Home className="h-14 w-14 text-indigo-500" />
												</div>
											</div>
											<Typography variant="h4" className="font-semibold mb-3 mt-2">
												No Courses Available
											</Typography>
											<Typography variant="body1" className="text-gray-600 max-w-md mb-8 leading-relaxed">
												We don't have any courses to display at the moment. Check back soon as our listings are updated
												regularly.
											</Typography>
											<div className="w-full max-w-xs h-1 bg-gradient-to-r from-transparent via-indigo-200 to-transparent rounded-full"></div>
										</div>
									</Card>
								) : (
									courses.map((course: Course) => {
										return <PropertyCard course={course} likeCourseHandler={likeCourseHandler} key={course?._id} />;
									})
								)}
							</Stack>
							<Stack className="pagination-config">
								{courses.length !== 0 && (
									<Stack className="pagination-box">
										<Pagination
											variant="outlined"
											page={currentPage}
											count={Math.ceil(total / searchFilter.limit)}
											onChange={handlePaginationChange}
											shape="circular"
											color="primary"
										/>
									</Stack>
								)}

								{courses.length !== 0 && (
									<Stack className="total-result">
										<span className="text-slate-800 dark:text-slate-200 font-openSans font-normal text-md">
											Total {total} cour{total > 1 ? 'se' : 's'} available
										</span>
									</Stack>
								)}
							</Stack>
						</Stack>
					</Stack>
				</div>
			</div>
		);
	}
};

CourseList.defaultProps = {
	initialInput: {
		page: 1,
		limit: 8,
		sort: 'createdAt',
		direction: 'DESC',
		search: {},
	},
};

export default withLayoutBasic(CourseList);
