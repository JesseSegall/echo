import {Outlet} from "react-router-dom";
import NavBar from "./NavBar.jsx";

const Layout = ({user, setUser, fullUser}) => {
    return (
        <div>
            <main>
            <NavBar user={user} setUser={setUser} fullUser={fullUser} />
            <Outlet/>
            </main>
        </div>
    )
}

export default Layout;