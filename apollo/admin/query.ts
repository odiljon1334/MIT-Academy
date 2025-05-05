import { gql } from '@apollo/client';

/**************************
 *         MEMBER         *
 *************************/

export const GET_ALL_MEMBERS_BY_ADMIN = gql`
	query GetAllMembersByAdmin($input: MembersInquiry!) {
		getAllMembersByAdmin(input: $input) {
			list {
				_id
				memberType
				memberStatus
				memberAuthType
				memberPhone
				memberNick
				memberFullName
				memberImage
				memberAddress
				memberDesc
				memberPosition
				memberWarnings
				memberBlocks
				memberCourses
				memberRank
				memberArticles
				memberPoints
				memberLikes
				memberViews
				deletedAt
				createdAt
				updatedAt
				accessToken
			}
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *        PROPERTY        *
 *************************/

export const GET_ALL_COURSES_BY_ADMIN = gql`
	query GetAllCoursesByAdmin($input: AllCoursesInquiry!) {
		getAllCoursesByAdmin(input: $input) {
			list {
				_id
				courseType
				courseStatus
				courseCategory
				courseTitle
				coursePrice
				courseViews
				courseLikes
				courseComments
				courseRank
				courseImage
				courseDesc
				memberId
				soldAt
				deletedAt
				constructedAt
				createdAt
				updatedAt
				courseModuls {
					_id
					moduleTitle
					lessons {
						_id
						lessonTitle
						lessonVideo
						completedLesson
						lessonDuration
					}
				}
				memberData {
					_id
					memberType
					memberStatus
					memberAuthType
					memberPhone
					memberNick
					memberPosition
					memberFullName
					memberImage
					memberAddress
					memberDesc
					memberCourses
					memberArticles
					memberFollowers
					memberFollowings
					memberPoints
					memberLikes
					memberViews
					memberComments
					memberRank
					memberWarnings
					memberBlocks
					deletedAt
					createdAt
					updatedAt
					accessToken
				}
			}
		}
	}
`;

/**************************
 *      BOARD-ARTICLE     *
 *************************/

export const GET_ALL_BOARD_ARTICLES_BY_ADMIN = gql`
	query GetAllBoardArticlesByAdmin($input: AllBoardArticlesInquiry!) {
		getAllBoardArticlesByAdmin(input: $input) {
			list {
				_id
				articleCategory
				articleStatus
				articleTitle
				articleContent
				articleImage
				articleViews
				articleLikes
				memberId
				createdAt
				updatedAt
				memberData {
					_id
					memberType
					memberStatus
					memberAuthType
					memberPhone
					memberNick
					memberFullName
					memberImage
					memberAddress
					memberPosition
					memberDesc
					memberWarnings
					memberBlocks
					memberCourses
					memberRank
					memberPoints
					memberLikes
					memberViews
					deletedAt
					createdAt
					updatedAt
					accessToken
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *         COMMENT        *
 *************************/

export const GET_COMMENTS = gql`
	query GetComments($input: CommentsInquiry!) {
		getComments(input: $input) {
			list {
				_id
				commentStatus
				commentGroup
				commentContent
				commentRefId
				memberId
				createdAt
				updatedAt
				memberData {
					_id
					memberType
					memberStatus
					memberAuthType
					memberPhone
					memberNick
					memberPosition
					memberFullName
					memberImage
					memberAddress
					memberDesc
					memberWarnings
					memberBlocks
					memberCourses
					memberRank
					memberPoints
					memberLikes
					memberViews
					deletedAt
					createdAt
					updatedAt
					accessToken
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_NOTICES = gql`
	query GetNotices($input: NoticeInquiry!) {
		getNotices(input: $input) {
			list {
				_id
				noticeCategory
				noticeStatus
				noticeTitle
				noticeContent
				event
				memberId
				constructedAt
				createdAt
				updatedAt
				deletedAt
				memberData {
					_id
					memberType
					memberStatus
					memberAuthType
					memberPhone
					memberNick
					memberPosition
					memberFullName
					memberImage
					memberAddress
					memberDesc
					memberCourses
					memberArticles
					memberFollowers
					memberFollowings
					memberPoints
					memberLikes
					memberViews
					memberComments
					memberRank
					memberWarnings
					memberBlocks
					deletedAt
					createdAt
					updatedAt
					accessToken
				}
			}
			metaCounter {
				total
			}
		}
	}
`;
