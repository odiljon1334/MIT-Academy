import React from 'react';
import { Stack, Typography, Box, Chip, Divider } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Course } from '../../types/course/course';
import Link from 'next/link';
import { formatterStr } from '../../utils';
import { REACT_APP_API_URL, topPropertyRank } from '../../config';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import IconButton from '@mui/material/IconButton';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { ArrowUpRight, BookMarked, Clock, Trophy } from 'lucide-react';
import { CourseStatus } from '../../enums/property.enum';
import { MemberPosition } from '../../enums/member.enum';

interface CourseCardType {
	course: Course;
	likeCourseHandler?: any;
	myFavorites?: boolean;
	recentlyVisited?: boolean;
}

const CourseCard = (props: CourseCardType) => {
	const { course, likeCourseHandler, myFavorites, recentlyVisited } = props;
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const imagePath: string = course?.courseImage
		? `${REACT_APP_API_URL}/${course?.courseImage}`
		: '/img/banner/header1.svg';

	if (device === 'mobile') {
		return <div>COURSE CARD</div>;
	} else {
		return (
			<Stack className="card-config">
				<Stack className="top border border-b-0 rounded-t-[10px] border-solid border-slate-300 dark:border-slate-600">
					{course && course._id && (
						<Link
							href={{
								pathname: '/course/detail',
								query: { id: course._id },
							}}
						>
							<img
								className=""
								src={imagePath}
								alt="property-image"
								style={{ width: '100%', height: '230px', objectFit: 'fill', borderRadius: '10px 10px 0px 0px' }}
							/>
						</Link>
					)}
					{course && course?.courseRank > topPropertyRank && (
						<Box component={'div'} className={'top-badge space-x-1'}>
							<img src="/img/icons/electricity.svg" alt="" />
							<Typography className="text-sm font-openSans font-medium">Best Seller</Typography>
						</Box>
					)}
					<Box component={'div'} className={'price-box'}>
						<Typography className="text-green-600">${course?.coursePrice}.00</Typography>
					</Box>
				</Stack>
				<Stack className="bottom border border-t-0 rounded-b-[10px] border-solid border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900">
					<Stack className="name-address">
						<Stack className="name ">
							{course?._id && (
								<>
									<div className="flex flex-row items-center justify-between">
										<Link
											href={{
												pathname: '/course/detail',
												query: { id: course._id },
											}}
										>
											<Typography className="flex items-center text-md font-openSans font-semibold text-slate-950 dark:text-slate-300 hover:underline">
												{course?.courseTitle
													? course.courseTitle.length > 15
														? course.courseTitle.substring(0, 17) + '...'
														: course.courseTitle
													: 'No title available'}
												<ArrowUpRight className="text-slate-950 dark:text-slate-300 w-5 h-5" />
											</Typography>
										</Link>
										<Chip
											size="small"
											label={course?.courseStatus === CourseStatus.ACTIVE ? 'Active' : 'Inactive'}
											color={CourseStatus.ACTIVE ? 'success' : 'default'}
										/>
									</div>
								</>
							)}
						</Stack>
						<Stack className="address">
							<Typography>
								{course?.courseDesc
									? course.courseDesc.length > 20
										? course.courseDesc.substring(0, 20) + ' ...'
										: course.courseDesc
									: ''}
							</Typography>
						</Stack>
					</Stack>
					<div className={'flex items-center flex-row justify-between'}>
						<div className="flex items-center flex-row">
							<Clock className="text-gray-500 w-5 h-5 mr-1" />
							<span className="text-[11px] font-bold font-openSans flex items-center dark:text-gray-200 text-gray-700">
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
							<span className="text-[11px] font-semibold font-openSans dark:text-gray-200 text-gray-700 flex items-center">
								Lesson: {course?.courseModuls?.reduce((sum, mod) => sum + (mod.lessons?.length || 0), 0)}
							</span>
						</div>
						<div className="flex flex-row space-x-1">
							<Trophy className="text-gray-500 w-5 h-5" />
							<span className="text-[11px] font-normal font-openSans dark:text-gray-200 text-gray-700 flex items-center">
								{course?.courseType}
							</span>
						</div>
					</div>
					<Divider sx={{ mt: '17px', mb: '10px' }} />
					<Stack className="type-buttons">
						<div className="flex flex-row items-center space-x-2">
							<Link
								href={{
									pathname: '/intructor/detail',
									query: { intructorId: course?.memberData?._id },
								}}
								className="flex flex-row cursor-pointer space-x-2"
							>
								<img
									className="w-[42px] h-[42px] rounded-full object-cover"
									src={`${REACT_APP_API_URL}/${course.memberData?.memberImage}`}
									alt=""
								/>
								<div className="flex flex-col space-y-1">
									<span className="text-slate-800 dark:text-slate-200 text-sm font-normal hover:underline">
										{course?.memberData?.memberNick}
									</span>
									<p className="text-[13px] font-openSans text-slate-500">
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
							</Link>
						</div>
						{!recentlyVisited && (
							<Stack className="buttons">
								<IconButton className="text-slate-600 dark:text-gray-200">
									<RemoveRedEyeIcon />
								</IconButton>
								<Typography className="text-sm font-normal text-slate-600 dark:text-gray-100">
									{course?.courseViews}
								</Typography>
								<IconButton color={'default'} onClick={() => likeCourseHandler(user, course?._id)}>
									{myFavorites ? (
										<FavoriteIcon color="primary" />
									) : course?.meLiked && course?.meLiked[0]?.myFavorite ? (
										<FavoriteIcon color="primary" />
									) : (
										<FavoriteBorderIcon />
									)}
								</IconButton>
								<Typography className="text-sm font-normal text-slate-600 dark:text-gray-100">
									{course?.courseLikes}
								</Typography>
							</Stack>
						)}
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default CourseCard;
