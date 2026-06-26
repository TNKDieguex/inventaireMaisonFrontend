import {useCallback, useEffect, useState} from 'react';
import type {ProduitDto} from "../types";
import {getFamilleIdFromToken, getValidCachedProduits} from "../../../utils/jwtUtils.ts";
import {useNavigate} from "react-router-dom";
import ItemProduit from "./ItemProduit.tsx";
import axios from "axios";
import type {ErreurResponseDto} from "../../auth/types";
import LoadingModal from "../../../components/LoadingModal.tsx";
import {fetchAndCacheProduits} from "../../../utils/ProduitCache.ts";

const ListeProduits = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const [familleUuid] = useState<string | null>(() => {
        const token = localStorage.getItem('token');
        return token ? getFamilleIdFromToken(token) : null;
    });
    const [listeProduits, setListeProduits] = useState<ProduitDto[]>(() => {
        return getValidCachedProduits(familleUuid) || [];
    });
    const fetchListeProduits = useCallback(async () => {
        if (!familleUuid) return;
        try {
            setIsLoading(true);
            const data = await fetchAndCacheProduits(familleUuid);
            setListeProduits(data);
        } catch (erreur: unknown) {
            if (axios.isAxiosError<ErreurResponseDto>(erreur)) {
                setError(erreur.response?.data?.message || 'Échec de la connexion.');
            } else {
                setError('Une erreur inattendue es survenue.');
            }
        } finally {
            setIsLoading(false);
        }
    }, [familleUuid]);

    useEffect(() => {
        if (!familleUuid) {
            localStorage.clear();
            sessionStorage.clear();
            navigate('/login');
            return;
        }

        const cachedData = getValidCachedProduits(familleUuid);
        if (!cachedData) {
            const ejecutarFetch = async () => {
                await fetchListeProduits();
            };
            void ejecutarFetch();
        }
    }, [familleUuid, navigate, fetchListeProduits]);

    return (
        <div className={"dashboard-screen"}>
            <h1 className="dashboard-titre">
                Liste des produits</h1>
            {!error && (<>
                <div className={"dashboard-screen-enfant"}>
                    {error && (
                        <p className="error">
                            {error}
                        </p>
                    )}
                    {listeProduits.length>0 ?(
                        [...listeProduits].reverse().map((produit, index) => (
                                <ItemProduit key={index} produit={produit} onSuccess={fetchListeProduits}/>
                        )
                    )):(
                        <p className={"text-gray-500"}>
                            Aucun produit dans la famille pour le moment.</p>
                    )}
                </div>
            </>)}
            {isLoading && <LoadingModal title="Mise à jour de la liste..." />}
        </div>
    );
};

export default ListeProduits;