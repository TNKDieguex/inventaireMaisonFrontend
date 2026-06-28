import type {ProduitDto, UpdateNoteProduitDto, UpdateQuantiteProduitDto} from "../types";
import {useState} from "react";
import ModalEditProduit from "./ModalEditProduit.tsx";
import {calculerJoursRestants} from "../../../utils/ExportMethodes.ts";
import Button from "../../../components/Button.tsx";
import axios from "axios";
import type {ErreurResponseDto} from "../../auth/types";
import axiosClient from "../../../api/axiosClient.ts";

const ItemProduit = ({produit, onSuccess}:{produit: ProduitDto, onSuccess: ()=>void}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isEditingQuantite, setIsEditingQuantite] = useState(false);
    const [isEditingNote, setIsEditingNote] = useState(false);
    const [error, setError] = useState('');

    const [localQuantite, setLocalQuantite] = useState<UpdateQuantiteProduitDto>({
            quantite: produit.quantite
    });
    const [localNotes, setLocalNotes] = useState<UpdateNoteProduitDto>({
        notes: produit.notes || ''
    });

    const stockFaible = ()=>{
        return produit.quantite <= produit.quantiteMinimal;
    }
    const joursRestants = calculerJoursRestants(produit.dateLimiteConsommation);
    const estPerime = joursRestants <= 0;
    const estProche = joursRestants > 0 && joursRestants <= 7;
    const changerIsEditing = ()=>{
        setIsEditing(!isEditing);
    }

    const changerIsEditingQuantite = () => {
        setIsEditingQuantite(!isEditingQuantite);
        if (!isEditingQuantite) setLocalQuantite({quantite: produit.quantite});
    };

    const changerIsEditingNote = () => {
        setIsEditingNote(!isEditingNote);
        if (!isEditingNote) setLocalNotes({notes: produit.notes || ''});
    };
    const handleStep = (amount: number) => {
        setLocalQuantite({quantite: Math.max(0, localQuantite.quantite + amount)});
    };
    const handleModNote = async ()=> {
        if (localNotes.notes === produit.notes) {
            setIsEditingNote(false);
            return;
        }
        try {
            await axiosClient.patch<ProduitDto>(`/produits/${produit.uuid}/notes`, localNotes)
            onSuccess();
        } catch (erreur: unknown) {
            if (axios.isAxiosError<ErreurResponseDto>(erreur)) {
                setError(erreur.response?.data?.message || 'Échec de la connexion.');
            } else {
                console.log(erreur)
                setError('Une erreur inattendue es survenue.');
            }
        } finally {
            setIsEditingNote(false);
            setTimeout(() => {
                setError('');
            }, 3000);
        }
    }

    const handleModQuantite = async ()=>{
        if (localQuantite.quantite === produit.quantite) {
            setIsEditingQuantite(false);
            return;
        }
        try {
            await axiosClient.patch<ProduitDto>(`/produits/${produit.uuid}/quantite`, localQuantite)
            onSuccess();
        } catch (erreur: unknown) {
            if (axios.isAxiosError<ErreurResponseDto>(erreur)) {
                setError(erreur.response?.data?.message || 'Échec de la connexion.');
            } else {
                console.log(erreur)
                setError('Une erreur inattendue es survenue.');
            }
        } finally {
            setIsEditingQuantite(false);
            setTimeout(() => {
                setError('');
            }, 3000);
        }
    }

    return (
        <>
        <div className={`flex justify-between border rounded-2xl overflow-hidden transition-all ${
        (stockFaible() || estPerime || estProche) ? 'bg-amber-50/40 border-blue-haze-200' : 'bg-blue-haze-50 border-blue-haze-200'}`}>
            {isEditing &&
                <ModalEditProduit produit={produit} isEditing={changerIsEditing} onSuccess={onSuccess}/>
            }
            <div className="flex flex-col gap-2 flex-1 p-4">
                <div className="flex flex-row justify-between items-center">
                    <div className="flex flex-col text-left">
                        <p className="texte">
                            {produit.nom.charAt(0).toUpperCase() + produit.nom.slice(1)}
                        </p>
                        <p className="sous-texte">
                            {produit.categorieProduit.toString().toLowerCase().replace(/_/g, ' ')}
                        </p>
                    </div>
                    <span className="flex items-center p-1 hover:cursor-pointer text-blue-haze-600 button-basic-style"
                          onClick={() => setIsEditing(true)}
                    >
                        <svg className="size-6"><use href="/sprite.svg#edit" /></svg>
                    </span>
                </div>

                {(produit.notes || isEditingNote) ? (
                    <div className="flex flex-row items-center gap-2 w-full mt-1">
                        {!isEditingNote ? (
                            <>
                                <svg className="size-5 button-basic-style hover:cursor-pointer text-slate-400"
                                     onClick={changerIsEditingNote}>
                                    <use href="/sprite.svg#edit"/></svg>
                                <div className="bg-gray-50/80 px-3 py-1.5 rounded-xl border-l-4 border-gray-300 w-full text-left">
                                    <p className="text-sm text-gray-600 italic">Notes: {produit.notes}</p>
                                </div>
                            </>
                        ) : (
                            <>
                                <input
                                    type="text"
                                    maxLength={100}
                                    value={localNotes.notes}
                                    onChange={(e) => setLocalNotes({ notes: e.target.value })}
                                    placeholder="Ajouter des notes..."
                                    className="w-full text-sm text-slate-700 bg-white border border-blue-haze-400 rounded-xl px-3 py-1.5 outline-none focus:border-blue-haze-600 transition-all text-left"
                                />
                                <Button type={"button"} variant={"confirm"} className={"p-1.5 h-7"}
                                        children={<svg className="size-4"><use href="/sprite.svg#check" /></svg>}
                                        onClick={handleModNote}
                                />
                                <Button type={"button"} variant={"danger"} children={"Annuler"}
                                        className={"p-1.5 h-7 text-xs w-13"} onClick={changerIsEditingNote}/>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="text-left mt-1">
                        <Button type="button"
                                className="text-xs"
                                onClick={changerIsEditingNote}
                            children={"+Ajouter une note"}/>
                    </div>
                )}

                <div className="flex flex-wrap gap-4 mt-2 text-sm font-medium justify-between items-center">
                    <div className="flex flex-row items-center gap-2 min-h-8">
                        {!isEditingQuantite ? (
                            <>
                                <svg className="size-5 button-basic-style hover:cursor-pointer text-slate-400"
                                     onClick={changerIsEditingQuantite}>
                                    <use href="/sprite.svg#edit"/></svg>
                                <span className={`${stockFaible() ? 'text-red-500 font-bold' : 'text-gray-600'} bg-gray-50 px-2 py-0.5 rounded-lg border border-blue-haze-100`}>
                                    Quantité: {produit.quantite}
                                </span>
                            </>
                        ) : (
                            <>
                                <Button type="button" variant="primary" className="size-7" children={"-"}
                                        onClick={() => handleStep(-1)}/>
                                <span className="font-mono font-bold bg-white px-3 py-0.5 rounded-lg border border-blue-haze-400 min-w-12 text-center text-slate-700 shadow-inner">
                                    {localQuantite.quantite}
                                </span>
                                <Button type="button" variant="primary" className="size-7" children={"+"}
                                        onClick={() => handleStep(1)}/>
                                <Button type={"button"} variant={"confirm"} className={"p-1.5 h-7"}
                                        children={<svg className="size-4"><use href="/sprite.svg#check" /></svg>}
                                        onClick={handleModQuantite}
                                />
                                <Button type={"button"} variant={"danger"} children={"Annuler"}
                                        className={"p-1.5 h-7 text-xs w-13"} onClick={changerIsEditingQuantite}/>
                            </>
                        )}
                    </div>

                    {estPerime ? (
                        <span className="produit-perime">Périmé ({Math.abs(joursRestants)} j)</span>
                    ) : estProche ? (
                        <span className="produit-proche">Échéance ({joursRestants} j)</span>
                    ) : (
                        <span className="produit-date">{produit.dateLimiteConsommation}</span>
                    )}
                </div>
            </div>

            {(stockFaible() || estProche || estPerime) && (
                <div className="produits-liste-alerte">
                    <span className="text-xs font-black tracking-widest uppercase whitespace-nowrap [writing-mode:vertical-lr] rotate-180">
                        {estPerime ? 'Périmé' : stockFaible() ? 'Stock faible' : 'Échéance'}
                    </span>
                </div>
            )}
        </div>
            {error && (
                <p className="error">
                    {error}
                </p>
            )}
        </>
    );
};

export default ItemProduit;