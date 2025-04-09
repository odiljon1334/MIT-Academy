import { useQuery, useReactiveVar } from '@apollo/client';
import { GET_COURSE } from '../../../apollo/user/query';
import { useEffect, useState } from 'react';
import { Course } from '../../types/course/course';
import { T } from '../../types/common';
import { useRouter } from 'next/router';
import { userVar } from '../../../apollo/store';
import { REACT_APP_API_URL } from '../../config';

const TopContent = () => {
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const [courseId, setCourseId] = useState<string | null>(null);
	const [course, setCourse] = useState<Course | null>(null);

	const {
		loading: getCourseLoading,
		data: getCourseData,
		error: getCourseError,
		refetch: getCourseRefetch,
	} = useQuery(GET_COURSE, {
		fetchPolicy: 'network-only',
		variables: { input: courseId },
		skip: !courseId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setCourse(data.getCourse);
		},
	});
	console.log('course:', course);
	/** LIFECYCLES **/
	useEffect(() => {
		const id = router.query.id as string;
		if (id) {
			setCourseId(id);
		}
	}, [router.query.id]);

	return (
		<div className="relative w-full h-[850px] dark:bg-slate-950">
			<div className="text-black  h-[850px] bg-gradient-to-r from-purple-800 to-pink-600 flex items-center px-10 clip-bottom">
				<div className="container flex flex-row justify-between">
					<div className="flex flex-col w-[550px] h-[500px] gap-2">
						<span className="bg-yellow-200 text-sm font-semibold p-2 mt-2 w-[120px] text-center rounded-2xl">
							{course?.courseType}
						</span>
						<div className="flex flex-col justify-between w-auto h-auto space-y-4 p-4">
							<h1 className="flex flex-row text-4xl font-openSans text-white font-bold">{course?.courseTitle}</h1>
							<p className="text-1xl text-white font-openSans font-medium ">
								{course?.courseDesc
									? course.courseDesc.length > 1010
										? course.courseDesc.substring(0, 190) + '...'
										: course.courseDesc
									: 'No Description!'}
							</p>
						</div>
						<h2 className="mt-5 text-white text-2xl font-bold mb-4">📚 What will you learn in the course?</h2>
						<ul className="space-y-3 text-lg">
							{course?.courseModuls.map((title, index) => (
								<li key={title._id} className="flex items-center gap-2">
									<span className="text-green-400">✔</span>
									<span className="font-openSans font-semibold text-white">{title.moduleTitle}</span>
								</li>
							))}
						</ul>
					</div>
					<div className="flex w-[550px] h-[500px]">
						<img
							src={`${REACT_APP_API_URL}/${course?.courseImage}`}
							alt={'main-image'}
							style={{
								objectFit: 'fill',
								width: '100%',
								height: '100%',
								borderRadius: '100px 100px 100px 100px',
							}}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default TopContent;
