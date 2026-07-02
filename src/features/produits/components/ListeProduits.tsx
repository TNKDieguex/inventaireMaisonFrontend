import {useCallback, useEffect, useMemo, useState} from 'react';
import {CategorieProduit, type ProduitDto} from "../types";
import {getFamilleIdFromToken, getValidCachedProduits} from "../../../utils/jwtUtils.ts";
import {useNavigate} from "react-router-dom";
import ItemProduit from "./ItemProduit.tsx";
import axios from "axios";
import type {ErreurResponseDto} from "../../auth/types";
import {fetchAndCacheProduits} from "../../../utils/ProduitCache.ts";
import Button from "../../../components/Button.tsx";

const ListeProduits = () => {
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const [categorieSelectionnee, setCategorieSelectionnee] = useState<string>('TOUS');

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
            const data = await fetchAndCacheProduits(familleUuid);
            setListeProduits(data);
        } catch (erreur: unknown) {
            if (axios.isAxiosError<ErreurResponseDto>(erreur)) {
                setError(erreur.response?.data?.message || 'Échec de la connexion. Veuillez réessayer.');
            } else {
                setError('Une erreur inattendue est survenue. Veuillez réessayer plus tard.');
            }
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
    const handleRetourner = () => {
        navigate('/dashboard');
    }

    const produitsFiltres = useMemo(() => {
        if (categorieSelectionnee === 'TOUS') return listeProduits;
        return listeProduits.filter(p => p.categorieProduit === categorieSelectionnee);
    }, [listeProduits, categorieSelectionnee]);

    const categoriesDisponibles = ['TOUS', ...Object.values(CategorieProduit)];
    
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
                    Liste des produits</h1>
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
                    <div className="w-full flex flex-row gap-2 overflow-x-auto pb-3 px-1 select-none scrollbar-none">
                        {categoriesDisponibles.map((cat) => {
                            const active = categorieSelectionnee === cat;
                            return (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setCategorieSelectionnee(cat)}
                                    className={`px-3 py-1.5 text-xs font-semibold rounded-full border whitespace-nowrap transition-all duration-200 cursor-pointer capitalize shadow-sm
                                            ${active
                                        ? 'bg-blue-haze-600 border-blue-haze-600 text-white font-bold scale-[1.02]'
                                        : 'bg-blue-haze-50 border-blue-haze-200 text-slate-600 hover:bg-blue-haze-100 hover:text-blue-haze-700'
                                    }`}
                                >
                                    {cat.toLowerCase().replace(/_/g, ' ')}
                                </button>
                            );
                        })}
                    </div>
                    {produitsFiltres.length > 0 ? (
                        [...produitsFiltres].reverse().map((produit) => (
                            <ItemProduit
                                key={produit.uuid}
                                produit={produit}
                                onSuccess={fetchListeProduits}
                            />
                        ))
                    ) : (
                        <p className="text-gray-500 text-center py-6 italic text-sm">
                            Aucun produit {categorieSelectionnee !== 'TOUS' ? "dans cette catégorie" : ""} pour le moment.
                        </p>
                    )}
                </div>
            </>)}
        </div>
    );
};

export default ListeProduits;