import React, { useCallback, useEffect, useState } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Button, Stack, Typography } from '@mui/material';
import axios from 'axios';
import { Messages, REACT_APP_API_URL } from '../../config';
import { getJwtToken, updateStorage, updateUserInfo } from '../../auth';
import { useMutation, useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { MemberUpdate } from '../../types/member/member.update';
import { UPDATE_MEMBER } from '../../../apollo/user/mutation';
import { sweetErrorHandling, sweetMixinSuccessAlert } from '../../sweetAlert';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';

const MyProfile: NextPage = ({ initialValues, ...props }: any) => {
	const device = useDeviceDetect();
	const token = getJwtToken();
	const user = useReactiveVar(userVar);
	const [updateData, setUpdateData] = useState<MemberUpdate>(initialValues);

	/** APOLLO REQUESTS **/
	const [updateMember] = useMutation(UPDATE_MEMBER);

	/** LIFECYCLES **/
	useEffect(() => {
		setUpdateData({
			...updateData,
			memberNick: user.memberNick,
			memberPhone: user.memberPhone,
			memberAddress: user.memberAddress,
			memberImage: user.memberImage,
		});
	}, [user]);

	/** HANDLERS **/
	const uploadImage = async (e: any) => {
		try {
			const image = e.target.files[0];
			console.log('+image:', image);

			const formData = new FormData();
			formData.append(
				'operations',
				JSON.stringify({
					query: `mutation ImageUploader($file: Upload!, $target: String!) {
						imageUploader(file: $file, target: $target) 
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

			const responseImage = response.data.data.imageUploader;
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
						<Typography className="main-title">My Profile</Typography>
						<Typography className="sub-title">We are glad to see you again!</Typography>
					</Stack>
				</Stack>
				<Stack className="top-box bg-neutral-50 dark:bg-slate-900 border border-solid dark:border-neutral-600 border-neutral-300">
					<Stack className="photo-box">
						<Typography className="title">Photo</Typography>
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
									<Typography>Upload Profile Image</Typography>
								</label>
								<Typography className="upload-text">A photo must be in JPG, JPEG or PNG format!</Typography>
							</Stack>
						</Stack>
					</Stack>
					<Stack className="small-input-box">
						<Stack className="input-box">
							<Typography className="title">Username</Typography>
							<input
								className="border border-solid border-neutral-300 dark:border-neutral-700 placeholder-neutral-700 text-neutral-700"
								type="text"
								placeholder="Your username"
								value={updateData.memberNick}
								onChange={({ target: { value } }) => setUpdateData({ ...updateData, memberNick: value })}
							/>
						</Stack>
						<Stack className="input-box">
							<Typography className="title">Phone</Typography>
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
						<Typography className="title">Address</Typography>
						<input
							className="border border-solid border-neutral-300 dark:border-neutral-700 placeholder-neutral-700 text-neutral-700"
							type="text"
							placeholder="Your address"
							value={updateData.memberAddress}
							onChange={({ target: { value } }) => setUpdateData({ ...updateData, memberAddress: value })}
						/>
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
	},
};

export default MyProfile;
