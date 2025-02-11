import type { AppProps } from 'next/app';
import { CssBaseline } from '@mui/material';
import React, { useState } from 'react';
import { ApolloProvider } from '@apollo/client';
import { useApollo } from '../apollo/client';
import { appWithTranslation } from 'next-i18next';
import { ThemeProvider } from '../scss/MaterialTheme/ThemeProvider';
import '../scss/app.scss';
import '../styles/globals.css';
import '../scss/pc/main.scss';
import '../scss/mobile/main.scss';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

const App = ({ Component, pageProps }: AppProps) => {
	// @ts-ignore
	const client = useApollo(pageProps.initialApolloState);

	return (
		<ApolloProvider client={client}>
			<ThemeProvider>
				<CssBaseline />
				<Component {...pageProps} />
			</ThemeProvider>
		</ApolloProvider>
	);
};

export default appWithTranslation(App);
