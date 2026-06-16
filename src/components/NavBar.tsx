import {Link} from "react-router-dom";

const NavBar = () => {
    return (
        <nav className="navbar">
            <ul className="navbar-list">
                <li><Link className={"navbar-link"} to={"/dashboard"}>Inicio</Link></li>
                <li><Link className={"navbar-link"} to={"/login"}>Login</Link></li>
                <li><Link className={"navbar-link"} to={"/register"}>Register</Link></li>
                <li><Link className={"navbar-link"} to={"/dashboard"}>Dashboard</Link></li>
            </ul>
        </nav>
    )
}

export default NavBar;