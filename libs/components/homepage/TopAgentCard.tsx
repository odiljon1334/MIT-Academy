import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/router';
import { Box, Stack } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Member } from '../../types/member/member';
import Link from 'next/link';
import { Padding } from '@mui/icons-material';
import { Radius } from 'lucide-react';

interface TopAgentProps {
	agent: Member;
}
const TopAgentCard = (props: TopAgentProps) => {
	const { agent } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const agentImage = agent?.memberImage
		? `${process.env.REACT_APP_API_URL}/${agent?.memberImage}`
		: '/img/profile/defaultUser.svg';

	/** HANDLERS **/

	if (device === 'mobile') {
		return (
			<Stack className="top-agent-card">
				<img src={agentImage} alt="" />
				<strong>{agent?.memberNick}</strong>
				<span>{agent?.memberType}</span>
			</Stack>
		);
	} else {
		return (
			<>
				<Card variant={'outlined'} sx={{ width: 500, borderRadius: '16px', cursor: 'pointer' }}>
					<Link
						href={{
							pathname: '/agent/detail',
							query: { agentId: agent?._id },
						}}
					>
						<Box className="p-4 dark:bg-slate-950">
							<CardMedia
								sx={{ width: 'auto', height: 210, objectFit: 'cover', borderRadius: '10px' }}
								image={agentImage}
								title="agent image"
							/>
						</Box>
						<CardContent className="flex flex-col items-center p-1 dark:bg-slate-950">
							<Typography className="text-md font-openSans font-normal" variant="h6" component="div">
								{agent?.memberNick}
							</Typography>
							<Typography variant="body2" sx={{ color: 'text.secondary' }}>
								{agent?.memberType}
							</Typography>
						</CardContent>
					</Link>
				</Card>
			</>
		);
	}
};

export default TopAgentCard;
