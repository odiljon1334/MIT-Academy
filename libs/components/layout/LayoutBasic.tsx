import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import Head from 'next/head';
import Top from '../Top';
import Footer from '../Footer';
import { Stack } from '@mui/material';
import { getJwtToken, updateUserInfo } from '../../auth';
import Chat from '../Chat';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { useTranslation } from 'next-i18next';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import IconBreadcrumbs from './IconBreadcrumbs';

const withLayoutBasic = (Component: any) => {
	return (props: any) => {
		const router = useRouter();
		const { t, i18n } = useTranslation('common');
		const device = useDeviceDetect();
		const [authHeader, setAuthHeader] = useState<boolean>(false);
		const user = useReactiveVar(userVar);
		const showBreadcrumbs = !['/login', '/signup'].includes(router.pathname);

		const memoizedValues = useMemo(() => {
			let title = '',
				desc = '',
				bgImage = '';

			switch (router.pathname) {
				case '/property':
					bgImage = '/img/banner/mac.jpg';
					break;
				case '/agent':
					bgImage = '/img/banner/library2.jpg';
					break;
				case '/agent/detail':
					bgImage = '/img/banner/library2.jpg';
					break;
				case '/mypage':
					bgImage = '/img/banner/mac.jpg';
					break;
				case '/community':
					bgImage = '/img/banner/header2.svg';
					break;
				case '/community/detail':
					bgImage = '/img/banner/header2.svg';
					break;
				case '/cs':
					bgImage = '/img/banner/header2.svg';
					break;
				case '/account/join':
					title = 'Login/Signup';
					desc = 'Authentication Process';
					bgImage = '/img/banner/header2.svg';
					setAuthHeader(true);
					break;
				case '/member':
					bgImage = '/img/banner/opoy7.jpg';
					break;
				default:
					break;
			}

			return { title, desc, bgImage };
		}, [router.pathname]);

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
						<title>Nestar</title>
						<meta name={'title'} content={`Nestar`} />
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
						<title>Academy</title>
						<meta name={'title'} content={`MIT Academy`} />
					</Head>
					<Stack id="pc-wrap">
						<Stack id={'top'}>
							<Top />
						</Stack>

						<div className="flex items-center bg-black">
							<Stack
								className={`header-basic ${authHeader && 'auth'}`}
								style={{
									backgroundImage: `url(${memoizedValues.bgImage})`,
									backgroundSize: 'cover',
									backgroundPosition: 'center',
									backgroundRepeat: 'no-repeat',
								}}
							>
								<Stack className={'container'}>
									<strong>{t(memoizedValues.title)}</strong>
									<span>{t(memoizedValues.desc)}</span>
								</Stack>
							</Stack>
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
							{showBreadcrumbs && <IconBreadcrumbs />}
							<Component {...props} />
						</Stack>
						<Chat />
						<Stack id={'footer'} className="bg-slate-950">
							<Footer />
						</Stack>
					</Stack>
				</>
			);
		}
	};
};

export default withLayoutBasic;
