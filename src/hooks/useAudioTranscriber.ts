import { useMutation, UseMutationOptions } from '@tanstack/react-query'

export function useAudioTranscriber(
  porps?: UseMutationOptions<any, Error, Blob, unknown>,
) {
  const baseURL = process.env.NEXT_PUBLIC_HOST
  const apiUrl = baseURL + '/transcription'

  const mutation = useMutation({
    ...porps,
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
