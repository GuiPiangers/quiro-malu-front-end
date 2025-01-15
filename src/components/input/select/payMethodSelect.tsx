'use client'

import { SelectProps } from '@mui/base'
import { inputVariantProps } from '../InputField'
import { Input } from '../'

export default function PayMethodSelect({
  errorMessage,
  ...props
}: SelectProps<object | string, boolean> &
  inputVariantProps & { errorMessage?: string }) {
  return (
    <Input.Root>
      <Input.Label notSave={props.notSave}>Forma de pagamento</Input.Label>
      <Input.Select {...props}>
        <Input.Option value="money">Dinheiro</Input.Option>
        <Input.Option value="pix">PIX</Input.Option>
        <Input.Option value="credit">Crédito</Input.Option>
        <Input.Option value="debit">Débito</Input.Option>
      </Input.Select>
      {errorMessage && <Input.Message error>{errorMessage}</Input.Message>}
    </Input.Root>
  )
}
