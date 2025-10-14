import { ProcessSEE } from '@/utils/processSSE'
import { useMutation } from '@tanstack/react-query'
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

export function useAudioTranscriber() {
  const baseURL = process.env.NEXT_PUBLIC_HOST
  const apiUrl = baseURL + '/transcription'

  const mutation = useMutation({
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

  return mutation
}
