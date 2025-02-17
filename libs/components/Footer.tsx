import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import InstagramIcon from '@mui/icons-material/Instagram';
import TelegramIcon from '@mui/icons-material/Telegram';
import TwitterIcon from '@mui/icons-material/Twitter';
import useDeviceDetect from '../hooks/useDeviceDetect';
import { Stack, Box, Button } from '@mui/material';
import moment from 'moment';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import Link from 'next/link';

const Footer = () => {
	const device = useDeviceDetect();

	const Wrapper = styled(motion.div)`
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 10px;
	`;

	const svg = {
		start: { pathLength: 0, fillOpacity: 0, fill: 'rgba(255, 255, 255, 0)' },
		end: {
			pathLength: 1,
			fillOpacity: 1,
			transition: { duration: 13 },
		},
	};

	if (device == 'mobile') {
		return (
			<Stack className={'footer-container'}>
				<Stack className={'main'}>
					<Stack className={'left'}>
						<Box component={'div'} className={'footer-box'}>
							<Wrapper>
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
										style={{ fill: 'url(#gradientId)' }}
										d="M512 337.2l0-284.8L344 77l0 296 168-35.8zM296 373l0-296L128 52.4l0 284.8L296 373zM523.4 2.2C542.7-.7 560 14.3 560 33.8l0 316.3c0 15.1-10.6 28.1-25.3 31.3l-201.3 43c-8.8 1.9-17.9 1.9-26.7 0l-201.3-43C90.6 378.3 80 365.2 80 350.1L80 33.8C80 14.3 97.3-.7 116.6 2.2L320 32 523.4 2.2zM38.3 23.7l10.2 2c-.3 2.7-.5 5.4-.5 8.1l0 40.7 0 267.6 0 66.7 265.8 54.5c2 .4 4.1 .6 6.2 .6s4.2-.2 6.2-.6L592 408.8l0-66.7 0-267.6 0-40.7c0-2.8-.2-5.5-.5-8.1l10.2-2C621.5 19.7 640 34.8 640 55l0 366.9c0 15.2-10.7 28.3-25.6 31.3L335.8 510.4c-5.2 1.1-10.5 1.6-15.8 1.6s-10.6-.5-15.8-1.6L25.6 453.2C10.7 450.2 0 437.1 0 421.9L0 55C0 34.8 18.5 19.7 38.3 23.7z"
									></motion.path>
								</svg>
								<motion.span className="font-openSans font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300 text-[24px]">
									MIT Academy
								</motion.span>
							</Wrapper>
						</Box>
						<Box component={'div'} className={'footer-box'}>
							<span>total free customer care</span>
							<p>+82 10 4867 2909</p>
						</Box>
						<Box component={'div'} className={'footer-box'}>
							<span>nee live</span>
							<p>+82 10 4867 2909</p>
							<span>Support?</span>
						</Box>
						<Box component={'div'} className={'footer-box'}>
							<p>follow us on social media</p>
							<div className={'media-box'}>
								<FacebookOutlinedIcon />
								<TelegramIcon />
								<InstagramIcon />
								<TwitterIcon />
							</div>
						</Box>
					</Stack>
					<Stack className={'right'}>
						<Box component={'div'} className={'bottom'}>
							<div>
								<strong>Popular Search</strong>
								<span>Property for Rent</span>
								<span>Property Low to hide</span>
							</div>
							<div>
								<strong>Quick Links</strong>
								<span>Terms of Use</span>
								<span>Privacy Policy</span>
								<span>Pricing Plans</span>
								<span>Our Services</span>
								<span>Contact Support</span>
								<span>FAQs</span>
							</div>
							<div>
								<strong>Discover</strong>
								<span>Seoul</span>
								<span>Gyeongido</span>
								<span>Busan</span>
								<span>Jejudo</span>
							</div>
						</Box>
					</Stack>
				</Stack>
				<Stack className={'second'}>
					<span>© Nestar - All rights reserved. Nestar {moment().year()}</span>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'footer-container'}>
				<Stack className={'main'}>
					<Stack className={'left'}>
						<Box component={'div'} className={'footer-box'}>
							<Link href={'/'}>
								<Wrapper className="flex flex-row space-x-1">
									<svg
										className="w-[60px] h-auto cursor-pointer"
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
											style={{ fill: 'url(#gradientId)' }}
											d="M512 337.2l0-284.8L344 77l0 296 168-35.8zM296 373l0-296L128 52.4l0 284.8L296 373zM523.4 2.2C542.7-.7 560 14.3 560 33.8l0 316.3c0 15.1-10.6 28.1-25.3 31.3l-201.3 43c-8.8 1.9-17.9 1.9-26.7 0l-201.3-43C90.6 378.3 80 365.2 80 350.1L80 33.8C80 14.3 97.3-.7 116.6 2.2L320 32 523.4 2.2zM38.3 23.7l10.2 2c-.3 2.7-.5 5.4-.5 8.1l0 40.7 0 267.6 0 66.7 265.8 54.5c2 .4 4.1 .6 6.2 .6s4.2-.2 6.2-.6L592 408.8l0-66.7 0-267.6 0-40.7c0-2.8-.2-5.5-.5-8.1l10.2-2C621.5 19.7 640 34.8 640 55l0 366.9c0 15.2-10.7 28.3-25.6 31.3L335.8 510.4c-5.2 1.1-10.5 1.6-15.8 1.6s-10.6-.5-15.8-1.6L25.6 453.2C10.7 450.2 0 437.1 0 421.9L0 55C0 34.8 18.5 19.7 38.3 23.7z"
										></motion.path>
									</svg>
									<motion.div className="font-openSans font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300 text-[24px]">
										MIT Academy™
									</motion.div>
								</Wrapper>
							</Link>
						</Box>
						<Box component={'div'} className={'footer-box'}>
							<span>total free customer care</span>
							<p>+998 (95) 577 5454</p>
						</Box>
						<Box component={'div'} className={'footer-box'}>
							<span>Email</span>
							<div className="text-slate-100 text-md font-openSans font-semibold">odil1334@gmail.com</div>
							<span>Support?</span>
						</Box>
						<Box component={'div'} className={'footer-box'}>
							<p>follow us on social media</p>
							<div className={'media-box'}>
								<FacebookOutlinedIcon />
								<TelegramIcon />
								<InstagramIcon />
								<TwitterIcon />
							</div>
						</Box>
					</Stack>
					<Stack className={'right'}>
						<Box component={'div'} className={'top'}>
							<strong>keep yourself up to date</strong>
							<div className="flex items-center justify-between">
								<input type="text" placeholder={'Your Email'} onInput={() => {}} />
								<Button
									className="w-[200px] p-[23px] rounded-r-xl text-md font-openSans font-semibold"
									variant="contained"
									color="success"
								>
									Subscribe
								</Button>
							</div>
						</Box>
						<Box component={'div'} className={'bottom'}>
							<div>
								<strong>Categories</strong>
								<span>Designing</span>
								<span>Programming</span>
								<span>Graphics</span>
								<span>Front End</span>
								<span>Database</span>
								<span>Sport</span>
								<span>Cooking</span>
							</div>
							<div>
								<strong>Quick Access</strong>
								<span>What We Offer</span>
								<span>Careers</span>
								<span>Leadership</span>
								<span>About</span>
								<span>Catalog</span>
								<span>For Enterprise</span>
							</div>
							<div>
								<strong>GET HELP</strong>
								<span>Contact Us</span>
								<span>Latest Articles</span>
								<span>FAQs</span>
							</div>
						</Box>
					</Stack>
				</Stack>
				<Stack className={'second'}>
					<span>© MIT Academy - All rights reserved. Academy {moment().year()}</span>
					<span>Privacy · Terms · Sitemap</span>
				</Stack>
			</Stack>
		);
	}
};

export default Footer;
