import { gql } from '@apollo/client';

/**************************
 *         MEMBER         *
 *************************/

export const SIGN_UP = gql`
	mutation Signup($input: MemberInput!) {
		signup(input: $input) {
			_id
			memberType
			memberStatus
			memberAuthType
			memberPhone
			memberNick
			memberFullName
			memberImage
			memberPosition
			memberAddress
			memberDesc
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
	}
`;

export const LOGIN = gql`
	mutation Login($input: LoginInput!) {
		login(input: $input) {
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
`;

export const UPDATE_MEMBER = gql`
	mutation UpdateMember($input: MemberUpdate!) {
		updateMember(input: $input) {
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

export const LIKE_TARGET_MEMBER = gql`
	mutation LikeTargetMember($input: String!) {
		likeTargetMember(memberId: $input) {
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
			memberPoints
			memberLikes
			memberViews
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

export const CREATE_COURSE = gql`
	mutation createCourse($input: CourseInput!) {
		createCourse(input: $input) {
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
				moduleTitle
				moduleOrder
				lessons {
					lessonTitle
					lessonOrder
					lessonVideo
					lessonDuration
				}
			}
		}
	}
`;

export const UPDATE_COURSE = gql`
	mutation UpdateCourse($input: CourseUpdate!) {
		updateCourse(input: $input) {
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
				moduleTitle
				moduleOrder
				lessons {
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

export const LIKE_TARGET_COURSE = gql`
	mutation LikeTargetCourse($input: String!) {
		likeTargetCourse(courseId: $input) {
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

export const CREATE_BOARD_ARTICLE = gql`
	mutation CreateBoardArticle($input: BoardArticleInput!) {
		createBoardArticle(input: $input) {
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

export const UPDATE_BOARD_ARTICLE = gql`
	mutation UpdateBoardArticle($input: BoardArticleUpdate!) {
		updateBoardArticle(input: $input) {
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

export const LIKE_TARGET_BOARD_ARTICLE = gql`
	mutation LikeTargetBoardArticle($input: String!) {
		likeTargetBoardArticle(articleId: $input) {
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

export const CREATE_COMMENT = gql`
	mutation CreateComment($input: CommentInput!) {
		createComment(input: $input) {
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

export const UPDATE_COMMENT = gql`
	mutation UpdateComment($input: CommentUpdate!) {
		updateComment(input: $input) {
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

/**************************
 *         FOLLOW        *
 *************************/

export const SUBSCRIBE = gql`
	mutation Subscribe($input: String!) {
		subscribe(input: $input) {
			_id
			followingId
			followerId
			createdAt
			updatedAt
		}
	}
`;

export const UNSUBSCRIBE = gql`
	mutation Unsubscribe($input: String!) {
		unsubscribe(input: $input) {
			_id
			followingId
			followerId
			createdAt
			updatedAt
		}
	}
`;
