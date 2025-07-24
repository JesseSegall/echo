import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom";
import Layout from "./Layout.jsx";
import SignUpForm from "./SignUpForm.jsx";
import LoginForm from "./LoginForm.jsx";
import {useState} from "react";
import UserProfile from "./UserProfile.jsx";
import NotFound from "./NotFound.jsx";

const AppRouter = () => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const routes = [
        {
            path: '/',
            element: <Layout user={user} setUser={setUser} />,
            children:[
                {
                    path: '',
                    element: <div>Welcome to Echo</div>,
                },
                {
                    path: 'signup',
                    element: <SignUpForm/>,
                },
                {
                    path: 'login',
                    element: <LoginForm setUser={setUser}/>,
                },
                {
                    path: "profile",
                    element: user
                        ? <Navigate to={`/profile/${user.username}`} replace />
                        : <Navigate to="/login" replace />
                },
                {
                    path: "profile/:username",
                    element: <UserProfile user={user}/>
                },
                {
                    path: "notFound",
                    element: <NotFound />,
                },
            ]
        }
    ];
    const router = createBrowserRouter(routes);
    return <RouterProvider router={router}/>
}

export default AppRouter;