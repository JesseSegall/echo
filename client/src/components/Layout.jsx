import {Outlet} from "react-router-dom";
import NavBar from "./NavBar.jsx";

const Layout = () => {
    return (
        <div>
            <main>
            <NavBar/>
            </main>
            <Outlet/>
        </div>
    )
}

export default Layout;