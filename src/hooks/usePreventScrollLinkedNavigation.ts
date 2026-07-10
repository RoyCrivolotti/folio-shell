import { useEffect } from 'react'

/** Block Chrome scroll-linked back/forward on horizontal trackpad swipes. */
export function usePreventScrollLinkedNavigation() {
  useEffect(() => {
    const onWheel = (event: WheelEvent) => {
      const absX = Math.abs(event.deltaX)
      const absY = Math.abs(event.deltaY)
      if (absX < 1) return

      if (absX >= absY || absX >= 6) {
        event.preventDefault()
      }
    }

    document.addEventListener('wheel', onWheel, { passive: false, capture: true })
    return () => document.removeEventListener('wheel', onWheel, { capture: true })
  }, [])
}
