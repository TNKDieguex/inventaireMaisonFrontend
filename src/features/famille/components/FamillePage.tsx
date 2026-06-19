import {useEffect, useState} from "react";
import FamilleItem from "./FamilleItem.tsx";
import {getFamilleIdFromToken} from "../../../utils/jwtUtils.ts";
import axiosClient from "../../../api/axiosClient.ts";
import type {FamilleDto} from "../types";

const FamillePage = () => {
    const [familleInfo, setFamilleInfo] = useState<FamilleDto>({
        nomFamille: '',
        uuid: '',
        utilisateurs: []
    });
    const [familleUuid, setFamilleUuid] = useState<string | null>(null);
    const [isUuidVisible, setIsUuidVisible] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const uuid = getFamilleIdFromToken(token);
            if (uuid) {
                setFamilleUuid(uuid);
            }
        }
    }, []);

    useEffect(() => {
        if (familleUuid) {
            const cachedInfo = sessionStorage.getItem(`famille_info_${familleUuid}`);
            if (cachedInfo) {
                setFamilleInfo(JSON.parse(cachedInfo));
            }else{
                axiosClient.get<FamilleDto>('/utilisateurs/familles/info')
                    .then(response => {
                        setFamilleInfo(response.data);
                        sessionStorage.setItem(`famille_info_${familleUuid}`, JSON.stringify(response.data));
                    })
                    .catch(error => {
                        console.error("Erreur lors de la récupération des membres:", error);
                    });
            }

        }
    }, [familleUuid]);

    const handleCopy = () => {
        if (familleUuid) {
            navigator.clipboard.writeText(familleUuid).then(() => {
                setCopySuccess(true);
                setTimeout(() => setCopySuccess(false), 2000);
            });
        }
    };

    if (!familleUuid) {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-gray-50 p-8 rounded-xl shadow-sm border">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Vous n'êtes dans aucune famille</h2>
                <p className="text-gray-600 mb-6 text-center">Pour commencer, créez une nouvelle famille ou rejoignez-en une existante.</p>
                <div className="flex gap-4">
                    <button className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                        Créer une famille
                    </button>
                    <button className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50">
                        Rejoindre une famille
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold text-gray-900">{familleInfo?.nomFamille || "Chargement..."}</h1>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Code d'invitation de la famille</h2>
                <div className="flex items-center gap-4">
                    <p
                        className={`text-gray-700 text-lg select-all font-mono bg-gray-100 p-2 rounded ${!isUuidVisible ? 'blur-sm' : ''}`}
                    >
                        {familleUuid || "Chargement..."}
                    </p>
                    <button
                        onClick={() => setIsUuidVisible(!isUuidVisible)}
                        className="text-sm text-blue-600 hover:underline"
                    >
                        {isUuidVisible ? 'Cacher' : 'Afficher'}
                    </button>
                    <button
                        onClick={handleCopy}
                        className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        {copySuccess ? 'Copié!' : 'Copier'}
                    </button>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Membres de votre famille</h2>
                <div className="space-y-3">
                    {familleInfo?.utilisateurs && familleInfo.utilisateurs.length > 0 ? (
                        familleInfo.utilisateurs.map((utilisateur) => (
                            <FamilleItem key={utilisateur.courriel}
                                         nom={utilisateur.nom}
                            />
                        ))
                    ) : (
                        <p className="text-gray-500">Aucun membre dans la famille pour le moment.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FamillePage;