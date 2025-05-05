import React from 'react';
import Link from 'next/link';
import {
	TableCell,
	TableHead,
	TableBody,
	TableRow,
	Table,
	TableContainer,
	Button,
	Menu,
	Fade,
	MenuItem,
} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import { Stack } from '@mui/material';
import { Course } from '../../../types/course/course';
import { REACT_APP_API_URL } from '../../../config';
import DeleteIcon from '@mui/icons-material/Delete';
import Typography from '@mui/material/Typography';
import { CourseStatus } from '../../../enums/property.enum';
import { PackageOpen } from 'lucide-react';

interface Data {
	id: string;
	title: string;
	price: string;
	instructor: string;
	category: string;
	type: string;
	status: string;
}

type Order = 'asc' | 'desc';

interface HeadCell {
	disablePadding: boolean;
	id: keyof Data;
	label: string;
	numeric: boolean;
}

const headCells: readonly HeadCell[] = [
	{
		id: 'id',
		numeric: true,
		disablePadding: false,
		label: 'ID',
	},
	{
		id: 'title',
		numeric: false,
		disablePadding: false,
		label: 'Title',
	},
	{
		id: 'price',
		numeric: false,
		disablePadding: false,
		label: 'Price',
	},
	{
		id: 'instructor',
		numeric: false,
		disablePadding: false,
		label: 'Instructor',
	},
	{
		id: 'category',
		numeric: false,
		disablePadding: false,
		label: 'Category',
	},
	{
		id: 'type',
		numeric: false,
		disablePadding: false,
		label: 'Type',
	},
	{
		id: 'status',
		numeric: false,
		disablePadding: false,
		label: 'Status',
	},
];

interface EnhancedTableProps {
	numSelected: number;
	onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
	onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
	order: Order;
	orderBy: string;
	rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
	const { onSelectAllClick } = props;

	return (
		<TableHead className={'bg-slate-700'}>
			<TableRow>
				{headCells.map((headCell) => (
					<TableCell
						key={headCell.id}
						align={headCell.numeric ? 'left' : 'center'}
						padding={headCell.disablePadding ? 'none' : 'normal'}
					>
						{headCell.label}
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	);
}

interface CoursePanelListType {
	courses: Course[];
	anchorEl: any;
	menuIconClickHandler: any;
	menuIconCloseHandler: any;
	updateCourseHandler: any;
	removeCourseHandler: any;
}

export const CoursePanelList = (props: CoursePanelListType) => {
	const { courses, anchorEl, menuIconClickHandler, menuIconCloseHandler, updateCourseHandler, removeCourseHandler } =
		props;

	return (
		<Stack>
			<TableContainer>
				<Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={'medium'}>
					{/*@ts-ignore*/}
					<EnhancedTableHead />
					<TableBody>
						{courses.length === 0 && (
							<TableRow>
								<TableCell align="center" colSpan={8}>
									<span className={'no-data'}>
										<div className="flex flex-col items-center justify-center p-12 text-center min-h-[300px]">
											<div className="relative">
												<div className="absolute inset-0 -m-10 bg-blue-100/50 rounded-full blur-3xl opacity-30 animate-pulse"></div>
												<div className="relative rounded-full bg-white p-6 mb-6 shadow-lg border border-indigo-100 transform transition-all duration-300 hover:scale-105">
													<PackageOpen className="h-14 w-14 text-indigo-500" />
												</div>
											</div>
											<Typography variant="h4" className="dark:text-slate-300 text-slate-950 font-semibold mb-3 mt-2">
												No Data Found!
											</Typography>
											<div className="w-full max-w-xs h-1 bg-gradient-to-r from-transparent via-indigo-200 to-transparent rounded-full"></div>
										</div>
									</span>
								</TableCell>
							</TableRow>
						)}

						{courses.length !== 0 &&
							courses.map((course: Course, index: number) => {
								const courseImage = `${REACT_APP_API_URL}/${course?.courseImage}`;

								return (
									<TableRow hover key={course?._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
										<TableCell align="left">
											<p className="text-slate-300">{course._id}</p>
										</TableCell>
										<TableCell align="left" className={'name'}>
											{course.courseStatus === CourseStatus.ACTIVE ? (
												<Stack direction={'row'} alignItems={'center'} spacing={2}>
													<Link href={`/course/detail?id=${course?._id}`}>
														<div>
															<img
																alt="Remy Sharp"
																src={courseImage}
																style={{
																	marginLeft: '10px',
																	width: 80,
																	height: 50,
																	borderRadius: '10px',
																}}
															/>
														</div>
													</Link>
													<Link href={`/course/detail?id=${course?._id}`}>
														<div className="text-slate-300 ">{course.courseTitle}</div>
													</Link>
												</Stack>
											) : (
												<Stack direction={'row'}>
													<div>
														<Avatar alt="Remy Sharp" src={courseImage} sx={{ ml: '2px', mr: '10px' }} />
													</div>
													<div style={{ marginTop: '10px' }}>{course.courseTitle}</div>
												</Stack>
											)}
										</TableCell>
										<TableCell align="center">
											<p className="text-slate-400">{course.coursePrice}</p>
										</TableCell>
										<TableCell align="center">
											<p className="text-slate-200">{course.memberData?.memberNick}</p>
										</TableCell>
										<TableCell align="center">
											<p className="text-green-400">{course.courseCategory}</p>
										</TableCell>
										<TableCell align="center">
											<p className="bg-orange-500 py-1 text-slate-200 font-semibold rounded-full">
												{course.courseType}
											</p>
										</TableCell>
										<TableCell align="center">
											{course.courseStatus === CourseStatus.DELETE && (
												<Button
													variant="outlined"
													sx={{ p: '3px', border: 'none', ':hover': { border: 'none' } }}
													onClick={() => removeCourseHandler(course._id)}
												>
													<DeleteIcon fontSize="small" />
												</Button>
											)}

											{course.courseStatus === CourseStatus.SOLD && (
												<Button variant="outlined" sx={{ py: '2px', width: 90 }} color="warning" className={'badge'}>
													{course.courseStatus}
												</Button>
											)}

											{course.courseStatus === CourseStatus.ACTIVE && (
												<>
													<Button
														variant="outlined"
														sx={{ py: '2px' }}
														color="success"
														onClick={(e: any) => menuIconClickHandler(e, index)}
														className={'badge'}
													>
														{course.courseStatus}
													</Button>

													<Menu
														className={'menu-modal'}
														MenuListProps={{
															'aria-labelledby': 'fade-button',
														}}
														anchorEl={anchorEl[index]}
														open={Boolean(anchorEl[index])}
														onClose={menuIconCloseHandler}
														TransitionComponent={Fade}
														sx={{ p: 1 }}
													>
														{Object.values(CourseStatus)
															.filter((ele) => ele !== course.courseStatus)
															.map((status: string) => (
																<MenuItem
																	onClick={() => updateCourseHandler({ _id: course._id, courseStatus: status })}
																	key={status}
																>
																	<Typography variant={'subtitle1'} component={'span'}>
																		{status}
																	</Typography>
																</MenuItem>
															))}
													</Menu>
												</>
											)}
										</TableCell>
									</TableRow>
								);
							})}
					</TableBody>
				</Table>
			</TableContainer>
		</Stack>
	);
};
