import {Link} from "react-router-dom";

const NavBar = () => {
    return (
        <nav className="navbar navbar-body">
            <ul className="navbar-list flex flex-row gap-4 content-end">
                <li><Link className={"navbar-link"} to={"/dashboard"}>Dashboard</Link></li>
                <li><Link className={"navbar-link"} to={"/famille"}>Famille</Link></li>
                <li><Link className={"navbar-link"} to={"/profil"}>Profil</Link></li>
            </ul>
        </nav>
    )
}

export default NavBar;