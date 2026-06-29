import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import LoginPage from "../features/auth/components/LoginPage.tsx";
import RegisterPage from "../features/auth/components/RegisterPage.tsx";
import ProtectedRoute from "../components/ProtectedRoute.tsx";
import ProduitDashboard from "../features/produits/components/ProduitDashboard.tsx";
import FamillePage from "../features/famille/components/FamillePage.tsx";
import FamilleInscription from "../features/famille/components/FamilleInscription.tsx";
import FamilleCreation from "../features/famille/components/FamilleCreation.tsx";
import ListeProduits from "../features/produits/components/ListeProduits.tsx";
import ListeProduitsUrgentes from "../features/produits/components/ListeProduitsUrgentes.tsx";
import CreationProduit from "../features/produits/components/CreationProduit.tsx";
import ProfilPage from "../features/auth/components/ProfilPage.tsx";

const AppRoutes = () => {
    const isAuthenticated = !!localStorage.getItem('token');
    return (
        <BrowserRouter>
            <Routes>
                <Route path={"/"} element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />
                <Route path={"/login"} element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
                <Route path={"/register"} element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />} />

                <Route element={<ProtectedRoute checkFamille={false} />}>
                    <Route path="/famille" element={<FamillePage />} />
                    <Route path="/famille/creation" element={<FamilleCreation />} />
                    <Route path="/famille/inscription" element={<FamilleInscription />} />
                </Route>
                <Route element={<ProtectedRoute checkFamille={true} />}>
                    <Route path="/dashboard" element={<ProduitDashboard />} />
                    <Route path="/produits" element={<ListeProduits />}/>
                    <Route path="/produits/liste-alertes-achats" element={<ListeProduitsUrgentes />} />
                    <Route path="/produits/creation" element={<CreationProduit />} />
                    <Route path="/profil" element={<ProfilPage />} />
                </Route>

                <Route path={"*"} element={<Navigate to={"/login"} replace />}/>
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes;