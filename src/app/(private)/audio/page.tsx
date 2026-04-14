'use client'

import { AudioRecorder } from '@/components/AudioRecorder'
import { AudioTranscriber } from '@/components/AudioTranscriber'
import { AudioTranscriberWhisper } from '@/components/AudioTranscriberWhisper'
import { useAudioTranscriber } from '@/hooks/useAudioTranscriber'
import { useState } from 'react'

export default function AudioPage() {
  const [audioBlob] = useState<Blob | null>(null)
  const { data: transcription, mutate: sendAudioForTranscription } =
    useAudioTranscriber()

  return (
    <div className="min-h-screen flex-col items-center justify-center gap-6 bg-gray-100 p-4">
      <AudioRecorder
        onRecordComplete={(blob) => sendAudioForTranscription(blob)}
      />
      <AudioTranscriber audioBlob={audioBlob} />
      {transcription?.text}
      <AudioTranscriberWhisper audioBlob={audioBlob} />
    </div>
  )
}
