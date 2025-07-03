import { Box, Typography, Card, CardContent, Avatar, Button, Divider } from '@mui/material';
import { useMutation, useReactiveVar } from '@apollo/client';
import { formatDistanceToNow } from 'date-fns';
import { Notification } from '../../types/notification/notification';
import { useEffect } from 'react';
import { T } from '../../types/common';
import { Messages, REACT_APP_API_URL } from '../../config';
import { PackageOpen } from 'lucide-react';
import { UPDATE_NOTIFICATIONS } from '../../../apollo/user/mutation';
import { sweetErrorHandling, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import { NotificationStatus } from '../../enums/notification.enum';
import { notificationsVar, userVar } from '../../../apollo/store';
import React from 'react';

const NotificationCardPage = () => {
	const user = useReactiveVar(userVar);
	const [notifications, setNotifications] = React.useState<Notification[]>([]);
	const [notificationCount, setNotificationCount] = React.useState<number>(0);

	const notificationsList = useReactiveVar(notificationsVar);

	const [updateNotification] = useMutation(UPDATE_NOTIFICATIONS);

	useEffect(() => {
		// @ts-ignore
		setNotifications(notificationsList?.list ?? []);
		setNotificationCount(notificationsList?.metaCounter[0]?.total ?? 0);
	}, [notificationsList, user]);

	/** HANDLERS **/
	const updateNotifications = async (user: any, notificationId: any) => {
		try {
			if (!notificationId) return;
			if (!user._id) throw new Error(Messages.error2);
			await updateNotification({
				variables: {
					input: {
						receiverId: user?._id,
						notificationStatus: 'READ',
					},
				},
			});
			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			sweetErrorHandling(err).then();
			console.error(err);
		}
	};

	return (
		<Box className=" bg-slate-900 border border-solid dark:border-neutral-600 rounded max-w-2xl mx-auto p-4">
			<Typography variant="h5" className="mb-4 font-bold text-center text-white">
				Notifications
			</Typography>
			{notifications.length === 0 && (
				<Typography className="text-center text-gray-500">
					<Divider className="mb-4" />
					<div className="flex flex-col items-center justify-center p-8 text-center">
						<div className="relative">
							<div className="absolute inset-0 -m-10 bg-blue-100/50 rounded-full blur-3xl opacity-30 animate-pulse"></div>
							<div className="relative rounded-full bg-white p-6 mb-4 shadow-lg border border-indigo-100 transform transition-all duration-300 hover:scale-105">
								<PackageOpen className="h-10 w-10 text-indigo-500" />
							</div>
						</div>
						<Typography variant="h5" className="text-neutral-800 dark:text-slate-200 font-semibold mb-3 mt-2">
							No Notification!
						</Typography>
						<div className="w-full max-w-xs h-1 bg-gradient-to-r from-transparent via-indigo-200 to-transparent rounded-full"></div>
					</div>
				</Typography>
			)}

			{notifications.map((notif: Notification) => (
				<Card key={notif._id} className="mb-4 shadow-md rounded bg-slate-800">
					<CardContent className="flex gap-4 items-center">
						<Avatar
							sx={{ width: 50, height: 50 }}
							src={`${REACT_APP_API_URL}/${notif?.authorData?.memberImage}`}
							alt={`${notif?.authorData?.memberNick || 'User'}`}
						/>
						<Box className="flex-1">
							<Typography variant="subtitle1" className="font-openSans font-semibold text-white">
								{notif.notificationTitle}
							</Typography>
							<Typography variant="body2" className="flex flex-row text-gray-400">
								{notif.authorData?.memberNick}
								{notif.notificationType === 'LIKE'
									? ` ❤️${notif?.notificationDesc || ''}`
									: notif.notificationType === 'COMMENT'
									? ` 💬 ${notif?.notificationDesc || ''}`
									: notif.notificationType === 'FOLLOW'
									? ` 🫂 ${notif?.notificationDesc || ''}`
									: ''}
								{notif.courseData?.courseTitle && `: "${notif.courseData.courseTitle}"`}
							</Typography>
							<Typography variant="caption" className="text-gray-400">
								{formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
							</Typography>
						</Box>
						{notif.notificationStatus === 'WAIT' && (
							<span className="text-xs bg-red-100 px-2 py-1 rounded-full text-red-500">New</span>
						)}
					</CardContent>
					<div className="flex justify-center p-4">
						<Button
							variant="contained"
							className="text-sm font-normal rounded"
							color="inherit"
							onClick={() => updateNotifications(user, notif._id)}
							disabled={!notifications.some((n: Notification) => n.notificationStatus === NotificationStatus.WAIT)}
						>
							Mark as read
						</Button>
					</div>
				</Card>
			))}
		</Box>
	);
};

NotificationCardPage.defaultProps = {
	initialInput: {
		page: 1,
		limit: 4,
		sort: 'createdAt',
		direction: 'DESC',
		search: {},
	},
};

export default NotificationCardPage;
