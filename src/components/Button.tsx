import { ButtonHTMLAttributes } from "react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>{
    variant?: 'primary' | 'secondary' | 'create' | 'edit'
} 

export default function Button({children, variant = 'primary', ...props}: ButtonProps){
    const variantConfig = {
        primary: 'bg-main text-white',
        secondary: 'bg-transparent text-main border border-main',
        create: 'bg-green-600 text-white',
        edit: 'bg-blue-600 text-white'
    }

    return(
        <button 
            className={`py-1 px-2 flex items-center justify-center rounded ${variantConfig[variant]}`} 
            {...props}
        >
            {children}
        </button>
    )
}