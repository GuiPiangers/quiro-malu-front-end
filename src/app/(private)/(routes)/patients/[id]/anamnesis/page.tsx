import { Input } from '@/components/formField'
import Form from '../../components/Form'
import { sectionStyles } from '../../components/Styles'
import RadioButton from '@/components/radioButton/RadioButton'

export default function Anamnesis() {
  return (
    <Form>
      <section aria-label="Anamnese do paciente" className={sectionStyles()}>
        <Input.Root>
          <Input.Label>Queixa principal</Input.Label>
          <Input.Field multiline minRows={4} />
        </Input.Root>

        <Input.Root>
          <Input.Label>História e moléstia atual</Input.Label>
          <Input.Field multiline minRows={4} />
        </Input.Root>

        <Input.Root>
          <Input.Label>Histórico e antecedentes</Input.Label>
          <Input.Field multiline minRows={4} />
        </Input.Root>

        <Input.Root>
          <Input.Label>Histórico familiar</Input.Label>
          <Input.Field multiline minRows={4} />
        </Input.Root>

        <Input.Root>
          <Input.Label>Atividades que realiza</Input.Label>
          <Input.Field multiline minRows={4} />
        </Input.Root>
        <RadioButton label="Fumante" />
      </section>
    </Form>
  )
}
