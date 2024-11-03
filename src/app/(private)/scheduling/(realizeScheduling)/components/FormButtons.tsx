import Button from '@/components/Button'
import { PageStage } from './RealizeScheduling'

type FormButtonsProps = {
  setNextPage: (page: PageStage) => void
  nextPage: PageStage
  previousPage: PageStage
}

export function FormButtons({
  setNextPage,
  previousPage,
  nextPage,
}: FormButtonsProps) {
  return (
    <div className="flex w-full justify-between gap-2">
      <Button
        variant="outline"
        color="green"
        onClick={() => setNextPage(previousPage)}
      >
        Voltar
      </Button>
      <Button
        variant="solid"
        color={'green'}
        onClick={() => setNextPage(nextPage)}
      >
        Próximo
      </Button>
    </div>
  )
}
