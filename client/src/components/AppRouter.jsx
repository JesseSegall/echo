import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Layout from "./Layout.jsx";
import SignUpForm from "./SignUpForm.jsx";
import LoginForm from "./LoginForm.jsx";
import {useState} from "react";

const AppRouter = () => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const routes = [
        {
            path: '/',
            element: <Layout  />,
            children:[
                {
                    path: '',
                    element: <div>Welcome to Echo</div>,
                },
                {
                    path: '/signup',
                    element: <SignUpForm/>,
                },
                {
                    path: '/login',
                    element: <LoginForm setUser={setUser}/>,
                },
            ]
        }
    ];
    const router = createBrowserRouter(routes);
    return <RouterProvider router={router}/>
}

export default AppRouter;