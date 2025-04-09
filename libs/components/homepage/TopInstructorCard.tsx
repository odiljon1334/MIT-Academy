import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/router';
import { Box, Chip, Stack } from '@mui/material';
import FaceIcon from '@mui/icons-material/Face';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Member } from '../../types/member/member';
import Link from 'next/link';
import { MemberPosition, MemberType } from '../../enums/member.enum';

interface TopAgentProps {
	instructor: Member;
}
const TopInstructorCard = (props: TopAgentProps) => {
	const { instructor } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const instructorImage = instructor?.memberImage
		? `${process.env.REACT_APP_API_URL}/${instructor?.memberImage}`
		: '/img/profile/defaultUser.svg';

	/** HANDLERS **/

	if (device === 'mobile') {
		return (
			<Stack className="top-agent-card">
				<img src={instructorImage} alt="" />
				<strong>{instructor?.memberNick}</strong>
				<span>{instructor?.memberType}</span>
			</Stack>
		);
	} else {
		return (
			<>
				<Card variant={'outlined'} sx={{ width: 500, borderRadius: '16px', cursor: 'pointer' }}>
					<Link
						href={{
							pathname: '/instructor/detail',
							query: { instructorId: instructor?._id },
						}}
					>
						<Box className="p-3 dark:bg-slate-950">
							<CardMedia
								sx={{ width: 'auto', height: 210, objectFit: 'cover', borderRadius: '10px' }}
								image={instructorImage}
								title="agent image"
							/>
						</Box>
						<CardContent className="flex flex-col items-center p-1 dark:bg-slate-950">
							<Stack className="flex flex-row justify-around w-full gap-20 mb-2">
								<Typography className="text-md font-openSans font-normal" variant="h6" component="div">
									{instructor?.memberNick}
								</Typography>
								<Typography variant="body2" sx={{ color: 'text.secondary' }}>
									{instructor?.memberType === MemberType.INSTRUCTOR ? (
										<Chip color="success" icon={<FaceIcon />} label={'Instructor'} variant="outlined" />
									) : null}
								</Typography>
							</Stack>
							<Stack className="flex flex-row w-full">
								<Typography className="text-sm font-openSans font-normal ml-2 text-slate-500" component="div">
									{instructor?.memberPosition === MemberPosition.UI_UX_DESIGNER
										? 'UI/UX Designer'
										: instructor?.memberPosition === MemberPosition.SOFTWARE_ENGINEER
										? 'Software Engineer'
										: instructor?.memberPosition === MemberPosition.FRONTEND_DEVELOPER
										? 'Frontend Developer'
										: instructor?.memberPosition === MemberPosition.BACKEND_DEVELOPER
										? 'Backend Developer'
										: instructor?.memberPosition === MemberPosition.FULLSTACK_DEVELOPER
										? 'Fullstack Developer'
										: instructor?.memberPosition === MemberPosition.DATA_SCIENTIST
										? 'Data Scientist'
										: instructor?.memberPosition === MemberPosition.WEB_DEVELOPER
										? 'Web Developer'
										: instructor?.memberPosition === MemberPosition.MOBILE_DEVELOPER
										? 'Mobile Developer'
										: instructor?.memberPosition === MemberPosition.MACHINE_LEARNING_ENGINEER
										? 'Machine Learning Eng'
										: instructor?.memberPosition === MemberPosition.DEVOPS_ENGINEER
										? 'DevOps Engineer'
										: instructor?.memberPosition === MemberPosition.GAME_DEVELOPER
										? 'Game Developer'
										: instructor?.memberPosition === MemberPosition.GRAPHIC_DESIGNER
										? 'Graphic Designer'
										: null}
								</Typography>
							</Stack>
						</CardContent>
					</Link>
				</Card>
			</>
		);
	}
};

export default TopInstructorCard;
