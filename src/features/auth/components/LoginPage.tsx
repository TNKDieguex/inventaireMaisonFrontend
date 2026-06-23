import FormInputs from "../../../components/FormInputs.tsx";
import {type SyntheticEvent, useState} from "react";
import axiosClient from "../../../api/axiosClient.ts";
import {useNavigate} from "react-router-dom";
import type {AuthResponseDto, ErreurResponseDto, LoginRequestDto} from "../types";
import axios from "axios";
import Button from "../../../components/Button.tsx";
import {getFamilleIdFromToken} from "../../../utils/jwtUtils.ts";
import LoadingModal from "../../../components/LoadingModal.tsx";

const LoginPage = () => {
    const [values, setValues] = useState<LoginRequestDto>(
        {
            courriel: '',
            motPasse: ''
        }
    );
    const [error, setError] = useState('');
    const [disableButton, setDisableButton] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const inputs: {
        id: number,
        name: keyof LoginRequestDto,
        type: string,
        placeholder: string,
        label: string
    }[] = [
        {
            id:1,
            name:"courriel",
            type:"email",
            placeholder:"vous@exemple.com",
            label: "Courriel"
        },
        {
            id:2,
            name:"motPasse",
            type:"password",
            placeholder:"•••••",
            label: "Mot de passe"
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
            setDisableButton(true);
            setIsLoading(true);
            const response = await axiosClient.post<AuthResponseDto>('/utilisateurs/connexion', values);
            const token = response.data.token;
            localStorage.setItem('token', token);
            setValues({
                courriel: '',
                motPasse: ''
            })
            const familleUuid = getFamilleIdFromToken(token);

            if (familleUuid) {
                navigate('/dashboard');
            } else {
                navigate('/famille');
            }
        } catch (erreur: unknown) {
            setDisableButton(false);
            if (axios.isAxiosError<ErreurResponseDto>(erreur)){
                const messageDuBackend = erreur.response?.data?.message;
                setError(messageDuBackend || 'Échec de la connexion. Veuillez réessayer.')
            }else{
                setError('Une erreur inattendue est survenue. Veuillez réessayer plus tard.')
            }
        }finally {
            setIsLoading(false);
        }
    }
    const isValid = () =>{
        return !(values.courriel === '' || values.motPasse === '');
    }
    
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValues({...values,[e.target.name]: e.target.value});
    }

    return (
        <div className="form-body">
            <div className="form-body-enfant">
                <div>
                    <h1 className="text-3xl font-extrabold text-blue-haze-title">Inventaire Maison</h1>
                    <p className="mt-2 text-sm text-blue-haze-600">Bienvenue!</p>
                </div>
            <form onSubmit={handleLogin}
                className="forms-style">
                {inputs.map((input) => (
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
                    <Button type={"submit"} variant={"primary"} fullWidth disabled={disableButton}
                        children={disableButton ? "Connexion en cours... Veuillez patienter..." : "Se connecter"}
                    />
                    <Button type={"button"} variant={"outline"} fullWidth
                            disabled={disableButton}
                            onClick={
                                () => {
                                    navigate('/register');
                                }
                            }
                            children={"Créer un compte"}
                    />
                </form>
                {isLoading && <LoadingModal title={"Connexion en cours..."}/>}
            </div>
        </div>
    );
};

export default LoginPage;
