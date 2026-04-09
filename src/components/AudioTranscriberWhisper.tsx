'use client'

import { useMutation } from '@tanstack/react-query'
import { FaUpload, FaRedoAlt, FaCopy } from 'react-icons/fa'

interface AudioTranscriberProps {
  audioBlob: Blob | null
}

export function AudioTranscriberWhisper({ audioBlob }: AudioTranscriberProps) {
  const baseURL = process.env.NEXT_PUBLIC_HOST
  const apiUrl = baseURL + '/transcription-whisper'

  const { data, isPending, mutate } = useMutation({
    mutationFn: async (blob: Blob) => {
      const formData = new FormData()
      formData.append('audio', blob)

      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to transcribe audio')
      }

      return response.json()
    },
  })

  console.log(data)

  const handleCopy = () => {
    const text = data
    if (text) navigator.clipboard.writeText(text)
  }

  return (
    <div className="flex w-full max-w-md flex-col items-center justify-center gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-md">
      <h2 className="text-lg font-semibold text-gray-800">Transcrever Áudio</h2>

      {/* Botões de ação */}
      <div className="flex gap-3">
        <button
          disabled={!audioBlob || isPending}
          onClick={() => {
            audioBlob && mutate(audioBlob)
          }}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 shadow-md transition-all duration-200 ${
            !audioBlob
              ? 'cursor-not-allowed bg-gray-400'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          <FaUpload />
          Transcrever
        </button>

        <button
          // onClick={resetTranscription}
          disabled={isPending}
          className="flex items-center gap-2 rounded-lg bg-gray-500 px-4 py-2 text-white shadow-md hover:bg-gray-600"
        >
          <FaRedoAlt /> Limpar
        </button>
      </div>

      {/* Status */}
      {isPending && (
        <div className="flex items-center gap-2 text-blue-600">
          <span className="h-3 w-3 animate-pulse rounded-full bg-blue-600" />
          Transcrevendo em tempo real...
        </div>
      )}

      {/* Texto exibido */}
      {data && (
        <div className="relative mt-2 min-h-[120px] w-full overflow-y-auto rounded-lg border border-gray-300 bg-gray-100 p-3">
          <p className="whitespace-pre-wrap text-sm text-gray-800">
            {data.text}
          </p>

          <button
            onClick={handleCopy}
            title="Copiar texto"
            className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
          >
            <FaCopy />
          </button>
        </div>
      )}
    </div>
  )
}
