'use client'
import React, { useEffect, useRef, useState } from 'react'
import WaveSurfer from 'wavesurfer.js'
import { Play, Pause } from 'lucide-react'

interface CustomAudioPlayerProps {
  src: string
}

export default function CustomAudioPlayer({ src }: CustomAudioPlayerProps) {
  const waveformRef = useRef<HTMLDivElement | null>(null)
  const wavesurfer = useRef<WaveSurfer | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)

  useEffect(() => {
    if (!waveformRef.current) return

    wavesurfer.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: '#808080',
      progressColor: '#3b82f6', // Azul Tailwind
      height: 50,
      cursorWidth: 0,
      barWidth: 2,
      barGap: 1.5,
    })

    wavesurfer.current.load(src)

    wavesurfer.current.on('finish', () => setIsPlaying(false))

    return () => wavesurfer.current?.destroy()
  }, [src])

  const togglePlay = () => {
    wavesurfer.current?.playPause()
    setIsPlaying(!isPlaying)
  }

  const toggleSpeed = () => {
    const newRate =
      playbackRate >= 2 ? 1 : parseFloat((playbackRate + 0.25).toFixed(2))
    wavesurfer.current?.setPlaybackRate(newRate)
    setPlaybackRate(newRate)
  }

  return (
    <div className="flex w-full items-center gap-3 rounded-xl bg-[#121212] p-3 shadow-lg">
      {/* Botão Play/Pause */}
      <button
        onClick={togglePlay}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 transition hover:bg-gray-700"
      >
        {isPlaying ? (
          <Pause size={20} color="#fff" />
        ) : (
          <Play size={20} color="#fff" />
        )}
      </button>

      {/* Forma de onda */}
      <div ref={waveformRef} className="min-w-[200px] flex-1" />

      {/* Velocidade */}
      <button
        onClick={toggleSpeed}
        className="rounded-lg bg-gray-800 px-3 py-1 text-sm font-medium text-white transition hover:bg-gray-700"
      >
        {playbackRate.toFixed(1)}x
      </button>
    </div>
  )
}
