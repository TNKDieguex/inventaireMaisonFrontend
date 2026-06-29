import type {ProduitDto} from "../types";
import {useCallback, useEffect, useState} from "react";
import {getFamilleIdFromToken} from "../../../utils/jwtUtils.ts";
import axiosClient from "../../../api/axiosClient.ts";
import axios from "axios";
import type {ErreurResponseDto} from "../../auth/types";
import ItemProduit from "./ItemProduit.tsx";
import LoadingModal from "../../../components/LoadingModal.tsx";

const ListeProduitsUrgentes = () => {
    const [listeDUrgence, setListeDUrgence] = useState<ProduitDto[]>();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [familleUuid] = useState<string | null>(() => {
        const token = localStorage.getItem('token');
        return token ? getFamilleIdFromToken(token) : null;
    });
    const fetchProduitsUrgentes = useCallback(async () => {
        if (!familleUuid) return;
        try {
            setError('');
            setIsLoading(true);
            const response = await axiosClient.get<ProduitDto[]>('/produits/liste-alertes-achats');
            setListeDUrgence(response.data);
        } catch (erreur: unknown) {
            if (axios.isAxiosError<ErreurResponseDto>(erreur)) {
                setError(erreur.response?.data?.message || 'Échec de la connexion.');
            } else {
                setError('Une erreur inattendue est survenue.');
            }
        } finally {
            setIsLoading(false);
        }
    }, [familleUuid]);

    useEffect(() => {
        const executerChargementDonnees = async () => {
            await fetchProduitsUrgentes();
        };
        void executerChargementDonnees();
    }, [fetchProduitsUrgentes]);

    return (
        <div className={"dashboard-screen"}>
            <h1 className="dashboard-titre">
                Produits Urgentes</h1>
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
                                <ItemProduit key={produit.uuid} produit={produit} onSuccess={fetchProduitsUrgentes}/>
                            )
                        )):(
                        <p className={"text-gray-500"}>
                            Aucun produit proche à la date d'éxpiration ou quantité minimal pour le moment
                        </p>
                    )}
                </div>
            </>)}
            {isLoading && <LoadingModal title="Mise à jour de la liste..." />}
        </div>
    );
};

export default ListeProduitsUrgentes;