import {useState} from "react";
import LoadingModal from "../../../components/LoadingModal.tsx";
import type {AuthResponseDto, ErreurResponseDto, UserData} from "../types";
import {getFamilleIdFromToken, getUserInfoFromToken, getValidCachedFamille} from "../../../utils/jwtUtils.ts";
import Button from "../../../components/Button.tsx";
import axiosClient from "../../../api/axiosClient.ts";
import {useNavigate} from "react-router-dom";
import axios from "axios";

const ProfilPage = () => {
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showConfirmQuitter, setShowConfirmQuitter] = useState(false);
    const navigate = useNavigate();

    const [userData] = useState<UserData>(() => {
        const token = localStorage.getItem('token');
        const tokenInfo = getUserInfoFromToken(token);
        const fUuid = token ? getFamilleIdFromToken(token) : null;

        if (!tokenInfo || !fUuid) {
            return { nom: "", courriel: (tokenInfo?.courriel || ""), familleUuid: "", userUuid: "" };
        }
        const familiaCache = getValidCachedFamille(fUuid);
        let utilisateur = "Utilisateur";

        if (familiaCache?.utilisateurs) {
            const utilisateurTrouve = familiaCache.utilisateurs.find(
                (u) => u.courriel.toLowerCase().trim() === tokenInfo.courriel.toLowerCase().trim()
            );
            if (utilisateurTrouve) {
                utilisateur = utilisateurTrouve.nom;
            }
        }

        return {
            nom: utilisateur,
            courriel: tokenInfo.courriel,
            familleUuid: fUuid,
            userUuid: tokenInfo.nom
        };
    });

    const handleQuitterFamille = async () => {
        try {
            setError('');
            setIsLoading(true);
            setShowConfirmQuitter(false);

            const response = await axiosClient.post<AuthResponseDto>(`/utilisateurs/quitter-famille`);
            const token = response.data.token;
            localStorage.setItem('token', token);

            sessionStorage.removeItem(`famille_info_${userData.familleUuid}`);
            sessionStorage.removeItem(`produits_famille_${userData.familleUuid}`);

            navigate('/famille');
        } catch (erreur: unknown) {
            if (axios.isAxiosError<ErreurResponseDto>(erreur)) {
                setError(erreur.response?.data?.message || "Échec de l'action.");
            } else {
                setError('Une erreur inattendue est survenue.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = '/login';
    };

    return (
        <div className="dashboard-screen">
            <h1 className="dashboard-titre">Mon Profil</h1>

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
                        <div className="flex flex-col gap-4">
                            {userData.familleUuid ? (
                                <Button
                                    type="button"
                                    variant="danger"
                                    fullWidth
                                    onClick={() => setShowConfirmQuitter(true)}>
                                    Quitter la famille
                                </Button>
                            ) : (
                                <p className="text-xs text-gray-400 italic">Vous n'êtes associé à aucune famille.</p>
                            )}
                            <Button
                                type="button"
                                variant="outline"
                                fullWidth
                                onClick={handleLogout}
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <svg className="size-5"><use href="/sprite.svg#logout" /></svg>
                                    <span>Se déconnecter</span>
                                </div>
                            </Button>
                        </div>
                    </div>
                </div>
            )}
            {showConfirmQuitter && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/70 backdrop-blur-sm select-none pointer-events-auto">
                    <div className="bg-blue-haze-200 p-8 rounded-2xl
                                shadow-2xl max-w-sm w-full mx-4 flex flex-col
                                items-center text-center space-y-6 border border-blue-haze-100">
                        <h1 className="titre ">Attention</h1>
                        <p className="text-sm text-gray-500">
                            Voulez-vous vraiment quitter votre famille ? Vous perdrez l'accès immédiat à l'inventaire partagé.
                        </p>
                        <div className="flex flex-row gap-2 w-full pt-2">
                            <Button type="button" variant="danger" fullWidth onClick={handleQuitterFamille}>
                                Oui, quitter
                            </Button>
                            <Button type="button" variant="outline" fullWidth onClick={() => setShowConfirmQuitter(false)}>
                                Annuler
                            </Button>
                        </div>
                    </div>
                </div>
            )}
            {isLoading && <LoadingModal title="Chargement de votre profil..." />}
        </div>
    );
};

export default ProfilPage;