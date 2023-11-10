import { Input } from '@/components/formField'
import Form from '../../components/Form'
import { sectionStyles } from '../../components/Styles'

export default function Diagnostic() {
  return (
    <Form>
      <section aria-label="Diagnóstico do paciente" className={sectionStyles()}>
        <Input.Root>
          <Input.Label>Diagnóstico</Input.Label>
          <Input.Field multiline minRows={4} />
        </Input.Root>

        <Input.Root>
          <Input.Label>Plano de tratamento</Input.Label>
          <Input.Field multiline minRows={4} />
        </Input.Root>
      </section>
    </Form>
  )
}
