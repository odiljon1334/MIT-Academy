import { NextPage } from 'next';
import useDeviceDetect from '../libs/hooks/useDeviceDetect';
import withLayoutMain from '../libs/components/layout/LayoutHome';
import CommunityBoards from '../libs/components/homepage/CommunityBoards';
import { Stack } from '@mui/material';
import Advertisement from '../libs/components/homepage/Advertisement';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import HeaderContainer from '../libs/components/common/HeaderContainer';
import PopularCourses from '../libs/components/homepage/PopularCourses';
import TrendCourses from '../libs/components/homepage/TrendCourses';
import TopCourses from '../libs/components/homepage/TopCourses';
import TopInstructor from '../libs/components/homepage/TopInstructors';
import { useEffect, useRef } from 'react';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const Home: NextPage = () => {
	const device = useDeviceDetect();
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

	if (device === 'mobile') {
		return (
			<Stack className={'home-page'}>
				<TrendCourses />
				<PopularCourses />
				<Advertisement />
				<TopCourses />
				<TopInstructor />
			</Stack>
		);
	} else {
		return (
			<Stack className={'home-page relative'}>
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
				<HeaderContainer />
				<TrendCourses />
				<PopularCourses />
				<Advertisement />
				<TopCourses />
				<TopInstructor />
				<CommunityBoards />
			</Stack>
		);
	}
};

export default withLayoutMain(Home);
