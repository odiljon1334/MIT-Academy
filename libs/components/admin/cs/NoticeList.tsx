import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
	TableCell,
	TableHead,
	TableBody,
	TableRow,
	Table,
	TableContainer,
	Button,
	Box,
	Checkbox,
	Toolbar,
	MenuItem,
	Menu,
	Fade,
} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import { IconButton, Tooltip } from '@mui/material';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/material';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { NotePencil } from 'phosphor-react';
import { NoticeInquiry } from '../../../types/notice/notice.input';
import { Notice } from '../../../types/notice/notice';
import { REACT_APP_API_URL } from '../../../config';
import Moment from 'react-moment';
import { AlignCenter, PackageOpen } from 'lucide-react';
import { NoticeStatus } from '../../../enums/notice.enum';

type Order = 'asc' | 'desc';

interface Data {
	category: string;
	title: string;
	id: string;
	writer: string;
	date: string;
	view: number;
	action: string;
}
interface HeadCell {
	disablePadding: boolean;
	id: keyof Data;
	label: string;
	numeric: boolean;
}

const headCells: readonly HeadCell[] = [
	{
		id: 'category',
		numeric: true,
		disablePadding: false,
		label: 'Category',
	},
	{
		id: 'title',
		numeric: true,
		disablePadding: false,
		label: 'TITLE',
	},
	{
		id: 'id',
		numeric: true,
		disablePadding: false,
		label: 'ID',
	},
	{
		id: 'writer',
		numeric: true,
		disablePadding: false,
		label: 'WRITER',
	},
	{
		id: 'date',
		numeric: true,
		disablePadding: false,
		label: 'DATE',
	},
	{
		id: 'view',
		numeric: true,
		disablePadding: false,
		label: 'VIEW',
	},
	{
		id: 'action',
		numeric: false,
		disablePadding: false,
		label: 'ACTION',
	},
];

interface EnhancedTableProps {
	numSelected: number;
	onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
	onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
	order: Order;
	orderBy: string;
	rowCount: number;
}

interface EnhancedTableToolbarProps {
	numSelected: number;
	onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
	onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
	order: Order;
	orderBy: string;
	rowCount: number;
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
	const [select, setSelect] = useState('');
	const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;

	return (
		<>
			{numSelected > 0 ? (
				<>
					<Toolbar>
						<Box component={'div'}>
							<Box component={'div'} className="flex_box">
								<Checkbox
									color="primary"
									indeterminate={numSelected > 0 && numSelected < rowCount}
									checked={rowCount > 0 && numSelected === rowCount}
									onChange={onSelectAllClick}
									inputProps={{
										'aria-label': 'select all',
									}}
								/>
								<Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="h6" component="div">
									{numSelected} selected
								</Typography>
							</Box>
							<Button variant={'text'} size={'large'}>
								Delete
							</Button>
						</Box>
					</Toolbar>
				</>
			) : (
				<TableHead>
					<TableRow>
						<TableCell padding="checkbox">
							<Checkbox
								color="primary"
								indeterminate={numSelected > 0 && numSelected < rowCount}
								checked={rowCount > 0 && numSelected === rowCount}
								onChange={onSelectAllClick}
								inputProps={{
									'aria-label': 'select all',
								}}
							/>
						</TableCell>
						{headCells.map((headCell) => (
							<TableCell
								key={headCell.id}
								align={headCell.numeric ? 'left' : 'right'}
								padding={headCell.disablePadding ? 'none' : 'normal'}
							>
								{headCell.label}
							</TableCell>
						))}
					</TableRow>
				</TableHead>
			)}
			{numSelected > 0 ? null : null}
		</>
	);
};

interface NoticeListType {
	dense?: boolean;
	updateNoticeHandler: any;
	membersData?: any;
	noticeData: Notice[];
	anchorEl?: any;
	handleMenuIconClick?: any;
	handleMenuIconClose?: any;
	removeNoticeHandler: any;
	generateMentorTypeHandle?: any;
}

export const NoticeList = (props: NoticeListType) => {
	const {
		dense,
		membersData,
		noticeData,
		updateNoticeHandler,
		anchorEl,
		handleMenuIconClick,
		handleMenuIconClose,
		removeNoticeHandler,
		generateMentorTypeHandle,
	} = props;
	const router = useRouter();

	/** APOLLO REQUESTS **/

	return (
		<Stack>
			<TableContainer>
				<Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={dense ? 'small' : 'medium'}>
					{/*@ts-ignore*/}
					<EnhancedTableToolbar />
					<TableBody>
						{noticeData && noticeData?.length === 0 && (
							<TableRow>
								<TableCell align="center" colSpan={8}>
									<span className={'no-data'}>
										<div className="flex flex-col items-center justify-center p-12 text-center min-h-[200px]">
											<div className="relative">
												<div className="absolute inset-0 -m-10 bg-blue-100/50 rounded-full blur-3xl opacity-30 animate-pulse"></div>
												<div className="relative rounded-full bg-white p-6 mb-6 shadow-lg border border-indigo-100 transform transition-all duration-300 hover:scale-105">
													<PackageOpen className="h-14 w-14 text-indigo-500" />
												</div>
											</div>
											<Typography variant="h4" className="dark:text-slate-300 text-slate-950 font-semibold mb-3 mt-2">
												No Data Found!
											</Typography>
											<div className="w-full max-w-xs h-1 bg-gradient-to-r from-transparent via-indigo-200 to-transparent rounded-full"></div>
										</div>
									</span>
								</TableCell>
							</TableRow>
						)}
						{noticeData &&
							noticeData.length !== 0 &&
							noticeData.map((notice: Notice, index: number) => {
								const member_image = membersData?.memberImage
									? `${REACT_APP_API_URL}/${membersData?.memberImage}`
									: '/img/profile/defaultUser.svg';

								return (
									<TableRow
										hover
										key={notice._id}
										sx={{
											'&:last-child td, &:last-child th': {
												border: 0,
											},
										}}
									>
										<TableCell padding="checkbox">
											<Checkbox color="primary" />
										</TableCell>
										<TableCell align="left">
											<p className="text-lime-600">{notice?.noticeCategory}</p>
										</TableCell>
										<TableCell align="left">
											<p className="text-slate-400">{notice?.noticeTitle}</p>
										</TableCell>
										<TableCell align="left">
											<p className="text-slate-400">{notice?._id}</p>
										</TableCell>
										<TableCell align="left">
											<p className="text-slate-400">{membersData?.memberNick}</p>
										</TableCell>
										<TableCell align="left" className={'name'}>
											<Stack direction={'row'}>
												<Link href={`/_admin/users/detail?mb_id=${membersData?._id}`}>
													<div>
														<Avatar alt="Remy Sharp" src={member_image} sx={{ ml: '2px', mr: '10px' }} />
													</div>
												</Link>
												<Link href={`/_admin/users/detail?mb_id=${membersData?._id}`}>
													<Moment className="text-slate-500" format={'DD.MM.YY'}>
														{notice?.createdAt}
													</Moment>
												</Link>
											</Stack>
										</TableCell>
										<TableCell align="left">
											<p className="text-slate-400">{membersData?.memberViews}</p>
										</TableCell>
										<TableCell align="right" className="relative">
											{notice?.noticeStatus === NoticeStatus.HOLD && (
												<>
													<Button
														variant="outlined"
														sx={{ py: '2px' }}
														color="warning"
														className={'badge'}
														onClick={(e: any) => handleMenuIconClick(e, index)}
													>
														{notice.noticeStatus}
													</Button>
													<Menu
														className={'menu-modal relative'}
														MenuListProps={{
															'aria-labelledby': 'fade-button',
														}}
														anchorEl={anchorEl[index]}
														open={Boolean(anchorEl[index])}
														onClose={handleMenuIconClose}
														TransitionComponent={Fade}
														sx={{ p: 1, position: 'absolute', left: '1430px', top: '-290px' }}
													>
														{Object.values(NoticeStatus)
															.filter((ele) => ele !== notice.noticeStatus)
															.map((status: string) => (
																<MenuItem
																	onClick={() => updateNoticeHandler({ _id: notice._id, noticeStatus: status })}
																	key={status}
																>
																	<Typography variant={'subtitle1'} component={'span'}>
																		{status}
																	</Typography>
																</MenuItem>
															))}
													</Menu>
												</>
											)}

											{notice?.noticeStatus === NoticeStatus.DELETE && (
												<>
													<Button
														variant="outlined"
														sx={{ py: '2px' }}
														color="primary"
														className={'badge outline-none'}
														onClick={(e: any) => handleMenuIconClick(e, index)}
													>
														{notice.noticeStatus}
													</Button>

													<Menu
														className={'menu-modal'}
														MenuListProps={{
															'aria-labelledby': 'fade-button',
														}}
														anchorEl={anchorEl[index]}
														open={Boolean(anchorEl[index])}
														onClose={handleMenuIconClose}
														TransitionComponent={Fade}
														sx={{ p: 1, position: 'absolute', left: '1360px', top: '-290px' }}
													>
														{Object.values(NoticeStatus)
															.filter((ele) => ele !== notice.noticeStatus)
															.map((status: string) => (
																<MenuItem
																	onClick={() => updateNoticeHandler({ _id: notice._id, noticeStatus: status })}
																	key={status}
																>
																	<Typography variant={'subtitle1'} component={'span'}>
																		{status}
																	</Typography>
																</MenuItem>
															))}
													</Menu>
												</>
											)}

											{notice?.noticeStatus === NoticeStatus.ACTIVE && (
												<>
													<Button
														variant="outlined"
														sx={{ py: '2px' }}
														color="success"
														onClick={(e: any) => handleMenuIconClick(e, index)}
														className={'badge'}
													>
														{notice.noticeStatus}
													</Button>

													<Menu
														className={'relative'}
														MenuListProps={{
															'aria-labelledby': 'fade-button',
														}}
														anchorEl={anchorEl[index]}
														open={Boolean(anchorEl[index])}
														onClose={handleMenuIconClose}
														TransitionComponent={Fade}
														sx={{ p: 1, position: 'absolute', left: '1430px', top: '-290px' }}
													>
														{Object.values(NoticeStatus)
															.filter((ele) => ele !== notice.noticeStatus)
															.map((status: string) => (
																<MenuItem
																	className="relative"
																	key={status}
																	onClick={() => updateNoticeHandler({ _id: notice._id, noticeStatus: status })}
																>
																	<Typography variant={'subtitle1'} component={'span'}>
																		{status}
																	</Typography>
																</MenuItem>
															))}
													</Menu>
												</>
											)}
										</TableCell>
										<TableCell align="left">
											<Tooltip title={'delete'}>
												<IconButton>
													{notice?.noticeStatus === NoticeStatus.DELETE && (
														<Button
															variant="outlined"
															sx={{
																p: '3px',
																border: 'none',
																':hover': { border: 'none' },
																background: 'none',
																outline: 'none',
															}}
															onClick={() => removeNoticeHandler(notice._id)}
														>
															<DeleteRoundedIcon />
														</Button>
													)}
												</IconButton>
											</Tooltip>
											<Tooltip title="edit">
												<IconButton onClick={() => router.push(`/_admin/cs/notice_create?id=${notice._id}`)}>
													<NotePencil size={24} weight="fill" />
												</IconButton>
											</Tooltip>
										</TableCell>
									</TableRow>
								);
							})}
					</TableBody>
				</Table>
			</TableContainer>
		</Stack>
	);
};

NoticeList.defaultProps = {
	initialInput: {
		page: 1,
		limit: 4,
		sort: 'createdAt',
		direction: 'DESC',
		search: {},
	},
};
