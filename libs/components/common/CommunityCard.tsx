import React from 'react';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Divider, Stack, Typography } from '@mui/material';
import { BoardArticle } from '../../types/board-article/board-article';
import Moment from 'react-moment';
import { REACT_APP_API_URL } from '../../config';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import IconButton from '@mui/material/IconButton';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Card, CardContent, CardMedia } from '@mui/material';
import { CalendarMonth } from '@mui/icons-material';
import { MemberPosition } from '../../enums/member.enum';

interface CommunityCardProps {
	boardArticle: BoardArticle;
	likeArticleHandler?: any;
	size?: string;
}

const CommunityCard = (props: CommunityCardProps) => {
	const { boardArticle, size = 'normal', likeArticleHandler } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const imagePath: string = boardArticle?.articleImage
		? `${REACT_APP_API_URL}/${boardArticle?.articleImage}`
		: '/img/community/communityImg.png';

	/** HANDLERS **/
	const chooseArticleHandler = (e: React.SyntheticEvent, boardArticle: BoardArticle) => {
		router.push(
			{
				pathname: '/community/detail',
				query: { articleCategory: boardArticle?.articleCategory, id: boardArticle?._id },
			},
			undefined,
			{ shallow: true },
		);
	};

	const goMemberPage = (id: string) => {
		if (id === user?._id) router.push('/mypage');
		else router.push(`/member?memberId=${id}`);
	};

	if (device === 'mobile') {
		return <div>COMMUNITY CARD MOBILE</div>;
	} else {
		return (
			<>
				<Card
					onClick={(e: React.SyntheticEvent<Element, Event>) => chooseArticleHandler(e, boardArticle)}
					variant="outlined"
					className="dark:bg-slate-900 border border-solid border-neutral-300 dark:border-neutral-700 shadow-lg rounded-lg overflow-hidden"
				>
					<CardMedia
						style={{ width: 300, height: 220, objectFit: 'fill', cursor: 'pointer' }}
						component="img"
						image={imagePath}
						alt={'article image'}
					/>
					<CardContent sx={{ width: 300 }}>
						<Typography variant="h6" className="font-semibold cursor-pointer hover:underline">
							{boardArticle.articleTitle}
						</Typography>
						<div className="flex items-center text-gray-500 text-sm mt-2">
							<CalendarMonth fontSize="small" className="mr-1 text-orange-300" />
							<Stack className="flex flex-row items-center space-x-1">
								<Moment className="month" format={'MMM'}>
									{boardArticle?.createdAt}
								</Moment>
								<Typography className="day">
									<Moment format={'DD'}>{boardArticle?.createdAt}</Moment>,
								</Typography>
								<Typography className="year">
									<Moment format={'YYYY'}>{boardArticle?.createdAt}</Moment>
								</Typography>
							</Stack>
						</div>

						<Divider sx={{ mt: '20px', mb: '10px' }} />
						<div className="flex flex-row items-center justify-between">
							<div className="flex items-center space-x-2 cursor-pointer">
								<img
									src={`${REACT_APP_API_URL}/${boardArticle?.memberData?.memberImage}`}
									alt="memberImage"
									style={{ width: 50, height: 50, borderRadius: 50, objectFit: 'cover' }}
								/>
								<div
									className="flex flex-col space-y-2"
									onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
										e.stopPropagation();
										goMemberPage(boardArticle?.memberData?._id as string);
									}}
								>
									<span className="text-md font-openSans font-semibold dark:text-neutral-200 hover:underline">
										{boardArticle.memberData?.memberNick}
									</span>
									<p className="text-[13px] font-openSans font-meduim text-neutral-400">
										{boardArticle?.memberData?.memberPosition === MemberPosition.UI_UX_DESIGNER
											? 'UI/UX Designer'
											: boardArticle?.memberData?.memberPosition === MemberPosition.SOFTWARE_ENGINEER
											? 'Software Engineer'
											: boardArticle?.memberData?.memberPosition === MemberPosition.FRONTEND_DEVELOPER
											? 'Frontend Developer'
											: boardArticle?.memberData?.memberPosition === MemberPosition.BACKEND_DEVELOPER
											? 'Backend Developer'
											: boardArticle?.memberData?.memberPosition === MemberPosition.FULLSTACK_DEVELOPER
											? 'Fullstack Developer'
											: boardArticle?.memberData?.memberPosition === MemberPosition.DATA_SCIENTIST
											? 'Data Scientist'
											: boardArticle?.memberData?.memberPosition === MemberPosition.WEB_DEVELOPER
											? 'Web Developer'
											: boardArticle?.memberData?.memberPosition === MemberPosition.MOBILE_DEVELOPER
											? 'Mobile Developer'
											: boardArticle?.memberData?.memberPosition === MemberPosition.MACHINE_LEARNING_ENGINEER
											? 'Machine Learning Eng'
											: boardArticle?.memberData?.memberPosition === MemberPosition.DEVOPS_ENGINEER
											? 'DevOps Engineer'
											: boardArticle?.memberData?.memberPosition === MemberPosition.GAME_DEVELOPER
											? 'Game Developer'
											: boardArticle?.memberData?.memberPosition === MemberPosition.GRAPHIC_DESIGNER
											? 'Graphic Designer'
											: null}
									</p>
								</div>
							</div>
							<Stack className={'flex flex-row items-center'}>
								<IconButton color={'default'}>
									<RemoveRedEyeIcon />
								</IconButton>
								<Typography className="view-cnt">{boardArticle?.articleViews}</Typography>
								<IconButton onClick={(e: any) => likeArticleHandler(e, user, boardArticle?._id)} color={'default'}>
									{boardArticle?.meLiked && boardArticle?.meLiked[0]?.myFavorite ? (
										<FavoriteIcon color={'primary'} />
									) : (
										<FavoriteBorderIcon />
									)}
								</IconButton>
								<Typography className="view-cnt">{boardArticle?.articleLikes}</Typography>
							</Stack>
						</div>
					</CardContent>
				</Card>
			</>
		);
	}
};

export default CommunityCard;
