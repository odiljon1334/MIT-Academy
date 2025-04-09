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
		label: 'MB ID',
	},
	{
		id: 'title',
		numeric: true,
		disablePadding: false,
		label: 'TITLE',
	},
	{
		id: 'price',
		numeric: false,
		disablePadding: false,
		label: 'PRICE',
	},
	{
		id: 'instructor',
		numeric: false,
		disablePadding: false,
		label: 'INTRUCTOR',
	},
	{
		id: 'category',
		numeric: false,
		disablePadding: false,
		label: 'CATEGORY',
	},
	{
		id: 'type',
		numeric: false,
		disablePadding: false,
		label: 'TYPE',
	},
	{
		id: 'status',
		numeric: false,
		disablePadding: false,
		label: 'STATUS',
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
		<TableHead>
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
									<span className={'no-data'}>data not found!</span>
								</TableCell>
							</TableRow>
						)}

						{courses.length !== 0 &&
							courses.map((course: Course, index: number) => {
								const courseImage = `${REACT_APP_API_URL}/${course?.courseImage}`;

								return (
									<TableRow hover key={course?._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
										<TableCell align="left">{course._id}</TableCell>
										<TableCell align="left" className={'name'}>
											{course.courseStatus === CourseStatus.ACTIVE ? (
												<Stack direction={'row'}>
													<Link href={`/property/detail?id=${course?._id}`}>
														<div>
															<Avatar alt="Remy Sharp" src={courseImage} sx={{ ml: '2px', mr: '10px' }} />
														</div>
													</Link>
													<Link href={`/property/detail?id=${course?._id}`}>
														<div>{course.courseTitle}</div>
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
										<TableCell align="center">{course.coursePrice}</TableCell>
										<TableCell align="center">{course.memberData?.memberNick}</TableCell>
										<TableCell align="center">{course.courseCategory}</TableCell>
										<TableCell align="center">{course.courseType}</TableCell>
										<TableCell align="center">
											{course.courseStatus === CourseStatus.DELETE && (
												<Button
													variant="outlined"
													sx={{ p: '3px', border: 'none', ':hover': { border: '1px solid #000000' } }}
													onClick={() => removeCourseHandler(course._id)}
												>
													<DeleteIcon fontSize="small" />
												</Button>
											)}

											{course.courseStatus === CourseStatus.SOLD && (
												<Button className={'badge warning'}>{course.courseStatus}</Button>
											)}

											{course.courseStatus === CourseStatus.ACTIVE && (
												<>
													<Button onClick={(e: any) => menuIconClickHandler(e, index)} className={'badge success'}>
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
