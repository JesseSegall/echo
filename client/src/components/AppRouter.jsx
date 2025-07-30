// import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
// import Layout from './Layout.jsx';
// import SignUpForm from './SignUpForm.jsx';
// import LoginForm from './LoginForm.jsx';
// import { useUser } from '../context/UserContext';
// import UserProfile from './UserProfile.jsx';
// import NotFound from './NotFound.jsx';
// import MessageCenter from './MessageCenter.jsx';
// import SignUpChoice from './SignUpChoice.jsx';
// import BandSignUpForm from './BandSignUpForm.jsx';
// import BandProfile from './BandProfile';

// export default function AppRouter() {
// 	const { user, activeEntity } = useUser();

// 	const router = createBrowserRouter([
// 		{
// 			path: '/',
// 			element: <Layout />,
// 			children: [

// 				{ index: true, element: <div>Welcome to Echo Music</div> },

// 				{ path: 'signup', element: <SignUpChoice /> },
// 				{ path: 'signup/user', element: <SignUpForm /> },
// 				{ path: 'signup/band', element: <BandSignUpForm /> },
// 				{ path: 'login', element: <LoginForm /> },

// 				{
// 					path: 'profile',
// 					element: user ? (
// 						<Navigate to={`/profile/${user.username}`} replace />
// 					) : (
// 						<Navigate to='/login' replace />
// 					),
// 				},
// 				{
// 					path: 'band',
// 					element:
// 						user && activeEntity?.kind === 'band' ? (
// 							<Navigate to={`/band/${activeEntity.id}`} replace />
// 						) : (
// 							<Navigate to='/login' replace />
// 						),
// 				},

// 				{
// 					path: 'profile/:username',
// 					element: user ? <UserProfile /> : <Navigate to='/login' replace />,
// 				},
// 				{
// 					path: 'band/:bandId',
// 					element: user ? <BandProfile /> : <Navigate to='/login' replace />,
// 				},

// 				{
// 					path: 'messages',
// 					element: user ? <MessageCenter /> : <Navigate to='/login' replace />,
// 				},
// 				{
// 					path: 'messages/:conversationId',
// 					element: user ? <MessageCenter /> : <Navigate to='/login' replace />,
// 				},

// 				{ path: '*', element: <NotFound /> },
// 			],
// 		},
// 	]);

// 	return <RouterProvider router={router} />;
// }
