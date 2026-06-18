import {type SyntheticEvent, useState} from "react";
import type {CreationUtilisateur, ErreurResponseDto, UtilisateurData, UtilisateurDto} from "../types";
import {useNavigate} from "react-router-dom";
import Button from "../../../components/Button.tsx";
import FormInputs from "./FormInputs.tsx";
import axiosClient from "../../../api/axiosClient.ts";
import axios from "axios";

const RegisterPage = () => {
    const [values, setValues] = useState<CreationUtilisateur>({
        nom: '',
        courriel: '',
        motPasse: '',
        motPasseConfirmation: ''
    });

    const [error, setError] = useState('');
    const [disableButton, setDisableButton] = useState(false);
    const navigate = useNavigate();

    const inputs: { id: number; name: keyof CreationUtilisateur; type: string; placeholder: string;}[] = [
        { id: 1, name: "nom", type: "text", placeholder: "Nom"},
        { id: 2, name: "courriel", type: "email", placeholder: "Courriel"},
        { id: 3, name: "motPasse", type: "password", placeholder: "Mot de passe"},
        { id: 4, name: "motPasseConfirmation", type: "password", placeholder: "Confirmation de mot de passe"}
    ];

    const handleRegister = async (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!isValid()) return;
        setError('');

        try {
            setDisableButton(true);
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
        }
    };

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-6 bg-white p-8 rounded-xl shadow-md border border-gray-100 text-center">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900">Créer un compte</h1>
                    <p className="mt-2 text-sm text-gray-600">Écrivez vos informations pour commencer</p>
                </div>
            <form onSubmit={handleRegister}
                  className="grid gap-2 w-full max-w-sm mx-auto">
                {inputs.map((input) => (
                    <FormInputs
                        key={input.id}
                        placeholder={input.placeholder}
                        type={input.type}
                        value={values[input.name]}
                        onChange={onChange}
                        name={input.name}
                    />
                ))}
                {error && (
                    <p className="text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200">
                        {error}
                    </p>
                )}
                <Button type="submit" variant="primary" fullWidth disabled={disableButton}
                        children={disableButton ? "Création en cours..." : "Créer un compte"}/>

                <Button type="button" variant="outline" fullWidth onClick={() => navigate('/login')}
                    children={"Déjà un compte? Se connecter"}/>
            </form>
        </div>
    </div>
    );
};

export default RegisterPage;