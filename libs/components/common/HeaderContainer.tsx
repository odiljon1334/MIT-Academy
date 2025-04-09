const HeaderContainer = () => {
	return (
		<section className="relative py-20 dark:bg-inherit bg-neutral-50/50">
			<div className="max-w-7xl mx-auto text-center">
				<div className="grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-4">
					{/* Creators stat */}
					<div className="bg-slate-900 rounded-l-2xl p-8">
						<div className="text-4xl font-bold text-white mb-2">8,000+</div>
						<div className="text-slate-400 font-mono">Active Students</div>
					</div>

					{/* Platform fee stat */}
					<div className="bg-slate-900 p-8">
						<div className="text-4xl font-bold text-white mb-2">877</div>
						<div className="text-slate-400">Total Courses</div>
					</div>

					{/* Payout stat */}
					<div className="bg-slate-900  p-8">
						<div className="text-4xl font-bold text-white mb-2">33</div>
						<div className="text-slate-400">Instructor</div>
					</div>

					{/* Uptime stat */}
					<div className="bg-slate-900 rounded-r-2xl p-8">
						<div className="text-4xl font-bold text-white mb-2">99.9%</div>
						<div className="text-slate-400">Satisfaction rate</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default HeaderContainer;
