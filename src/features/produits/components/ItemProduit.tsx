import type {ProduitDto} from "../types";
import {useState} from "react";
import ModalEditProduit from "./ModalEditProduit.tsx";
import {calculerJoursRestants} from "../../../utils/ExportMethodes.ts";

const ItemProduit = ({produit, onSuccess}:{produit: ProduitDto, onSuccess: ()=>void}) => {
    const [isEditing, setIsEditing] = useState(false);
    const stockFaible = ()=>{
        return produit.quantite <= produit.quantiteMinimal;
    }
    const joursRestants = calculerJoursRestants(produit.dateLimiteConsommation);
    const estPerime = joursRestants <= 0;
    const estProche = joursRestants > 0 && joursRestants <= 7;
    const changerIsEditing = ()=>{
        setIsEditing(!isEditing);
    }

    return (
        <div className={`flex justify-between border rounded-2xl overflow-hidden transition-all ${
        (stockFaible() || estPerime || estProche) ? 'bg-amber-50/40 border-blue-haze-200' : 'bg-blue-haze-50 border-blue-haze-200'}`}>
            {isEditing &&
                <ModalEditProduit produit={produit} isEditing={changerIsEditing} onSuccess={onSuccess}/>
            }
            <div className={"flex flex-col gap-2 flex-1 p-4"}>
                <div className={"flex flex-row justify-between items-center"}>
                    <div className={"flex flex-col"}>
                        <p className="texte">{
                            produit.nom.charAt(0).toUpperCase() + produit.nom.slice(1)
                        }</p>
                        <p className="sous-texte">{
                            produit.categorieProduit.toString()
                                .toLowerCase()
                                .replace(/_/g, ' ')
                        }</p>
                    </div>
                    <span className={"flex items-center p-1 hover:cursor-pointer"}
                        onClick={()=>{
                            setIsEditing(true);
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                             stroke="currentColor" className="size-7">
                            <path strokeLinecap="round" strokeLinejoin="round"
                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"/>
                        </svg>

                    </span>
                </div>
                {produit.notes && (
                    <div className="bg-gray-50/80 px-3 py-1.5 rounded-xl border-l-4 border-gray-300 max-w-xl">
                        <p className="text-sm text-gray-600 italic">Notes: {produit.notes}</p>
                    </div>
                )}
                <div className={"flex flex-wrap gap-4 mt-1 text-sm font-medium justify-between"}>
                    <span className={`${stockFaible() ? 'text-red-500' : 'text-gray-600'} bg-gray-50 px-2 py-0.5 rounded-lg border border-blue-haze-100`}>
                        Quantité: {produit.quantite}</span>
                    {estPerime ? (
                        <span className="produit-perime">
                        Périmé ({Math.abs(joursRestants)} j)
                    </span>
                    ) : estProche ? (
                        <span className="produit-proche">
                        Échéance ({joursRestants} j)
                    </span>
                    ) : (
                        <span className="produit-date">
                        {produit.dateLimiteConsommation}
                    </span>
                    )}
                </div>
            </div>
            {(stockFaible() || estProche || estPerime) && (
                <div className="produits-liste-alerte">
                    <span className="text-xs font-black tracking-widest  uppercase whitespace-nowrap [writing-mode:vertical-lr] rotate-180">
                        {estPerime ? 'Périmé' : stockFaible() ? 'Stock faible' : 'Échéance'}
                    </span>
                </div>
            )}
        </div>
    );
};

export default ItemProduit;