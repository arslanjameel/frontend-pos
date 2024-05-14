import { useEffect, useState } from 'react'

interface WindowSize {
  width: number
  height: number
}

export function useWindowSize() {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: 0,
    height: 0,
  })

  const [isMobileSize, setIsMobileSize] = useState(false)

  const handleSize = () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    })
    setIsMobileSize(window.innerWidth <= 700)
  }

  const isWindowBelow = (limit: number) => {
    return windowSize.width <= limit
  }

  useEffect(() => {
    handleSize()
    window.addEventListener('resize', handleSize)

    return () =>
      window.removeEventListener('resize', handleSize)
  }, [])

  return { windowSize, isMobileSize, isWindowBelow }
}
