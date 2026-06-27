import {Link} from "react-router-dom";

const NavBar = () => {
    // TODO: apartado de "profil" para ver los datos del usuario, poder desconectarse y salirse de la familia
    return (
        <nav className="navbar navbar-body">
            <ul className="navbar-list flex flex-row gap-4 content-end">
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