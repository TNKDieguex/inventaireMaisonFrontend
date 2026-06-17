import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import LoginPage from "../features/auth/components/LoginPage.tsx";
import RegisterPage from "../features/auth/components/RegisterPage.tsx";
import ProtectedRoute from "../components/ProtectedRoute.tsx";
import ProduitDashboard from "../features/produits/components/ProduitDashboard.tsx";

const AppRoutes = () => {
    const isAuthenticated = !!localStorage.getItem('token');
    return (
        <BrowserRouter>
            <Routes>
                <Route path={"/"} element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />
                <Route path={"/login"} element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
                <Route path={"/register"} element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />} />

                <Route element={<ProtectedRoute/>}>
                    <Route path={"/dashboard"} element={<ProduitDashboard/>} />
                </Route>

                <Route path={"*"} element={<Navigate to={"/login"} replace />} />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes;