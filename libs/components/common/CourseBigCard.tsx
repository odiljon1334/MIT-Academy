import React from 'react';
import { Stack, Box, Divider, Chip } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Course } from '../../types/course/course';
import { REACT_APP_API_URL, topPropertyRank } from '../../config';
import { formatterStr } from '../../utils';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { useRouter } from 'next/router';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { CourseStatus } from '../../enums/property.enum';
import { ArrowUpRight, BookMarked, Clock, Trophy } from 'lucide-react';
import { MemberPosition } from '../../enums/member.enum';

interface CourseBigCardProps {
	course: Course;
	likeCourseHandler?: any;
}

const CourseBigCard = (props: CourseBigCardProps) => {
	const { course, likeCourseHandler } = props;
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const router = useRouter();

	/** HANDLERS **/
	const goCourseDetatilPage = (courseId: string) => {
		router.push(`/course/detail?id=${courseId}`);
	};

	if (device === 'mobile') {
		return <div>COURSE BIG CARD</div>;
	} else {
		return (
			<Stack className="property-big-card-box" onClick={() => goCourseDetatilPage(course?._id)}>
				<Box
					component={'div'}
					className={'card-img border border-solid border-slate-300 dark:border-slate-600 border-b-0'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${course?.courseImage})` }}
				>
					{course && course?.courseRank >= topPropertyRank && (
						<div className={'status'}>
							<img src="/img/icons/electricity.svg" alt="" />
							<span>Best Seller</span>
						</div>
					)}

					<div className={'price text-green-600'}>${formatterStr(course?.coursePrice)}</div>
				</Box>
				<Box
					component={'div'}
					className={'info border border-solid border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900'}
				>
					<div className="flex flex-row items-center justify-between">
						<p
							onClick={() => {
								goCourseDetatilPage(course._id);
							}}
							className="flex items-center gap-1 text-md font-openSans font-semibold text-slate-950 dark:text-slate-200 hover:underline cursor-pointer"
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
							? course.courseDesc.length > 30
								? course.courseDesc.substring(0, 30) + ' '
								: course.courseDesc
							: 'No Course Description'}
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
					<Divider sx={{ mt: '15px', mb: '15px' }} />
					<div className={'flex flex-row justify-between'}>
						<div className="flex flex-row space-x-2">
							<img
								className="w-[42px] h-[42px] rounded-full object-cover"
								src={`${REACT_APP_API_URL}/${course.memberData?.memberImage}`}
								alt=""
							/>
							<div className="flex flex-col">
								<span className="text-sm text-neutral-800 dark:text-slate-200 font-openSans font-semibold">
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

export default CourseBigCard;
