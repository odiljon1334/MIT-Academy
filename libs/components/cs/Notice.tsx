import React from 'react';
import { Stack, Box, Divider } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';

const Notice = () => {
	const device = useDeviceDetect();

	/** APOLLO REQUESTS **/
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
						{data.map((ele: any) => (
							<div className={`notice-card ${ele?.event && 'dark:bg-lime-700/50 bg-neutral-200'}`} key={ele.title}>
								{ele?.event ? (
									<div>event</div>
								) : (
									<span className={'notice-number dark:text-slate-400 text-slate-600'}>{ele.no}</span>
								)}
								<span className={'notice-title dark:text-slate-400 text-slate-700'}>{ele.title}</span>
								<span className={'notice-date dark:text-slate-400 text-slate-600'}>{ele.date}</span>
							</div>
						))}
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default Notice;
