import {useEffect, useState} from "react";
import FamilleItem from "./FamilleItem.tsx";
import {getFamilleIdFromToken} from "../../../utils/jwtUtils.ts";
import axiosClient from "../../../api/axiosClient.ts";
import type {FamilleDto} from "../types";
import Button from "../../../components/Button.tsx";
import {useNavigate} from "react-router-dom";

const FamillePage = () => {
    const [familleUuid, setFamilleUuid] = useState<string | null>(()=>{
        const token = localStorage.getItem('token');
        if (token) {
            return getFamilleIdFromToken(token);
        }
        return null;
    });
    const [familleInfo, setFamilleInfo] = useState<FamilleDto | undefined>(() => {
        if (familleUuid) {
            const cachedInfo = sessionStorage.getItem(`famille_info_${familleUuid}`);
            return cachedInfo ? JSON.parse(cachedInfo) : undefined;
        }
        return undefined;
    });
    const [isUuidVisible, setIsUuidVisible] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);
    const navigate = useNavigate();

    const [cooldown, setCooldown] = useState(0);

    useEffect(() => {
        if (cooldown > 0) {
            const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [cooldown]);

    useEffect(() => {
        if (familleUuid && !familleInfo) {
            axiosClient.get<FamilleDto>('/utilisateurs/familles/info')
                .then(response => {
                    setFamilleInfo(response.data);
                    sessionStorage.setItem(`famille_info_${familleUuid}`, JSON.stringify(response.data));
                })
                .catch(error => {
                    console.error("Erreur lors de la récupération des membres:", error);
                });
        }
    }, [familleUuid, familleInfo]);

    const handleRefresh = () => {
        if (cooldown > 0 || !familleUuid) return;
        sessionStorage.removeItem(`famille_info_${familleUuid}`);
        setFamilleInfo(undefined);
        setCooldown(180);
    };

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
            <div className={"flex items-center justify-center h-full w-full"}>
                <div className={"space-y-4"}>
                    <div className="information-div text-center">
                        <h2 className="titre">Vous n'êtes dans aucune famille</h2>
                        <p className="text-gray-600 mb-6 text-center">Pour commencer, créez une nouvelle famille ou rejoignez-en une existante.</p>
                        <div className="flex gap-4 justify-center">
                            <Button type={"button"} variant={"primary"} children={"Créer une famille"}
                                    onClick={() => {
                                navigate('/famille/creation');
                            }}/>
                            <Button type={"button"} variant={"secondary"} children={"Rejoindre une famille"}
                                    onClick={() => {
                                navigate('/famille/inscription');
                            }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <h1 className="titre">{familleInfo?.nomFamille || "Chargement..."}</h1>

            <div className="information-div">
                <h2 className="sous-titre">Code d'invitation de la famille</h2>
                <div className="flex items-center gap-4">
                    <p
                        className={`text-gray-700 text-lg select-all font-mono bg-gray-100 p-2 rounded ${!isUuidVisible ? 'blur-sm' : ''}`}
                    >
                        {familleUuid || "Chargement..."}
                    </p>
                    <div className="space-y-2">
                        <Button type={"button"} variant={"outline"} fullWidth
                            onClick={() => setIsUuidVisible(!isUuidVisible)}
                                children={isUuidVisible ? 'Cacher' : 'Afficher'}
                        />
                        <Button type={"button"} variant={"primary"} fullWidth
                            onClick={handleCopy}
                                children={copySuccess ? 'Copié!' : 'Copier'}
                        />
                    </div>
                </div>
            </div>

            <div className="information-div">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="sous-titre mb-0">Membres de votre famille</h2>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleRefresh}
                        disabled={cooldown > 0}
                        children={cooldown > 0
                            ? `Attendre ${Math.floor(cooldown / 60)}:${String(cooldown % 60).padStart(2, '0')}`
                            : "Actualiser"
                        }
                    />
                </div>

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