import React from "react";

const FormInputs = ({placeholder, type, value, onChange, name}:{
    placeholder: string,
    type: string,
    value: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    name: string
}) => {
    return (
        <input type={type} placeholder={placeholder}
               className="mb-2 p-2 rounded
                        border border-gray-300"
               name={name}
               value={value}
               onChange={onChange}
        />
    );
}

export default FormInputs;
