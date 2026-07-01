import React, {useState} from "react";
import Button from "./Button.tsx";

const FormInputs = ({placeholder, type, value, onChange, name, label, maxLength, options}:{
    placeholder: string,
    type: string,
    value: string|number|undefined,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void,
    name: string,
    label: string,
    maxLength?: number,
    options?: string[]
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const currentType = type === 'password' && showPassword ? 'text' : type;
    const isNumberType = type === 'number'
    const isSelectType = type === 'select';
    const currentLength = String(value ?? '').length;
    const handleStep = (amount: number) => {
        const valeurActuelle = value === '' ? 0 : Number(value);
        const nouveauValeur = Math.max(0, valeurActuelle + amount);

        onChange({
            target: {
                name,
                value: String(nouveauValeur)
            }
        } as React.ChangeEvent<HTMLInputElement>);
    };
    const classesInput = `text-slate-700 border rounded-md px-3 py-2 ease shadow-sm outline-none transition-all w-full
        ${isNumberType
        ? 'border-blue-haze-400 bg-blue-haze-50 text-center font-mono font-bold focus:border-blue-haze-600 focus:bg-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
        : 'border-blue-haze-600 bg-blue-haze-200 focus:border-blue-haze-500 focus:bg-blue-haze-200'
    } ${type === 'password' ? 'pr-12' : ''} ${maxLength ? 'pb-5' : ''}`;

    return (
        <div className={"w-full flex flex-col relative mb-3"}>
            <label className={"absolute -mt-3 ms-3 bg-blue-haze-200 px-0.5 font-medium text-slate-600 z-10"}>
                {label}
            </label>
            <div className="relative w-full">
            {isNumberType ? (
                <div className="flex pt-3 px-1 items-center w-full border border-blue-haze-600 bg-blue-haze-200 rounded-md shadow-sm
                focus-within:border-blue-haze-500  transition-all overflow-hidden">
                    <Button type={"button"} variant={"primary"} onClick={()=>{handleStep( - 1)}}>
                        -
                    </Button>

                    <input
                        type="number"
                        placeholder={placeholder}
                        aria-label={name}
                        className="w-full text-center font-mono font-bold py-2 px-1 text-slate-700 bg-transparent border-none
                        outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        name={name}
                        value={value ?? ''}
                        onChange={onChange}
                    />
                    <Button type={"button"} variant={"primary"} onClick={()=>{handleStep( + 1)}}>
                            +
                    </Button>
                </div>
            ) : isSelectType ? (
                <div className="relative w-full text-left">
                    <button
                        type="button"
                        onClick={() => setIsOpen(!isOpen)}
                        className={`${classesInput} flex items-center justify-between cursor-pointer capitalize text-left`}
                    >
                        <span>{(value ? String(value) : placeholder || 'Sélectionner...').toLowerCase().replace(/_/g, ' ')}</span>
                        <svg className={`size-4 text-blue-haze-600 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                            <use href={"/sprite.svg#arrowDown"}/>
                        </svg>
                    </button>

                    {isOpen && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />

                            <ul className="absolute left-0 mt-1 w-full bg-blue-haze-50 border border-blue-haze-300 rounded-xl shadow-xl max-h-48
                            overflow-y-auto z-20 p-1.5 animate-in fade-in duration-100
                             scrollbar-thin scrollbar-thumb-blue-haze-400">
                                {options?.map((option) => (
                                    <li
                                        key={option}
                                        onClick={() => {
                                            onChange({ target: { name, value: option } } as React.ChangeEvent<HTMLInputElement>);
                                            setIsOpen(false);
                                        }}
                                        className={`px-3 py-2 text-sm rounded-lg cursor-pointer capitalize transition-colors select-none
                                ${value === option
                                            ? 'bg-blue-haze-600 text-white font-bold'
                                            : 'text-slate-700 hover:bg-blue-haze-200 hover:text-blue-haze-title'
                                        }`}
                                    >
                                        {option.toLowerCase().replace(/_/g, ' ')}
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </div>
            ): (
                <>
                <input type={currentType} placeholder={placeholder}
                       className={classesInput}
                       name={name}
                       value={value ?? ''}
                       onChange={onChange}
                       maxLength={maxLength}
                />
                {maxLength && (
                    <span className={`absolute right-2.5 bottom-1 text-xs font-mono tracking-tight select-none pointer-events-none transition-colors ${
                        currentLength >= maxLength ? 'text-red-600 font-bold' : 'text-slate-500'
                    }`}>
                            {currentLength} / {maxLength}
                        </span>
                )}
                {type === 'password' && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="h-full absolute right-3 top-1/2 -translate-y-1/2 font-semibold text-slate-500
                        hover:text-slate-800 transition-colors focus:outline-none select-none"
                    >
                        {showPassword ?
                            (<svg className={"size-6" }><use href={"/sprite.svg#eyeClose"}/></svg>
                            ) : (
                                <svg className={"size-6" }><use href={"/sprite.svg#eyeOpen"}/></svg>
                            )}
                    </button>
                )}
                </>)}
            </div>
        </div>
    );
}

export default FormInputs;
