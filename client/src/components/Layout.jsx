import { Outlet } from 'react-router-dom';
import { Container } from '@chakra-ui/react';
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
			<Container maxW='container.lg' py={6}>
				<NavBar user={user} setUser={setUser} fullUser={fullUser} />
				<Outlet />
			</Container>
		</div>
	);
};

export default Layout;
