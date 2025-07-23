import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Layout from "./Layout.jsx";
import SignUpForm from "./SignUpForm.jsx";

const AppRouter = () => {
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
            ]
        }
    ];
    const router = createBrowserRouter(routes);
    return <RouterProvider router={router}/>
}

export default AppRouter;