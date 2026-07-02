import type {ProduitDto} from "../types";
import {useCallback, useEffect, useState} from "react";
import {getFamilleIdFromToken} from "../../../utils/jwtUtils.ts";
import axiosClient from "../../../api/axiosClient.ts";
import axios from "axios";
import type {ErreurResponseDto} from "../../auth/types";
import ItemProduit from "./ItemProduit.tsx";
import {fetchAndCacheProduits} from "../../../utils/ProduitCache.ts";
import {useNavigate} from "react-router-dom";
import Button from "../../../components/Button.tsx";

const ListeProduitsUrgentes = () => {
    const navigate = useNavigate();
    const [listeDUrgence, setListeDUrgence] = useState<ProduitDto[]>([]);
    const [error, setError] = useState('');
    const [aEteModifie, setAEteModifie] = useState(false);
    const [familleUuid] = useState<string | null>(() => {
        const token = localStorage.getItem('token');
        return token ? getFamilleIdFromToken(token) : null;
    });

    const fetchProduitsUrgentes = useCallback(async () => {
        if (!familleUuid) return;
        try {
            setError('');
            const response = await axiosClient.get<ProduitDto[]>('/produits/liste-alertes-achats');
            setListeDUrgence(response.data);
        } catch (erreur: unknown) {
            if (axios.isAxiosError<ErreurResponseDto>(erreur)) {
                setError(erreur.response?.data?.message || 'Échec de la connexion. Veuillez réessayer.');
            } else {
                setError('Une erreur inattendue est survenue. Veuillez réessayer plus tard.');
            }
        }
    }, [familleUuid]);

    const handleItemMutation = useCallback(() => {
        setAEteModifie(true);
        void fetchProduitsUrgentes();
    }, [fetchProduitsUrgentes]);

    const handleRetourner = async () => {
        if (!familleUuid || !aEteModifie) {
            navigate('/dashboard');
            return;
        }
        try {
            await fetchAndCacheProduits(familleUuid);
        } catch (e) {
            console.error('Erreur lors de la mise à jour du cache des produits :', e);
        } finally {
            navigate('/dashboard');
        }
    };

    useEffect(() => {
        const executerChargementDonnees = async () => {
            await fetchProduitsUrgentes();
        };
        void executerChargementDonnees();
    }, [fetchProduitsUrgentes]);

    return (
        <div className={"dashboard-screen"}>
            <div className="dashboard-titre flex flex-row gap-2">
                <Button
                    type="button"
                    variant="secondary"
                    size={"sm"}
                    onClick={handleRetourner}
                >
                    <svg className={"size-5"}>
                        <use href="/sprite.svg#arrowLeft" />
                    </svg>
                </Button>
                <h1>
                    Produits Urgentes
                </h1>
            </div>
            {error && (
                <div className={"dashboard-screen-enfant"}>
                    <p className="error">
                        {error}
                    </p>
                </div>
            )}
            {!error && (<>
                <div className={"dashboard-screen-enfant"}>
                    {listeDUrgence && listeDUrgence.length>0 ?(
                        [...listeDUrgence].map((produit) => (
                                <ItemProduit key={produit.uuid} produit={produit} onSuccess={handleItemMutation}/>
                            )
                        )):(
                        <p className={"text-gray-500"}>
                            Aucun produit proche à la date d'éxpiration ou quantité minimal pour le moment
                        </p>
                    )}
                </div>
            </>)}
        </div>
    );
};

export default ListeProduitsUrgentes;