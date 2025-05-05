import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { Badge, Button, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { Activity, RefreshCw } from 'lucide-react';
import { getJwtToken } from '../../../libs/auth';
import { useRouter } from 'next/router';
import { NoticeCategory } from '../../../libs/enums/notice.enum';
import { useMutation } from '@apollo/client';
import { CREATE_NOTICE } from '../../../apollo/admin/mutation';
import { Message } from '../../../libs/enums/common.enum';
import { T } from '../../../libs/types/common';
import { sweetErrorHandling, sweetTopSuccessAlert } from '../../../libs/sweetAlert';
import { useState } from 'react';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';

const FaqCreate = () => {
	const token = getJwtToken(),
		router = useRouter();
	const [noticeTitle, setNoticeTitle] = useState('');
	const [noticeContent, setNoticeContent] = useState('');

	const [noticeCategory, setNoticeCategory] = useState<NoticeCategory>(NoticeCategory.NOTICE);

	/** APOLLO REQUESTS **/
	const [createNoticeFaq] = useMutation(CREATE_NOTICE);
	console.log('noticeContent', noticeContent);

	const changeCategoryHandler = (e: any) => {
		setNoticeCategory(e.target.value);
	};

	const noticeTitleHandler = (e: T) => {
		setNoticeTitle(e.target.value);
	};

	const noticeContentHandler = (e: T) => {
		setNoticeContent(e.target.value);
	};

	const handleRegisterButton = async () => {
		try {
			setNoticeContent(noticeContent);

			if (noticeContent === '' && noticeTitle === '') {
				throw new Error(Message.INSERT_ALL_INPUTS);
			}

			await createNoticeFaq({
				variables: {
					input: { noticeCategory, noticeTitle, noticeContent },
				},
			});

			await sweetTopSuccessAlert('Notice is created successfully', 700);
			await router.push({
				pathname: '/_admin/cs/notice',
			});
		} catch (err: any) {
			console.log(err);
			sweetErrorHandling(new Error(Message.INSERT_ALL_INPUTS)).then();
		}
	};

	return (
		<Stack className="w-full flex flex-col gap-10">
			<Stack
				component={'div'}
				className={'flex flex-row justify-between w-full p-4 border-b-[1.5px] border-solid border-cyan-600'}
			>
				<div className="flex flex-row items-center justify-between">
					<Typography variant={'h2'} className={'tit flex items-center'} sx={{}}>
						<Activity className="mr-2 h-5 w-5 text-cyan-500" />
						Create Notice
					</Typography>
					<div className="flex items-center space-x-2">
						<Badge
							variant="outline"
							className="flex flex-row items-center justify-center border-2 border-solid rounded-full w-[55px] p-0.5 bg-slate-800/50 text-cyan-400 border-cyan-500/50 text-xs"
						>
							<div className="h-1.5 w-1.5 rounded-full bg-cyan-500 mr-1 animate-pulse"></div>
							LIVE
						</Badge>
						<Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
							<RefreshCw className="h-4 w-4" />
						</Button>
					</div>
				</div>
			</Stack>
			<Stack
				component={'div'}
				className="w-full flex flex-row justify-between p-4 border-[1.5px] border-solid border-cyan-600 rounded"
			>
				<div className="flex flex-row items-center justify-around">
					<Box style={{ width: '300px' }} className="form_row p-4">
						<Typography style={{ marginBottom: '20px' }} variant="h5" className="text-neutral-800 dark:text-slate-200">
							Category
						</Typography>
						<FormControl className="rounded-[10px]" sx={{ minWidth: '100%' }} size="medium" color="info">
							<InputLabel id="demo-select-small-label">Category</InputLabel>
							<Select
								variant="outlined"
								labelId="demo-select-small-label"
								id="demo-select-small"
								value={noticeCategory}
								onChange={changeCategoryHandler}
								label="category"
								sx={{ borderRadius: '8px', outline: 'none', color: 'white' }}
							>
								<MenuItem value={NoticeCategory.FAQ}>FAQ</MenuItem>
								<MenuItem value={NoticeCategory.TERMS}>TERMS</MenuItem>
								<MenuItem value={NoticeCategory.INQUIRY}>INQUIRY</MenuItem>
								<MenuItem value={NoticeCategory.NOTICE}>NOTICE</MenuItem>
							</Select>
						</FormControl>
					</Box>
					<Box component={'div'} style={{ width: '300px', flexDirection: 'column' }}>
						<Typography style={{ marginBottom: '20px' }} variant="h5" className="text-neutral-800 dark:text-slate-200">
							Title
						</Typography>
						<input
							onChange={noticeTitleHandler}
							id="filled-basic"
							value={noticeTitle}
							style={{ width: '280px', outline: 'none', background: 'none' }}
							className="border border-solid border-neutral-400 dark:border-neutral-600 rounded-[8px] text-neutral-900 dark:text-slate-200 p-4"
						/>
					</Box>
				</div>
				<Stack className="border-t-[1.5px] border-solid border-cyan-600 p-6 mt-5 gap-3">
					<Typography variant={'h5'} className="font-serif font-semibold text-neutral-900 dark:text-slate-200">
						Content
					</Typography>
					<textarea
						name=""
						id=""
						className="text-slate-950 rounded-md h-[150px] px-2"
						value={noticeContent}
						onChange={noticeContentHandler}
					></textarea>
				</Stack>

				<Stack direction="row" justifyContent="center">
					<Button
						variant="contained"
						className="bg-lime-700 hover:bg-lime-600 rounded-lg font-openSans font-semibold "
						style={{ margin: '30px', width: '180px', height: '45px', borderRadius: '8px' }}
						onClick={handleRegisterButton}
					>
						Register
					</Button>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default withAdminLayout(FaqCreate);
