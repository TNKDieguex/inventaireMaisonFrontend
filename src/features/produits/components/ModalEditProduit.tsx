import type {ProduitDto, UpdateProduitDto} from "../types";
import Button from "../../../components/Button.tsx";
import React, {type SyntheticEvent, useState} from "react";
import FormInputs from "../../../components/FormInputs.tsx";
import LoadingModal from "../../../components/LoadingModal.tsx";
import axios from "axios";
import type {ErreurResponseDto} from "../../auth/types";
import axiosClient from "../../../api/axiosClient.ts";

const ModalEditProduit = ({produit, isEditing, onSuccess}:
                          {produit: ProduitDto,
                            isEditing: () => void,
                              onSuccess: ()=> void
                          }) => {
    const [validation, setValidation] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

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
        { id: 2, name: "quantiteMinimal", type: "number", placeholder: produit.quantiteMinimal.toString(), label: "Quantite Minimal"},
        { id: 3, name: "dateLimiteConsommation", type: "date", placeholder: produit.dateLimiteConsommation, label: "Date Limite De Consommation"},
        { id: 4, name: "notes", type: "text", placeholder: produit.notes || '', label: "Notes (Facultatif)", maxLength: 100}
    ]

    const handleModProduit = async (e: SyntheticEvent<HTMLFormElement>)=>{
        e.preventDefault();
        if (values.quantite === produit.quantite &&
            values.quantiteMinimal === produit.quantiteMinimal &&
            values.dateLimiteConsommation === produit.dateLimiteConsommation &&
            values.notes === produit.notes){
            isEditing();
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
            await axiosClient.put<ProduitDto>('/produits/modifierProduit', values);

            onSuccess();
            isEditing();
            setIsLoading(false);
        }catch (erreur: unknown) {
            if (axios.isAxiosError<ErreurResponseDto>(erreur)) {
                setError(erreur.response?.data?.message || 'Échec de la connexion.');
            } else {
                console.log(erreur)
                setError('Une erreur inattendue es survenue.');
            }
        }
    }
    const handleDeleteProduit = async ()=>{
        try{
            setIsLoading(true)
            setValidation(false);
            await axiosClient.delete<ProduitDto>(`/produits/${values.uuid}`);

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
    const onchange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
                            onClick={() => setValidation(true)}>
                            <svg className={"size-5"}><use href={"/sprite.svg#trash"}/></svg>
                        </Button>
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
                            <Button type="submit" variant={"primary"} fullWidth>
                                Confirmer
                            </Button>
                            <Button type="button" variant={"outline"} onClick={isEditing} fullWidth>
                                Annuler
                            </Button>
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
                        <Button type={"button"} variant={"primary"} fullWidth onClick={handleDeleteProduit}>
                            Oui
                        </Button>
                        <Button type={"button"} variant={"danger"} fullWidth onClick={()=>{setValidation(false)}}>
                            Non
                        </Button>
                    </div>
                </div>
            </div>}
            {isLoading && <LoadingModal title={"Modification en cours..."}/>}
        </>

    );
};

export default ModalEditProduit;