import React, { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Stack, Box, Button, Pagination, Typography } from '@mui/material';
import { Menu, MenuItem } from '@mui/material';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import InstructorCard from '../../libs/components/common/InstructorCard';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Member } from '../../libs/types/member/member';
import { useMutation, useQuery } from '@apollo/client';
import { LIKE_TARGET_MEMBER } from '../../apollo/user/mutation';
import { GET_INSTRUCTOR } from '../../apollo/user/query';
import { T } from '../../libs/types/common';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import { Message } from '../../libs/enums/common.enum';
import { UserRoundSearch } from 'lucide-react';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const InstructorsList: NextPage = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
	const [filterSortName, setFilterSortName] = useState('Recent');
	const [sortingOpen, setSortingOpen] = useState(false);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [searchFilter, setSearchFilter] = useState<any>(
		router?.query?.input ? JSON.parse(router?.query?.input as string) : initialInput,
	);
	const [instructors, setIntructors] = useState<Member[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [searchText, setSearchText] = useState<string>('');

	/** APOLLO REQUESTS **/
	const [likeTargetMember] = useMutation(LIKE_TARGET_MEMBER);

	const {
		loading: getInstructorLoading,
		data: getInstructorData,
		error: getInstructorError,
		refetch: getInstructorRefetch,
	} = useQuery(GET_INSTRUCTOR, {
		fetchPolicy: 'cache-and-network',
		variables: { input: searchFilter },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			if (data?.getInstructor?.list?.length) {
				setIntructors(data.getInstructor.list);
				setTotal(data.getInstructor.metaCounter[0]?.total || 0);
			} else {
				setIntructors([]);
				setTotal(0);
			}
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (router.query.input) {
			const input_obj = JSON.parse(router?.query?.input as string);
			setSearchFilter(input_obj);
		} else
			router.replace(
				`/instructor?input=${JSON.stringify(searchFilter)}`,
				`/instructor?input=${JSON.stringify(searchFilter)}`,
			);

		setCurrentPage(searchFilter.page === undefined ? 1 : searchFilter.page);
	}, [router]);

	useEffect(() => {
		if (!searchFilter?.search?.text) {
			delete searchFilter.search.text;
			router
				.push(
					`/instructor?input=${JSON.stringify({
						...searchFilter,
					})}`,
					`/instructor?input=${JSON.stringify({
						...searchFilter,
					})}`,
					{ scroll: false },
				)
				.then();
		} else {
			router
				.push(
					`/instructor?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					`/instructor?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					{ scroll: false },
				)
				.then();
		}
	}, [searchFilter.search.text]);

	/** HANDLERS **/
	const likeMemberHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			// executed likeTargetMember Mutation
			await likeTargetMember({
				variables: { input: id },
			});
			await getInstructorRefetch({ input: searchFilter });

			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('ERROR, likeMemberHandler:', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const sortingClickHandler = (e: MouseEvent<HTMLElement>) => {
		setAnchorEl(e.currentTarget);
		setSortingOpen(true);
	};

	const sortingCloseHandler = () => {
		setSortingOpen(false);
		setAnchorEl(null);
	};

	const sortingHandler = async (e: React.MouseEvent<HTMLLIElement>) => {
		switch (e.currentTarget.id) {
			case 'recent':
				setSearchFilter({ ...searchFilter, sort: 'createdAt', direction: 'DESC' });
				router.push(
					`/instructor?input=${JSON.stringify({
						...searchFilter,
						sort: 'createdAt',
						direction: 'DESC',
					})}`,
				);
				setFilterSortName('Recent');
				break;
			case 'old':
				setSearchFilter({ ...searchFilter, sort: 'createdAt', direction: 'ASC' });
				router.push(
					`/instructor?input=${JSON.stringify({
						...searchFilter,
						sort: 'createdAt',
						direction: 'ASC',
					})}`,
				);
				setFilterSortName('Oldest order');
				break;
			case 'likes':
				setSearchFilter({ ...searchFilter, sort: 'memberLikes', direction: 'DESC' });
				router.push(
					`/instructor?input=${JSON.stringify({
						...searchFilter,
						sort: 'memberLikes',
						direction: 'DESC',
					})}`,
				);
				setFilterSortName('Likes');
				break;
			case 'views':
				setSearchFilter({ ...searchFilter, sort: 'memberViews', direction: 'DESC' });
				router.push(
					`/instructor?input=${JSON.stringify({
						...searchFilter,
						sort: 'memberViews',
						direction: 'DESC',
					})}`,
				);
				setFilterSortName('Views');
				break;
		}
		setSortingOpen(false);
		setAnchorEl2(null);
	};

	const paginationChangeHandler = async (event: ChangeEvent<unknown>, value: number) => {
		searchFilter.page = value;
		await router.push(
			`/instructor?input=${JSON.stringify(searchFilter)}`,
			`/instructor?input=${JSON.stringify(searchFilter)}`,
			{
				scroll: false,
			},
		);
		setCurrentPage(value);
	};

	if (device === 'mobile') {
		return <h1>INSTRUCTOR PAGE MOBILE</h1>;
	} else {
		return (
			<Stack className={'agent-list-page'}>
				<Stack className={'container'}>
					<Stack className={'filter'}>
						<Box component={'div'} className={'left'}>
							<input
								className="outline-none dark:bg-slate-200 dark:placeholder-slate-600"
								type="text"
								placeholder={'Search for an Instructor'}
								value={searchText}
								onChange={(e: any) => setSearchText(e.target.value)}
								onKeyDown={(event: any) => {
									if (event.key == 'Enter') {
										setSearchFilter({
											...searchFilter,
											search: { ...searchFilter.search, text: searchText },
										});
									}
								}}
							/>
						</Box>
						<Box component={'div'} className={'right space-x-1'}>
							<span className="text-slate-700 dark:text-slate-300 text-md font-openSans font-semibold">Sort by:</span>
							<div>
								<Button
									className="text-md font-openSans font-semibold dark:text-slate-300 text-slate-600 hover:underline"
									onClick={sortingClickHandler}
									endIcon={<KeyboardArrowDownRoundedIcon />}
								>
									{filterSortName}
								</Button>
								<Menu anchorEl={anchorEl} open={sortingOpen} onClose={sortingCloseHandler} sx={{ paddingTop: '5px' }}>
									<MenuItem onClick={sortingHandler} id={'recent'} disableRipple>
										Recent
									</MenuItem>
									<MenuItem onClick={sortingHandler} id={'old'} disableRipple>
										Oldest
									</MenuItem>
									<MenuItem onClick={sortingHandler} id={'likes'} disableRipple>
										Likes
									</MenuItem>
									<MenuItem onClick={sortingHandler} id={'views'} disableRipple>
										Views
									</MenuItem>
								</Menu>
							</div>
						</Box>
					</Stack>
					<Stack className={'card-wrap p-5'}>
						{instructors?.length === 0 ? (
							<div className={'no-data space-y-2'}>
								<div className="flex flex-col items-center justify-center p-12 text-center min-h-[600px]">
									<div className="relative">
										<div className="absolute inset-0 -m-10 bg-blue-100/50 rounded-full blur-3xl opacity-30 animate-pulse"></div>
										<div className="relative rounded-full bg-white p-6 mb-6 shadow-lg border border-indigo-100 transform transition-all duration-300 hover:scale-105">
											<UserRoundSearch className="h-14 w-14 text-indigo-500" />
										</div>
									</div>
									<Typography variant="h4" className="font-semibold mb-3 mt-2">
										No Instructor found!
									</Typography>
									<Typography variant="body1" className="text-gray-600 max-w-md mb-8 leading-relaxed">
										We don't have any Instructor to display at the moment. Check back soon as our list is updated
										regularly.
									</Typography>
									<div className="w-full max-w-xs h-1 bg-gradient-to-r from-transparent via-indigo-200 to-transparent rounded-full"></div>
								</div>
							</div>
						) : (
							instructors.map((instructor: Member) => {
								return (
									<InstructorCard likeMemberHandler={likeMemberHandler} instructor={instructor} key={instructor._id} />
								);
							})
						)}
					</Stack>
					<Stack className={'pagination mt-5'}>
						<Stack className="pagination-box">
							{instructors.length !== 0 && (
								<Stack className="pagination-box">
									<Pagination
										variant="outlined"
										page={currentPage}
										count={Math.ceil(total / searchFilter.limit)}
										onChange={paginationChangeHandler}
										shape="circular"
										color="primary"
									/>
								</Stack>
							)}
						</Stack>

						{instructors.length !== 0 && (
							<span className="font-openSans font-semibold dark:text-slate-300 text-slate-800">
								Total {total} Instructor{total > 1 ? 's' : ''} available
							</span>
						)}
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

InstructorsList.defaultProps = {
	initialInput: {
		page: 1,
		limit: 10,
		sort: 'createdAt',
		direction: 'DESC',
		search: {},
	},
};

export default withLayoutBasic(InstructorsList);
