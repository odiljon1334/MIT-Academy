import React from 'react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import {
	Stack,
	Box,
	Typography,
	CardMedia,
	Card,
	CardActionArea,
	CardContent,
	CardActions,
	Chip,
	Avatar,
	Tooltip,
	Divider,
} from '@mui/material';
import Link from 'next/link';
import { REACT_APP_API_URL } from '../../config';
import IconButton from '@mui/material/IconButton';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import FaceIcon from '@mui/icons-material/Face';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { green } from '@mui/material/colors';

interface AgentCardProps {
	agent: any;
	likeMemberHandler?: any;
}

const AgentCard = (props: AgentCardProps) => {
	const { agent, likeMemberHandler } = props;
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const imagePath: string = agent?.memberImage
		? `${REACT_APP_API_URL}/${agent?.memberImage}`
		: '/img/profile/defaultUser.svg';

	if (device === 'mobile') {
		return <div>AGENT CARD</div>;
	} else {
		return (
			<>
				<div className="p-3 flex flex-row flex-wrap">
					<Card variant={'outlined'} className="w-[345px] rounded-xl flex flex-col items-center">
						<CardActionArea>
							<Link
								href={{
									pathname: '/agent/detail',
									query: { agentId: agent?._id },
								}}
							>
								<CardMedia
									className="h-[250px] object-cover"
									component="img"
									image={`${imagePath}`}
									alt="Instructor image"
								/>
								<CardContent className="flex flex-row items-center justify-between dark:bg-slate-900">
									<Typography gutterBottom component="div" className="space-y-2">
										<strong className="text-md font-openSans font-semibold">
											{agent?.memberFullName ?? agent?.memberNick}
										</strong>
										<p className="text-md font-openSans font-normal dark:text-gray-400 text-gray-500">UI/UX Design</p>
									</Typography>
									<Stack direction="row" spacing={2}>
										<Tooltip className="rounded-md" title="Instructor Properties">
											<Avatar sx={{ bgcolor: green[500] }}>
												<span className="text-md font-openSans font-normal">{agent?.memberProperties}</span>
												<AssignmentIcon />
											</Avatar>
										</Tooltip>
									</Stack>
								</CardContent>
							</Link>
						</CardActionArea>
						<CardActions className="flex flex-col dark:bg-slate-900 w-full">
							<Divider sx={{ width: 320, height: 2, marginBottom: 2 }} />
							<Box component={'div'} className={'flex items-center justify-between space-x-[110px]'}>
								<Stack direction="row" spacing={1}>
									<Chip
										icon={<FaceIcon className="text-slate-600" />}
										label="Instructor"
										color="success"
										variant="outlined"
									/>
								</Stack>
								<div className="flex flex-row items-center">
									<IconButton color={'default'}>
										<RemoveRedEyeIcon />
									</IconButton>
									<Typography className="view-cnt">{agent?.memberViews}</Typography>
									<IconButton onClick={() => likeMemberHandler(user, agent?._id)} color={'default'}>
										{agent?.meLiked && agent?.meLiked[0]?.myFavorite ? (
											<FavoriteIcon color={'primary'} />
										) : (
											<FavoriteBorderIcon />
										)}
									</IconButton>
									<Typography className="view-cnt">{agent?.memberLikes}</Typography>
								</div>
							</Box>
						</CardActions>
					</Card>
				</div>
			</>
		);
	}
};

export default AgentCard;
