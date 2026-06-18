import FormInputs from "./FormInputs.tsx";
import {type SyntheticEvent, useState} from "react";
import axiosClient from "../../../api/axiosClient.ts";
import {useNavigate} from "react-router-dom";
import type {AuthResponseDto, ErreurResponseDto, LoginRequestDto} from "../types";
import axios from "axios";
import Button from "../../../components/Button.tsx";

const LoginPage = () => {
    const [values, setValues] = useState<LoginRequestDto>(
        {
            courriel: '',
            motPasse: ''
        }
    );
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const inputs: {
        id: number,
        name: keyof LoginRequestDto,
        type: string,
        placeholder: string}[] = [
        {
            id:1,
            name:"courriel",
            type:"email",
            placeholder:"Courriel"
        },
        {
            id:2,
            name:"motPasse",
            type:"password",
            placeholder:"Mot de passe"
        }
    ]


    const handleLogin = async (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!isValid()) {
            setError('Veuillez completer tous les champs')
            return;
        }
        setError('');
        try {
            const response = await axiosClient.post<AuthResponseDto>('/utilisateurs/connexion', values);
            const token = response.data.token;
            localStorage.setItem('token', token);
            setValues({
                courriel: '',
                motPasse: ''
            })
            navigate('/dashboard');
        } catch (erreur: unknown) {
            if (axios.isAxiosError<ErreurResponseDto>(erreur)){
                const messageDuBackend = erreur.response?.data?.message;
                setError(messageDuBackend || 'Échec de la connexion. Veuillez réessayer.')
            }else{
                setError('Une erreur inattendue est survenue. Veuillez réessayer plus tard.')
            }
        }
    }
    const isValid = () =>{
        return !(values.courriel === '' || values.motPasse === '');
    }
    
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValues({...values,[e.target.name]: e.target.value});
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-6 bg-white p-8 rounded-xl shadow-md border border-gray-100 text-center">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900">Nom de l'application</h1>
                    <p className="mt-2 text-sm text-gray-600">Bienvenue!!</p>
                </div>
            <form onSubmit={handleLogin}
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
                    <Button type={"submit"} variant={"primary"} fullWidth
                        children={"Se connecter"}
                    />
                    <Button type={"button"} variant={"outline"} fullWidth
                            onClick={
                                () => {
                                    navigate('/register');
                                }
                            }
                            children={"Créer un compte"}
                    />
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
