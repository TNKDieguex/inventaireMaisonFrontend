import type {rejoindreFamilleDto} from "../types";
import {type SyntheticEvent, useState} from "react";
import {useNavigate} from "react-router-dom";
import FormInputs from "../../../components/FormInputs.tsx";
import Button from "../../../components/Button.tsx";
import axios from "axios";
import type {AuthResponseDto, ErreurResponseDto} from "../../auth/types";
import axiosClient from "../../../api/axiosClient.ts";


const FamilleInscription = () => {
    const [values, setValues] = useState<rejoindreFamilleDto>(
        {
            familleUuid: ''
        }
    );
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const inputs: {
        id: number,
        name: keyof rejoindreFamilleDto,
        type: string,
        placeholder: string}[] = [
        {
            id: 1,
            name: "familleUuid",
            type: "text",
            placeholder: "Code d'invitation"
        }]
    const rejoindreFamilleHandle = async (e: SyntheticEvent<HTMLFormElement>)=>{
        e.preventDefault();
        if (!isValid()){
            setError('Veuillez completer tous les champs')
            return;
        }
        setError('');
        try{
            const response = await axiosClient.post<AuthResponseDto>('/utilisateurs/rejoindre-famille',values);
            const token = response.data.token;
            localStorage.setItem('token', token);
            setValues({
                familleUuid: ''
            })
            navigate('/famille');
        }catch (erreur: unknown) {
            if (axios.isAxiosError<ErreurResponseDto>(erreur)){
                const messageDuBackend = erreur.response?.data?.message;
                setError(messageDuBackend || 'Échec de la connexion. Veuillez réessayer.')
            }else{
                setError('Une erreur inattendue est survenue. Veuillez réessayer plus tard.')
            }
        }

    }
    const isValid = ()=>{
        return !(values.familleUuid === '');
    }
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValues({...values,[e.target.name]: e.target.value});
    }

    return (
        <div className={"information-div-center px-4"}>
            <div className={"information-div text-center"}>
                <h2 className={"titre"}>Rejoindre une famille</h2>
                <form onSubmit={rejoindreFamilleHandle}
                      className={"forms-style"}
                >
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
                        <p className="error">
                            {error}
                        </p>
                    )}
                    <Button type={"submit"} variant={"primary"} fullWidth
                            children={"Rejoindre"}
                    />
                </form>
            </div>
        </div>
    );
};

export default FamilleInscription;