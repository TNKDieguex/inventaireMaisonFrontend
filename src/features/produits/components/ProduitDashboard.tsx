import {useCallback, useEffect, useMemo, useState} from "react";
import type {ProduitDto} from "../types";
import {useNavigate} from "react-router-dom";
import {getFamilleIdFromToken, getValidCachedProduits} from "../../../utils/jwtUtils.ts";
import type {ErreurResponseDto} from "../../auth/types";
import axios from "axios";
import LoadingModal from "../../../components/LoadingModal.tsx";
import {fetchAndCacheProduits} from "../../../utils/ProduitCache.ts";
import {calculerJoursRestants} from "../../../utils/ExportMethodes.ts";

const ProduitDashboard = () => {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [familleUuid] = useState<string | null>(() => {
        const token = localStorage.getItem('token');
        return token ? getFamilleIdFromToken(token) : null;
    });

    const [listeProduits, setListeProduits] = useState<ProduitDto[] | undefined>(()=>{
            return getValidCachedProduits(familleUuid);
        });

    const stats = useMemo(()=>{
        if (!listeProduits || listeProduits.length === 0) {
            return { total: 0, stockFaible: 0, perime: 0, proche: 0 };
        }

        let stockFaible = 0;
        let perime = 0;
        let proche = 0;

        listeProduits.forEach(p => {
            if (p.quantite <= p.quantiteMinimal) stockFaible++;
            const dias = calculerJoursRestants(p.dateLimiteConsommation);
            if (dias <= 0) perime++;
            else if (dias <= 7) proche++;
        });

        return { total: listeProduits.length, stockFaible, perime, proche };
    }, [listeProduits]);
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
                setError('Une erreur inattendue est survenue.');
            }
        } finally {
            setIsLoading(false);
        }
    }, [familleUuid]);

    useEffect(() => {
        if (!familleUuid || listeProduits) return;

        const initDashboard = async () => {
            await fetchListeProduits();
        };
        void initDashboard();
    }, [familleUuid, listeProduits, fetchListeProduits]);

    const totalProducts = stats.total || 1;
    const barreProgress = [
        { label: "En stock normal", value: stats.total - stats.stockFaible, color: "bg-blue-haze-500" },
        { label: "Stock faible", value: stats.stockFaible, color: "bg-amber-500" },
        { label: "Produits périmés", value: stats.perime, color: "bg-red-600" }
    ];


    return (
        <div className="dashboard-screen">
            <h1 className="dashboard-titre">
                Dashboard</h1>
            {error && (
                <p className="error">
                    {error}
                </p>
            )}
        {!error && (
            <>
                <div className="dashboard-screen-enfant">
                    <div className={"flex flex-row gap-3"}>
                        <div className={"dashboard-sections w-10/12 hover:cursor-pointer"}
                            onClick={() => {navigate('/produits')}}>

                            <h1 className="text-xl font-bold text-blue-haze-title">Liste des produits</h1>
                            <p className="text-3xl font-black text-blue-haze-600 mt-2">{stats.total}</p>
                            <p className="text-xs text-gray-500 mt-1">Articles au total en inventaire</p>
                        </div>

                        <div className="dashboard-sections w-full md:w-5/12 flex flex-col justify-center p-5 gap-3.5 bg-white shadow-sm">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 text-left mb-1">État de l'inventaire</h3>

                            {barreProgress.map((barra, idx) => {
                                const percentage = (barra.value / totalProducts) * 100;
                                return (
                                    <div key={idx} className="space-y-1 text-left">
                                        <div className="flex justify-between text-xs font-medium text-gray-600">
                                            <span>{barra.label}</span>
                                            <span className="font-bold">{barra.value}</span>
                                        </div>
                                        <div className="h-2 w-full bg-slate-100 dark:bg-neutral-700 rounded-full overflow-hidden">
                                            <div className={`h-full rounded-full transition-all duration-500 ${barra.color}`}
                                                style={{ width: `${percentage}%` }}/>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="flex flex-row gap-3">
                        <div className={"dashboard-sections w-5/12 min-h-30 hover:cursor-pointer"}
                            onClick={() => {}}>

                        <div className={"flex flex-col justify-between items-center gap-2"}>
                            <p className="font-bold text-gray-800">Liste de courses</p>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-9">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                            </svg>
                        </div>
                    </div>
                        <div className={"dashboard-sections w-7/12 min-h-30 hover:cursor-pointer"}
                            onClick={() => {navigate('/produits/liste-alertes-achats')}}>

                            <div className={"flex flex-col justify-between items-center gap-2"}>
                                <p className="font-bold text-gray-800">Liste des produits d'urgence</p>
                                {stats.perime + stats.proche > 0 && (
                                    <span className="px-2.5 py-0.5 text-xs font-bold bg-red-100 text-red-600 rounded-full">
                                            {stats.perime + stats.proche} Alerte(s)
                                        </span>
                                )}
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-9">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </>)}
            {isLoading && <LoadingModal title={"Connexion en cours..."}/>}
        </div>
    );
};

export default ProduitDashboard;