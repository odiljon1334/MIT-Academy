import React, { useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import Head from 'next/head';
import Top from '../Top';
import Footer from '../Footer';
import { Stack } from '@mui/material';
import { getJwtToken, updateUserInfo } from '../../auth';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import IconBreadcrumbs from './IconBreadcrumbs';
import TopContent from '../course/Top';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const withLayoutFull = (Component: any) => {
	return (props: any) => {
		const router = useRouter();
		const device = useDeviceDetect();
		const user = useReactiveVar(userVar);
		const showBreadcrumbs = !['/login', '/signup'].includes(router.pathname);

		const canvasRef = useRef<HTMLCanvasElement>(null);

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

		/** LIFECYCLES **/
		useEffect(() => {
			const jwt = getJwtToken();
			if (jwt) updateUserInfo(jwt);
		}, []);

		const memoizedValues = useMemo(() => {
			switch (router.pathname) {
				case '/course':
					break;
				case '/course/detail':
					break;
				case '/course/lesson':
					break;
				default:
					break;
			}
		}, [router.pathname]);

		/** HANDLERS **/

		if (device == 'mobile') {
			return (
				<>
					<Head>
						<title>EDUcampus</title>
						<meta name={'title'} content={`EDUcampus`} />
					</Head>
					<Stack id="mobile-wrap">
						<Stack id={'top'}>
							<Top />
						</Stack>

						<Stack id={'main'}>
							<Component {...props} />
						</Stack>

						<Stack id={'footer'}>
							<Footer />
						</Stack>
					</Stack>
				</>
			);
		} else {
			return (
				<>
					<Head>
						<title>EDUcampus</title>
						<meta name={'title'} content={`EDUcampus`} />
					</Head>
					<Stack id="pc-wrap" className="w-full min-h-screen">
						<Stack id={'top'}>
							<Top />
						</Stack>
						<div className="relative">
							<TopContent />
						</div>
						<Stack id={'main'} className="relative">
							<div className="absolute inset-0 bg-gradient-to-b dark:from-slate-950 dark:to-slate-900 from-white to-gray-200">
								{/* Grid pattern overlay */}
								<div
									className="absolute inset-0 transition-colors duration-300"
									style={
										{
											backgroundImage: `
											linear-gradient(to right, var(--grid-color) 2px, transparent 2px),
											linear-gradient(to bottom, var(--grid-color) 2px, transparent 2px)
											`,
											backgroundSize: '150px 150px',
											maskImage: 'linear-gradient(to bottom, transparent, black 20%, black 90%, transparent)',
											'--grid-color': 'rgb(148 163 184 / 0.1)',
										} as React.CSSProperties
									}
								/>
							</div>
							<canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-30" />
							{showBreadcrumbs && <IconBreadcrumbs />}
							<Component {...props} />
						</Stack>

						<Stack id={'footer'} className="relative bg-slate-950">
							<Footer />
						</Stack>
					</Stack>
				</>
			);
		}
	};
};

export default withLayoutFull;
