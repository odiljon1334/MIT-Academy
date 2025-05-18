import React, { useCallback, useState } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Box, Button, Checkbox, FormControlLabel, FormGroup, Stack } from '@mui/material';
import { useRouter } from 'next/router';
import { logIn, signUp } from '../../libs/auth';
import { sweetMixinErrorAlert } from '../../libs/sweetAlert';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { MemberPosition } from '../../libs/enums/member.enum';
import { motion } from 'framer-motion';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const Join: NextPage = () => {
	const router = useRouter();
	const device = useDeviceDetect();
	const [input, setInput] = useState({ nick: '', password: '', phone: '', type: 'USER', position: '' });
	const [loginView, setLoginView] = useState<boolean>(true);
	const [memberPosition, setMemberPosition] = useState<MemberPosition | ''>('');
	const [svgColor, setSvgColor] = useState('url(#gradientId)');

	/** HANDLERS **/
	const viewChangeHandler = (state: boolean) => {
		setLoginView(state);
	};

	const checkUserTypeHandler = (e: any) => {
		const checked = e.target.checked;
		if (checked) {
			const value = e.target.name;
			handleInput('type', value);
		} else {
			handleInput('type', 'USER');
		}
	};

	const handleInput = useCallback((name: any, value: any) => {
		setInput((prev) => {
			return { ...prev, [name]: value };
		});
	}, []);

	const doLogin = useCallback(async () => {
		console.warn(input);
		try {
			await logIn(input.nick, input.password);
			await router.push(`${router.query.referrer ?? '/'}`);
		} catch (err: any) {
			await sweetMixinErrorAlert(err.message);
		}
	}, [input]);

	const doSignUp = useCallback(async () => {
		console.warn(input);
		console.log('input:', input);

		const finalPosition = input.position === '' ? MemberPosition.STUDENT : input.position;

		try {
			await signUp(input.nick, input.password, input.phone, input.type, finalPosition);
			await router.push(`${router.query.referrer ?? '/'}`);
		} catch (err: any) {
			await sweetMixinErrorAlert(err.message);
		}
	}, [input]);

	const svg = {
		start: { pathLength: 0, fillOpacity: 0, fill: 'rgba(255, 255, 255, 0)' },
		end: {
			pathLength: 1,
			fillOpacity: 1,
			transition: { duration: 13 },
		},
	};

	if (device === 'mobile') {
		return <div>LOGIN MOBILE</div>;
	} else {
		return (
			<Stack className={'join-page'}>
				<Stack className={'container'}>
					<Stack className={'main bg-slate-900'}>
						<Stack className={'left'}>
							{/* @ts-ignore */}
							<Box
								className={
									'logo font-openSans font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300 text-[24px]'
								}
							>
								<svg
									className="w-[60px] h-auto"
									focusable="false"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 640 512"
								>
									<defs>
										<linearGradient id="gradientId" x1="0%" y1="0%" x2="100%" y2="0%">
											<stop offset="0%" stopColor="#a5b4fc" />
											<stop offset="50%" stopColor="rgba(255, 255, 255, 0.9)" />
											<stop offset="100%" stopColor="#fda4af" />
										</linearGradient>
									</defs>
									<motion.path
										variants={svg}
										initial="start"
										animate="end"
										stroke="white"
										strokeWidth={5}
										style={{ fill: svgColor }}
										d="M512 337.2l0-284.8L344 77l0 296 168-35.8zM296 373l0-296L128 52.4l0 284.8L296 373zM523.4 2.2C542.7-.7 560 14.3 560 33.8l0 316.3c0 15.1-10.6 28.1-25.3 31.3l-201.3 43c-8.8 1.9-17.9 1.9-26.7 0l-201.3-43C90.6 378.3 80 365.2 80 350.1L80 33.8C80 14.3 97.3-.7 116.6 2.2L320 32 523.4 2.2zM38.3 23.7l10.2 2c-.3 2.7-.5 5.4-.5 8.1l0 40.7 0 267.6 0 66.7 265.8 54.5c2 .4 4.1 .6 6.2 .6s4.2-.2 6.2-.6L592 408.8l0-66.7 0-267.6 0-40.7c0-2.8-.2-5.5-.5-8.1l10.2-2C621.5 19.7 640 34.8 640 55l0 366.9c0 15.2-10.7 28.3-25.6 31.3L335.8 510.4c-5.2 1.1-10.5 1.6-15.8 1.6s-10.6-.5-15.8-1.6L25.6 453.2C10.7 450.2 0 437.1 0 421.9L0 55C0 34.8 18.5 19.7 38.3 23.7z"
									></motion.path>
								</svg>
								<span>EDUcampus</span>
							</Box>
							<Box className={'info text-slate-50'}>
								<span>{loginView ? 'login' : 'signup'}</span>
								<p className="text-slate-500">
									Securely {loginView ? 'Login' : 'Sign'} with your EDUcampus account to access multiple services.
								</p>
							</Box>
							<Box className={'input-wrap'}>
								<div className={'input-box'}>
									<span className="text-slate-50">Nickname</span>
									<input
										type="text"
										placeholder={'Enter Nickname'}
										onChange={(e) => handleInput('nick', e.target.value)}
										required={true}
										onKeyDown={(event) => {
											if (event.key == 'Enter' && loginView) doLogin();
											if (event.key == 'Enter' && !loginView) doSignUp();
										}}
									/>
								</div>
								<div className={'input-box'}>
									<span className="text-slate-50">Password</span>
									<input
										type="text"
										placeholder={'Enter Password'}
										onChange={(e) => handleInput('password', e.target.value)}
										required={true}
										onKeyDown={(event) => {
											if (event.key == 'Enter' && loginView) doLogin();
											if (event.key == 'Enter' && !loginView) doSignUp();
										}}
									/>
								</div>
								{!loginView && (
									<div className={'input-box'}>
										<span className="text-slate-50">Phone</span>
										<input
											type="text"
											placeholder={'Enter Phone'}
											onChange={(e) => handleInput('phone', e.target.value)}
											required={true}
											onKeyDown={(event) => {
												if (event.key == 'Enter') doSignUp();
											}}
										/>
									</div>
								)}
								{input?.type === 'INSTRUCTOR' && (
									<div className="mt-4">
										<label className="mb-2">
											<p className="text-slate-50">Instructor Type</p>
											<select
												className="p-4 w-full border border-solid border-neutral-300 dark:border-neutral-600 rounded-md"
												onChange={(e) => handleInput('position', e.target.value as MemberPosition)}
											>
												<option className="flex flex-col items-center justify-around text-slate-900" value="">
													Select Position
												</option>
												{Object.values(MemberPosition).map((position) => (
													<option key={position} value={position}>
														{position}
													</option>
												))}
											</select>
										</label>
									</div>
								)}
							</Box>
							<Box className={'register'}>
								{!loginView && (
									<div className={'type-option'}>
										<span className={'text text-slate-500'}>I want to be registered as:</span>
										<div>
											<FormGroup>
												<FormControlLabel
													className="text-slate-50"
													control={
														<Checkbox
															size="small"
															name={'USER'}
															onChange={checkUserTypeHandler}
															checked={input?.type == 'USER'}
															color="success"
														/>
													}
													label="User"
												/>
											</FormGroup>
											<FormGroup>
												<FormControlLabel
													className="text-slate-50"
													control={
														<Checkbox
															size="small"
															name={'INSTRUCTOR'}
															onChange={checkUserTypeHandler}
															checked={input?.type == 'INSTRUCTOR'}
															color="success"
														/>
													}
													label="Instructor"
												/>
											</FormGroup>
										</div>
									</div>
								)}

								{loginView && (
									<div className={'remember-info text-slate-50'}>
										<FormGroup>
											<FormControlLabel control={<Checkbox defaultChecked size="small" />} label="Remember me" />
										</FormGroup>
										<a className="text-slate-50">Lost your password?</a>
									</div>
								)}

								{loginView ? (
									<Button
										variant="contained"
										endIcon={<img src="/img/icons/rightup.svg" alt="" />}
										disabled={input.nick == '' || input.password == ''}
										onClick={doLogin}
									>
										LOGIN
									</Button>
								) : (
									<Button
										variant="contained"
										disabled={input.nick == '' || input.password == '' || input.phone == '' || input.type == ''}
										onClick={doSignUp}
										endIcon={<img src="/img/icons/rightup.svg" alt="" />}
									>
										SIGNUP
									</Button>
								)}
							</Box>
							<Box className={'ask-info text-slate-50'}>
								{loginView ? (
									<p className={'text-slate-500'}>
										Not registered yet?
										<b
											className={'text-slate-50 cursor-pointer'}
											onClick={() => {
												viewChangeHandler(false);
											}}
										>
											SIGNUP
										</b>
									</p>
								) : (
									<p className={'text-slate-500'}>
										Have account?
										<b className="text-slate-50" onClick={() => viewChangeHandler(true)}>
											{' '}
											LOGIN
										</b>
									</p>
								)}
							</Box>
						</Stack>
						<Stack className={'right'}></Stack>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default withLayoutBasic(Join);
