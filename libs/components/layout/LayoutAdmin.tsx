import type { ComponentType } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import MenuList from '../admin/AdminMenuList';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { CardContent, Menu, MenuItem } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import { getJwtToken, logOut, updateUserInfo } from '../../auth';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { REACT_APP_API_URL } from '../../config';
import { MemberType } from '../../enums/member.enum';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
const drawerWidth = 280;

const withAdminLayout = (Component: ComponentType) => {
	return (props: object) => {
		const router = useRouter();
		const user = useReactiveVar(userVar);
		const [settingsState, setSettingsStateState] = useState(false);
		const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
		const [openMenu, setOpenMenu] = useState(false);
		const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
		const [title, setTitle] = useState('admin');
		const [loading, setLoading] = useState(true);
		const canvasRef = useRef<HTMLCanvasElement>(null);
		const [currentTime, setCurrentTime] = useState(new Date());

		// Particle effect
		useEffect(() => {
			const canvas = canvasRef.current;
			if (!canvas) return;

			const ctx = canvas.getContext('2d');
			if (!ctx) return;

			canvas.width = canvas.offsetWidth;
			canvas.height = canvas.offsetHeight;

			const particles: Particle[] = [];
			const particleCount = 100;

			class Particle {
				x: number;
				y: number;
				size: number;
				speedX: number;
				speedY: number;
				color: string;

				constructor() {
					this.x = Math.random() * (canvas?.width || 0);
					this.y = Math.random() * (canvas?.height || 0);
					this.size = Math.random() * 3 + 1;
					this.speedX = (Math.random() - 0.5) * 0.5;
					this.speedY = (Math.random() - 0.5) * 0.5;
					this.color = `rgba(${Math.floor(Math.random() * 100) + 100}, ${Math.floor(Math.random() * 100) + 150}, ${
						Math.floor(Math.random() * 55) + 200
					}, ${Math.random() * 0.5 + 0.2})`;
				}

				update() {
					this.x += this.speedX;
					this.y += this.speedY;

					if (canvas && this.x > canvas.width) this.x = 0;
					if (canvas && this.x < 0) this.x = canvas.width;
					if (canvas && this.y > canvas.height) this.y = 0;
					if (canvas && this.y < 0) this.y = canvas.height;
				}

				draw() {
					if (!ctx) return;
					ctx.fillStyle = this.color;
					ctx.beginPath();
					ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
					ctx.fill();
				}
			}

			for (let i = 0; i < particleCount; i++) {
				particles.push(new Particle());
			}

			function animate() {
				if (!ctx || !canvas) return;
				ctx.clearRect(0, 0, canvas.width, canvas.height);

				for (const particle of particles) {
					particle.update();
					particle.draw();
				}

				requestAnimationFrame(animate);
			}

			animate();

			const handleResize = () => {
				if (!canvas) return;
				canvas.width = canvas.offsetWidth;
				canvas.height = canvas.offsetHeight;
			};

			window.addEventListener('resize', handleResize);

			return () => {
				window.removeEventListener('resize', handleResize);
			};
		}, []);

		// Update time
		useEffect(() => {
			const interval = setInterval(() => {
				setCurrentTime(new Date());
			}, 1000);

			return () => clearInterval(interval);
		}, []);

		// Format time
		const formatTime = (date: Date) => {
			return date.toLocaleTimeString('en-US', {
				hour12: false,
				hour: '2-digit',
				minute: '2-digit',
				second: '2-digit',
			});
		};

		// Format date
		const formatDate = (date: Date) => {
			return date.toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'short',
				day: 'numeric',
			});
		};

		/** LIFECYCLES **/
		useEffect(() => {
			const jwt = getJwtToken();
			if (jwt) updateUserInfo(jwt);
			setLoading(false);
		}, []);

		useEffect(() => {
			if (!loading && user.memberType !== MemberType.ADMIN) {
				router.push('/').then();
			}
		}, [loading, user, router]);

		/** HANDLERS **/
		const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
			setAnchorElUser(event.currentTarget);
		};

		const handleCloseUserMenu = () => {
			setAnchorElUser(null);
		};

		const logoutHandler = () => {
			logOut();
			router.push('/').then();
		};

		if (!user || user?.memberType !== MemberType.ADMIN) return null;

		return (
			<main
				id="pc-wrap-admin"
				className="min-h-screen space-x-4 bg-gradient-to-br from-black to-slate-900 text-slate-100 relative overflow-hidden"
			>
				<canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-30" />
				<Box component={'div'} sx={{ display: 'flex', justifyContent: 'space-between', gap: 5 }}>
					<div>
						<AppBar
							position="fixed"
							sx={{
								ml: `${drawerWidth}px`,
								boxShadow: 'rgb(100 116 139 / 12%) 0px 1px 4px',
								background: 'none',
							}}
							className="container mr-[400px]"
						>
							<Toolbar>
								<Tooltip title="Open settings">
									<IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
										<Avatar
											src={
												user?.memberImage ? `${REACT_APP_API_URL}/${user?.memberImage}` : '/img/profile/defaultUser.svg'
											}
										/>
									</IconButton>
								</Tooltip>
								<Menu
									sx={{ mt: '45px' }}
									id="menu-appbar"
									className={'pop-menu'}
									anchorEl={anchorElUser}
									anchorOrigin={{
										vertical: 'top',
										horizontal: 'right',
									}}
									keepMounted
									transformOrigin={{
										vertical: 'top',
										horizontal: 'right',
									}}
									open={Boolean(anchorElUser)}
									onClose={handleCloseUserMenu}
								>
									<Box component={'div'} onClick={handleCloseUserMenu}>
										<Stack sx={{ px: '20px' }}>
											<Typography variant={'h6'} component={'h6'} sx={{ mb: '4px' }}>
												{user?.memberNick}
											</Typography>
											<Typography variant={'subtitle1'} component={'p'} color={'#757575'}>
												{user?.memberPhone}
											</Typography>
										</Stack>
										<Divider />
										<Box component={'div'} sx={{ p: 1, py: '6px' }} onClick={logoutHandler}>
											<MenuItem sx={{ px: '16px', py: '6px' }}>
												<Typography variant={'subtitle1'} component={'span'}>
													Logout
												</Typography>
											</MenuItem>
										</Box>
									</Box>
								</Menu>
							</Toolbar>
						</AppBar>
					</div>

					<div className="aside bg-slate-900/50 border-[1.5px] border-cyan-700 border-solid rounded backdrop-blur-sm overflow-hidden">
						<Toolbar sx={{ flexDirection: 'column', alignItems: 'flexStart' }}>
							<div className={'flex flex-col space-x-2 h-full mb-10 mt-10'}>
								<div className="flex flex-col items-center">
									<BookOpen
										className="w-20 h-20"
										style={{
											stroke: 'url(#gradient)',
										}}
									/>

									<svg width="0" height="0">
										<defs>
											<linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
												<stop offset="0%" stopColor="#c7d2fe" />
												<stop offset="50%" stopColor="white" stopOpacity="0.9" />
												<stop offset="100%" stopColor="#fda4af" />
											</linearGradient>
										</defs>
									</svg>

									<motion.span className="font-openSans font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300 text-[24px] outline-none">
										EDUcampus
									</motion.span>
								</div>
							</div>

							<Stack
								className="user bg-slate-900/50 border border-solid border-cyan-700  backdrop-blur overflow-hidden"
								direction={'row'}
								alignItems={'center'}
								sx={{
									borderRadius: '8px',
									px: '24px',
									py: '11px',
								}}
							>
								<Avatar
									src={user?.memberImage ? `${REACT_APP_API_URL}/${user?.memberImage}` : '/img/profile/defaultUser.svg'}
								/>
								<Typography variant={'body2'} p={1} ml={1}>
									{user?.memberNick} <br />
									<p className="bg-slate-400/50 p-1 mt-1">{user?.memberPhone}</p>
								</Typography>
							</Stack>
						</Toolbar>

						<Divider sx={{ border: '1px solid #0e7490' }} />

						<MenuList />
					</div>

					<div className="border-[1.5px] border-solid rounded-lg w-[1300px] h-auto p-8 bg-slate-900/50 border-cyan-700  backdrop-blur overflow-hidden">
						<Box component={'div'} id="bunker" sx={{ flexGrow: 1 }}>
							{/*@ts-ignore*/}
							<Component {...props} setSnackbar={setSnackbar} setTitle={setTitle} />
						</Box>
					</div>
					<div className="w-[350px]  p-2 relative rounded-lg border-[1.5px] border-solid border-cyan-700">
						{/* System time */}
						<div className="bg-slate-900/50 border-slate-700/50 backdrop-blur-lg rounded overflow-hidden p-0">
							<CardContent className="p-0">
								<div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-md">
									<div className="text-center">
										<div className="text-xs text-slate-500 mb-1 font-mono font-semibold">SYSTEM TIME</div>
										<div className="text-3xl font-mono text-cyan-400 mb-1">{formatTime(currentTime)}</div>
										<div className="text-sm text-slate-400 font-sans font-semibold">{formatDate(currentTime)}</div>
									</div>
								</div>
								<div className="py-4">
									<div className="grid grid-cols-2 gap-3">
										<div className="bg-slate-800/50 rounded-md p-3 border border-slate-700/50">
											<div className="text-xs text-slate-500 mb-1">Uptime</div>
											<div className="text-sm font-mono text-slate-200">14d 06:42:18</div>
										</div>
										<div className="bg-slate-800/50 rounded-md p-3 border border-slate-700/50">
											<div className="text-xs text-slate-500 mb-1">Time Zone</div>
											<div className="text-sm font-mono text-slate-200">UTC-08:00</div>
										</div>
									</div>
								</div>
							</CardContent>
						</div>
					</div>
				</Box>
			</main>
		);
	};
};

export default withAdminLayout;
