import {useState} from "react";
import LoadingModal from "../../../components/LoadingModal.tsx";
import type {UserData} from "../types";
import {getFamilleIdFromToken, getValidCachedFamille} from "../../../utils/jwtUtils.ts";
import Button from "../../../components/Button.tsx";

const ProfilPage = () => {
    const [error] = useState('');
    const [isLoading] = useState(false);

    const [userData] = useState<UserData>(() => {
        try {
            const token = localStorage.getItem('token');
            const fUuid = token ? getFamilleIdFromToken(token) : null;
            const cachedUserData = sessionStorage.getItem('user');
            if (!cachedUserData || !fUuid) {
                return { nom: "", courriel: "", familleUuid: "", userUuid: "" };
            }
            let courrielCible = "";
            try {
                const parsed = JSON.parse(cachedUserData);
                courrielCible = typeof parsed === 'object' && parsed !== null && 'courriel' in parsed
                    ? parsed.courriel
                    : parsed;
            } catch {
                courrielCible = cachedUserData;
            }
            const familiaCache = getValidCachedFamille(fUuid);

            if (familiaCache?.utilisateurs) {
                const utilisateurCourant = familiaCache.utilisateurs.find(
                    (u) => u.courriel.toLowerCase().trim() === courrielCible.toLowerCase().trim()
                );

                if (utilisateurCourant) {
                    return {
                        nom: utilisateurCourant.nom,
                        courriel: utilisateurCourant.courriel,
                        familleUuid: fUuid,
                        userUuid: utilisateurCourant.uuid || ""
                    };
                }
            }
        } catch (err) {
            console.error("Erreur lors du chargement des données locales:", err);
        }
        return { nom: "", courriel: "", familleUuid: "", userUuid: "" };
    });

    const handleLogout = () => {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = '/login';
    };

    return (
        <div className="dashboard-screen">
            <h1 className="titre">Mon Profil</h1>

            {error && (
                <div className="dashboard-screen-enfant">
                    <p className="error">{error}</p>
                </div>
            )}

            {!error && (
                <div className="dashboard-screen-enfant">
                    <div className="information-div text-left flex items-center gap-4">
                        <div className="size-12 bg-blue-haze-600 text-white rounded-full flex items-center justify-center font-bold text-lg uppercase shadow-inner shrink-0 select-none">
                            {userData.nom ? userData.nom.substring(0, 2) : "??"}
                        </div>
                        <div className="flex flex-col truncate">
                            <h2 className="text-lg font-bold text-gray-900 capitalize truncate">
                                {userData.nom || "Utilisateur"}
                            </h2>
                            <p className="text-sm text-gray-500 truncate">
                                {userData.courriel || "Email non chargé"}
                            </p>
                        </div>
                    </div>
                    <div className="information-div text-left space-y-3">
                        <h3 className="sous-titre text-red-600 mb-1">Zone de danger</h3>
                        <div className="flex flex-col gap-2">
                            <Button
                                type="button"
                                variant="danger"
                                fullWidth
                                onClick={handleLogout}
                                children="Se déconnecter"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                fullWidth
                                onClick={() => {
                                    console.log("userData:", userData);
                                }}
                                children="show data user"
                            />
                        </div>
                    </div>
                </div>
            )}
            {isLoading && <LoadingModal title="Chargement de votre profil..." />}
        </div>
    );
};

export default ProfilPage;