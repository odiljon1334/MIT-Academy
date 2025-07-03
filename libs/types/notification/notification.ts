import { BoardArticleCategory, BoardArticleStatus } from '../../enums/board-article.enum';
import { NotificationGroup, NotificationStatus, NotificationType } from '../../enums/notification.enum';
import { CourseCategory, CourseStatus, CourseType } from '../../enums/property.enum';

export interface Notification {
	_id: string;
	notificationType: NotificationType;
	notificationStatus: NotificationStatus;
	notificationGroup: NotificationGroup;
	notificationTitle: string;
	notificationDesc?: string;
	authorId: string;
	receiverId: string;
	courseId?: string;
	articleId?: string;
	createdAt: Date;
	updatedAt: Date;
	authorData?: {
		_id: string;
		memberType: string;
		memberStatus: string;
		memberNick: string;
		memberFullName: string;
		memberImage: string;
		deletedAt?: Date;
		createdAt: Date;
		updatedAt: Date;
	};
	courseData?: {
		_id: string;
		courseType: CourseType;
		courseStatus: CourseStatus;
		courseCategory: CourseCategory;
		courseTitle: string;
		coursePrice: number;
		courseViews: number;
		courseLikes: number;
		courseComments: number;
		courseRank: number;
		courseImage: string;
		courseDesc?: string;
		memberId: string;
		courseModuls: {
			_id: string;
			moduleTitle: string;
			lessons: {
				_id: string;
				lessonTitle: string;
				lessonVideo: string;
				completedLesson: boolean;
				lessonDuration: number;
			}[];
		}[];
		soldAt?: Date;
		deletedAt?: Date;
		constructedAt?: Date;
		createdAt: Date;
		updatedAt: Date;
	};
	articleData?: {
		_id: string;
		articleCategory: BoardArticleCategory;
		articleStatus: BoardArticleStatus;
		articleTitle: string;
		articleContent: string;
		articleImage: string;
		articleViews: number;
		articleLikes: number;
		articleComments: number;
		memberId: string;
		createdAt: Date;
		updatedAt: Date;
	};
	receiverData?: {
		_id: string;
		memberType: string;
		memberStatus: string;
		memberNick: string;
		memberFullName: string;
		memberImage: string;
		deletedAt?: Date;
		createdAt: Date;
		updatedAt: Date;
	};
}

export interface TotalCounter {
	total: number;
}

export interface Notifications {
	list: Notification[];
	metaCounter: TotalCounter[];
}
