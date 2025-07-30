import { Outlet } from 'react-router-dom';
import NavBar from './NavBar.jsx';

import { useEffect, useState } from 'react';

const Layout = ({ user, setUser }) => {
	const [fullUser, setFullUser] = useState(null);

	useEffect(() => {
		if (user?.jwt && user.username) {
			fetch(`http://localhost:8080/api/user/profile/${user.username}`, {
				headers: { Authorization: `Bearer ${user.jwt}` },
			})
				.then((res) => (res.ok ? res.json() : Promise.reject()))
				.then(setFullUser)
				.catch(() => setFullUser(null));
		} else {
			setFullUser(null);
		}
	}, [user]);
	return (
		<div>
			<main>
				<NavBar user={user} setUser={setUser} fullUser={fullUser} />
				<Outlet />
			</main>
		</div>
	);
};

export default Layout;
