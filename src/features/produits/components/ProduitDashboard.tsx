import {useCallback, useEffect, useMemo, useState} from "react";
import type {ProduitDto} from "../types";
import {useNavigate} from "react-router-dom";
import {
    fetchFamilleAndPutCache,
    getFamilleIdFromToken,
    getValidCachedFamille,
    getValidCachedProduits
} from "../../../utils/jwtUtils.ts";
import type {ErreurResponseDto} from "../../auth/types";
import axios from "axios";
import LoadingModal from "../../../components/LoadingModal.tsx";
import {fetchAndCacheProduits} from "../../../utils/ProduitCache.ts";
import {calculerJoursRestants} from "../../../utils/ExportMethodes.ts";

const ProduitDashboard = () => {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [menuOuvert, setMenuOuvert] = useState(false);
    const [cooldown, setCooldown] = useState(0);

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

    const fetchListeProduitsAndFamille = useCallback(async () => {
        if (!familleUuid) return;
        try {
            setError('');
            setIsLoading(true);

            const tasks = [];
            if (!getValidCachedProduits(familleUuid)) {
                tasks.push(
                    fetchAndCacheProduits(familleUuid).then(
                        data => setListeProduits(data))
                );
            }
            if (!getValidCachedFamille(familleUuid)) {
                tasks.push(fetchFamilleAndPutCache(familleUuid));
            }
            if (tasks.length > 0) {
                await Promise.all(tasks);
            }
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
    const handleRefreshProduits = async () => {
        if (cooldown > 0 || !familleUuid) return;
        sessionStorage.removeItem(`produits_famille_${familleUuid}`);
        setCooldown(180);
        setMenuOuvert(false);

        try {
            setIsLoading(true);
            setError('');
            const data = await fetchAndCacheProduits(familleUuid);
            setListeProduits(data);
        } catch (erreur: unknown) {
            if (axios.isAxiosError<ErreurResponseDto>(erreur)) {
                setError(erreur.response?.data?.message || 'Échec de la mise à jour.');
            } else {
                setError('Une erreur est survenue.');
            }
        } finally {
            setIsLoading(false);
        }
    };
    const handleRefresh = async () => {
        if (cooldown > 0 || !familleUuid) return;
        sessionStorage.removeItem(`produits_famille_${familleUuid}`);
        setCooldown(180);
        await handleRefreshProduits();
    };
    const switchMenuOuvert = ()=>{
        setMenuOuvert(!menuOuvert);
    }

    useEffect(() => {
        if (!familleUuid) return;
        const hasProduits = !!getValidCachedProduits(familleUuid);
        const hasFamille = !!getValidCachedFamille(familleUuid);
        if (cooldown > 0) {
            const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
            return () => clearTimeout(timer);
        }

        if (!hasProduits || !hasFamille) {
            const initDashboard = async () => {
                await fetchListeProduitsAndFamille();
            };
            void initDashboard();
        }
    }, [familleUuid, fetchListeProduitsAndFamille, cooldown]);

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
            <>
                {menuOuvert && (
                    <div className="absolute inset-0 bg-slate-800/20 backdrop-blur-sm z-20 "
                        onClick={switchMenuOuvert} />
                )}
                <div className="absolute bottom-18 right-3 flex flex-col items-end gap-3 z-50 select-none">
                    {menuOuvert && (
                        <div className="menu-options-enfant">
                            <span className="menu-options-item" onClick={() => navigate('/produits/creation')}>
                                Créer un produit +
                            </span>
                            <span className={`menu-options-item ${cooldown > 0 ? 
                                'opacity-50 cursor-not-allowed pointer-events-none hover:bg-transparent hover:text-slate-800' : ''}`}
                                onClick={cooldown > 0 ? undefined : handleRefresh}>
                            {cooldown > 0 ?
                                `Attendre ${Math.floor(cooldown / 60)}:${String(cooldown % 60).padStart(2, '0')}`
                                : "Rafraîchir l'inventaire"}
                        </span>
                        </div>
                    )}
                    <div className="menu-options" onClick={switchMenuOuvert}>
                        {menuOuvert ? <svg className="size-9"><use href="/sprite.svg#xMark"/></svg>: <svg className="size-9"><use href="/sprite.svg#options"/></svg>}
                    </div>
                </div>
            </>
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