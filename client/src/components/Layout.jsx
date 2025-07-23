import {Outlet} from "react-router-dom";
import NavBar from "./NavBar.jsx";

const Layout = ({user, setUser}) => {
    return (
        <div>
            <main>
            <NavBar user={user} setUser={setUser} />
            </main>
            <Outlet/>
        </div>
    )
}

export default Layout;