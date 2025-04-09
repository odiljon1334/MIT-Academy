import React from 'react';
import { Stack, Box, Divider, Typography, Button, Chip } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Course } from '../../types/course/course';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { REACT_APP_API_URL, topPropertyRank } from '../../config';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { ArrowUpRight, BookMarked, Clock, Trophy } from 'lucide-react';
import { CourseStatus } from '../../enums/property.enum';
import { MemberPosition } from '../../enums/member.enum';

interface PopularCourseCardProps {
	course: Course;
}

const PopularCourseCard = (props: PopularCourseCardProps) => {
	const { course } = props;
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
			<Stack className="popular-card-box">
				<Box
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${course?.courseImage})` }}
					onClick={() => {
						pushDetailHandler(course._id);
					}}
				>
					{course && course?.courseRank >= topPropertyRank ? (
						<div className={'status'}>
							<img src="/img/icons/electricity.svg" alt="" />
							<span>top</span>
						</div>
					) : (
						''
					)}

					<div className={'price text-green-600'}>${course.coursePrice}.00</div>
				</Box>
				<Box component={'div'} className={'info'}>
					<p
						onClick={() => {
							pushDetailHandler(course._id);
						}}
						className={
							'flex items-center text-sm font-openSans font-semibold text-slate-950 dark:text-slate-200 hover:underline'
						}
					>
						{course?.courseTitle
							? course.courseTitle.length > 15
								? course.courseTitle.substring(0, 15) + '...'
								: course.courseTitle
							: 'No title available'}
					</p>
					<p className={'desc'}>{course.courseDesc}</p>
					<div className={'options'}>
						<div className="flex items-center flex-row">
							<Clock className="text-gray-500 w-5 h-5 mr-1" />
							<span className="text-sm font-normal font-openSans flex items-center dark:text-gray-200 text-gray-700">
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
							<span className="text-sm font-normal font-openSans dark:text-gray-200 text-gray-700 flex items-center">
								Lesson: {course?.courseModuls?.reduce((sum, mod) => sum + (mod.lessons?.length || 0), 0)}
							</span>
						</div>
						<div className="flex flex-row space-x-1">
							<Trophy className="text-gray-500 w-5 h-5" />
							<span className="text-sm font-normal font-openSans dark:text-gray-200 text-gray-700 flex items-center">
								Beginner
							</span>
						</div>
					</div>
					<Divider sx={{ mt: '15px', mb: '17px' }} />
					<div className={'bott'}>
						<div className="view-like-box">
							<IconButton>
								<RemoveRedEyeIcon className="text-slate-600 dark:text-gray-200" />
							</IconButton>
							<Typography className="">{course?.courseViews}</Typography>
						</div>
					</div>
				</Box>
			</Stack>
		);
	} else {
		return (
			<Stack className="popular-card-box">
				<Box
					component={'div'}
					className={'card-img border border-solid border-slate-300 dark:border-slate-700 border-b-0'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${course?.courseImage})` }}
					onClick={() => {
						pushDetailHandler(course._id);
					}}
				>
					{course && course?.courseRank >= topPropertyRank ? (
						<div className={'status'}>
							<img src="/img/icons/electricity.svg" alt="" />
							<span>Best</span>
						</div>
					) : (
						''
					)}

					<div className={'price text-green-600'}>${course.coursePrice}.00</div>
				</Box>
				<Box
					component={'div'}
					className={'info border border-solid border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900'}
				>
					<div className="flex flex-row items-center justify-between">
						<p
							onClick={() => {
								pushDetailHandler(course._id);
							}}
							className="flex items-center gap-1 text-md font-openSans font-semibold text-slate-950 dark:text-slate-200 hover:underline"
						>
							{course?.courseTitle
								? course.courseTitle.length > 15
									? course.courseTitle.substring(0, 25) + '...'
									: course.courseTitle
								: 'No title available'}
							<ArrowUpRight className="text-slate-950 dark:text-slate-200 w-5 h-5" />
						</p>
						<Chip
							className="w-[60px] h-5"
							size="small"
							label={course?.courseStatus === CourseStatus.ACTIVE ? 'Active' : 'Inactive'}
							color={CourseStatus.ACTIVE ? 'success' : 'default'}
						/>
					</div>
					<p className={'desc'}>
						{course?.courseDesc
							? course.courseDesc.length > 15
								? course.courseDesc.substring(0, 27) + ' '
								: course.courseDesc
							: 'no description'}
					</p>
					<div className={'options'}>
						<div className="flex items-center flex-row">
							<Clock className="text-gray-500 w-5 h-5 mr-1" />
							<span className="text-sm font-normal font-openSans flex items-center dark:text-gray-200 text-gray-700">
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
							<span className="text-sm font-normal font-openSans dark:text-gray-200 text-gray-700 flex items-center">
								Lesson: {course?.courseModuls?.reduce((sum, mod) => sum + (mod.lessons?.length || 0), 0)}
							</span>
						</div>
						<div className="flex flex-row space-x-1">
							<Trophy className="text-gray-500 w-5 h-5" />
							<span className="text-sm font-normal font-openSans dark:text-gray-200 text-gray-700 flex items-center">
								{course?.courseType}
							</span>
						</div>
					</div>
					<Divider sx={{ mt: '15px', mb: '17px' }} />
					<div className={'bott'}>
						<div className="flex flex-row space-x-2">
							<img
								className="w-[42px] h-[42px] rounded-full object-cover"
								src={`${REACT_APP_API_URL}/${course.memberData?.memberImage}`}
								alt=""
							/>
							<div className="flex flex-col">
								<span className="text-slate-800 dark:text-slate-200 text-sm font-normal">
									{course?.memberData?.memberNick}
								</span>
								<p className="text-sm font-openSans text-slate-500">
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
						</div>
					</div>
				</Box>
			</Stack>
		);
	}
};

export default PopularCourseCard;
