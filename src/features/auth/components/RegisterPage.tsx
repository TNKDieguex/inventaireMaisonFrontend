import React, {type SyntheticEvent, useState} from "react";
import type {CreationUtilisateur, ErreurResponseDto, UtilisateurData, UtilisateurDto} from "../types";
import {useNavigate} from "react-router-dom";
import Button from "../../../components/Button.tsx";
import FormInputs from "../../../components/FormInputs.tsx";
import axiosClient from "../../../api/axiosClient.ts";
import axios from "axios";
import LoadingModal from "../../../components/LoadingModal.tsx";

const INPUTS: { id: number,
    name: keyof CreationUtilisateur,
    type: string,
    placeholder: string,
    label: string}[] = [
    { id: 1, name: "nom", type: "text", placeholder: "Laufey Lín Bing", label: "Nom"},
    { id: 2, name: "courriel", type: "email", placeholder: "vous@exemple.com" ,label:"Courriel"},
    { id: 3, name: "motPasse", type: "password", placeholder: "•••••", label: "Mot de passe"},
    { id: 4, name: "motPasseConfirmation", type: "password", placeholder: "•••••",label: "Confirmation de mot de passe"}
];

const RegisterPage = () => {
    const [values, setValues] = useState<CreationUtilisateur>({
        nom: '',
        courriel: '',
        motPasse: '',
        motPasseConfirmation: ''
    });

    const [error, setError] = useState('');
    const [disableButton, setDisableButton] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();



    const handleRegister = async (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!isValid()) return;
        setError('');
        try {
            setDisableButton(true);
            setIsLoading(true);
            const payload: UtilisateurData = {
                nom: values.nom,
                courriel: values.courriel,
                motPasse: values.motPasse
            };

            await axiosClient.post<UtilisateurDto>('/utilisateurs', payload);

            setValues({ nom: '', courriel: '', motPasse: '', motPasseConfirmation: '' });
            navigate('/login');
        } catch (erreur: unknown) {
            setDisableButton(false);
            if (axios.isAxiosError<ErreurResponseDto>(erreur)) {
                const messageDuBackend = erreur.response?.data?.message;
                setError(messageDuBackend || "Échec de la création du compte.");
            } else {
                setError('Une erreur inattendue est survenue. Veuillez réessayer plus tard.');
            }
            console.error(erreur);
        }finally {
            setIsLoading(false);
        }
    };

    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const fieldName = e.target.name as keyof CreationUtilisateur;
        setValues({ ...values, [fieldName]: e.target.value });
    };

    const isValid = () => {
        if (values.nom.trim() === '' || values.courriel.trim() === '' || values.motPasse === '' || values.motPasseConfirmation === '') {
            setError('Veuillez compléter tous les champs');
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(values.courriel)) {
            setError('Courriel invalide');
            return false;
        }
        if (values.motPasse.length < 5) {
            setError('Le mot de passe doit contenir au moins 5 caractères');
            return false;
        }
        if (values.motPasse !== values.motPasseConfirmation) {
            setError('Les mots de passe ne correspondent pas');
            return false;
        }
        return true;
    };

    return (
        <div className="form-body">
            <div className="form-body-enfant">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900">Créer un compte</h1>
                    <p className="mt-2 text-sm text-gray-600">Écrivez vos informations pour commencer</p>
                </div>
            <form onSubmit={handleRegister}
                  className="forms-style">
                {INPUTS.map((input) => (
                    <FormInputs
                        key={input.id}
                        placeholder={input.placeholder}
                        type={input.type}
                        value={values[input.name]}
                        onChange={onChange}
                        name={input.name}
                        label={input.label}
                    />
                ))}
                {error && (
                    <p className="error">
                        {error}
                    </p>
                )}
                <Button type="submit" variant="primary" fullWidth disabled={disableButton}>
                    {disableButton ? "Création en cours..." : "Créer un compte"}
                </Button>

                <Button type="button" variant="outline" fullWidth onClick={() => navigate('/login')}>
                    Déjà un compte? Se connecter
                </Button>
            </form>
                {isLoading && <LoadingModal title={"Création de votre compte..."}/>}
        </div>
    </div>
    );
};

export default RegisterPage;