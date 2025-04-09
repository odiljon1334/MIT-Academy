import React, { useEffect, useRef } from 'react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import Head from 'next/head';
import Top from '../Top';
import Footer from '../Footer';
import { Stack } from '@mui/material';
import { userVar } from '../../../apollo/store';
import { useReactiveVar } from '@apollo/client';
import { getJwtToken, updateUserInfo } from '../../auth';
import Chat from '../Chat';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import HeroGeometric from '../homepage/HeroGeometrik';

const withLayoutMain = (Component: any) => {
	return (props: any) => {
		const device = useDeviceDetect();
		const user = useReactiveVar(userVar);

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

		/** HANDLERS **/

		if (device == 'mobile') {
			return (
				<>
					<Head>
						<title>EDUcampus</title>
						<meta name={'title'} content={`MIT Academy`} />
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
						<meta name={'title'} content={`MIT Academy`} />
					</Head>
					<Stack id="pc-wrap">
						<Stack id={'top'}>
							<Top />
						</Stack>

						<Stack className={'header-main'}>
							<HeroGeometric />
							<Stack className={'container'}>{/* <HeaderFilter /> */}</Stack>
						</Stack>
						<Stack id={'main'}>
							<canvas ref={canvasRef} className="absolute inset-0 w-full min-h-screen opacity-30" />
							<Component {...props} />
						</Stack>

						{user?._id && <Chat />}

						<Stack id={'footer'} className="bg-slate-950">
							<Footer />
						</Stack>
					</Stack>
				</>
			);
		}
	};
};

export default withLayoutMain;
