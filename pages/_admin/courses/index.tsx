import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import { Box, List, ListItem, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { TabContext } from '@mui/lab';
import TablePagination from '@mui/material/TablePagination';
import { CoursePanelList } from '../../../libs/components/admin/properties/CourseList';
import { AllCoursesInquiry } from '../../../libs/types/course/course.input';
import { Course } from '../../../libs/types/course/course';
import { CourseCategory, CourseStatus } from '../../../libs/enums/property.enum';
import { sweetConfirmAlert, sweetErrorHandling } from '../../../libs/sweetAlert';
import { CourseUpdate } from '../../../libs/types/course/course.update';
import { useMutation, useQuery } from '@apollo/client';
import { REMOVE_COURSE_BY_ADMIN, UPDATE_COURSE_BY_ADMIN } from '../../../apollo/admin/mutation';
import { GET_ALL_COURSES_BY_ADMIN } from '../../../apollo/admin/query';
import { T } from '../../../libs/types/common';

const AdminCourses: NextPage = ({ initialInquiry, ...props }: any) => {
	const [anchorEl, setAnchorEl] = useState<[] | HTMLElement[]>([]);
	const [coursesInquiry, setCoursesInquiry] = useState<AllCoursesInquiry>(initialInquiry);
	const [courses, setCourses] = useState<Course[]>([]);
	const [coursesTotal, setCoursesTotal] = useState<number>(0);
	const [value, setValue] = useState(
		coursesInquiry?.search?.courseStatus ? coursesInquiry?.search?.courseStatus : 'ALL',
	);
	const [searchType, setSearchType] = useState('ALL');

	/** APOLLO REQUESTS **/
	const [updateCourseByAdmin] = useMutation(UPDATE_COURSE_BY_ADMIN);
	const [removeCourseByAdmin] = useMutation(REMOVE_COURSE_BY_ADMIN);

	const {
		loading: getAllCoursesByAdminLoading,
		data: getAllCoursesByAdminData,
		error: getAllCoursesByAdminError,
		refetch: getAllCoursesByAdminRefetch,
	} = useQuery(GET_ALL_COURSES_BY_ADMIN, {
		fetchPolicy: 'network-only',
		variables: { input: coursesInquiry },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setCourses(data.getAllCoursesByAdmin?.list);
			setCoursesTotal(data.getAllCoursesByAdmin?.metaCounter[0]?.total ?? 0);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		getAllCoursesByAdminRefetch({ input: coursesInquiry }).then();
	}, [coursesInquiry]);

	/** HANDLERS **/
	const changePageHandler = async (event: unknown, newPage: number) => {
		coursesInquiry.page = newPage + 1;
		setCoursesInquiry({ ...coursesInquiry });
	};

	const changeRowsPerPageHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
		coursesInquiry.limit = parseInt(event.target.value, 10);
		coursesInquiry.page = 1;
		setCoursesInquiry({ ...coursesInquiry });
	};

	const menuIconClickHandler = (e: any, index: number) => {
		const tempAnchor = anchorEl.slice();
		tempAnchor[index] = e.currentTarget;
		setAnchorEl(tempAnchor);
	};

	const menuIconCloseHandler = () => {
		setAnchorEl([]);
	};

	const tabChangeHandler = async (event: any, newValue: string) => {
		setValue(newValue);

		setCoursesInquiry({ ...coursesInquiry, page: 1, sort: 'createdAt' });

		switch (newValue) {
			case 'ACTIVE':
				setCoursesInquiry({ ...coursesInquiry, search: { courseStatus: CourseStatus.ACTIVE } });
				break;
			case 'SOLD':
				setCoursesInquiry({ ...coursesInquiry, search: { courseStatus: CourseStatus.SOLD } });
				break;
			case 'DELETE':
				setCoursesInquiry({ ...coursesInquiry, search: { courseStatus: CourseStatus.DELETE } });
				break;
			default:
				delete coursesInquiry?.search?.courseStatus;
				setCoursesInquiry({ ...coursesInquiry });
				break;
		}
	};

	const removeCourseHandler = async (id: string) => {
		try {
			if (await sweetConfirmAlert('Are you sure to remove?')) {
				await removeCourseByAdmin({ variables: { input: id } });
				await getAllCoursesByAdminRefetch({ input: coursesInquiry });
			}
			menuIconCloseHandler();
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};

	const searchTypeHandler = async (newValue: string) => {
		try {
			setSearchType(newValue);

			if (newValue !== 'ALL') {
				setCoursesInquiry({
					...coursesInquiry,
					page: 1,
					sort: 'createdAt',
					search: {
						...coursesInquiry.search,
						courseCategory: [newValue as CourseCategory],
					},
				});
			} else {
				delete coursesInquiry?.search?.courseCategory;
				setCoursesInquiry({ ...coursesInquiry });
			}
		} catch (err: any) {
			console.log('searchTypeHandler: ', err.message);
		}
	};

	const updateCourseHandler = async (updateData: CourseUpdate) => {
		try {
			console.log('+updateData: ', updateData);
			await updateCourseByAdmin({
				variables: {
					input: updateData,
				},
			});
			menuIconCloseHandler();
			await getAllCoursesByAdminRefetch({ input: coursesInquiry });
		} catch (err: any) {
			menuIconCloseHandler();
			sweetErrorHandling(err).then();
		}
	};

	return (
		<Box component={'div'} className={'content'}>
			<Typography variant={'h2'} className={'tit'} sx={{ mb: '24px' }}>
				Course List
			</Typography>
			<Box component={'div'} className={'table-wrap'}>
				<Box component={'div'} sx={{ width: '100%', typography: 'body1' }}>
					<TabContext value={value}>
						<Box component={'div'}>
							<List className={'tab-menu'}>
								<ListItem
									onClick={(e: any) => tabChangeHandler(e, 'ALL')}
									value="ALL"
									className={value === 'ALL' ? 'li on' : 'li'}
								>
									All
								</ListItem>
								<ListItem
									onClick={(e: any) => tabChangeHandler(e, 'ACTIVE')}
									value="ACTIVE"
									className={value === 'ACTIVE' ? 'li on' : 'li'}
								>
									Active
								</ListItem>
								<ListItem
									onClick={(e: any) => tabChangeHandler(e, 'SOLD')}
									value="SOLD"
									className={value === 'SOLD' ? 'li on' : 'li'}
								>
									Sold
								</ListItem>
								<ListItem
									onClick={(e: any) => tabChangeHandler(e, 'DELETE')}
									value="DELETE"
									className={value === 'DELETE' ? 'li on' : 'li'}
								>
									Delete
								</ListItem>
							</List>
							<Divider />
							<Stack className={'search-area'} sx={{ m: '24px' }}>
								<Select sx={{ width: '160px', mr: '20px' }} value={searchType}>
									<MenuItem value={'ALL'} onClick={() => searchTypeHandler('ALL')}>
										ALL
									</MenuItem>
									{Object.values(CourseCategory).map((category: string) => (
										<MenuItem value={category} onClick={() => searchTypeHandler(category)} key={category}>
											{category}
										</MenuItem>
									))}
								</Select>
							</Stack>
							<Divider />
						</Box>
						<CoursePanelList
							courses={courses}
							anchorEl={anchorEl}
							menuIconClickHandler={menuIconClickHandler}
							menuIconCloseHandler={menuIconCloseHandler}
							updateCourseHandler={updateCourseHandler}
							removeCourseHandler={removeCourseHandler}
						/>

						<TablePagination
							rowsPerPageOptions={[10, 20, 40, 60]}
							component="div"
							count={coursesTotal}
							rowsPerPage={coursesInquiry?.limit}
							page={coursesInquiry?.page - 1}
							onPageChange={changePageHandler}
							onRowsPerPageChange={changeRowsPerPageHandler}
						/>
					</TabContext>
				</Box>
			</Box>
		</Box>
	);
};

AdminCourses.defaultProps = {
	initialInquiry: {
		page: 1,
		limit: 10,
		sort: 'createdAt',
		direction: 'DESC',
		search: {},
	},
};

export default withAdminLayout(AdminCourses);
