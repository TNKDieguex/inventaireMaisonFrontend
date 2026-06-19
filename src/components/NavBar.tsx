import {Link} from "react-router-dom";

const NavBar = () => {
    return (
        <nav className="navbar flex justify-between items-center p-4">
            <ul className="navbar-list flex justify-between gap-4 ">
                <li><Link className={"navbar-link"} to={"/dashboard"}>Inicio</Link></li>
                <li><Link className={"navbar-link"} to={"/dashboard"}>Dashboard</Link></li>
                <li><Link className={"navbar-link"} to={"/famille"}>Famille</Link></li>
                <li><button className={"bg-transparent border-0 cursor-pointer"}
                            onClick={()=>{
                                localStorage.removeItem('token');
                                sessionStorage.clear();
                                window.location.href = '/login';
                            }}>
                        Logout
                    </button>
                </li>
            </ul>
        </nav>
    )
}

export default NavBar;