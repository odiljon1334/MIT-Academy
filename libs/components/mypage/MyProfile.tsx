import React, { useCallback, useEffect, useState } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Button, FormControl, InputLabel, MenuItem, Select, Stack, Typography } from '@mui/material';
import axios from 'axios';
import { Messages, REACT_APP_API_URL } from '../../config';
import { getJwtToken, updateStorage, updateUserInfo } from '../../auth';
import { useMutation, useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { MemberUpdate } from '../../types/member/member.update';
import { UPDATE_MEMBER } from '../../../apollo/user/mutation';
import { sweetErrorHandling, sweetMixinSuccessAlert } from '../../sweetAlert';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import { MemberPosition } from '../../enums/member.enum';

const MyProfile: NextPage = ({ initialValues, ...props }: any) => {
	const device = useDeviceDetect();
	const token = getJwtToken();
	const user = useReactiveVar(userVar);
	const [updateData, setUpdateData] = useState<MemberUpdate>(initialValues);

	/** APOLLO REQUESTS **/
	const [updateMember] = useMutation(UPDATE_MEMBER);

	/** LIFECYCLES **/
	useEffect(() => {
		setUpdateData((prevState) => ({
			...prevState,
			memberNick: user.memberNick,
			memberPhone: user.memberPhone,
			memberAddress: user.memberAddress,
			memberPosition: user.memberPosition as MemberPosition,
			memberImage: user.memberImage,
		}));
	}, [user]);
	console.log('user:', user);

	/** HANDLERS **/
	const uploadImage = async (e: any) => {
		try {
			const image = e.target.files[0];
			console.log('+image:', image);

			const formData = new FormData();
			formData.append(
				'operations',
				JSON.stringify({
					query: `mutation fileUploader($file: Upload!, $target: String!) {
						fileUploader(file: $file, target: $target) 
				  }`,
					variables: {
						file: null,
						target: 'member',
					},
				}),
			);
			formData.append(
				'map',
				JSON.stringify({
					'0': ['variables.file'],
				}),
			);
			formData.append('0', image);

			const response = await axios.post(`${process.env.REACT_APP_API_GRAPHQL_URL}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					'apollo-require-preflight': true,
					Authorization: `Bearer ${token}`,
				},
			});

			const responseImage = response.data.data.fileUploader;
			console.log('+responseImage: ', responseImage);
			updateData.memberImage = responseImage;
			setUpdateData({ ...updateData });

			return `${REACT_APP_API_URL}/${responseImage}`;
		} catch (err) {
			console.log('Error, uploadImage:', err);
		}
	};

	const updatePropertyHandler = useCallback(async () => {
		try {
			if (!user._id) throw new Error(Messages.error2);
			updateData._id = user._id;
			const result = await updateMember({
				variables: {
					input: updateData,
				},
			});

			// @ts-ignore
			const jwtToken = result.data.updateMember?.accessToken;
			updateStorage({ jwtToken });
			updateUserInfo(result.data.updateMember?.accessToken);
			await sweetMixinSuccessAlert('Information updated successfully');
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	}, [updateData]);

	const doDisabledCheck = () => {
		if (
			updateData.memberNick === '' ||
			updateData.memberPhone === '' ||
			updateData.memberAddress === '' ||
			updateData.memberPosition === ('' as MemberPosition) ||
			updateData.memberImage === ''
		) {
			return true;
		}
	};

	console.log('+updateData', updateData);

	if (device === 'mobile') {
		return <>MY PROFILE PAGE MOBILE</>;
	} else
		return (
			<div id="my-profile-page">
				<Stack className="main-title-box">
					<Stack className="right-box">
						<Typography className="main-title text-neutral-800 dark:text-slate-200">My Profile</Typography>
						<Typography className="sub-title text-slate-500">Welcome back to EduCampus!!</Typography>
					</Stack>
				</Stack>
				<Stack className="top-box bg-neutral-50 dark:bg-slate-900 border border-solid dark:border-neutral-600 border-neutral-300">
					<Stack className="photo-box">
						<Typography className="title text-neutral-800 dark:text-slate-200">Photo</Typography>
						<Stack className="image-big-box">
							<Stack className="image-box">
								<img
									src={
										updateData?.memberImage
											? `${REACT_APP_API_URL}/${updateData?.memberImage}`
											: `/img/profile/defaultUser.svg`
									}
									alt=""
								/>
							</Stack>
							<Stack className="upload-big-box">
								<input
									type="file"
									hidden
									id="hidden-input"
									onChange={uploadImage}
									accept="image/jpg, image/jpeg, image/png"
								/>
								<label
									htmlFor="hidden-input"
									className="labeler border border-solid border-neutral-500 dark:border-neutral-400 hover:underline"
								>
									<Typography className="text-neutral-800 dark:text-slate-200">Upload Profile Image</Typography>
								</label>
								<Typography className="upload-text text-slate-500">
									A photo must be in JPG, JPEG or PNG format!
								</Typography>
							</Stack>
						</Stack>
					</Stack>
					<Stack className="small-input-box">
						<Stack className="input-box">
							<Typography className="title text-neutral-800 dark:text-slate-200">Username</Typography>
							<input
								className="border border-solid border-neutral-300 dark:border-neutral-700 placeholder-neutral-700 text-neutral-700"
								type="text"
								placeholder="Your username"
								value={updateData.memberNick}
								onChange={({ target: { value } }) => setUpdateData({ ...updateData, memberNick: value })}
							/>
						</Stack>
						<Stack className="input-box">
							<Typography className="title text-neutral-800 dark:text-slate-200">Phone</Typography>
							<input
								className="border border-solid border-neutral-300 dark:border-neutral-700 placeholder-neutral-700 text-neutral-700"
								type="text"
								placeholder="Your Phone"
								value={updateData.memberPhone}
								onChange={({ target: { value } }) => setUpdateData({ ...updateData, memberPhone: value })}
							/>
						</Stack>
					</Stack>
					<Stack className="address-box">
						<div className="flex flex-row items-center w-full space-x-8">
							<label
								htmlFor=""
								className="w-full flex flex-col text-neutral-800 dark:text-slate-200 text-md font-openSans font-semibold"
							>
								Address
								<input
									className="font-openSans font-normal border border-solid border-neutral-300 dark:border-neutral-700 placeholder-neutral-700 text-neutral-700"
									type="text"
									placeholder="Your address"
									value={updateData.memberAddress}
									onChange={({ target: { value } }) => setUpdateData({ ...updateData, memberAddress: value })}
								/>
							</label>
							<FormControl className="w-full mt-5">
								<Select
									color="success"
									className="font-openSans font-normal bg-white rounded-md text-slate-950"
									labelId="demo-simple-select-label"
									id="demo-simple-select"
									value={updateData.memberPosition || ''}
									onChange={(event) =>
										setUpdateData({ ...updateData, memberPosition: event.target.value as MemberPosition })
									}
								>
									{Object.values(MemberPosition).map((position) => (
										<MenuItem key={position.length} value={position} sx={{ borderRadius: '8px' }}>
											{position}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</div>
					</Stack>
					<Stack className="about-me-box">
						<Button
							className="update-button bg-neutral-900 text-slate-200 hover:bg-neutral-700"
							onClick={updatePropertyHandler}
							disabled={doDisabledCheck()}
						>
							<Typography>Update Profile</Typography>
							<ArrowOutwardIcon fontSize="medium" />
						</Button>
					</Stack>
				</Stack>
			</div>
		);
};

MyProfile.defaultProps = {
	initialValues: {
		_id: '',
		memberImage: '',
		memberNick: '',
		memberPhone: '',
		memberAddress: '',
		memberPosition: '',
	},
};

export default MyProfile;
