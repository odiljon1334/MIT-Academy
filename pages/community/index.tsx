import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Stack, Tab, Typography, Button, Pagination, Divider } from '@mui/material';
import CommunityCard from '../../libs/components/common/CommunityCard';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { BoardArticle } from '../../libs/types/board-article/board-article';
import { T } from '../../libs/types/common';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { BoardArticlesInquiry } from '../../libs/types/board-article/board-article.input';
import { BoardArticleCategory } from '../../libs/enums/board-article.enum';
import { useMutation, useQuery } from '@apollo/client';
import { LIKE_TARGET_BOARD_ARTICLE } from '../../apollo/user/mutation';
import { GET_BOARD_ARTICLES } from '../../apollo/user/query';
import { Message } from '../../libs/enums/common.enum';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import NewspaperOutlinedIcon from '@mui/icons-material/NewspaperOutlined';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const Community: NextPage = ({ initialInput, ...props }: T) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const { query } = router;
	const articleCategory = query?.articleCategory as string;
	const [searchCommunity, setSearchCommunity] = useState<BoardArticlesInquiry>(initialInput);
	const [boardArticles, setBoardArticles] = useState<BoardArticle[]>([]);
	const [totalCount, setTotalCount] = useState<number>(0);
	if (articleCategory) initialInput.search.articleCategory = articleCategory;

	/** APOLLO REQUESTS **/
	const [likeTargetBoardArticle] = useMutation(LIKE_TARGET_BOARD_ARTICLE);
	const {
		loading: boardArticlesLoading,
		data: boardArticlesData,
		error: boardArticlesError,
		refetch: boardArticlesRefetch,
	} = useQuery(GET_BOARD_ARTICLES, {
		fetchPolicy: 'cache-and-network',
		variables: { input: searchCommunity },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setBoardArticles(data.getBoardArticles.list);
			setTotalCount(data.getBoardArticles.metaCounter[0].total);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (!query?.articleCategory)
			router.push(
				{
					pathname: router.pathname,
					query: { articleCategory: 'FREE' },
				},
				router.pathname,
				{ shallow: true },
			);
	}, []);

	/** HANDLERS **/
	const likeArticleHandler = async (e: any, user: T, id: string) => {
		try {
			e.stopPropagation();
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			// executed likeTargetBoardArticle Mutation
			await likeTargetBoardArticle({
				variables: { input: id },
			});
			await boardArticlesRefetch({ input: searchCommunity });

			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('ERROR, likePropertyHandler:', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const tabChangeHandler = async (e: T, value: string) => {
		console.log(value);

		setSearchCommunity({ ...searchCommunity, page: 1, search: { articleCategory: value as BoardArticleCategory } });
		await router.push(
			{
				pathname: '/community',
				query: { articleCategory: value },
			},
			router.pathname,
			{ shallow: true },
		);
	};

	const paginationHandler = (e: T, value: number) => {
		setSearchCommunity({ ...searchCommunity, page: value });
	};

	if (device === 'mobile') {
		return <h1>COMMUNITY PAGE MOBILE</h1>;
	} else {
		return (
			<div id="community-list-page">
				<div className="container py-24">
					<TabContext value={searchCommunity.search.articleCategory}>
						<Stack className="main-box border border-solid border-neutral-300 dark:border-neutral-600 rounded-lg dark:bg-slate-950/50 bg-neutral-50/50">
							<Stack className="left-config dark:bg-slate-900 bg-neutral-50 border border-solid border-neutral-300 dark:border-neutral-600">
								<Stack className={'image-info'}>
									<Stack className={'community-name'}>
										<Typography className={'name text-neutral-900 dark:text-neutral-200 font-openSans'}>
											Article Category <NewspaperOutlinedIcon className="text-amber-400 ml-2" />
										</Typography>
									</Stack>
								</Stack>

								<TabList
									orientation="vertical"
									aria-label="lab API tabs example"
									TabIndicatorProps={{
										style: { display: 'none' },
									}}
									onChange={tabChangeHandler}
								>
									<Tab
										value={'FREE'}
										label={'Free Board'}
										className={`tab-button ${
											searchCommunity.search.articleCategory == 'FREE' ? 'active' : ''
										} border border-solid border-neutral-600`}
									/>
									<Tab
										value={'RECOMMEND'}
										label={'Recommendation'}
										className={`tab-button ${
											searchCommunity.search.articleCategory == 'RECOMMEND' ? 'active' : ''
										} border border-solid border-neutral-600`}
									/>
									<Tab
										value={'NEWS'}
										label={'News'}
										className={`tab-button ${
											searchCommunity.search.articleCategory == 'NEWS' ? 'active' : ''
										} border border-solid border-neutral-600`}
									/>
									<Tab
										value={'HUMOR'}
										label={'Humor'}
										className={`tab-button ${
											searchCommunity.search.articleCategory == 'HUMOR' ? 'active' : ''
										} border border-solid border-neutral-600`}
									/>
								</TabList>
								<Divider />
								<Button
									variant="contained"
									onClick={() =>
										router.push({
											pathname: '/mypage',
											query: {
												category: 'writeArticle',
											},
										})
									}
									className="rounded-md mt-5 p-3 border border-solid border-neutral-600 text-neutral-200 bg-neutral-900 hover:bg-neutral-700 font-openSans font-meduim"
								>
									Write new article
								</Button>
							</Stack>
							<Stack className="right-config">
								<Stack className="panel-config">
									<Stack className="title-box">
										<Stack className="left">
											<Typography className="title text-neutral-900 dark:text-neutral-200 font-openSans mb-2">
												{searchCommunity.search.articleCategory} BOARD
											</Typography>
											<Typography className="sub-title font-openSans text-gray-600">
												Express your opinions freely here without content restrictions
											</Typography>
										</Stack>
									</Stack>

									<TabPanel value="FREE">
										<Stack className="list-box">
											{totalCount ? (
												boardArticles?.map((boardArticle: BoardArticle) => {
													return (
														<CommunityCard
															likeArticleHandler={likeArticleHandler}
															boardArticle={boardArticle}
															key={boardArticle?._id}
														/>
													);
												})
											) : (
												<Stack className={'no-data'}>
													<div className="flex flex-col items-center justify-center p-12 text-center min-h-[600px]">
														<div className="relative">
															<div className="absolute inset-0 -m-10 bg-blue-100/50 rounded-full blur-3xl opacity-30 animate-pulse"></div>
															<div className="relative rounded-full bg-white p-6 mb-6 shadow-lg border border-indigo-100 transform transition-all duration-300 hover:scale-105">
																<NewspaperOutlinedIcon className="h-14 w-14 text-indigo-500" />
															</div>
														</div>
														<Typography variant="h4" className="font-semibold mb-3 mt-2">
															No Articles Found!
														</Typography>
														<Typography variant="body1" className="text-gray-600 max-w-md mb-8 leading-relaxed">
															We don't have any articles to display at the moment. Check back soon as our listings are
															updated regularly.
														</Typography>
														<div className="w-full max-w-xs h-1 bg-gradient-to-r from-transparent via-indigo-200 to-transparent rounded-full"></div>
													</div>
												</Stack>
											)}
										</Stack>
									</TabPanel>
									<TabPanel value="RECOMMEND">
										<Stack className="list-box">
											{totalCount ? (
												boardArticles?.map((boardArticle: BoardArticle) => {
													return (
														<CommunityCard
															likeArticleHandler={likeArticleHandler}
															boardArticle={boardArticle}
															key={boardArticle?._id}
														/>
													);
												})
											) : (
												<Stack className={'no-data'}>
													<div className="flex flex-col items-center justify-center p-12 text-center min-h-[600px]">
														<div className="relative">
															<div className="absolute inset-0 -m-10 bg-blue-100/50 rounded-full blur-3xl opacity-30 animate-pulse"></div>
															<div className="relative rounded-full bg-white p-6 mb-6 shadow-lg border border-indigo-100 transform transition-all duration-300 hover:scale-105">
																<NewspaperOutlinedIcon className="h-14 w-14 text-indigo-500" />
															</div>
														</div>
														<Typography variant="h4" className="font-semibold mb-3 mt-2">
															No Articles Found!
														</Typography>
														<Typography variant="body1" className="text-gray-600 max-w-md mb-8 leading-relaxed">
															We don't have any articles to display at the moment. Check back soon as our listings are
															updated regularly.
														</Typography>
														<div className="w-full max-w-xs h-1 bg-gradient-to-r from-transparent via-indigo-200 to-transparent rounded-full"></div>
													</div>
												</Stack>
											)}
										</Stack>
									</TabPanel>
									<TabPanel value="NEWS">
										<Stack className="list-box">
											{totalCount ? (
												boardArticles?.map((boardArticle: BoardArticle) => {
													return (
														<CommunityCard
															likeArticleHandler={likeArticleHandler}
															boardArticle={boardArticle}
															key={boardArticle?._id}
														/>
													);
												})
											) : (
												<Stack className={'no-data'}>
													<div className="flex flex-col items-center justify-center p-12 text-center min-h-[600px]">
														<div className="relative">
															<div className="absolute inset-0 -m-10 bg-blue-100/50 rounded-full blur-3xl opacity-30 animate-pulse"></div>
															<div className="relative rounded-full bg-white p-6 mb-6 shadow-lg border border-indigo-100 transform transition-all duration-300 hover:scale-105">
																<NewspaperOutlinedIcon className="h-14 w-14 text-indigo-500" />
															</div>
														</div>
														<Typography variant="h4" className="font-semibold mb-3 mt-2">
															No Articles Found!
														</Typography>
														<Typography variant="body1" className="text-gray-600 max-w-md mb-8 leading-relaxed">
															We don't have any articles to display at the moment. Check back soon as our listings are
															updated regularly.
														</Typography>
														<div className="w-full max-w-xs h-1 bg-gradient-to-r from-transparent via-indigo-200 to-transparent rounded-full"></div>
													</div>
												</Stack>
											)}
										</Stack>
									</TabPanel>
									<TabPanel value="HUMOR">
										<Stack className="list-box">
											{totalCount ? (
												boardArticles?.map((boardArticle: BoardArticle) => {
													return (
														<CommunityCard
															likeArticleHandler={likeArticleHandler}
															boardArticle={boardArticle}
															key={boardArticle?._id}
														/>
													);
												})
											) : (
												<Stack className={'no-data'}>
													<div className="flex flex-col items-center justify-center p-12 text-center min-h-[600px]">
														<div className="relative">
															<div className="absolute inset-0 -m-10 bg-blue-100/50 rounded-full blur-3xl opacity-30 animate-pulse"></div>
															<div className="relative rounded-full bg-white p-6 mb-6 shadow-lg border border-indigo-100 transform transition-all duration-300 hover:scale-105">
																<NewspaperOutlinedIcon className="h-14 w-14 text-indigo-500" />
															</div>
														</div>
														<Typography variant="h4" className="font-semibold mb-3 mt-2">
															No Articles Found!
														</Typography>
														<Typography variant="body1" className="text-gray-600 max-w-md mb-8 leading-relaxed">
															We don't have any articles to display at the moment. Check back soon as our listings are
															updated regularly.
														</Typography>
														<div className="w-full max-w-xs h-1 bg-gradient-to-r from-transparent via-indigo-200 to-transparent rounded-full"></div>
													</div>
												</Stack>
											)}
										</Stack>
									</TabPanel>
								</Stack>
							</Stack>
						</Stack>
					</TabContext>

					{totalCount > 0 && (
						<Stack className="pagination-config">
							<Stack className="pagination-box">
								<Pagination
									variant="outlined"
									count={Math.ceil(totalCount / searchCommunity.limit)}
									page={searchCommunity.page}
									shape="circular"
									color="primary"
									onChange={paginationHandler}
								/>
							</Stack>
							<Stack className="total-result">
								<span className="text-slate-800 dark:text-slate-200 font-openSans font-normal text-md">
									Total {totalCount} article{totalCount > 1 ? 's' : ''} available
								</span>
							</Stack>
						</Stack>
					)}
				</div>
			</div>
		);
	}
};

Community.defaultProps = {
	initialInput: {
		page: 1,
		limit: 6,
		sort: 'createdAt',
		direction: 'ASC',
		search: { articleCategory: 'FREE' },
	},
};

export default withLayoutBasic(Community);
