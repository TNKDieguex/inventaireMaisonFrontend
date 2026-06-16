import React from 'react';
import {Navigate, Outlet} from "react-router-dom";
import NavBar from "./NavBar.tsx";

export const ProtectedRoute: React.FC = () => {
    const token = localStorage.getItem('token');

    if (!token) {
    return <Navigate to="/login" replace />
    }


    return (
        <div>
            <NavBar/>
            <main className="container-fuild mt-4">
                <Outlet/>;
            </main>
        </div>
    );
};

export default ProtectedRoute;
