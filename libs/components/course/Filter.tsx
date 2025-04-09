import React, { useCallback, useEffect, useState } from 'react';
import { Stack, Typography, Checkbox, OutlinedInput, Tooltip, IconButton } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { CourseCategory, CourseType } from '../../enums/property.enum';
import { CoursesInquiry } from '../../types/course/course.input';
import { useRouter } from 'next/router';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import RefreshIcon from '@mui/icons-material/Refresh';
import { BookOpenCheck, Rocket as RocketIcon } from 'lucide-react';
import styled from 'styled-components';

interface FilterType {
	searchFilter: CoursesInquiry;
	setSearchFilter: any;
	initialInput: CoursesInquiry;
}

const GradientRocket = styled(RocketIcon as any)`
	stroke: url(#rocketGradient);
`;

const Filter = (props: FilterType) => {
	const { searchFilter, setSearchFilter, initialInput } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const [courseCategory, setCourseCategory] = useState<CourseCategory[]>(Object.values(CourseCategory));
	const [courseType, setCourseType] = useState<CourseType[]>(Object.values(CourseType));
	const [searchText, setSearchText] = useState<string>('');
	const [showMore, setShowMore] = useState<boolean>(false);

	/** LIFECYCLES **/
	useEffect(() => {
		if (searchFilter?.search?.categoryList?.length == 0) {
			delete searchFilter.search.categoryList;
			setShowMore(false);
			router
				.push(
					`/course?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					`/course?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					{ scroll: false },
				)
				.then();
		}

		if (searchFilter?.search?.typeList?.length == 0) {
			delete searchFilter.search.typeList;
			router
				.push(
					`/course?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					`/course?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					{ scroll: false },
				)
				.then();
		}

		if (searchFilter?.search?.options?.length == 0) {
			delete searchFilter.search.options;
			router
				.push(
					`/course?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					`/course?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					{ scroll: false },
				)
				.then();
		}

		if (searchFilter?.search?.categoryList) setShowMore(true);
	}, [searchFilter]);

	/** HANDLERS **/
	const courseLocationSelectHandler = useCallback(
		async (e: any) => {
			try {
				const isChecked = e.target.checked;
				const value = e.target.value;
				if (isChecked) {
					await router.push(
						`/course?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								categoryList: [...(searchFilter?.search?.categoryList || []), value],
							},
						})}`,
						`/course?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, categoryList: [...(searchFilter?.search?.categoryList || []), value] },
						})}`,
						{ scroll: false },
					);
				} else if (searchFilter?.search?.categoryList?.includes(value)) {
					await router.push(
						`/course?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								categoryList: searchFilter?.search?.categoryList?.filter((item: string) => item !== value),
							},
						})}`,
						`/course?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								categoryList: searchFilter?.search?.categoryList?.filter((item: string) => item !== value),
							},
						})}`,
						{ scroll: false },
					);
				}

				if (searchFilter?.search?.typeList?.length == 0) {
					alert('error');
				}

				console.log('courseLocationSelectHandler:', e.target.value);
			} catch (err: any) {
				console.log('ERROR, courseLocationSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const courseTypeSelectHandler = useCallback(
		async (e: any) => {
			try {
				const isChecked = e.target.checked;
				const value = e.target.value;
				if (isChecked) {
					await router.push(
						`/course?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, typeList: [...(searchFilter?.search?.typeList || []), value] },
						})}`,
						`/course?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, typeList: [...(searchFilter?.search?.typeList || []), value] },
						})}`,
						{ scroll: false },
					);
				} else if (searchFilter?.search?.typeList?.includes(value)) {
					await router.push(
						`/course?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								typeList: searchFilter?.search?.typeList?.filter((item: string) => item !== value),
							},
						})}`,
						`/course?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								typeList: searchFilter?.search?.typeList?.filter((item: string) => item !== value),
							},
						})}`,
						{ scroll: false },
					);
				}

				if (searchFilter?.search?.typeList?.length == 0) {
					alert('error');
				}

				console.log('courseTypeSelectHandler:', e.target.value);
			} catch (err: any) {
				console.log('ERROR, courseTypeSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const refreshHandler = async () => {
		try {
			setSearchText('');
			await router.push(
				`/course?input=${JSON.stringify(initialInput)}`,
				`/course?input=${JSON.stringify(initialInput)}`,
				{ scroll: false },
			);
		} catch (err: any) {
			console.log('ERROR, refreshHandler:', err);
		}
	};

	if (device === 'mobile') {
		return <div>Courses FILTER</div>;
	} else {
		return (
			<Stack className={'filter-main bg-slate-800'}>
				<Stack className={'find-your-home'} mb={'40px'}>
					<Typography className={'title-main text-slate-100'}>Find Course</Typography>
					<Stack className={'input-box'}>
						<OutlinedInput
							value={searchText}
							type={'text'}
							className={'search-input p-2 dark:text-slate-800'}
							placeholder={'What are you looking...?'}
							onChange={(e: any) => setSearchText(e.target.value)}
							onKeyDown={(event: any) => {
								if (event.key == 'Enter') {
									setSearchFilter({
										...searchFilter,
										search: { ...searchFilter.search, text: searchText },
									});
								}
							}}
							endAdornment={
								<>
									{searchText !== '' ? (
										<CancelRoundedIcon
											onClick={() => {
												setSearchText('');
												setSearchFilter({
													...searchFilter,
													search: { ...searchFilter.search, text: '' },
												});
											}}
										/>
									) : null}
								</>
							}
							sx={{
								'& .MuiOutlinedInput-notchedOutline': {
									border: 'none',
								},
							}}
						/>
						<img src={'/img/icons/search_icon.png'} alt={''} />
						<Tooltip title="Reset">
							<IconButton onClick={refreshHandler}>
								<RefreshIcon className="text-slate-300" />
							</IconButton>
						</Tooltip>
					</Stack>
				</Stack>
				<Stack className={'find-your-home'} mb={'30px'}>
					<p className={'title flex gap-2 text-slate-100 font-openSans font-semibold text-md'}>
						Course category <BookOpenCheck />
					</p>
					<Stack
						className={`property-location`}
						style={{ height: showMore ? '253px' : '115px' }}
						onMouseEnter={() => setShowMore(true)}
						onMouseLeave={() => {
							if (!searchFilter?.search?.categoryList) {
								setShowMore(false);
							}
						}}
					>
						{courseCategory.map((location: string) => {
							return (
								<Stack className={'input-box'} key={location}>
									<Checkbox
										id={location}
										className="property-checkbox"
										color="default"
										size="small"
										value={location}
										checked={(searchFilter?.search?.categoryList || []).includes(location as CourseCategory)}
										onChange={courseLocationSelectHandler}
									/>
									<label htmlFor={location} style={{ cursor: 'pointer' }}>
										<Typography className="property-type">{location}</Typography>
									</label>
								</Stack>
							);
						})}
					</Stack>
				</Stack>
				<Stack className={'find-your-home'} mb={'30px'}>
					<Typography className={'title flex items-center text-slate-100 font-openSans font-semibold gap-1'}>
						Level{' '}
						<svg width="30" height="28">
							<defs>
								<linearGradient id="rocketGradient" x1="0%" y1="0%" x2="100%" y2="100%">
									<stop offset="0%" stopColor="#FF4500" />
									<stop offset="50%" stopColor="#FFD700" />
									<stop offset="100%" stopColor="#FF6347" />
								</linearGradient>
							</defs>
							<GradientRocket />
						</svg>
					</Typography>
					{courseType.map((type: string) => (
						<Stack className={'input-box'} key={type}>
							<Checkbox
								id={type}
								className="property-checkbox"
								color="default"
								size="small"
								value={type}
								onChange={courseTypeSelectHandler}
								checked={(searchFilter?.search?.typeList || []).includes(type as CourseType)}
							/>
							<label style={{ cursor: 'pointer' }}>
								<Typography className="property-type">{type}</Typography>
							</label>
						</Stack>
					))}
				</Stack>
				<Stack className={'find-your-home'} mb={'30px'}></Stack>
			</Stack>
		);
	}
};

export default Filter;
