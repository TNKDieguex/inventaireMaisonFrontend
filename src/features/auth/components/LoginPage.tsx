import FormInputs from "./FormInputs.tsx";
import {type SyntheticEvent, useState} from "react";
import axiosClient from "../../../api/axiosClient.ts";
import {useNavigate} from "react-router-dom";
import type {AuthResponseDto, LoginRequestDto} from "../types";

const LoginPage = () => {
    const [values, setValues] = useState<LoginRequestDto>(
        {
            courriel: '',
            motPasse: ''
        }
    )
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const inputs: {id: number, name: keyof LoginRequestDto, type: string, placeholder: string}[] = [
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
        } catch (error: any) {
            if (error.response && error.response.status === 404)
                setError('Courriel ou mot de passe incorrect');
            else
                setError('Échec de la connexion. Veuillez réessayer plus tard.');
            console.error(error);
        }
    }
    const isValid = () =>{
        return !(values.courriel === '' || values.motPasse === '');
    }
    
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValues({...values,[e.target.name]: e.target.value});
    }

    return (
        <div className="grid grid-cols-1 items-center text-center
            border-black border
            p-6 rounded
            m-6
        ">
                <h1>Login</h1>
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
                    {error && <p className="text-red-500">{error}</p>}
                    <button type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded
                        hover:bg-blue-600
                        "
                    >Login</button>
                </form>
        </div>
    )
}

export default LoginPage;