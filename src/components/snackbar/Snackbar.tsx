'use client'

import { useState, useRef, createContext, ReactNode } from 'react'
import { Transition } from 'react-transition-group'
import { Snackbar as SnackbarBase } from '@mui/base/Snackbar'
import { CgClose } from 'react-icons/cg'
import {
  IoAlertCircle,
  IoCheckmarkCircle,
  IoCloseCircle,
  IoWarning,
} from 'react-icons/io5'
import { tv } from 'tailwind-variants'

const positioningStyles = {
  entering: 'translateX(0)',
  entered: 'translateX(0)',
  exiting: 'translateX(500px)',
  exited: 'translateX(500px)',
  unmounted: 'translateX(500px)',
}

const SnackbarStyles = tv({
  slots: {
    SnackbarRoot:
      'min-w-xs fixed bottom-4 left-auto right-4 z-50 flex max-w-xl',
    SnackbarWrapper:
      'flex items-center gap-4 overflow-hidden	rounded-lg border border-solid	border-slate-200 bg-white p-3 text-start text-slate-900 shadow-md',
    SnackbarTitle: 'mr-2 font-medium',
    SnackbarDescription: 'font-normal text-slate-800 ',
    SnackbarIcon: '',
    SnackbarClose: 'cursor-pointer rounded p-0.5 hover:bg-slate-50 ',
  },
  variants: {
    type: {
      success: {
        SnackbarWrapper: 'border-green-600 bg-green-100 text-green-600',
        SnackbarClose: 'hover:bg-green-200',
      },
      error: {
        SnackbarWrapper: 'border-red-600 bg-red-100 text-red-600',
        SnackbarClose: 'hover:bg-red-200',
      },
      warning: {
        SnackbarWrapper: 'border-orange-600 bg-orange-100 text-orange-600',
        SnackbarClose: 'hover:bg-orange-200',
      },
      info: {
        SnackbarWrapper: 'border-blue-600 bg-blue-100 text-blue-600',
        SnackbarClose: 'hover:bg-blue-200',
      },
      none: {
        SnackbarWrapper: '',
      },
    },
  },
})

type SnackbarProps = {
  type?: 'none' | 'success' | 'error' | 'warning' | 'info'
  description?: string
  title?: string
}

type SnackbarContextType = {
  handleMessage(values: SnackbarProps): void
}

export const SnackbarContext = createContext({} as SnackbarContextType)

export default function Snackbar({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [type, setType] = useState<SnackbarProps['type']>('none')
  const [exited, setExited] = useState(true)
  const nodeRef = useRef(null)

  const {
    SnackbarClose,
    SnackbarDescription,
    SnackbarIcon,
    SnackbarRoot,
    SnackbarTitle,
    SnackbarWrapper,
  } = SnackbarStyles({ type })

  const handleClose = () => {
    setOpen(false)
  }

  const handleMessage = ({
    type = 'none',
    description = '',
    title = '',
  }: SnackbarProps) => {
    setOpen(true)
    setTitle(title)
    setDescription(description)
    setType(type)
  }

  const handleOnEnter = () => {
    setExited(false)
  }

  const handleOnExited = () => {
    setExited(true)
  }

  const icon = () => {
    switch (type) {
      case 'success':
        return <IoCheckmarkCircle size={20} className={SnackbarIcon()} />
      case 'info':
        return <IoAlertCircle size={20} className={SnackbarIcon()} />
      case 'error':
        return <IoCloseCircle size={20} className={SnackbarIcon()} />
      case 'warning':
        return <IoWarning size={20} className={SnackbarIcon()} />

      default:
        break
    }
  }

  return (
    <SnackbarContext.Provider value={{ handleMessage }}>
      <>
        {children}

        <SnackbarBase
          autoHideDuration={3000}
          open={open}
          onClose={handleClose}
          exited={exited}
          className={SnackbarRoot()}
        >
          <Transition
            timeout={{ enter: 400, exit: 400 }}
            in={open}
            appear
            unmountOnExit
            onEnter={handleOnEnter}
            onExited={handleOnExited}
            nodeRef={nodeRef}
          >
            {(status) => (
              <div
                className={SnackbarWrapper()}
                style={{
                  transform: positioningStyles[status],
                  transition: 'transform 300ms ease',
                }}
                ref={nodeRef}
              >
                {icon()}
                <div className="max-w-full">
                  {title && <p className={SnackbarTitle()}>{title}</p>}
                  {description && (
                    <p className={SnackbarDescription()}>{description}</p>
                  )}
                </div>
                <CgClose
                  size={18}
                  onClick={handleClose}
                  className={SnackbarClose()}
                />
              </div>
            )}
          </Transition>
        </SnackbarBase>
      </>
    </SnackbarContext.Provider>
  )
}
