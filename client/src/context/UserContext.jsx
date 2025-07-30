import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
	const [user, setUser] = useState(() => {
		try {
			return JSON.parse(localStorage.getItem('user'));
		} catch {
			return null;
		}
	});
	const [fullUser, setFullUser] = useState(null);
	const [bands, setBands] = useState([]);
	const [activeEntity, setActiveEntity] = useState(null);

	useEffect(() => {
		if (!user?.jwt) {
			setFullUser(null);
			setBands([]);
			setActiveEntity(null);
			return;
		}

		fetch(`http://localhost:8080/api/user/profile/${user.username}`, {
			headers: { Authorization: user.jwt },
		})
			.then((res) => res.json())
			.then((user) => {
				setFullUser(user);
			})
			.catch(() => setFullUser(null));

		fetch(`http://localhost:8080/api/band/self`, {
			headers: { Authorization: user.jwt },
		})
			.then((res) => (res.ok ? res.json() : []))
			.then((band) => setBands(band))
			.catch(() => setBands([]));
	}, [user]);

	// whenever we know fullUser or bands we will set whichever into this active entity so the context knows if its a user or a band.
	useEffect(() => {
		if (bands.length > 0) {
			setActiveEntity({ kind: 'band', ...bands[0] });
		} else if (fullUser) {
			setActiveEntity({ kind: 'user', ...fullUser });
		} else {
			setActiveEntity(null);
		}
	}, [bands, fullUser]);

	return (
		<UserContext.Provider
			value={{
				user,
				setUser,
				fullUser,
				setFullUser,
				bands,
				setBands,
				activeEntity,
			}}
		>
			{children}
		</UserContext.Provider>
	);
}

export function useUser() {
	const ctx = useContext(UserContext);
	if (!ctx) throw new Error('useUser must be inside a <UserProvider>');
	return ctx;
}
