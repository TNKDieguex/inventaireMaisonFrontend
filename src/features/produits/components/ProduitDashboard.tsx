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
            const jours = calculerJoursRestants(p.dateLimiteConsommation);
            if (jours <= 0) perime++;
            else if (jours <= 7) proche++;
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
                <div className={"dashboard-screen-enfant"}>
                    <p className="error">
                        {error}
                    </p>
                </div>
            )}
            <div className={"ajouter-produit"} onClick={() => {navigate('/produits/creation')}}>
                <svg className={"size-9"}><use href={"/sprite.svg#add"}/></svg>
            </div>
        {!error && (
            <>
                <div className="dashboard-screen-enfant">
                    <div className={"flex flex-row gap-3"}>
                        <div className={"dashboard-sections w-7/12 sm:w-9/12 md:w-7/12 hover:cursor-pointer"}
                            onClick={() => {navigate('/produits')}}>

                            <h1 className="text-xl font-bold text-blue-haze-title">Liste des produits</h1>
                            <p className="text-3xl font-black text-blue-haze-600 mt-2">{stats.total}</p>
                            <p className="text-xs text-gray-500 mt-1">Articles au total en inventaire</p>
                        </div>

                        <div className="dashboard-sections w-5/12 sm:w-3/12 md:w-5/12 flex flex-col justify-center p-5 gap-3.5 bg-white">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-haze-title text-center mb-1">État de l'inventaire</h3>

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
                            <svg className={"size-9"}><use href={"/sprite.svg#shoppingCart"}/></svg>
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
                                <svg className={"size-9"}><use href={"/sprite.svg#alert"}/></svg>
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