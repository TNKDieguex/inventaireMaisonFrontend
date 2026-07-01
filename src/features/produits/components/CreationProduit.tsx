import {useEffect, useState} from 'react';
import Button from "../../../components/Button.tsx";
import ModalAddProduit from "./ModalAddProduit.tsx";
import type {CreateProduitDto} from "../types";
import axios from "axios";
import type {ErreurResponseDto} from "../../auth/types";
import {useNavigate} from "react-router-dom";
import {creerProduits} from "../../../utils/ProduitCache.ts";
import {getFamilleIdFromToken} from "../../../utils/jwtUtils.ts";

const CreationProduit = () => {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [listeProduitsACreer, setListeProduitsACreer] = useState<CreateProduitDto[]>(() => {
        const listeProduits = sessionStorage.getItem('queue_produits_creation');
        return listeProduits ? JSON.parse(listeProduits) : [];
    });
    const [familleUuid] = useState<string | null>(()=>{
        const token = localStorage.getItem('token');
        return token ? getFamilleIdFromToken(token) : null;
    });

    const [montrerModalAddProduit, setMontrerModalAddProduit] = useState(false);

    const switchModal = () =>{
        setMontrerModalAddProduit(!montrerModalAddProduit);
    }

    const handleAjouterProduitALaQueue = (nouveauProduit: CreateProduitDto) => {
        setListeProduitsACreer((prev) => [...prev, nouveauProduit]);
    };

    const postProduits = async () => {
        if (listeProduitsACreer.length === 0) return;

        try {
            await creerProduits(familleUuid, listeProduitsACreer);
            sessionStorage.removeItem('queue_produits_creation');
            setListeProduitsACreer([]);
            navigate("/dashboard");

        } catch (erreur: unknown) {
            if (axios.isAxiosError<ErreurResponseDto>(erreur)) {
                setError(erreur.response?.data?.message || 'Échec de la connexion. Veuillez réessayer.');
            } else {
                setError('Une erreur inattendue est survenue. Veuillez réessayer plus tard.');
            }
        }
    };
    const supprimerProduitListe = (pos: number) => {
        setListeProduitsACreer(
            listeProduitsACreer.filter((produit)=>{
                return listeProduitsACreer.indexOf(produit) !== pos;
            })
        )
    }
    const handleRetourner = () => {
        navigate('/dashboard');
    }

    useEffect(() => {
        sessionStorage.setItem('queue_produits_creation', JSON.stringify(listeProduitsACreer));
    }, [listeProduitsACreer]);

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
                Création Produits </h1>
            </div>
            {error && (
                <div className={"dashboard-screen-enfant"}>
                        <p className="error">
                            {error}
                        </p>
                </div>
            )}
            {!error && (
                <>
                    {montrerModalAddProduit &&
                        <ModalAddProduit switcherModal={switchModal} onSuccess={handleAjouterProduitALaQueue}/>
                    }
                    <div className={"dashboard-screen-enfant pb-12"}>
                        <div className="information-div space-y-2">
                            <h3 className="font-bold texte border-b border-blue-haze-300 pb-1">
                                Produits en attente ({listeProduitsACreer.length})
                            </h3>

                            {listeProduitsACreer.length > 0 ? (
                                <div className="space-y-1.5 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-haze-400 text-sm">
                                    {listeProduitsACreer.map((prod, idx) => (
                                        <div key={idx} className="flex justify-between bg-blue-haze-50 p-2 rounded-lg border border-blue-haze-100 items-center">
                                            <span className="font-semibold text-gray-800 capitalize">{prod.nom}</span>
                                            <div className={"flex flex-col gap-1 items-center "}>
                                                <span className="text-gray-500">Cant: {prod.quantite} | Min: {prod.quantiteMinimal}</span>
                                                <span className="text-gray-500">Catégorie: {(prod.categorieProduit).toString().toLowerCase().replace(/_/g, ' ')}</span>
                                            </div>
                                            <span>
                                                <Button type={"button"} variant={"danger"}
                                                        onClick={()=>{supprimerProduitListe(idx)}}>
                                                    <svg className={"size-5" }><use href={"/sprite.svg#trash"}/></svg>
                                                </Button>
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-sm italic py-1">Aucun produit ajouté a la lista temporal.</p>
                            )}
                            <Button fullWidth type={"button"} onClick={switchModal}>
                                + Ajouter un produit
                            </Button>
                        </div>
                    </div>
                    <div className={"pt-4 border-t border-blue-haze-300"}>
                        <Button className={"w-4/12"} type={"button"} onClick={postProduits}>
                            Sauvegarder produits
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
};

export default CreationProduit;