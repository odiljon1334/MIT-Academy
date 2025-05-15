import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
	return (
		<Html lang="uz">
			<Head>
				{/* Favicon va boshqa ikonkalar */}
				<link rel="icon" type="image/svg+xml" href="/img/logo/favicon-book.svg" />
				<link rel="apple-touch-icon" sizes="180x180" href="/img/logo/apple-touch-icon.png" />
				<link rel="icon" type="image/png" sizes="32x32" href="/img/logo/favicon-32x32.png" />
				<link rel="icon" type="image/png" sizes="16x16" href="/img/logo/favicon-16x16.png" />
				<link rel="manifest" href="/site.webmanifest" />

				{/* Asosiy SEO metalar */}
				<meta name="robots" content="index, follow, max-image-preview:large" />
				<meta name="googlebot" content="index, follow" />

				{/* Ko'p tilli kalit so'zlar */}
				<meta
					name="keywords"
					content="EDUcampus, onlayn ta'lim, online education, онлайн образование, 온라인 교육, kurslar, courses, курсы, 코스, dasturlash, programming, программирование, 프로그래밍, IT, web dasturlash, web development, веб-разработка, 웹 개발"
				/>

				{/* Ko'p tilli tavsif */}
				<meta
					name="description"
					content="EDUcampus - O'zbekistonda yetakchi onlayn ta'lim platformasi. Professional mutaxassislar tomonidan tayyorlangan yuqori sifatli kurslar. | EDUcampus - ведущая онлайн-образовательная платформа в Узбекистане. Высококачественные курсы от профессиональных экспертов. | EDUcampus - leading online education platform in Uzbekistan. High-quality courses prepared by professional experts. | EDUcampus - 우즈베키스탄의 선도적인 온라인 교육 플랫폼. 전문가가 준비한 고품질 코스."
				/>

				{/* Ijtimoiy tarmoqlar uchun Open Graph metalar - ko'p tilli */}
				<meta
					property="og:title"
					content="EDUcampus - O'zbekistondagi yetakchi ta'lim platformasi | Ведущая образовательная платформа в Узбекистане | Leading education platform in Uzbekistan | 우즈베키스탄의 선도적인 교육 플랫폼"
				/>
				<meta
					property="og:description"
					content="Yuqori sifatli onlayn kurslar orqali professional ko'nikmalarni rivojlantiring. | Развивайте профессиональные навыки через высококачественные онлайн-курсы. | Develop professional skills through high-quality online courses. | 고품질 온라인 코스를 통해 전문 기술을 개발하세요."
				/>
				<meta property="og:type" content="website" />
				<meta property="og:url" content="https://educampus.uz" />
				<meta property="og:image" content="https://educampus.uz/img/logo/og-image.png" />
				<meta property="og:locale" content="uz_UZ" />
				<meta property="og:locale:alternate" content="ru_RU" />
				<meta property="og:locale:alternate" content="en_US" />
				<meta property="og:locale:alternate" content="ko_KR" />

				{/* Twitter uchun metalar */}
				<meta name="twitter:card" content="summary_large_image" />
				<meta
					name="twitter:title"
					content="EDUcampus - O'zbekistondagi yetakchi ta'lim platformasi | Ведущая образовательная платформа"
				/>
				<meta
					name="twitter:description"
					content="Yuqori sifatli onlayn kurslar orqali professional ko'nikmalarni rivojlantiring. | Развивайте профессиональные навыки через высококачественные онлайн-курсы. | Develop professional skills through high-quality online courses. | 고품질 온라인 코스를 통해 전문 기술을 개발하세요."
				/>
				<meta name="twitter:image" content="https://educampus.uz/img/logo/twitter-image.png" />

				{/* Mobil moslik uchun metalar */}
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<meta name="format-detection" content="telephone=no" />
				<meta name="theme-color" content="#4A6CF7" />

				{/* Canonical URL */}
				<link rel="canonical" href="https://educampus.uz" />

				{/* Alternativlar (ko'p tilli sayt uchun) */}
				<link rel="alternate" href="https://educampus.uz" hrefLang="uz" />
				<link rel="alternate" href="https://educampus.uz/ru" hrefLang="ru" />
				<link rel="alternate" href="https://educampus.uz/en" hrefLang="en" />
				<link rel="alternate" href="https://educampus.uz/ko" hrefLang="ko" />
				<link rel="alternate" href="https://educampus.uz" hrefLang="x-default" />
			</Head>
			<body>
				<Main />
				<NextScript />

				{/* Ko'rinmas SEO strukturasi - O'zbek tili */}
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify({
							'@context': 'https://schema.org',
							'@type': 'EducationalOrganization',
							name: 'EDUcampus',
							url: 'https://educampus.uz',
							logo: 'https://educampus.uz/img/logo/logo.png',
							description: "EDUcampus - O'zbekistonda yetakchi onlayn ta'lim platformasi.",
							address: {
								'@type': 'PostalAddress',
								addressCountry: 'Uzbekistan',
							},
							contactPoint: {
								'@type': 'ContactPoint',
								telephone: '+998-95-577-54-54',
								contactType: 'customer service',
							},
							sameAs: ['https://facebook.com/educampus', 'https://instagram.com/educampus', 'https://t.me/educampus'],
						}),
					}}
				/>

				{/* Ko'rinmas SEO strukturasi - Rus tili */}
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify({
							'@context': 'https://schema.org',
							'@type': 'EducationalOrganization',
							name: 'EDUcampus',
							url: 'https://educampus.uz/ru',
							logo: 'https://educampus.uz/img/logo/logo.png',
							description: 'EDUcampus - ведущая онлайн-образовательная платформа в Узбекистане.',
							address: {
								'@type': 'PostalAddress',
								addressCountry: 'Узбекистан',
							},
							contactPoint: {
								'@type': 'ContactPoint',
								telephone: '+998-95-577-54-54',
								contactType: 'Служба поддержки',
							},
							sameAs: ['https://facebook.com/educampus', 'https://instagram.com/educampus', 'https://t.me/educampus'],
						}),
					}}
				/>

				{/* Ko'rinmas SEO strukturasi - Ingliz tili */}
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify({
							'@context': 'https://schema.org',
							'@type': 'EducationalOrganization',
							name: 'EDUcampus',
							url: 'https://educampus.uz/en',
							logo: 'https://educampus.uz/img/logo/logo.png',
							description: 'EDUcampus - leading online education platform in Uzbekistan.',
							address: {
								'@type': 'PostalAddress',
								addressCountry: 'Uzbekistan',
							},
							contactPoint: {
								'@type': 'ContactPoint',
								telephone: '+998-95-577-54-54',
								contactType: 'Customer Service',
							},
							sameAs: ['https://facebook.com/educampus', 'https://instagram.com/educampus', 'https://t.me/educampus'],
						}),
					}}
				/>

				{/* Ko'rinmas SEO strukturasi - Koreys tili */}
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify({
							'@context': 'https://schema.org',
							'@type': 'EducationalOrganization',
							name: 'EDUcampus',
							url: 'https://educampus.uz/ko',
							logo: 'https://educampus.uz/img/logo/logo.png',
							description: 'EDUcampus - 우즈베키스탄의 선도적인 온라인 교육 플랫폼.',
							address: {
								'@type': 'PostalAddress',
								addressCountry: '우즈베키스탄',
							},
							contactPoint: {
								'@type': 'ContactPoint',
								telephone: '+998-95-577-54-54',
								contactType: '고객 서비스',
							},
							sameAs: ['https://facebook.com/educampus', 'https://instagram.com/educampus', 'https://t.me/educampus'],
						}),
					}}
				/>
			</body>
		</Html>
	);
}
