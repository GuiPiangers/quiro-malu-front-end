'use client'
import { Input } from '@/components/input'
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
    <Input.Root>
      <Input.Label>Senha</Input.Label>
      <Input.Field
        {...props}
        name="password"
        placeholder="Senha251"
        type={isVisible ? 'text' : `password`}
        rightIcon={
          <button
            disabled={props.disabled}
            type="button"
            onClick={handleChangeVisible}
          >
            {buttonIcon()}
          </button>
        }
      />
    </Input.Root>
  )
}
