import React, {useState} from "react";
import Button from "./Button.tsx";

const FormInputs = ({placeholder, type, value, onChange, name, label}:{
    placeholder: string,
    type: string,
    value: string|number,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    name: string,
    label: string,
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const currentType = type === 'password' && showPassword ? 'text' : type;
    const isNumberType = type === 'number'
    const handleStep = (amount: number) => {
        const valorActual = value === '' ? 0 : Number(value);
        const nuevoValor = Math.max(0, valorActual + amount);

        onChange({
            target: {
                name,
                value: String(nuevoValor)
            }
        } as React.ChangeEvent<HTMLInputElement>);
    };
    const classesInput = `text-slate-700 border rounded-md px-3 py-2 ease shadow-sm outline-none transition-all w-full
        ${isNumberType
        ? 'border-blue-haze-400 bg-blue-haze-50 text-center font-mono font-bold focus:border-blue-haze-600 focus:bg-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
        : 'border-slate-500 bg-blue-haze-200 focus:border-blue-haze-500 focus:bg-blue-haze-200'
    } ${type === 'password' ? 'pr-12' : ''}`;

    return (
        <div className={"w-full flex flex-col relative mb-3"}>
            <label className={"absolute -mt-3 ms-3 bg-blue-haze-200 px-0.5 font-medium text-slate-600 z-10"}>
                {label}
            </label>
            <div className="relative w-full">
            {isNumberType ? (
                <div className="flex pt-3 px-1 items-center w-full border border-blue-haze-400 bg-blue-haze-200 rounded-md shadow-sm focus-within:border-blue-haze-600  transition-all overflow-hidden">
                    <Button type={"button"} variant={"primary"}
                    children={"-"} onClick={()=>{handleStep( - 1)}}
                    />

                    <input
                        type="number"
                        placeholder={placeholder}
                        className="w-full text-center font-mono font-bold py-2 px-1 text-slate-700 bg-transparent border-none outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        name={name}
                        value={value}
                        onChange={onChange}
                    />
                    <Button type={"button"} variant={"primary"}
                            children={"+"} onClick={()=>{handleStep( + 1)}}
                    />
                </div>
            ) : (
                <>
                <input type={currentType} placeholder={placeholder}
                       className={classesInput}
                       name={name}
                       value={value}
                       onChange={onChange}

                />
                {type === 'password' && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="h-full absolute right-3 top-1/2 -translate-y-1/2 font-semibold text-slate-500 hover:text-slate-800 transition-colors focus:outline-none select-none"
                    >
                        {showPassword ?
                            (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                </svg>

                            ):
                            (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                </svg>
                            )}
                    </button>
                )}
                </>)}
            </div>
        </div>
    );
}

export default FormInputs;
