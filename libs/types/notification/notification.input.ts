import { Direction } from '../../enums/common.enum';
import { NotificationStatus, NotificationType } from '../../enums/notification.enum';

export interface NotificationInput {
	notificationType: NotificationType;
	notificationStatus: NotificationStatus;
	notificationGroup: string;
	notificationTitle: string;
	notificationDesc?: string;
	receiverId: string;
	authorId: string;
	courseId?: string;
	articleId?: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface Search {
	notificationType?: NotificationType[];
	notificationGroup?: NotificationStatus[];
}

export interface NotifInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search?: Search[];
}
