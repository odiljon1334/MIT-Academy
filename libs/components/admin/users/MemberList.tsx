import React from 'react';
import Link from 'next/link';
import {
	TableCell,
	TableHead,
	TableBody,
	TableRow,
	Table,
	TableContainer,
	Button,
	Menu,
	Fade,
	MenuItem,
} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/material';
import { Member } from '../../../types/member/member';
import { REACT_APP_API_URL } from '../../../config';
import { MemberStatus, MemberType } from '../../../enums/member.enum';
import { PackageOpen } from 'lucide-react';

interface Data {
	id: string;
	nickname: string;
	fullname: string;
	phone: string;
	type: string;
	state: string;
	warning: string;
	block: string;
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
	if (b[orderBy] < a[orderBy]) {
		return -1;
	}
	if (b[orderBy] > a[orderBy]) {
		return 1;
	}
	return 0;
}

type Order = 'asc' | 'desc';

interface HeadCell {
	disablePadding: boolean;
	id: keyof Data;
	label: string;
	numeric: boolean;
}

const headCells: readonly HeadCell[] = [
	{
		id: 'id',
		numeric: true,
		disablePadding: false,
		label: 'ID',
	},
	{
		id: 'nickname',
		numeric: true,
		disablePadding: false,
		label: 'Nick Name',
	},
	{
		id: 'fullname',
		numeric: false,
		disablePadding: false,
		label: 'Full Name',
	},
	{
		id: 'phone',
		numeric: true,
		disablePadding: false,
		label: 'Phone Number',
	},
	{
		id: 'type',
		numeric: false,
		disablePadding: false,
		label: 'Member Type',
	},
	{
		id: 'warning',
		numeric: false,
		disablePadding: false,
		label: 'Warning Crimes',
	},
	{
		id: 'block',
		numeric: false,
		disablePadding: false,
		label: 'Block Crimes',
	},
	{
		id: 'state',
		numeric: false,
		disablePadding: false,
		label: 'Status',
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

function EnhancedTableHead(props: EnhancedTableProps) {
	const { onSelectAllClick } = props;

	return (
		<TableHead className={'bg-slate-700'}>
			<TableRow>
				{headCells.map((headCell) => (
					<TableCell
						key={headCell.id}
						align={headCell.numeric ? 'left' : 'center'}
						padding={headCell.disablePadding ? 'none' : 'normal'}
					>
						{headCell.label}
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	);
}

interface MemberPanelListType {
	members: Member[];
	anchorEl: any;
	menuIconClickHandler: any;
	menuIconCloseHandler: any;
	updateMemberHandler: any;
}

export const MemberPanelList = (props: MemberPanelListType) => {
	const { members, anchorEl, menuIconClickHandler, menuIconCloseHandler, updateMemberHandler } = props;

	return (
		<Stack>
			<TableContainer>
				<Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={'medium'}>
					{/*@ts-ignore*/}
					<EnhancedTableHead />
					<TableBody>
						{members.length === 0 && (
							<TableRow>
								<TableCell align="center" colSpan={8}>
									<span className={'no-data'}>
										<div className="flex flex-col items-center justify-center p-12 text-center min-h-[300px]">
											<div className="relative">
												<div className="absolute inset-0 -m-10 bg-blue-100/50 rounded-full blur-3xl opacity-30 animate-pulse" />
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

						{members.length !== 0 &&
							members.map((member: Member, index: number) => {
								const member_image = member.memberImage
									? `${REACT_APP_API_URL}/${member.memberImage}`
									: '/img/profile/defaultUser.svg';
								return (
									<TableRow hover key={member?._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
										<TableCell align="left">
											<p className="text-slate-400">{member._id}</p>
										</TableCell>

										<TableCell align="left" className={'name'}>
											<Stack direction={'row'}>
												<Link href={`/member?memberId=${member._id}`}>
													<div>
														<Avatar alt="Remy Sharp" src={member_image} sx={{ ml: '2px', mr: '10px' }} />
													</div>
												</Link>
												<Link href={`/member?memberId=${member._id}`}>
													<div className="text-slate-400">{member.memberNick}</div>
												</Link>
											</Stack>
										</TableCell>

										<TableCell align="center">
											<p className="text-slate-400">{member.memberFullName ?? '-'}</p>
										</TableCell>
										<TableCell align="left">
											<p className="bg-orange-500 text-slate-300 flex items-center py-1 justify-center rounded-full">
												{member.memberPhone}
											</p>
										</TableCell>

										<TableCell align="center">
											<Button
												variant="outlined"
												sx={{ py: '2px' }}
												color="warning"
												onClick={(e: any) => menuIconClickHandler(e, index, 'type')}
												className={'badge'}
											>
												{member.memberType}
											</Button>

											<Menu
												className={'menu-modal'}
												MenuListProps={{
													'aria-labelledby': 'fade-button',
												}}
												anchorEl={anchorEl[index]?.anchor}
												open={Boolean(anchorEl[index]) && anchorEl[index]?.field === 'type'}
												onClose={menuIconCloseHandler}
												TransitionComponent={Fade}
												sx={{ p: 1 }}
											>
												{Object.values(MemberType)
													.filter((ele) => ele !== member?.memberType)
													.map((type: string) => (
														<MenuItem
															onClick={() => updateMemberHandler({ _id: member._id, memberType: type })}
															key={type}
														>
															<Typography variant={'subtitle1'} component={'span'}>
																{type}
															</Typography>
														</MenuItem>
													))}
											</Menu>
										</TableCell>

										<TableCell align="center">
											<p className="text-orange-500">{member.memberWarnings}</p>
										</TableCell>
										<TableCell align="center">
											<p className="text-orange-500">{member.memberBlocks}</p>
										</TableCell>
										<TableCell align="center">
											<Button
												onClick={(e: any) => menuIconClickHandler(e, index, 'status')}
												variant="outlined"
												sx={{ py: '2px', width: 90 }}
												color={member.memberStatus === MemberStatus.BLOCK ? 'error' : 'success'}
												className={'badge'}
											>
												{member.memberStatus}
											</Button>

											<Menu
												className={'menu-modal'}
												MenuListProps={{
													'aria-labelledby': 'fade-button',
												}}
												anchorEl={anchorEl[index]?.anchor}
												open={Boolean(anchorEl[index]) && anchorEl[index]?.field === 'status'}
												onClose={menuIconCloseHandler}
												TransitionComponent={Fade}
												sx={{ p: 1 }}
											>
												{Object.values(MemberStatus)
													.filter((ele: string) => ele !== member?.memberStatus)
													.map((status: string) => (
														<MenuItem
															onClick={() => updateMemberHandler({ _id: member._id, memberStatus: status })}
															key={status}
														>
															<Typography variant={'subtitle1'} component={'span'}>
																{status}
															</Typography>
														</MenuItem>
													))}
											</Menu>
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
