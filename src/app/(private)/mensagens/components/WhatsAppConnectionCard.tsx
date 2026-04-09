'use client'

import Button from '@/components/Button'
import useSnackbarContext from '@/hooks/useSnackbarContext'
import { Validate } from '@/services/api/Validate'
import {
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

  const showRegisterAction =
    status === 'NOT_REGISTERED' ||
    status === 'DISCONNECTED' ||
    (status === 'CONNECTING' && connectingTimedOut)

  const showConnecting =
    status === 'CONNECTING' && !connectingTimedOut && !showRegisterAction

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
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
              Conecte o WhatsApp para enviar mensagens automáticas aos
              pacientes. Um registro por clínica.
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
        ) : null}
      </div>

      <div className="mt-6 border-t border-slate-100 pt-6">
        {status === 'CONNECTED' ? (
          <p className="text-sm text-slate-600">
            A conexão com o WhatsApp está ativa. Os templates de mensagem
            poderão ser enviados quando configurados.
          </p>
        ) : null}

        {showConnecting ? (
          <div className="flex flex-col items-start gap-3">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <Loader2 className="h-4 w-4 animate-spin text-main" />
              Conectando...
            </div>
            <p className="text-sm text-slate-500">
              Aguarde enquanto preparamos a conexão. O status será atualizado
              automaticamente.
            </p>
          </div>
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
    </div>
  )
}
