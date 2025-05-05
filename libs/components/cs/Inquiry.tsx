import React from 'react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import withAdminLayout from '../layout/LayoutAdmin';
import TuiEditor from '../community/Teditor';
import { useRouter } from 'next/router';

const Inquiry = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const path = router.asPath;

	/** APOLLO REQUESTS **/
	/** LIFECYCLES **/
	/** HANDLERS **/

	if (device === 'mobile') {
		return <div>Inquiry MOBILE</div>;
	} else {
		return (
			<>
				<div className="w-full">
					<p>salom</p>
					<p>{path}</p>
				</div>
			</>
		);
	}
};

export default withAdminLayout(Inquiry);
