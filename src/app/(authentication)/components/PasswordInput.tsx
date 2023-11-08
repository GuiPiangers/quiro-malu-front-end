'use client'
import { Input } from '@/components/formField'
import { InputHTMLAttributes, useState, forwardRef } from 'react'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import { InputProps } from '@mui/base'

const PasswordInput = (
  {
    children,
    ...props
  }: { error?: boolean } & InputHTMLAttributes<HTMLInputElement & InputProps>,
  ref: any,
) => {
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
        placeholder="Senha251"
        type={isVisible ? 'text' : `password`}
        ref={ref}
        autoComplete="off"
        endAdornment={
          <button
            className="mr-3"
            disabled={props.disabled}
            type="button"
            onClick={handleChangeVisible}
          >
            {buttonIcon()}
          </button>
        }
      />
      {children}
    </Input.Root>
  )
}

export default forwardRef(PasswordInput)
