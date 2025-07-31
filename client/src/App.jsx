import React from 'react';
import { BrowserRouter, useRoutes, Navigate } from 'react-router-dom';

import Layout from './components/Layout.jsx';
import SignUpChoice from './components/SignUpChoice.jsx';
import SignUpForm from './components/SignUpForm.jsx';
import BandSignUpForm from './components/BandSignUpForm.jsx';
import LoginForm from './components/LoginForm.jsx';
import UserProfile from './components/UserProfile.jsx';
import BandProfile from './components/BandProfile.jsx';
import MessageCenter from './components/MessageCenter.jsx';
import NotFound from './components/NotFound.jsx';
import Home from './components/Home.jsx';

import { useUser } from './context/UserContext.jsx';

function AppRoutes() {
	const { user, activeEntity } = useUser();

	return useRoutes([
		{
			element: <Layout />,
			children: [
				{ index: true, element: <Home /> },

				{ path: 'signup', element: <SignUpChoice /> },
				{ path: 'signup/user', element: <SignUpForm /> },
				{ path: 'signup/band', element: <BandSignUpForm /> },
				{ path: 'login', element: <LoginForm /> },

				{
					path: 'profile',
					element: user ? (
						<Navigate to={`/profile/${user.username}`} replace />
					) : (
						<Navigate to='/login' replace />
					),
				},
				{
					path: 'band',
					element:
						user && activeEntity?.kind === 'band' ? (
							<Navigate to={`/band/${activeEntity.id}`} replace />
						) : (
							<Navigate to='/login' replace />
						),
				},

				{
					path: 'profile/:username',
					element: user ? <UserProfile /> : <Navigate to='/login' replace />,
				},
				{
					path: 'band/:bandId',
					element: user ? <BandProfile /> : <Navigate to='/login' replace />,
				},

				{
					path: 'messages',
					element: user ? <MessageCenter /> : <Navigate to='/login' replace />,
				},
				{
					path: 'messages/:conversationId',
					element: user ? <MessageCenter /> : <Navigate to='/login' replace />,
				},

				{ path: '*', element: <NotFound /> },
			],
		},
	]);
}

export default function App() {
	return (
		<BrowserRouter>
			<AppRoutes />
		</BrowserRouter>
	);
}
