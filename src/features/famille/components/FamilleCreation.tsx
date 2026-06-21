import FormInputs from "../../../components/FormInputs.tsx";
import type {CreationFamilleDto} from "../types";
import Button from "../../../components/Button.tsx";
import {type SyntheticEvent, useState} from "react";
import axiosClient from "../../../api/axiosClient.ts";
import type {AuthResponseDto, ErreurResponseDto} from "../../auth/types";
import axios from "axios";
import {useNavigate} from "react-router-dom";


const FamilleCreation = () => {
    const [values, setValues] = useState<CreationFamilleDto>(
        {
            nomFamille: ''
        }
    );
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const inputs: {
        id: number,
        name: keyof CreationFamilleDto,
        type: string,
        placeholder: string}[] = [
        {
            id:1,
            name:"nomFamille",
            type:"text",
            placeholder:"Nom de famille"
        }]

    const creationFamilleHandle = async (e: SyntheticEvent<HTMLFormElement>)=>{
        e.preventDefault();
        if (!isValid()){
            setError('Veuillez completer tous les champs')
            return;
        }
        setError('');
        try{
            const response = await axiosClient.post<AuthResponseDto>('/utilisateurs/familles', values);
            const token = response.data.token;
            localStorage.setItem('token', token);
            setValues({
                nomFamille: ''
            })
            navigate('/famille');
        }catch (erreur: unknown){
            if (axios.isAxiosError<ErreurResponseDto>(erreur)){
                const messageDuBackend = erreur.response?.data?.message;
                setError(messageDuBackend || 'Échec de la connexion. Veuillez réessayer.')
            }else{
                setError('Une erreur inattendue est survenue. Veuillez réessayer plus tard.')
            }
        }
    }
    const isValid = () => {
        return !(values.nomFamille === '');
    }

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValues({...values,[e.target.name]: e.target.value});
    }

    return (
        <div className={"information-div-center px-4"}>
                <div className={"information-div text-center"}>
                    <h2 className={"titre"}>Création de famille</h2>
                    <form onSubmit={creationFamilleHandle}
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
                            children={"Créer"}
                        />
                    </form>
                </div>
        </div>
    );
};

export default FamilleCreation;