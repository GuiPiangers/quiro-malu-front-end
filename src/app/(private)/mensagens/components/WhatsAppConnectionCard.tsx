'use client'

import { Box } from '@/components/box/Box'
import Button from '@/components/Button'
import useSnackbarContext from '@/hooks/useSnackbarContext'
import { Validate } from '@/services/api/Validate'
import {
  disconnectWhatsApp,
  getWhatsAppStatus,
  registerWhatsApp,
  type WhatsAppConnectionStatus,
} from '@/services/whatsapp/whatsapp'
import { Loader2, MessageCircle } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

const POLL_MS = 3000
const CONNECTING_NO_QR_TIMEOUT_MS = 30_000

type WhatsAppConnectionCardProps = {
  initialStatus: WhatsAppConnectionStatus
}

export default function WhatsAppConnectionCard({
  initialStatus,
}: WhatsAppConnectionCardProps) {
  const { handleMessage } = useSnackbarContext()
  const [status, setStatus] = useState<WhatsAppConnectionStatus>(initialStatus)
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [instanceName, setInstanceName] = useState<string | null>(null)
  const [isRegistering, setIsRegistering] = useState(false)
  const [isDisconnecting, setIsDisconnecting] = useState(false)
  const [connectingTimedOut, setConnectingTimedOut] = useState(false)

  const connectingNoQrSinceRef = useRef<number | null>(null)

  const refreshStatus = useCallback(async () => {
    const res = await getWhatsAppStatus()
    if (Validate.isError(res)) {
      return
    }
    setStatus(res.status)
    if (res.status === 'DISCONNECTED' || res.status === 'NOT_REGISTERED') {
      setQrCode(null)
    }
  }, [])

  const needPoll =
    status === 'CONNECTING' || (!!qrCode && status !== 'CONNECTED')

  useEffect(() => {
    if (status === 'CONNECTED') {
      setQrCode(null)
      setConnectingTimedOut(false)
      connectingNoQrSinceRef.current = null
    }
  }, [status])

  useEffect(() => {
    if (!needPoll) {
      return
    }

    refreshStatus()
    const id = setInterval(() => {
      refreshStatus()
    }, POLL_MS)
    return () => clearInterval(id)
  }, [needPoll, refreshStatus])

  useEffect(() => {
    if (status !== 'CONNECTING') {
      connectingNoQrSinceRef.current = null
      setConnectingTimedOut(false)
      return
    }

    if (qrCode) {
      connectingNoQrSinceRef.current = null
      setConnectingTimedOut(false)
      return
    }

    if (connectingNoQrSinceRef.current === null) {
      connectingNoQrSinceRef.current = Date.now()
    }

    const interval = setInterval(() => {
      const start = connectingNoQrSinceRef.current
      if (start === null) return
      if (Date.now() - start >= CONNECTING_NO_QR_TIMEOUT_MS) {
        setConnectingTimedOut(true)
      }
    }, 500)

    return () => clearInterval(interval)
  }, [qrCode, status])

  const handleRegister = useCallback(async () => {
    setIsRegistering(true)
    setConnectingTimedOut(false)
    connectingNoQrSinceRef.current = null
    try {
      const res = await registerWhatsApp()
      if (Validate.isError(res)) {
        handleMessage({
          title: 'Erro!',
          description: res.message,
          type: 'error',
        })
        return
      }
      setInstanceName(res.instanceName)
      setQrCode(res.qrCode)
      await refreshStatus()
    } finally {
      setIsRegistering(false)
    }
  }, [handleMessage, refreshStatus])

  const handleDisconnect = useCallback(async () => {
    setIsDisconnecting(true)
    try {
      const res = await disconnectWhatsApp()
      if (Validate.isError(res)) {
        handleMessage({
          title: 'Erro!',
          description: res.message,
          type: 'error',
        })
        return
      }
      setInstanceName(null)
      await refreshStatus()
      handleMessage({
        title: 'WhatsApp desconectado',
        description: res.message,
        type: 'success',
      })
    } finally {
      setIsDisconnecting(false)
    }
  }, [handleMessage, refreshStatus])

  const showRegisterAction =
    status === 'NOT_REGISTERED' ||
    status === 'DISCONNECTED' ||
    (status === 'CONNECTING' && connectingTimedOut)

  return (
    <Box>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-50">
            <MessageCircle className="h-6 w-6 text-green-700" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              WhatsApp da clínica
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Conecte o WhatsApp para enviar mensagens automáticas aos pacientes
            </p>
            {status === 'CONNECTED' && instanceName ? (
              <p className="mt-2 text-xs text-slate-400">
                Instância: <span className="font-medium">{instanceName}</span>
              </p>
            ) : null}
          </div>
        </div>

        {status === 'CONNECTED' ? (
          <span className="shrink-0 self-start rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
            Conectado
          </span>
        ) : status === 'CONNECTING' ? (
          <span className="flex shrink-0 items-center gap-1.5 self-start rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-900">
            <Loader2 className="h-3 w-3 animate-spin text-yellow-800" />
            Conectando...
          </span>
        ) : (
          <span className="shrink-0 self-start rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-800">
            Desconectado
          </span>
        )}
      </div>

      <div className="mt-6 border-t border-slate-100 pt-6">
        {status === 'CONNECTED' ? (
          <Button
            type="button"
            color="red"
            variant="outline"
            disabled={isDisconnecting}
            className="w-fit"
            onClick={() => {
              handleDisconnect()
            }}
          >
            {isDisconnecting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Desconectando...
              </>
            ) : (
              'Desconectar'
            )}
          </Button>
        ) : null}

        {showRegisterAction ? (
          <div className="flex flex-col gap-4">
            {connectingTimedOut ? (
              <p className="text-sm text-amber-800">
                A conexão demorou mais que o esperado. Tente iniciar o registro
                novamente.
              </p>
            ) : null}
            <Button
              type="button"
              color="green"
              disabled={isRegistering}
              className="w-fit"
              onClick={handleRegister}
            >
              {isRegistering ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Conectando...
                </>
              ) : (
                'Conectar WhatsApp'
              )}
            </Button>
          </div>
        ) : null}

        {qrCode && status !== 'CONNECTED' ? (
          <div className="mt-6 flex flex-col items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-6">
            <p className="text-center text-sm font-medium text-slate-700">
              Escaneie o QR Code com o WhatsApp
            </p>
            <p className="text-center text-xs text-slate-500">
              Abra o WhatsApp no celular → Menu → Aparelhos conectados →
              Conectar um aparelho
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrCode}
              alt="QR Code para conectar WhatsApp"
              className="max-w-[240px] rounded-lg border border-white bg-white p-2 shadow-sm"
            />
          </div>
        ) : null}
      </div>
    </Box>
  )
}
