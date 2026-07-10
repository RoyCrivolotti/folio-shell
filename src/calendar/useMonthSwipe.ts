import { useCallback, useEffect, useRef, type PointerEvent as ReactPointerEvent } from 'react'
import { blockScrollLinkedNavigationWheel } from './scrollNavGuard'

const POINTER_THRESHOLD = 48
const WHEEL_THRESHOLD = 72
const WHEEL_RESET_MS = 400

type MonthSwipeHandlers = {
  onPrevMonth: () => void
  onNextMonth: () => void
}

function attachWheelSwipe(
  node: HTMLElement,
  handlers: MonthSwipeHandlers,
): () => void {
  let wheelAccum = 0
  let wheelTimer: ReturnType<typeof setTimeout> | null = null

  const resetWheel = () => {
    wheelAccum = 0
    if (wheelTimer) {
      clearTimeout(wheelTimer)
      wheelTimer = null
    }
  }

  const onWheel = (event: WheelEvent) => {
    blockScrollLinkedNavigationWheel(event)

    const absX = Math.abs(event.deltaX)
    const absY = Math.abs(event.deltaY)
    if (absX < 1 || absX <= absY) return

    wheelAccum += event.deltaX
    if (wheelTimer) clearTimeout(wheelTimer)
    wheelTimer = setTimeout(resetWheel, WHEEL_RESET_MS)

    if (wheelAccum >= WHEEL_THRESHOLD) {
      resetWheel()
      handlers.onNextMonth()
    } else if (wheelAccum <= -WHEEL_THRESHOLD) {
      resetWheel()
      handlers.onPrevMonth()
    }
  }

  node.addEventListener('wheel', onWheel, { passive: false, capture: true })
  return () => {
    node.removeEventListener('wheel', onWheel, { capture: true })
    resetWheel()
  }
}

export function useMonthSwipe({ onPrevMonth, onNextMonth }: MonthSwipeHandlers) {
  const zoneRef = useRef<HTMLDivElement | null>(null)
  const pointerOrigin = useRef<{ x: number; y: number; id: number } | null>(null)

  useEffect(() => {
    const node = zoneRef.current
    if (!node) return
    return attachWheelSwipe(node, { onPrevMonth, onNextMonth })
  }, [onNextMonth, onPrevMonth])

  const onPointerDown = useCallback((event: ReactPointerEvent<HTMLElement>) => {
    if (event.button !== 0) return
    pointerOrigin.current = { x: event.clientX, y: event.clientY, id: event.pointerId }
  }, [])

  const onPointerUp = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      const origin = pointerOrigin.current
      pointerOrigin.current = null
      if (!origin || origin.id !== event.pointerId) return

      const dx = event.clientX - origin.x
      const dy = event.clientY - origin.y
      if (Math.abs(dx) < POINTER_THRESHOLD || Math.abs(dx) <= Math.abs(dy)) return

      if (dx > 0) onPrevMonth()
      else onNextMonth()
    },
    [onNextMonth, onPrevMonth],
  )

  return {
    zoneRef,
    pointerHandlers: {
      onPointerDown,
      onPointerUp,
      onPointerCancel: onPointerUp,
    },
  }
}
