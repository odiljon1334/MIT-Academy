import { CourseCategory, CourseStatus, CourseType } from '../../enums/property.enum';

export interface CourseUpdate {
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
		moduleTitle: string;
		moduleOrder: number;
		lessons: {
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
}
