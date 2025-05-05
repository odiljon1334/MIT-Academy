import { Direction } from '../../enums/common.enum';
import { NoticeCategory, NoticeStatus } from '../../enums/notice.enum';

export interface NoticeInput {
	noticeCategory: string;
	noticeStatus: string;
	noticeTitle: string;
	noticeContent: string;
	event: boolean;
	memberId: string;
	constructedAt: Date;
	createdAt: Date;
	updatedAt: Date;
	deletedAt?: Date;
}

export interface NoticeInputUpdate {
	noticeCategory?: string;
	noticeStatus?: string;
	noticeTitle?: string;
	noticeContent?: string;
	event?: boolean;
	memberId?: string;
	constructedAt?: Date;
	createdAt?: Date;
	updatedAt?: Date;
	deletedAt?: Date;
}

interface NoticeSearch {
	categoryList?: NoticeCategory[];
	typeList?: NoticeStatus[];
	text?: string;
}

export interface NoticeInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search?: NoticeSearch;
}
