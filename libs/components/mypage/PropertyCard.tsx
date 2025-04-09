import { Menu, MenuItem, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import IconButton from '@mui/material/IconButton';
import ModeIcon from '@mui/icons-material/Mode';
import DeleteIcon from '@mui/icons-material/Delete';
import { Course } from '../../types/course/course';
import { formatterStr } from '../../utils';
import Moment from 'react-moment';
import { useRouter } from 'next/router';
import { CourseStatus } from '../../enums/property.enum';

interface CourseCardProps {
	course: Course;
	deleteCourseHandler?: any;
	memberPage?: boolean;
	updateCourseHandler?: any;
}

export const PropertyCard = (props: CourseCardProps) => {
	const { course, deleteCourseHandler, memberPage, updateCourseHandler } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	/** HANDLERS **/
	const pushEditCourse = async (id: string) => {
		console.log('+pushEditCourse: ', id);
		await router.push({
			pathname: '/mypage',
			query: { category: 'addCourse', courseId: id },
		});
	};

	const pushCourseDetail = async (id: string) => {
		if (memberPage)
			await router.push({
				pathname: '/course/detail',
				query: { id: id },
			});
		else return;
	};

	const handleClick = (event: any) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	if (device === 'mobile') {
		return <div>MOBILE COURSE CARD</div>;
	} else
		return (
			<Stack className="property-card-box bg-neutral-50 dark:bg-slate-900 p-2 border border-solid dark:border-neutral-600 border-neutral-300">
				<Stack className="image-box" onClick={() => pushCourseDetail(course?._id)}>
					<img src={`${process.env.REACT_APP_API_URL}/${course.courseImage}`} alt="" />
				</Stack>
				<Stack className="information-box" onClick={() => pushCourseDetail(course?._id)}>
					<Typography className="name text-neutral-800 dark:text-slate-200">{course.courseTitle}</Typography>
					<Typography className="price text-neutral-500">
						<strong>${formatterStr(course?.coursePrice)}.00</strong>
					</Typography>
				</Stack>
				<Stack className="date-box">
					<Typography className="date text-neutral-500">
						<Moment format="DD MMM, YYYY">{course.createdAt}</Moment>
					</Typography>
				</Stack>
				<Stack className="status-box">
					<Stack className="coloured-box" sx={{ background: '#E5F0FD' }} onClick={handleClick}>
						<Typography className="status" sx={{ color: '#3554d1' }}>
							{course.courseStatus}
						</Typography>
					</Stack>
				</Stack>
				{!memberPage && course.courseStatus !== 'SOLD' && (
					<Menu
						anchorEl={anchorEl}
						open={open}
						onClose={handleClose}
						PaperProps={{
							elevation: 0,
							sx: {
								width: '70px',
								mt: 1,
								ml: '10px',
								overflow: 'visible',
								filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
							},
							style: {
								padding: 0,
								display: 'flex',
								justifyContent: 'center',
							},
						}}
					>
						{course.courseStatus === 'ACTIVE' && (
							<MenuItem
								disableRipple
								onClick={() => {
									handleClose();
									updateCourseHandler(CourseStatus.SOLD, course?._id);
								}}
							>
								Sold
							</MenuItem>
						)}
					</Menu>
				)}

				<Stack className="views-box">
					<Typography className="views text-neutral-600 dark:text-neutral-300">
						{course.courseViews.toLocaleString()}
					</Typography>
				</Stack>
				{!memberPage && (
					<Stack className="action-box">
						<IconButton className="icon-button" onClick={() => pushEditCourse(course._id)}>
							<ModeIcon className="buttons text-neutral-500" />
						</IconButton>
						<IconButton className="icon-button" onClick={() => deleteCourseHandler(course._id)}>
							<DeleteIcon className="buttons text-neutral-500" />
						</IconButton>
					</Stack>
				)}
			</Stack>
		);
};
