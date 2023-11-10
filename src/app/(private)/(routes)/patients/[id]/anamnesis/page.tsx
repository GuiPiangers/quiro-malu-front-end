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

        <div className="grid w-fit grid-cols-[auto_auto_auto] gap-x-4 gap-y-1">
          <p className="col-span-full text-sm font-medium">Fumante?</p>
          <RadioButton label="Sim" name="smoke" />
          <RadioButton label="Não" name="smoke" />
          <RadioButton label="Passivo" name="smoke" />
        </div>

        <div className="grid w-fit grid-cols-[auto_auto_auto] gap-x-4 gap-y-1">
          <p className="col-span-full text-sm font-medium">Usa medicamentos?</p>
          <RadioButton label="Sim" name="use-medicine" />
          <RadioButton label="Não" name="use-medicine" />
        </div>

        <Input.Root>
          <Input.Label>Se sim quais?</Input.Label>
          <Input.Field multiline minRows={4} />
        </Input.Root>

        <div className="grid w-fit grid-cols-[auto_auto_auto] gap-x-4 gap-y-1">
          <p className="col-span-full text-sm font-medium">
            Passou por alguma cirurgia?
          </p>
          <RadioButton label="Sim" name="surgery" />
          <RadioButton label="Não" name="surgery" />
        </div>

        <Input.Root>
          <Input.Label>Se sim quais?</Input.Label>
          <Input.Field multiline minRows={4} />
        </Input.Root>
      </section>
    </Form>
  )
}
