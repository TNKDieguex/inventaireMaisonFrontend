import Button from "../../../components/Button.tsx";
import {CategorieProduit, type CreateProduitDto} from "../types";
import React, {type SyntheticEvent, useState} from "react";
import FormInputs from "../../../components/FormInputs.tsx";

const ModalAddProduit = ({switcherModal, onSuccess}: {switcherModal: ()=>void, onSuccess: (produit: CreateProduitDto)=>void}) => {
    const [error, setError] = useState('');

    const [values, setValues] = useState<CreateProduitDto>({
        nom: '',
        categorieProduit: CategorieProduit.AUTRES,
        quantite: 0,
        quantiteMinimal: 0,
        dateLimiteConsommation: '',
        notes:'',
    });

    const inputs = [
        { id: 1, name: "nom" as const, type: "text", placeholder: "Ex: Lait", label: "Nom" },
        { id: 2, name: "categorieProduit" as const, type: "select", placeholder: "", label: "Catégorie", options: Object.values(CategorieProduit) },
        { id: 3, name: "quantite" as const, type: "number", placeholder: "0", label: "Quantité" },
        { id: 4, name: "quantiteMinimal" as const, type: "number", placeholder: "0", label: "Quantité Minimale" },
        { id: 5, name: "dateLimiteConsommation" as const, type: "date", placeholder: "", label: "Date Limite De Consommation" },
        { id: 6, name: "notes" as const, type: "text", placeholder: '', label: "Notes (Facultatif)", maxLength: 100 }
    ];

    const hanldeAjouterProduitListe = (e: SyntheticEvent<HTMLFormElement>)=>{
        e.preventDefault();
        if (values.quantite == null || values.quantiteMinimal == null ||
            values.dateLimiteConsommation == '' || values.nom == '' ||
            values.categorieProduit == null){
            setError("Veuillez remplir tous les champs.");
            return;}
        if (values.quantiteMinimal <= 0) {
            setError("La quantité minimal doit être supérieure à zéro.");
            return;}
        if (values.nom.length < 3){
            setError("Le nom du produit doit contenir au moins 3 caractères.");
            return;}
        if (values.nom.length > 50){
            setError("Le nom du produit ne doit pas dépasser 50 caractères.");
            return;}
        if (values.notes && values.notes.length > 100){
            setError("Les notes ne doivent pas dépasser 100 caractères.");
            return;
        }

        onSuccess(values);
        switcherModal();
    }
    const onchange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const fieldName = e.target.name as keyof CreateProduitDto;
        setValues({ ...values, [fieldName]: e.target.value });
    }


    return (
        <>
            <div className={"fixed inset-0 z-50 flex items-center justify-center bg-gray-900/70 backdrop-blur-sm select-none pointer-events-auto"}>
                <div className={"max-w-xs w-full bg-blue-haze-200 p-8 rounded-2xl " +
                    "shadow-2xl  flex flex-col text-center items-center " +
                    "space-y-6 border border-gray-100"}>
                    <h1 className={"titre mb-0"}>Ajouter Produit</h1>
                    <form onSubmit={hanldeAjouterProduitListe}>
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
                                options={input.options}
                            />
                        ))}
                        {error && (
                            <p className="error">
                                {error}
                            </p>
                        )}
                        <div className={"p-2 flex flex-row gap-2"}>
                            <Button variant={"primary"} type={"submit"} fullWidth>
                                Confirmer
                            </Button>
                            <Button variant={"outline"} type={"button"} fullWidth onClick={switcherModal}>
                                Annuler
                            </Button>
                        </div>
                    </form>

                </div>
            </div>

        </>
    );
};

export default ModalAddProduit;