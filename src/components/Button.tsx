import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>{
    variant?: 'primary' | 'secondary' | 'confirm' | 'danger' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
}
const BASE_STYLES = "button-basic-style";

const VARIANTS = {
    primary: "button-primary",
    secondary: "button-secondary",
    confirm: "button-confirm",
    danger: "button-danger",
    outline: "button-outline"
};
const SIZES = {
    sm: "px-2.5 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-base"
};

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    type= 'button',
    size = 'md',
    fullWidth = false,
    className = '',
    ...props
    }) => {
    const combinedClasses = `
        ${BASE_STYLES} 
        ${VARIANTS[variant]} 
        ${SIZES[size]} 
        ${fullWidth ? 'w-full' : ''} 
        ${className}
    `.trim().replace(/\s+/g, ' ');
    return (
        <button type={type} className={combinedClasses} {...props}>
            {children}
        </button>
    );
};

export default Button;