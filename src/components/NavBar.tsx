import {NavLink} from "react-router-dom";

const NavBar = () => {
    return (
        <nav className="navbar-body">
            <ul className="navbar-list">
                <li>
                    <NavLink to="/dashboard" className="navbar-link">
                        <svg className="size-5"><use href="/sprite.svg#options" /></svg>
                        <span>Dashboard</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/famille" className="navbar-link">
                        <svg className="size-5"><use href="/sprite.svg#family" /></svg>
                        <span>Famille</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/profil" className="navbar-link">
                        <svg className="size-5"><use href="/sprite.svg#profil" /></svg>
                        <span>Profil</span>
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
}

export default NavBar;