import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import Layout from './Layout.jsx';
import SignUpForm from './SignUpForm.jsx';
import LoginForm from './LoginForm.jsx';
import { useState } from 'react';
import UserProfile from './UserProfile.jsx';
import NotFound from './NotFound.jsx';
import MessageCenter from './MessageCenter.jsx';
import SignUpChoice from './SignUpChoice.jsx';
import BandSignUpForm from './BandSignUpForm.jsx';

export default function AppRouter() {
	const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));
	const [fullUser, setFullUser] = useState(null);

	const router = createBrowserRouter([
		{
			path: '/',
			element: <Layout user={user} setUser={setUser} fullUser={fullUser} />,
			children: [
				{ index: true, element: <div>Welcome to Echo</div> },
				{ path: 'signup', element: <SignUpChoice /> },
				{ path: 'login', element: <LoginForm setUser={setUser} setFullUser={setFullUser} /> },
				{
					path: 'signup/user',
					element: <SignUpForm />,
				},
				{
					path: 'signup/band',
					element: <BandSignUpForm />,
				},
				{
					path: 'profile',
					element: user ? (
						<Navigate to={`/profile/${user.username}`} replace />
					) : (
						<Navigate to='/login' replace />
					),
				},

				{
					path: 'profile/:username',
					element: user ? (
						<UserProfile user={user} fullUser={fullUser} />
					) : (
						<Navigate to='/login' replace />
					),
				},
				{
					path: 'messages',
					element: user ? <MessageCenter loggedInUser={user} /> : <Navigate to='/login' replace />,
				},
				{
					path: 'messages/:conversationId',
					element: user ? <MessageCenter loggedInUser={user} /> : <Navigate to='/login' replace />,
				},
				{ path: '*', element: <NotFound /> },
			],
		},
	]);

	return <RouterProvider router={router} />;
}
