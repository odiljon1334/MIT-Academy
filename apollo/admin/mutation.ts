import { gql } from '@apollo/client';

/**************************
 *         MEMBER         *
 *************************/

export const UPDATE_MEMBER_BY_ADMIN = gql`
	mutation UpdateMemberByAdmin($input: MemberUpdate!) {
		updateMemberByAdmin(input: $input) {
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
			memberRank
			memberArticles
			memberPoints
			memberLikes
			memberViews
			memberWarnings
			memberBlocks
			deletedAt
			createdAt
			updatedAt
			accessToken
		}
	}
`;

/**************************
 *        PROPERTY        *
 *************************/

export const UPDATE_COURSE_BY_ADMIN = gql`
	mutation UpdatePropertyByAdmin($input: PropertyUpdate!) {
		updatePropertyByAdmin(input: $input) {
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
				moduleOrder
				lessons {
					_id
					lessonTitle
					lessonOrder
					lessonVideo
					completedLesson
					lessonDuration
				}
			}
		}
	}
`;

export const REMOVE_COURSE_BY_ADMIN = gql`
	mutation RemovePropertyByAdmin($input: String!) {
		removePropertyByAdmin(propertyId: $input) {
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
				moduleOrder
				lessons {
					_id
					lessonTitle
					lessonOrder
					lessonVideo
					completedLesson
					lessonDuration
				}
			}
		}
	}
`;

/**************************
 *      BOARD-ARTICLE     *
 *************************/

export const UPDATE_BOARD_ARTICLE_BY_ADMIN = gql`
	mutation UpdateBoardArticleByAdmin($input: BoardArticleUpdate!) {
		updateBoardArticleByAdmin(input: $input) {
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
		}
	}
`;

export const REMOVE_BOARD_ARTICLE_BY_ADMIN = gql`
	mutation RemoveBoardArticleByAdmin($input: String!) {
		removeBoardArticleByAdmin(articleId: $input) {
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
		}
	}
`;

/**************************
 *         COMMENT        *
 *************************/

export const REMOVE_COMMENT_BY_ADMIN = gql`
	mutation RemoveCommentByAdmin($input: String!) {
		removeCommentByAdmin(commentId: $input) {
			_id
			commentStatus
			commentGroup
			commentContent
			commentRefId
			memberId
			createdAt
			updatedAt
		}
	}
`;
