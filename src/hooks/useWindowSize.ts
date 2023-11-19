'use client'

import { useState, useEffect } from 'react'

export default function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    windowHeight: 0,
    windowWidth: 0,
  })
  useEffect(() => {
    setWindowSize({
      windowHeight: window.innerHeight,
      windowWidth: window.innerWidth,
    })
    function handleResize() {
      setWindowSize({
        windowHeight: window.innerHeight,
        windowWidth: window.innerWidth,
      })
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])
  return windowSize
}
