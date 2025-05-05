import React from 'react';
import Link from 'next/link';
import {
	Box,
	Button,
	Chip,
	Fade,
	Menu,
	MenuItem,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Tooltip,
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import OpenInBrowserRoundedIcon from '@mui/icons-material/OpenInBrowserRounded';
import Moment from 'react-moment';
import { BoardArticle } from '../../../types/board-article/board-article';
import { REACT_APP_API_URL } from '../../../config';
import DeleteIcon from '@mui/icons-material/Delete';
import Typography from '@mui/material/Typography';
import { BoardArticleStatus } from '../../../enums/board-article.enum';
import { PackageOpen } from 'lucide-react';

interface Data {
	category: string;
	title: string;
	writer: string;
	register: string;
	view: number;
	like: number;
	status: string;
	article_id: string;
}

interface HeadCell {
	disablePadding: boolean;
	id: keyof Data;
	label: string;
	numeric: boolean;
}

const headCells: readonly HeadCell[] = [
	{
		id: 'article_id',
		numeric: true,
		disablePadding: false,
		label: 'ID',
	},
	{
		id: 'title',
		numeric: true,
		disablePadding: false,
		label: 'Title',
	},
	{
		id: 'category',
		numeric: true,
		disablePadding: false,
		label: 'Category',
	},
	{
		id: 'writer',
		numeric: true,
		disablePadding: false,
		label: 'Wtiter',
	},
	{
		id: 'view',
		numeric: false,
		disablePadding: false,
		label: 'View',
	},
	{
		id: 'like',
		numeric: false,
		disablePadding: false,
		label: 'Like',
	},
	{
		id: 'register',
		numeric: true,
		disablePadding: false,
		label: 'Register Date',
	},
	{
		id: 'status',
		numeric: false,
		disablePadding: false,
		label: 'Status',
	},
];

interface EnhancedTableProps {
	numSelected: number;
	onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
	onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
	rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
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

interface CommunityArticleListProps {
	articles: BoardArticle[];
	anchorEl: any;
	menuIconClickHandler: any;
	menuIconCloseHandler: any;
	updateArticleHandler: any;
	removeArticleHandler: any;
}

const CommunityArticleList = (props: CommunityArticleListProps) => {
	const { articles, anchorEl, menuIconClickHandler, menuIconCloseHandler, updateArticleHandler, removeArticleHandler } =
		props;

	return (
		<Stack>
			<TableContainer>
				<Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={'medium'}>
					{/*@ts-ignore*/}
					<EnhancedTableHead />
					<TableBody>
						{articles.length === 0 && (
							<TableRow>
								<TableCell align="center" colSpan={8}>
									<span className={'no-data'}>
										<div className="flex flex-col items-center justify-center p-12 text-center min-h-[300px]">
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

						{articles.length !== 0 &&
							articles.map((article: BoardArticle, index: number) => (
								<TableRow hover key={article._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
									<TableCell align="left">{article._id}</TableCell>
									<TableCell align="left">
										<Box component={'div'} className={'text-slate-300'}>
											{article.articleTitle}
											{article.articleStatus === BoardArticleStatus.ACTIVE && (
												<Link
													href={`/community/detail?articleCategory=${article.articleCategory}&id=${article._id}`}
													className={'img_box'}
												>
													<IconButton className="btn_window">
														<Tooltip title={'Open window'}>
															<OpenInBrowserRoundedIcon />
														</Tooltip>
													</IconButton>
												</Link>
											)}
										</Box>
									</TableCell>
									<TableCell align="left">
										<p className="font-semibold text-purple-500">{article.articleCategory}</p>
									</TableCell>
									<TableCell align="left" className={'name'}>
										<Link href={`/member?memberId=${article?.memberData?._id}`}>
											<Avatar
												alt="Remy Sharp"
												src={
													article?.memberData?.memberImage
														? `${REACT_APP_API_URL}/${article?.memberData?.memberImage}`
														: `/img/profile/defaultUser.svg`
												}
												sx={{ ml: '2px', mr: '10px' }}
											/>
											<p className="font-sans font-medium text-slate-400">{article?.memberData?.memberNick}</p>
										</Link>
									</TableCell>
									<TableCell align="center">
										<p className="text-slate-400">{article?.articleViews}</p>
									</TableCell>
									<TableCell align="center">
										<p className="text-slate-400">{article?.articleLikes}</p>
									</TableCell>
									<TableCell align="left">
										<span className="text-slate-400">
											<Moment format={'DD.MM.YY HH:mm'}>{article?.createdAt}</Moment>
										</span>
									</TableCell>
									<TableCell align="center">
										{article.articleStatus === BoardArticleStatus.DELETE ? (
											<Button
												variant="outlined"
												sx={{
													p: '3px',
													border: 'none',
													':hover': { border: 'none', outline: 'none' },
												}}
												onClick={() => removeArticleHandler(article._id)}
											>
												<DeleteIcon fontSize="small" />
											</Button>
										) : (
											<>
												<Button
													variant="outlined"
													color="success"
													sx={{ py: '2px', borderRadius: '50px', border: '1.5px solid' }}
													onClick={(e: any) => menuIconClickHandler(e, index)}
												>
													{article.articleStatus}
												</Button>

												<Menu
													className={'menu-modal'}
													sx={{ p: 1 }}
													MenuListProps={{
														'aria-labelledby': 'fade-button',
													}}
													anchorEl={anchorEl[index]}
													open={Boolean(anchorEl[index])}
													onClose={menuIconCloseHandler}
													TransitionComponent={Fade}
												>
													{Object.values(BoardArticleStatus)
														.filter((ele) => ele !== article.articleStatus)
														.map((status: string) => (
															<MenuItem
																sx={{ background: 'slategray' }}
																onClick={() => updateArticleHandler({ _id: article._id, articleStatus: status })}
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
									</TableCell>
								</TableRow>
							))}
					</TableBody>
				</Table>
			</TableContainer>
		</Stack>
	);
};

export default CommunityArticleList;
