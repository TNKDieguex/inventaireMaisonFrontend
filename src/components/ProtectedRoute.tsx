import React from 'react';
import {Navigate, Outlet} from "react-router-dom";
import NavBar from "./NavBar.tsx";
import {getFamilleIdFromToken} from "../utils/jwtUtils.ts"

interface ProtectedRouteProps {
    checkFamille?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({checkFamille = true}) => {
    const token = localStorage.getItem('token');

    if (!token) {
        return <Navigate to="/login" replace />
    }
    const familleUuid = getFamilleIdFromToken(token);

    if (checkFamille && !familleUuid) {
        return <Navigate to="/famille" replace />;
    }

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-gray-50">
            <main className="flex-1 overflow-y-auto p-4">
                <Outlet/>
            </main>
            <NavBar/>
        </div>
    );
};

export default ProtectedRoute;
