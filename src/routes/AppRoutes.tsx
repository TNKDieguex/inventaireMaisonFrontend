import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import LoginPage from "../features/auth/components/LoginPage.tsx";
import RegisterPage from "../features/auth/components/RegisterPage.tsx";
import ProtectedRoute from "../components/ProtectedRoute.tsx";
import ProduitDashboard from "../features/produits/components/ProduitDashboard.tsx";

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path={"/login"} element={<LoginPage />}/>
                <Route path={"/register"} element={<RegisterPage />} />

                <Route element={<ProtectedRoute/>}>
                    <Route path={"/dashboard"} element={<ProduitDashboard/>} />
                </Route>

                <Route path={"*"} element={<Navigate to={"/login"} replace />} />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes;