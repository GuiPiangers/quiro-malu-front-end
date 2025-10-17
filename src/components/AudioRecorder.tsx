'use client'

import { useAudioRecorder } from '@/hooks/useAudioRecorder'
import { useEffect } from 'react'
import { FaMicrophone, FaStop } from 'react-icons/fa'

interface AudioRecorderProps {
  onRecordComplete: (blob: Blob) => void
  disabled?: boolean
}

export function AudioRecorder({
  onRecordComplete,
  disabled,
}: AudioRecorderProps) {
  const { isRecording, audioBlob, startRecording, stopRecording } =
    useAudioRecorder()

  useEffect(() => {
    if (audioBlob) {
      onRecordComplete(audioBlob)
    }
  }, [audioBlob])

  return (
    <>
      {isRecording && (
        <div className="mt-2 flex items-center gap-2 text-red-600">
          <span className="h-3 w-3 animate-pulse rounded-full bg-red-600" />
          Gravando...
        </div>
      )}
      <button
        disabled={disabled}
        type="button"
        onClick={isRecording ? stopRecording : startRecording}
        className={`flex h-9 w-9 items-center justify-center rounded-full shadow-lg transition-all duration-200 disabled:bg-slate-600 ${
          isRecording
            ? 'bg-red-600 hover:bg-red-700'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isRecording ? (
          <FaStop className="text-white" />
        ) : (
          <FaMicrophone className="text-white" />
        )}
      </button>
    </>
  )
}
