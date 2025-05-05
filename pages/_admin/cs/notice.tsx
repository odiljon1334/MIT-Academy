import React, { useCallback, useEffect, useState } from 'react';
import type { NextPage } from 'next';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import { Box, Button, InputAdornment, Stack } from '@mui/material';
import { List, ListItem } from '@mui/material';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { TabContext } from '@mui/lab';
import OutlinedInput from '@mui/material/OutlinedInput';
import TablePagination from '@mui/material/TablePagination';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import { NoticeList } from '../../../libs/components/admin/cs/NoticeList';
import { NoticeInputUpdate, NoticeInquiry } from '../../../libs/types/notice/notice.input';
import { useMutation, useQuery } from '@apollo/client';
import { GET_NOTICES } from '../../../apollo/admin/query';
import { T } from '../../../libs/types/common';
import { Notice } from '../../../libs/types/notice/notice';
import { useRouter } from 'next/router';
import { Member } from '../../../libs/types/member/member';
import { NoticeCategory, NoticeStatus } from '../../../libs/enums/notice.enum';
import { REMOVE_NOTICE, UPDATE_NOTICE } from '../../../apollo/admin/mutation';
import { sweetConfirmAlert, sweetErrorHandling } from '../../../libs/sweetAlert';
import { SearchIcon } from 'lucide-react';

interface NoticeProps {
	initialInput: NoticeInquiry;
}

const AdminNotice: NextPage<NoticeProps> = ({ initialInput }) => {
	const [noticeInquiry, setNoticeInquiry] = useState<NoticeInquiry>(initialInput);
	const [anchorEl, setAnchorEl] = useState<[] | HTMLElement[]>([]);
	const [noticeData, setNoticeData] = useState<Notice[]>([]);
	const [value, setValue] = useState(noticeInquiry?.search?.typeList ? noticeInquiry?.search?.typeList : 'ALL');
	const [noticeTotal, setNoticeTotal] = useState<number>(0);
	const router = useRouter();

	const [searchText, setSearchText] = useState('');
	const [searchType, setSearchType] = useState('ALL');

	const [updateNoticeByAdmin] = useMutation(UPDATE_NOTICE);
	const [removeNoticeByAdmin] = useMutation(REMOVE_NOTICE);

	/** APOLLO REQUESTS **/
	const {
		loading: getNoticesLoading,
		data: getNoticesData,
		error: getNoticesError,
		refetch: getNoticesRefetch,
	} = useQuery(GET_NOTICES, {
		fetchPolicy: 'cache-and-network',
		variables: { input: initialInput },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setNoticeData(data?.getNotices?.list);
			setNoticeTotal(data?.getNotices?.metaCounter[0]?.total ?? 0);
		},
	});

	const notices: Notice[] = getNoticesData?.getNotices?.list || [];
	const membersData: Member[] = getNoticesData?.getNotices?.list?.[0]?.memberData || [];
	/** LIFECYCLES **/
	useEffect(() => {
		getNoticesRefetch({ input: noticeInquiry }).then();
	}, [noticeInquiry, value]);
	/** HANDLERS **/
	const changePageHandler = async (event: unknown, newPage: number) => {
		noticeInquiry.page = newPage + 1;
		setNoticeInquiry({ ...noticeInquiry });
	};

	const changeRowsPerPageHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
		noticeInquiry.limit = parseInt(event.target.value, 10);
		noticeInquiry.page = 1;
		setNoticeInquiry({ ...noticeInquiry });
	};

	const handleMenuIconClick = (event: React.MouseEvent, index: number, field: 'type' | 'status') => {
		setAnchorEl((prev: any) => {
			const newAnchor = { ...prev };
			newAnchor[index] = { anchor: event.currentTarget, field };
			return newAnchor;
		});
	};

	const handleMenuIconClose = () => {
		setAnchorEl([]);
	};

	const updateNoticeHandler = async (updateData: NoticeInputUpdate) => {
		try {
			await updateNoticeByAdmin({
				variables: {
					input: updateData,
				},
			});
			handleMenuIconClose();
			await getNoticesRefetch({ input: noticeInquiry });
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};

	const removeNoticeHandler = async (id: string) => {
		try {
			if (await sweetConfirmAlert('Are you sure to remove?')) {
				await removeNoticeByAdmin({ variables: { input: id } });
				await getNoticesRefetch({ input: noticeInquiry });
			}
			handleMenuIconClose();
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};

	const textHandler = useCallback((value: string) => {
		try {
			setSearchText(value);
		} catch (err: any) {
			console.log('textHandler: ', err.message);
		}
	}, []);

	const searchTextHandler = () => {
		try {
			setNoticeInquiry({
				...noticeInquiry,
				search: {
					...noticeInquiry.search,
					text: searchText,
				},
			});
		} catch (err: any) {
			console.log('searchTextHandler: ', err.message);
		}
	};

	const searchTypeHandler = async (newValue: string) => {
		try {
			setSearchType(newValue);

			if (newValue !== 'ALL') {
				setNoticeInquiry({
					...noticeInquiry,
					page: 1,
					sort: 'createdAt',
					search: {
						...noticeInquiry.search,
						categoryList: [newValue as NoticeCategory],
					},
				});
			} else {
				delete noticeInquiry?.search?.categoryList;
				setNoticeInquiry({ ...noticeInquiry });
			}
		} catch (err: any) {
			console.log('searchTypeHandler: ', err.message);
		}
	};

	const handleTabChange = async (event: any, newValue: string) => {
		setValue(newValue);
		setSearchText('');

		setNoticeInquiry({ ...noticeInquiry, page: 1, sort: 'createdAt' });

		switch (newValue) {
			case 'ACTIVE':
				setNoticeInquiry({ ...noticeInquiry, search: { typeList: [NoticeStatus.ACTIVE] } });
				break;
			case 'HOLD':
				setNoticeInquiry({ ...noticeInquiry, search: { typeList: [NoticeStatus.HOLD] } });
				break;
			case 'DELETE':
				setNoticeInquiry({ ...noticeInquiry, search: { typeList: [NoticeStatus.DELETE] } });
				break;
			default:
				delete noticeInquiry?.search?.typeList;
				setNoticeInquiry({ ...noticeInquiry });
				break;
		}
	};

	const handleRedirect = () => {
		router.push('/_admin/cs/faq_create');
	};

	return (
		// @ts-ignore
		<Box component={'div'} className={'content'}>
			<Box component={'div'} className={'title flex_space'}>
				<Typography variant={'h2'}>Notice Management</Typography>
				<Button
					className="btn_add"
					variant={'contained'}
					size={'medium'}
					sx={{ borderRadius: '6px' }}
					onClick={handleRedirect}
				>
					<AddRoundedIcon sx={{ mr: '8px' }} />
					ADD
				</Button>
			</Box>
			<Box
				component={'div'}
				className={
					'table-wrap bg-slate-900/50 border border-cyan-700 border-solid rounded backdrop-blur-sm overflow-hidden'
				}
			>
				<Box component={'div'} sx={{ width: '100%', typography: 'body1' }}>
					<TabContext value={'value'}>
						<Box component={'div'}>
							<List className={'tab-menu'}>
								<ListItem
									onClick={(e: any) => handleTabChange(e, 'ALL')}
									value="ALL"
									className={value === 'ALL' ? 'li on' : 'li'}
								>
									All
								</ListItem>
								<ListItem
									onClick={(e: any) => handleTabChange(e, 'ACTIVE')}
									value="ACTIVE"
									className={value === 'ACTIVE' ? 'li on' : 'li'}
								>
									Active
								</ListItem>
								<ListItem
									onClick={(e: any) => handleTabChange(e, 'HOLD')}
									value="HOLD"
									className={value === 'HOLD' ? 'li on' : 'li'}
								>
									Hold
								</ListItem>
								<ListItem
									onClick={(e: any) => handleTabChange(e, 'DELETE')}
									value="DELETE"
									className={value === 'DELETE' ? 'li on' : 'li'}
								>
									Deleted
								</ListItem>
							</List>
							<Divider />
							<Stack className={'search-area'} sx={{ m: '24px' }}>
								<Select sx={{ width: '160px', mr: '20px' }} value={searchType}>
									<MenuItem value={'ALL'} onClick={() => searchTypeHandler('ALL')}>
										All
									</MenuItem>

									<MenuItem value={'FAQ'} onClick={() => searchTypeHandler('FAQ')}>
										FaQ
									</MenuItem>

									<MenuItem value={'TERMS'} onClick={() => searchTypeHandler('TERMS')}>
										Terms
									</MenuItem>

									<MenuItem value={'INQUIRY'} onClick={() => searchTypeHandler('INQUIRY')}>
										Inquiry
									</MenuItem>

									<MenuItem value={'NOTICE'} onClick={() => searchTypeHandler('NOTICE')}>
										Notice
									</MenuItem>
								</Select>

								<OutlinedInput
									value={searchText}
									onChange={(e: any) => textHandler(e.target.value)}
									sx={{ width: '100%' }}
									className={'search'}
									placeholder="Search notice title"
									onKeyDown={(event) => {
										if (event.key == 'Enter') searchTextHandler();
									}}
									endAdornment={
										<>
											{searchText && (
												<CancelRoundedIcon
													onClick={async () => {
														setSearchText('');
														setNoticeInquiry({
															...noticeInquiry,
															search: {
																...noticeInquiry.search,
																text: '',
															},
														});
													}}
													style={{ cursor: 'pointer' }}
												/>
											)}
											<InputAdornment position="end" onClick={() => searchTextHandler()}>
												<SearchIcon style={{ cursor: 'pointer' }} />
											</InputAdornment>
										</>
									}
								/>
							</Stack>
							<Divider />
						</Box>
						<NoticeList
							updateNoticeHandler={updateNoticeHandler}
							removeNoticeHandler={removeNoticeHandler}
							membersData={membersData}
							noticeData={noticeData}
							anchorEl={anchorEl}
							handleMenuIconClick={handleMenuIconClick}
							handleMenuIconClose={handleMenuIconClose}
							// generateMentorTypeHandle={generateMentorTypeHandle}
						/>

						<TablePagination
							rowsPerPageOptions={[10, 20, 40, 60]}
							component="div"
							count={noticeTotal}
							rowsPerPage={noticeInquiry?.limit}
							page={noticeInquiry?.page - 1}
							onPageChange={changePageHandler}
							onRowsPerPageChange={changeRowsPerPageHandler}
						/>
					</TabContext>
				</Box>
			</Box>
		</Box>
	);
};

AdminNotice.defaultProps = {
	initialInput: {
		page: 1,
		limit: 10,
		sort: 'createdAt',
		search: {},
	},
};

const AdminNoticeWithDefaults: NextPage = (props) => (
	<AdminNotice {...props} initialInput={(AdminNotice.defaultProps?.initialInput || {}) as NoticeInquiry} />
);

export default withAdminLayout(AdminNoticeWithDefaults);
