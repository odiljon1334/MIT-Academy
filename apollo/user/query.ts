import { gql } from '@apollo/client';

/**************************
 *         MEMBER         *
 *************************/

export const GET_INSTRUCTOR = gql`
	query GetInstructor($input: InstructorInquiry!) {
		getInstructor(input: $input) {
			list {
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
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_MEMBER = gql(`
query GetMember($input: String!) {
    getMember(memberId: $input) {
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
        memberCourses
        memberArticles
        memberPoints
        memberLikes
        memberViews
        memberFollowings
				memberFollowers
        memberRank
        memberWarnings
        memberBlocks
        deletedAt
        createdAt
        updatedAt
        accessToken
        meFollowed {
					followingId
					followerId
					myFollowing
				}
    }
}
`);

/**************************
 *        PROPERTY        *
 *************************/

export const GET_COURSE = gql`
	query GetCourse($input: String!) {
		getCourse(courseId: $input) {
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
			meLiked {
				memberId
				likeRefId
				myFavorite
			}
		}
	}
`;

export const GET_COURSES = gql`
	query GetCourses($input: CoursesInquiry!) {
		getCourses(input: $input) {
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
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_INTRUCTOR_COURSES = gql`
	query GetInstructorCourses($input: InstructorCourseInquiry!) {
		getInstructorCourses(input: $input) {
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
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_FAVORITES = gql`
	query GetFavorites($input: OrdinaryInquiry!) {
		getFavorites(input: $input) {
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
					meLiked {
						memberId
						likeRefId
						myFavorite
					}
					meFollowed {
						followingId
						followerId
						myFollowing
					}
				}
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_VISITED = gql`
	query GetVisited($input: OrdinaryInquiry!) {
		getVisited(input: $input) {
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
					memberFullName
					memberImage
					memberAddress
					memberDesc
					memberPosition
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

/**************************
 *      BOARD-ARTICLE     *
 *************************/

export const GET_BOARD_ARTICLE = gql`
	query GetBoardArticle($input: String!) {
		getBoardArticle(articleId: $input) {
			_id
			articleCategory
			articleStatus
			articleTitle
			articleContent
			articleImage
			articleViews
			articleLikes
			articleComments
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
			}
			meLiked {
				memberId
				likeRefId
				myFavorite
			}
		}
	}
`;

export const GET_BOARD_ARTICLES = gql`
	query GetBoardArticles($input: BoardArticlesInquiry!) {
		getBoardArticles(input: $input) {
			list {
				_id
				articleCategory
				articleStatus
				articleTitle
				articleContent
				articleImage
				articleViews
				articleLikes
				articleComments
				memberId
				createdAt
				updatedAt
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
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
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *         FOLLOW        *
 *************************/
export const GET_MEMBER_FOLLOWERS = gql`
	query GetMemberFollowers($input: FollowInquiry!) {
		getMemberFollowers(input: $input) {
			list {
				_id
				followingId
				followerId
				createdAt
				updatedAt
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
				meFollowed {
					followingId
					followerId
					myFollowing
				}
				followerData {
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
					memberCourses
					memberArticles
					memberPoints
					memberLikes
					memberViews
					memberComments
					memberFollowings
					memberFollowers
					memberRank
					memberWarnings
					memberBlocks
					deletedAt
					createdAt
					updatedAt
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_MEMBER_FOLLOWINGS = gql`
	query GetMemberFollowings($input: FollowInquiry!) {
		getMemberFollowings(input: $input) {
			list {
				_id
				followingId
				followerId
				createdAt
				updatedAt
				followingData {
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
					memberCourses
					memberArticles
					memberPoints
					memberLikes
					memberViews
					memberComments
					memberFollowings
					memberFollowers
					memberRank
					memberWarnings
					memberBlocks
					deletedAt
					createdAt
					updatedAt
					accessToken
				}
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
				meFollowed {
					followingId
					followerId
					myFollowing
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *      Notification      *
 *************************/

export const GET_NOTIFICATIONS_COURSE = gql`
	query GetCourseNotifications($input: NotifInquiry!) {
		getCourseNotifications(input: $input) {
			list {
				_id
				notificationType
				notificationStatus
				notificationGroup
				notificationTitle
				notificationDesc
				authorId
				receiverId
				propertyId
				articleId
				createdAt
				updatedAt
				courseData {
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
				}
				authorData {
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
