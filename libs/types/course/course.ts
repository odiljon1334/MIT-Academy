import { CourseCategory, CourseStatus, CourseType } from '../../enums/property.enum';
import { Member } from '../member/member';

export interface MeLiked {
	memberId: string;
	likeRefId: string;
	myFavorite: boolean;
}

export interface TotalCounter {
	total: number;
}

export interface Course {
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
		moduleOrder: number;
		lessons: {
			_id: string;
			lessonTitle: string;
			lessonOrder: number;
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
	/** from aggregation **/
	meLiked?: MeLiked[];
	memberData?: Member;
}

export interface Courses {
	list: Course[];
	metaCounter: TotalCounter[];
}
