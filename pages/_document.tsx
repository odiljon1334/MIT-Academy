import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
	return (
		<Html lang="uz">
			<Head>
				{/* Favicon va boshqa ikonkalar */}
				<link rel="icon" href="/img/logo/favicon-book.svg" />
				<link rel="apple-touch-icon" href="/img/logo/apple-touch-icon.png" />

				{/* Viewport */}
				<meta name="viewport" content="width=device-width, initial-scale=1" />

				{/* Open Graph (Telegram, Kakao, Facebook uchun muhim) */}
				<meta property="og:type" content="website" />
				<meta property="og:site_name" content="EDUcampus" />
				<meta
					property="og:title"
					content="EDUcampus - Leading education platform in Uzbekistan | 우즈베키스탄의 선도적인 교육 플랫폼"
				/>
				<meta
					property="og:description"
					content="Develop professional skills through high-quality online courses. | 고품질 온라인 코스를 통해 전문 기술을 개발하세요."
				/>
				<meta property="og:image" content="http://educampus.uz/img/logo/educeo.jpg" />
				<meta property="og:url" content="http://educampus.uz" />

				{/* Twitter Card (ixtiyoriy) */}
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:title" content="EDUcampus - O'zbekistondagi ta'lim platformasi" />
				<meta name="twitter:description" content="Yuqori sifatli onlayn kurslar orqali ko'nikmalarni rivojlantiring." />
				<meta name="twitter:image" content="http://educampus.uz/img/logo/educeo.jpg" />

				{/* Canonical URL */}
				<link rel="canonical" href="http://educampus.uz" />
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
