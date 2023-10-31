'use client'
import Input from '@/components/Input'
import { InputHTMLAttributes, useState } from 'react'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'

export default function PasswordInput(
  props: InputHTMLAttributes<HTMLInputElement>,
) {
  const [isVisible, setIsVisible] = useState(false)
  const handleChangeVisible = () => {
    setIsVisible((value) => !value)
  }
  const buttonIcon = () => {
    if (!isVisible) return <AiOutlineEye size={20} />
    return <AiOutlineEyeInvisible size={20} />
  }
  return (
    <Input
      {...props}
      name="password"
      label="Senha"
      placeholder="Senha251"
      type={isVisible ? 'text' : `password`}
      rightIcon={
        <button type="button" onClick={handleChangeVisible}>
          {buttonIcon()}
        </button>
      }
    />
  )
}
