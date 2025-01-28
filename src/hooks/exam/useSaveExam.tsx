import { saveExam } from '@/services/exam/exam'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useSaveExam() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async ({
      formData,
      patientId,
    }: {
      patientId: string
      formData: FormData
    }) => saveExam(patientId, formData),
    mutationKey: ['saveExam'],
    onSettled: async (data, error, { patientId }) => {
      return await queryClient.invalidateQueries({
        queryKey: ['exams', { patientId }],
      })
    },
  })

  return mutation
}
