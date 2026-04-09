'use client'

import { useAudioTranscriber } from '@/hooks/useAudioTranscriber'
import { useEffect } from 'react'
import { FaUpload, FaRedoAlt, FaCopy } from 'react-icons/fa'

interface AudioTranscriberProps {
  audioBlob: Blob | null
}

export function AudioTranscriber({ audioBlob }: AudioTranscriberProps) {
  const {
    isPending: isTranscribing,
    data: transcription,
    mutate: sendAudioForTranscription,
  } = useAudioTranscriber()

  const handleTranscribe = async () => {
    if (audioBlob) {
      sendAudioForTranscription(audioBlob)
    }
  }

  const handleCopy = () => {
    const text = transcription
    if (text) navigator.clipboard.writeText(text)
  }

  return (
    <div className="flex w-full max-w-md flex-col items-center justify-center gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-md">
      <h2 className="text-lg font-semibold text-gray-800">Transcrever Áudio</h2>

      {/* Botões de ação */}
      <div className="flex gap-3">
        <button
          type="button"
          disabled={!audioBlob || isTranscribing}
          onClick={handleTranscribe}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 shadow-md transition-all duration-200 ${
            !audioBlob
              ? 'cursor-not-allowed bg-gray-400'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          <FaUpload />
          Transcrever
        </button>
      </div>

      {/* Status */}
      {isTranscribing && (
        <div className="flex items-center gap-2 text-blue-600">
          <span className="h-3 w-3 animate-pulse rounded-full bg-blue-600" />
          Transcrevendo em tempo real...
        </div>
      )}

      {/* Texto exibido */}
      {transcription && (
        <div className="relative mt-2 min-h-[120px] w-full overflow-y-auto rounded-lg border border-gray-300 bg-gray-100 p-3">
          <p className="whitespace-pre-wrap text-sm text-gray-800">
            {transcription}
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
