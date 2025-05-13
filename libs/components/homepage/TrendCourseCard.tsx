import React from 'react';
import { Stack, Box, Divider, Typography, Link, Button, Chip } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Course } from '../../types/course/course';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { REACT_APP_API_URL } from '../../config';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { Clock, BookMarked, Trophy, ArrowUpRight } from 'lucide-react';
import { CourseStatus } from '../../enums/property.enum';
import { MemberPosition } from '../../enums/member.enum';

interface TrendPropertyCardProps {
	course: Course;
	likeCourseHandler: any;
}

const TrendCourseCard = (props: TrendPropertyCardProps) => {
	const { course, likeCourseHandler } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);

	/** HANDLERS **/
	const pushDetailHandler = async (courseId: string) => {
		console.log('courseId:', courseId);
		await router.push({ pathname: '/course/detail', query: { id: courseId } });
	};

	if (device === 'mobile') {
		return (
			<Stack className="trend-card-box" key={course._id}>
				<Box
					component={'div'}
					className={'card-img'}
					style={{
						backgroundImage: `url(${REACT_APP_API_URL}/${course?.courseImage})`,
					}}
					onClick={() => {
						pushDetailHandler(course._id);
					}}
				>
					<div>${course.coursePrice}</div>
				</Box>
				<Box component={'div'} className={'info'}>
					<strong
						className={'title'}
						onClick={() => {
							pushDetailHandler(course._id);
						}}
					>
						{course.courseTitle}
					</strong>
					<p className={'desc'}>{course.courseDesc ?? 'no description'}</p>
					<Divider sx={{ mt: '15px', mb: '17px' }} />
					<div className={'bott'}>
						<div className="view-like-box">
							<IconButton color={'default'}>
								<RemoveRedEyeIcon />
							</IconButton>
							<Typography className="view-cnt">{course?.courseViews}</Typography>
							<IconButton color={'default'} onClick={() => likeCourseHandler(user, course?._id)}>
								{course?.meLiked && course?.meLiked[0]?.myFavorite ? (
									<FavoriteIcon style={{ color: 'red' }} />
								) : (
									<FavoriteIcon />
								)}
							</IconButton>
							<Typography className="view-cnt">{course?.courseLikes}</Typography>
						</div>
					</div>
				</Box>
			</Stack>
		);
	} else {
		return (
			<Stack className="trend-card-box w-[350px]" key={course._id}>
				<Box
					component={'div'}
					className={'card-img border border-solid border-b-0 border-slate-300 dark:border-slate-700'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${course?.courseImage})` }}
					onClick={() => {
						pushDetailHandler(course._id);
					}}
				>
					<div className="text-green-600">${course.coursePrice}.00</div>
				</Box>
				<Box
					component={'div'}
					className={
						'info bg-white border border-solid border-slate-300 dark:border-slate-700 dark:bg-slate-900 cursor-pointer'
					}
				>
					<div className="flex flex-row items-center justify-between mt-4 ml-5">
						<p
							onClick={() => {
								pushDetailHandler(course._id);
							}}
							className="flex items-center gap-1 text-md font-openSans font-semibold text-slate-950 dark:text-slate-200 hover:underline"
						>
							{course?.courseTitle
								? course.courseTitle.length > 15
									? course.courseTitle.substring(0, 18) + '...'
									: course.courseTitle
								: 'No title available'}
							<ArrowUpRight className="text-slate-950 dark:text-slate-200 w-5 h-5" />
						</p>
						<Chip
							className="w-[60px] h-5 mr-2"
							size="small"
							label={course?.courseStatus === CourseStatus.ACTIVE ? 'Active' : 'Inactive'}
							color={CourseStatus.ACTIVE ? 'success' : 'default'}
						/>
					</div>
					<p className={'desc ml-5'}>
						{course?.courseDesc
							? course.courseDesc.length > 15
								? course.courseDesc.substring(0, 28) + '...'
								: course.courseDesc
							: 'no description'}
					</p>
					<div className={'flex flox-col items-center justify-between mt-5 p-2'}>
						<div className="flex items-center flex-row">
							<Clock className="text-gray-500 w-5 h-5 mr-1" />
							<span className="text-[12px] font-normal font-openSans flex items-center dark:text-gray-200 text-gray-700">
								{' '}
								{(() => {
									const totalMinutes = Array.isArray(course?.courseModuls)
										? course.courseModuls.reduce(
												(totalDuration, module) =>
													totalDuration +
													(Array.isArray(module.lessons)
														? module.lessons.reduce((sum, lesson) => sum + lesson.lessonDuration, 0)
														: 0),
												0,
										  )
										: 0;

									const hours = Math.floor(totalMinutes / 60); // Soat
									const minutes = totalMinutes % 60; // Qolgan daqiqa

									return `${hours > 0 ? `${hours}h ` : ''}${minutes > 0 ? `${minutes}min` : ''}`.trim();
								})()}
							</span>
						</div>
						<div className="flex flex-row space-x-1">
							<BookMarked className="text-gray-500 w-5 h-5" />
							<span className="text-[12px] font-normal font-openSans dark:text-gray-200 text-gray-700 flex items-center">
								Lesson: {course?.courseModuls?.reduce((sum, mod) => sum + (mod.lessons?.length || 0), 0)}
							</span>
						</div>
						<div className="flex flex-row space-x-1">
							<Trophy className="text-gray-500 w-5 h-5" />
							<span className="text-[12px] font-normal font-openSans dark:text-gray-200 text-gray-700 flex items-center">
								{course?.courseType}
							</span>
						</div>
					</div>
					<Divider sx={{ mt: '15px', mb: '5px' }} />
					<div className={'bott p-3'}>
						<div className="flex flex-row space-x-2">
							<img
								className="w-[42px] h-[42px] rounded-full object-cover"
								src={`${REACT_APP_API_URL}/${course.memberData?.memberImage}`}
								alt=""
							/>
							<div className="flex flex-col w-full">
								<span className="text-slate-800 dark:text-slate-200 text-sm font-normal">
									{course?.memberData?.memberNick}
								</span>
								<p className="text-[12px] font-openSans text-slate-500">
									{course?.memberData?.memberPosition === MemberPosition.UI_UX_DESIGNER
										? 'UI/UX Designer'
										: course?.memberData?.memberPosition === MemberPosition.SOFTWARE_ENGINEER
										? 'Software Engineer'
										: course?.memberData?.memberPosition === MemberPosition.FRONTEND_DEVELOPER
										? 'Frontend Developer'
										: course?.memberData?.memberPosition === MemberPosition.BACKEND_DEVELOPER
										? 'Backend Developer'
										: course?.memberData?.memberPosition === MemberPosition.FULLSTACK_DEVELOPER
										? 'Fullstack Developer'
										: course?.memberData?.memberPosition === MemberPosition.DATA_SCIENTIST
										? 'Data Scientist'
										: course?.memberData?.memberPosition === MemberPosition.WEB_DEVELOPER
										? 'Web Developer'
										: course?.memberData?.memberPosition === MemberPosition.MOBILE_DEVELOPER
										? 'Mobile Developer'
										: course?.memberData?.memberPosition === MemberPosition.MACHINE_LEARNING_ENGINEER
										? 'Machine Learning Eng'
										: course?.memberData?.memberPosition === MemberPosition.DEVOPS_ENGINEER
										? 'DevOps Engineer'
										: course?.memberData?.memberPosition === MemberPosition.GAME_DEVELOPER
										? 'Game Developer'
										: course?.memberData?.memberPosition === MemberPosition.GRAPHIC_DESIGNER
										? 'Graphic Designer'
										: null}
								</p>
							</div>
						</div>
						<div className="view-like-box">
							<IconButton className="text-slate-600 dark:text-gray-200">
								<RemoveRedEyeIcon />
							</IconButton>
							<span className="text-sm font-normal text-slate-600 dark:text-gray-100">{course?.courseViews}</span>
							<IconButton color={'default'} onClick={() => likeCourseHandler(user, course?._id)}>
								{course?.meLiked && course?.meLiked[0]?.myFavorite ? (
									<FavoriteIcon style={{ color: 'red' }} />
								) : (
									<FavoriteIcon className="text-slate-600 dark:text-gray-200" />
								)}
							</IconButton>
							<span className="text-sm font-normal text-slate-600 dark:text-gray-100">{course?.courseLikes}</span>
						</div>
					</div>
				</Box>
			</Stack>
		);
	}
};

export default TrendCourseCard;
