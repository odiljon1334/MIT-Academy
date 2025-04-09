import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import HomeIcon from '@mui/icons-material/Home';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import GrainIcon from '@mui/icons-material/Grain';
import { useRouter } from 'next/router';

const IconBreadcumbs = () => {
	const router = useRouter();
	const pathMap: Record<string, { name: string; icon: JSX.Element }> = {
		'/': { name: 'Home', icon: <HomeIcon sx={{ mr: 0.5 }} fontSize="medium" /> },
		'/course': {
			name: 'Courses',
			icon: <WhatshotIcon className="text-slate-400" sx={{ mr: 0.5 }} fontSize="medium" />,
		},
		'/course/detail': {
			name: 'Courses Deatil',
			icon: <GrainIcon className="text-slate-400" sx={{ mr: 0.5 }} fontSize="medium" />,
		},
		'/course/lesson': {
			name: 'Courses Videos',
			icon: <GrainIcon className="text-slate-400" sx={{ mr: 0.5 }} fontSize="medium" />,
		},
		'/instructor': {
			name: 'Instructors',
			icon: <WhatshotIcon className="text-slate-400" sx={{ mr: 0.5 }} fontSize="medium" />,
		},
		'/instructor/detail': {
			name: 'Instructors Detail',
			icon: <GrainIcon className="text-slate-400" sx={{ mr: 0.5 }} fontSize="medium" />,
		},
		'/mypage': {
			name: 'My Page',
			icon: <WhatshotIcon className="text-slate-400" sx={{ mr: 0.5 }} fontSize="medium" />,
		},
		'/community': {
			name: 'Community',
			icon: <WhatshotIcon className="text-slate-400" sx={{ mr: 0.5 }} fontSize="medium" />,
		},
		'/community/detail': {
			name: 'Community Detail',
			icon: <GrainIcon className="text-slate-400" sx={{ mr: 0.5 }} fontSize="medium" />,
		},
		'/cs': {
			name: 'CS',
			icon: <GrainIcon className="text-slate-400" sx={{ mr: 0.5 }} fontSize="medium" />,
		},
		'/member': {
			name: 'Member',
			icon: <GrainIcon className="text-slate-400" sx={{ mr: 0.5 }} fontSize="medium" />,
		},
	};

	const paths = router.pathname.split('/').filter((p) => p);

	return (
		<div className="container">
			<Breadcrumbs className="mt-7">
				<Link
					className="dark:text-slate-300 text-slate-500 font-openSans font-medium"
					underline="hover"
					sx={{ display: 'flex', alignItems: 'center' }}
					href="/"
				>
					<HomeIcon fontSize="medium" className=" text-slate-400" sx={{ mr: 0.5 }} />
					Home
				</Link>
				{paths.map((path, index) => {
					const fullPath = `/${paths.slice(0, index + 1).join('/')}`;
					const item = pathMap[fullPath];

					if (!item) return null;

					return index === paths.length - 1 ? (
						<Typography
							className="dark:text-slate-300 text-slate-500 font-openSans font-medium"
							key={fullPath}
							sx={{ display: 'flex', alignItems: 'center' }}
						>
							{item.icon}
							<span className="dark:text-slate-300 text-slate-500 font-openSans font-medium">{item.name}</span>
						</Typography>
					) : (
						<Link key={fullPath} underline="none" sx={{ display: 'flex', alignItems: 'center' }} href={fullPath}>
							{item.icon}
							<span className="dark:text-slate-300 text-slate-500 font-openSans font-medium hover:underline">
								{item.name}
							</span>
						</Link>
					);
				})}
			</Breadcrumbs>
		</div>
	);
};

export default IconBreadcumbs;
