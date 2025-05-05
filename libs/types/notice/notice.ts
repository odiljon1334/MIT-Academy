export interface Notice {
	_id: string;
	noticeCategory: string;
	noticeStatus: string;
	noticeTitle: string;
	noticeContent: string;
	memberId: string;
	event: boolean;
	memberData: {
		_id: string;
		memberType: string;
		memberStatus: string;
		memberAuthType: string;
		memberPhone: string;
		memberNick: string;
		memberPosition: string;
		memberFullName: string;
		memberImage: string;
		memberAddress: string;
		memberDesc: string;
		memberRank: number;
		memberPoints: number;
		memberLikes: number;
		memberViews: number;
	};
	constructedAt: Date;
	deletedAt?: Date;
	createdAt: Date;
	updatedAt: Date;
}

export interface TotalNoticeCounter {
	total: number;
}

export interface Notices {
	list: [];
	metaCounter: TotalNoticeCounter[];
}
