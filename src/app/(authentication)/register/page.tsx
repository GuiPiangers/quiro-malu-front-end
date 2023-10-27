'use client'

import Input from "@/components/Input";
import AuthForm from "../components/AuthForm";
import Link from "next/link";
import PasswordInput from "../components/PasswordInput";
import Button from "@/components/Button";
import { UserDTO } from "@quiromalu/core/src/models/entities/User";
import { ChangeEvent, useState } from "react";
import { Name } from "@quiromalu/core";


async function createUser(data: UserDTO){
    try{

        const res = await fetch('http://localhost:8000/register', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {'Content-Type': 'application/json'}
        })
        console.log(await res.json())
        return res
    }
    catch(err){
        console.log(err)
    }
}

export default function Register(){
    const [fields, setFields] = useState({
        name: '',
        phone: '',
        email: '',
        password: ''
    })


    const [nameMessage, setNameMessage] = useState(undefined)
    const [emailMessage, setEmailMessage] = useState(undefined)
    const [passwordMessage, setPasswordMessage] = useState(undefined)

    const invalidateField = (fn: Function, message: string)=>{
        fn(() => ({type: 'invalid', text: message}))
    }

    const handleChangeValue = (
        e: ChangeEvent<HTMLInputElement>, 
        field: 'name' | 'phone' | 'email' | 'password')=>
    {
        const value = e.target.value
        setFields(data => ({...data, [field]: value,}))
    }
    
    return(
            <AuthForm title="Registrar">
                <div className="flex flex-col gap-4">
                    <Input 
                        name="Nome" 
                        placeholder="Seu nome" 
                        type="text"
                        value={fields.name}
                        onChange={e => handleChangeValue(e, 'name')}
                        message={nameMessage}
                    />
                    <Input 
                        name="Celular" 
                        placeholder="(51) 99999 9999" 
                        type="tel"
                        value={fields.phone}
                        onChange={e => handleChangeValue(e, 'phone')}
                    />
                    <Input 
                        name="Email" 
                        placeholder="exemplo@gmail.com" 
                        type="email"
                        value={fields.email}
                        onChange={e => handleChangeValue(e, 'email')}
                    />
                    <PasswordInput 
                        value={fields.password}
                        onChange={e => handleChangeValue(e, 'password')}
                    />

                    <Button 
                        variant="edit"
                        onClick={()=>{createUser(fields)}}
                    >
                        Cadastrar
                    </Button>

                    <p className="text-sm text-center">
                        Já possui uma conta? <Link className="text-blue-600 underline" href={'/login'}>Entrar</Link>
                    </p>
                </div>
            </AuthForm>
    )
}