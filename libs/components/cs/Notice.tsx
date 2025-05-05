import React, { useState } from 'react';
import { Stack, Box, Divider } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { GET_NOTICES } from '../../../apollo/admin/query';
import { useQuery } from '@apollo/client';
import type { Notice } from '../../types/notice/notice';
import { T } from '../../types/common';
import { NoticeInquiry } from '../../types/notice/notice.input';
import Moment from 'react-moment';

interface NoticeProps {
	initialInput: NoticeInquiry;
}

const Notice = ({ initialInput = { page: 1, limit: 10, sort: 'createdAt', search: {} } }: NoticeProps) => {
	const [noticeData, setNoticeData] = useState<Notice[]>([]);
	const device = useDeviceDetect();

	/** APOLLO REQUESTS **/
	// GraphQL query for property data
	const {
		loading: getNoticeLoading,
		data: getNoticeData,
		error: getNoticeError,
		refetch: getNoticeRefetch,
	} = useQuery(GET_NOTICES, {
		fetchPolicy: 'cache-and-network',
		variables: { input: initialInput },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setNoticeData(data?.getNotices?.list);
		},
	});

	const notices: Notice[] = getNoticeData?.getNotices?.list || [];
	console.log('notices', notices);

	/** LIFECYCLES **/
	/** HANDLERS **/

	const data = [
		{
			no: 1,
			event: true,
			title: 'Register to use and get discounts',
			date: '01.03.2024',
		},
		{
			no: 2,
			title: "It's absolutely free to upload and trade properties",
			date: '31.03.2024',
		},
	];

	if (device === 'mobile') {
		return <div>NOTICE MOBILE</div>;
	} else {
		return (
			<Stack className={'notice-content'}>
				<span className={'title text-neutral-800 dark:text-slate-200'}>Notice</span>
				<Stack
					className={
						'main border border-solid border-neutral-300 dark:border-neutral-600 rounded-lg dark:bg-slate-950/50 bg-neutral-50/50'
					}
				>
					<Box component={'div'} className={'top'}>
						<span className="text-neutral-800 dark:text-slate-200">number</span>
						<span className="text-neutral-800 dark:text-slate-200">title</span>
						<span className="text-neutral-800 dark:text-slate-200">date</span>
					</Box>
					<Divider />
					<Stack className={'bottom'}>
						{notices.map((ele: Notice, index: number) => (
							<div
								className={`notice-card ${
									ele?.event
										? 'dark:bg-lime-700/50 bg-neutral-200'
										: 'dark:bg-gray-800/50 border-b border-solid border-slate-600 bg-neutral-200'
								}`}
								key={ele._id}
							>
								{ele?.event ? (
									<div>event</div>
								) : (
									<span className={'notice-number dark:text-slate-400 text-slate-600'}>{index + 1}</span>
								)}
								<span className={'notice-title dark:text-slate-400 text-slate-700'}>{ele.noticeContent}</span>
								<span className={'notice-date dark:text-slate-400 text-slate-600'}>
									<Moment className="text-slate-500" format={'DD.MM.YY'}>
										{ele?.createdAt}
									</Moment>
								</span>
							</div>
						))}
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default Notice;
