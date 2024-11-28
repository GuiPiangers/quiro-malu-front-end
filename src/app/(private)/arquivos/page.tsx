import { Box } from '@/components/box/Box'
import Button from '@/components/Button'
import { PiPaperclipLight } from 'react-icons/pi'

export default function Page() {
  return (
    <section className="w-full max-w-screen-md">
      <Box>
        
        <Button asChild variant="outline">
          <label htmlFor="select-file" className="cursor-pointer">
            Selecione um arquivo CSV
            <PiPaperclipLight size={24} />
          </label>
        </Button>
        <input
          type="file"
          accept=".csv"
          id="select-file"
          className="h-0 w-0 opacity-0"
        />
      </Box>
    </section>
  )
}
