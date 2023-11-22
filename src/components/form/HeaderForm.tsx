import { CgClose } from 'react-icons/cg'
import { twMerge } from 'tailwind-merge'

type HeaderFormProps = {
  handleClose(): void
  title?: string
  className?: string
}

export default function HeaderForm({
  handleClose,
  title,
  className,
}: HeaderFormProps) {
  return (
    <div
      className={twMerge(
        'flex items-center justify-between border-b p-4',
        className,
      )}
    >
      <h2 className="text-xl font-semibold text-main">{title}</h2>
      <CgClose
        size={22}
        onClick={handleClose}
        className="cursor-pointer rounded p-0.5 hover:bg-slate-100 "
      />
    </div>
  )
}
