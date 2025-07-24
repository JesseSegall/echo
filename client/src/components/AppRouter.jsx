import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom";
import Layout from "./Layout.jsx";
import SignUpForm from "./SignUpForm.jsx";
import LoginForm from "./LoginForm.jsx";
import { useState} from "react";
import UserProfile from "./UserProfile.jsx";
import NotFound from "./NotFound.jsx";

export default function AppRouter() {
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));
    const [fullUser, setFullUser] = useState(null);

    const router = createBrowserRouter([
        {
            path: "/",
            element: <Layout user={user} setUser={setUser} fullUser={fullUser} />,
            children: [
                { index: true, element: <div>Welcome to Echo</div> },
                { path: "signup", element: <SignUpForm /> },
                { path: "login", element: <LoginForm setUser={setUser} setFullUser={setFullUser} /> },
                {
                    path: "profile",
                    element: user
                        ? <Navigate to={`/profile/${user.username}`} replace />
                        : <Navigate to="/login" replace />
                },
                {
                    path: "profile/:username",
                    element: <UserProfile user={user} fullUser={fullUser} />
                },
                { path: "*", element: <NotFound /> },
            ],
        },
    ]);

    return <RouterProvider router={router} />;
}
