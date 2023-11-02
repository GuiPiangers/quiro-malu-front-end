import PreviousButton from '../PreviousButton'

export default function SubHeader() {
  return (
    <nav className="flex w-full gap-6 border-b border-zinc-300 px-8 py-2">
      <PreviousButton />
      <h1 className="text-2xl font-bold text-main">Pacientes</h1>
    </nav>
  )
}
