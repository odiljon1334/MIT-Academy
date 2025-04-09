import { CourseCategory, CourseStatus, CourseType } from '../../enums/property.enum';
import { Direction } from '../../enums/common.enum';

export interface CourseInput {
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
	memberId?: string;
	constructedAt?: Date;
}

interface PISearch {
	memberId?: string;
	categoryList?: CourseCategory[];
	typeList?: CourseType[];
	options?: string[];
	text?: string;
}

export interface CoursesInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: PISearch;
}

interface APISearch {
	courseStatus?: CourseStatus;
}

export interface InstructorCoursesInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: APISearch;
}

interface ALPISearch {
	courseStatus?: CourseStatus;
	courseCategory?: CourseCategory[];
}

export interface AllCoursesInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: ALPISearch;
}
