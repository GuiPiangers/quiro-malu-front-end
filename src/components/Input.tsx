"use client"
import { InputHTMLAttributes, ReactNode, useId, useState } from "react"

type InputProps = {
    name?: string
    leftIcon?: ReactNode
    rightIcon?: ReactNode
    message?: {
        type: 'valid' | 'invalid'
        text: string
    }
} & InputHTMLAttributes<HTMLInputElement>

export default function Input({
    name, 
    leftIcon, 
    rightIcon,
    message,
    ...props
}: InputProps){
    const [isFocus, setIsFocus] = useState(false)
    const id = useId()
    const validateColor = {
        valid: 'green-600',
        invalid: 'red-600'
    }

    const ValidationMessage = ()=>{
        if(message?.text){
            return(
            <span className={`text-sm ${message?.type && 'text-'+validateColor[message.type]}`}>
                {message?.text}
            </span>
            )
        }
    }

    const handleFocusTrue = ()=>{
        setIsFocus(true)
    }
    const handleFocusFalse = ()=>{
        setIsFocus(false)
    }

    return(
        <div className="flex flex-col gap-1">
            <label htmlFor={id} className="font-medium text-sm">
                {name}
            </label>
            <div className={`px-2 py-1 rounded border flex gap-1 bg-white 
                ${isFocus && 'outline outline-2'} ${message?.type && 'outline outline-2 outline-'+validateColor[message.type]}`
            }>
                {leftIcon ? leftIcon : null}
                <input 
                    {...props} 
                    id={id} 
                    className="focus:outline-none w-full bg-transparent select-none text-sm"
                    onFocus={handleFocusTrue}
                    onBlur={handleFocusFalse}     
                />
                {rightIcon ? rightIcon : null}
            </div> 
            {ValidationMessage()}
        </div>
    )
}