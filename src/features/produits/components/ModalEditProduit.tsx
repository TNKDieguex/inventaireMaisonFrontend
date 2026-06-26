import type {ProduitDto, UpdateProduitDto} from "../types";
import Button from "../../../components/Button.tsx";
import React, {type SyntheticEvent, useState} from "react";
import FormInputs from "../../../components/FormInputs.tsx";
import {getFamilleIdFromToken, getValidCachedProduits} from "../../../utils/jwtUtils.ts";
import LoadingModal from "../../../components/LoadingModal.tsx";
import axios from "axios";
import type {ErreurResponseDto} from "../../auth/types";
import {deleteProduit, updateProduit} from "../../../utils/ProduitCache.ts";

const ModalEditProduit = ({produit, isEditing, onSuccess}:
                          {produit: ProduitDto,
                            isEditing: () => void,
                              onSuccess: ()=> void
                          }) => {
    const [validation, setValidation] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [familleUuid] = useState<string | null>(()=>{
        const token = localStorage.getItem('token');
        return token ? getFamilleIdFromToken(token) : null;
    });

    const [values, setValues] = useState<UpdateProduitDto>(
        {
            quantite: produit.quantite,
            quantiteMinimal: produit.quantiteMinimal,
            dateLimiteConsommation: produit.dateLimiteConsommation,
            notes: produit.notes|| '',
            uuid: produit.uuid
        });

    const inputs: {
        id: number,
        name: keyof UpdateProduitDto,
        type: string,
        placeholder: string,
        label: string,
        maxLength?: number
    }[] = [
        { id: 1, name: "quantite", type: "number", placeholder: produit.quantite.toString(), label: "Quantité"},
        { id: 2, name: "quantiteMinimal", type: "number", placeholder: produit.quantiteMinimal.toString(), label: "QuantiteMinimal"},
        { id: 3, name: "dateLimiteConsommation", type: "date", placeholder: produit.dateLimiteConsommation, label: "DateLimiteConsommation"},
        { id: 4, name: "notes", type: "text", placeholder: produit.notes || '', label: "Notes (Facultatif)", maxLength: 100}
    ]

    const handleModProduit = async (e: SyntheticEvent<HTMLFormElement>)=>{
        e.preventDefault();
        if (values.quantite === produit.quantite &&
            values.quantiteMinimal === produit.quantiteMinimal &&
            values.dateLimiteConsommation === produit.dateLimiteConsommation &&
            values.notes === produit.notes){
            isEditing();
            console.log("no pasó nada")
            return;}
        if (values.quantite == null || values.quantiteMinimal == null ||
            values.dateLimiteConsommation == ''){
            setError("Veuillez remplir tous les champs.");
            return;}
        if (values.quantiteMinimal <= 0) {
            setError("La quantité minimal doit être supérieure à zéro.");
            return;}

        try {
            setIsLoading(true);
            const currentList = getValidCachedProduits(familleUuid) || [];
            await updateProduit(familleUuid, currentList, values);

            onSuccess();
            isEditing();
        }catch (erreur: unknown) {
            if (axios.isAxiosError<ErreurResponseDto>(erreur)) {
                setError(erreur.response?.data?.message || 'Échec de la connexion.');
            } else {
                console.log(erreur)
                setError('Une erreur inattendue es survenue.');
            }
        }finally {
            setIsLoading(false);
        }
    }
    const handleDeleteProduit = async ()=>{
        try{
            setIsLoading(true)
            setValidation(false);
            const currentList = getValidCachedProduits(familleUuid) || [];
            await deleteProduit(values.uuid, familleUuid, currentList);

            onSuccess();
            isEditing();
        }catch (erreur: unknown) {
            if (axios.isAxiosError<ErreurResponseDto>(erreur)) {
                setError(erreur.response?.data?.message || 'Échec de la connexion.');
            } else {
                setError('Une erreur inattendue es survenue.');
            }
        }finally {
            setIsLoading(false)
        }
    }
    const onchange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const fieldName = e.target.name as keyof UpdateProduitDto;
        setValues({ ...values, [fieldName]: e.target.value });
    }

    return (
        <>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/70 backdrop-blur-sm select-none pointer-events-auto">
            <div className="max-w-xs w-full bg-blue-haze-200 p-8 rounded-2xl
            shadow-2xl  flex flex-col text-center
            items-center space-y-6 border border-gray-100">
                <h1 className={"titre mb-0"}>Modifier le produit</h1>
                <div className="w-full flex flex-row items-center justify-between gap-4 border-b border-blue-haze-300 pb-4">
                    <div className="flex flex-col text-left">
                        <h2 className="texte text-gray-900 leading-tight">
                            {produit.nom.charAt(0).toUpperCase() + produit.nom.slice(1)}
                        </h2>
                        <h2 className="sous-texte text-xs uppercase tracking-wider font-bold mt-0.5">
                            {produit.categorieProduit.toString().toLowerCase().replace(/_/g, ' ')}
                        </h2>
                    </div>
                    <div className="flex items-center shrink-0">
                        <Button
                            type="button"
                            variant="danger"
                            onClick={() => setValidation(true)}
                            children={
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                            }
                        />
                    </div>
                </div>
                <form onSubmit={handleModProduit}
                    className="forms-style">
                    {inputs.map((input) => (
                        <FormInputs
                            key={input.id}
                            placeholder={input.placeholder}
                            type={input.type}
                            value={values[input.name]}
                            onChange={onchange}
                            name={input.name}
                            label={input.label}
                            maxLength={input.maxLength}
                            />
                        ))}
                        {error && (
                            <p className="error">
                                {error}
                            </p>
                        )}
                        <div className={"p-2 flex flex-row gap-2"}>
                            <Button type="submit" variant={"primary"} fullWidth
                                    children={"Confirmer"}
                            />
                            <Button type="button" variant={"outline"} fullWidth
                                    children={"Annuler"} onClick={isEditing}
                            />
                        </div>
                </form>
            </div>
        </div>
            {validation && <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-haze-900/20 backdrop-blur-sm select-none pointer-events-auto">
                <div className="bg-blue-haze-200 p-8 rounded-2xl
            shadow-2xl max-w-sm w-full mx-4 flex flex-col
            items-center text-center space-y-6 border border-blue-haze-100">
                    <h1 className={"titre"}>Voulez-vous vraiment supprimer ce produit ?</h1>
                    <div className={"flex flex-row gap-2"}>
                        <Button type={"button"} variant={"primary"} fullWidth
                                children={"Oui"} onClick={handleDeleteProduit}
                        />
                        <Button type={"button"} variant={"danger"} fullWidth
                                children={"Non"} onClick={()=>{setValidation(false)}}
                        />
                    </div>
                </div>
            </div>}
            {isLoading && <LoadingModal title={"Modification en cours..."}/>}
        </>

    );
};

export default ModalEditProduit;