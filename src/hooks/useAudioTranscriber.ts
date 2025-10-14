import { ProcessSEE } from '@/utils/processSSE'
import { useState, useCallback, useRef } from 'react'

interface TranscriptionChunk {
  type: 'partial' | 'final'
  text: string
}

interface UseAudioTranscriberReturn {
  transcription: string
  isTranscribing: boolean
  error: string | null
  sendAudioForTranscription: (audioBlob: Blob) => Promise<void>
  resetTranscription: () => void
}

export function useAudioTranscriber(): UseAudioTranscriberReturn {
  const [transcription, setTranscription] = useState('')
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const baseURL = process.env.NEXT_PUBLIC_HOST
  const apiUrl = baseURL + '/transcription'
  const finalTranscription = useRef('')

  const sendAudioForTranscription = useCallback(
    async (audioBlob: Blob) => {
      try {
        setIsTranscribing(true)
        setError(null)
        setTranscription('')

        // Converte o Blob em File (com nome e tipo)
        const file = new File([audioBlob], 'recording.wav', {
          type: 'audio/wav',
        })

        // Cria o formData e adiciona o arquivo
        const formData = new FormData()
        formData.append('audio', file)

        // Envia o áudio para o servidor com streaming de resposta

        const eventSource = new ProcessSEE()

        eventSource.onConnect(() => {
          setTranscription('')
          finalTranscription.current = ''
        })

        await eventSource.connect(apiUrl, {
          method: 'POST',
          body: formData,
        })

        eventSource.onMessage<TranscriptionChunk>((data) => {
          if (data.type === 'partial') {
            setTranscription((prev) => prev + data.text)
          } else if (data.type === 'final') {
            console.log(data.text)
            finalTranscription.current += data.text
            setTranscription(finalTranscription.current)
          }
        })
      } catch (err) {
        console.error(err)
        setError('Erro ao processar a transcrição.')
      } finally {
        setIsTranscribing(false)
      }
    },
    [apiUrl],
  )

  const resetTranscription = useCallback(() => {
    setTranscription('')
    setError(null)
  }, [])

  return {
    transcription,
    isTranscribing,
    error,
    sendAudioForTranscription,
    resetTranscription,
  }
}
