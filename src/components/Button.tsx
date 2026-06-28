import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>{
    variant?: 'primary' | 'secondary' | 'confirm' | 'danger' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    className = '',
    ...props
    }) => {
    const baseStyles = "button-basic-style";
    const variants = {
        primary: "button-primary",
        secondary: "button-secondary",
        confirm: "button-confirm",
        danger: "button-danger",
        outline: "button-outline"
    };
    const sizes = {
        sm: "px-2.5 py-1.5 text-xs",
        md: "px-4 py-2 text-sm",
        lg: "px-5 py-2.5 text-base"
    };
    const combinedClasses = `
        ${baseStyles} 
        ${variants[variant]} 
        ${sizes[size]} 
        ${fullWidth ? 'w-full' : ''} 
        ${className}
    `.trim().replace(/\s+/g, ' ');
    return (
        <button className={combinedClasses} {...props}>
            {children}
        </button>
    );
};

export default Button;