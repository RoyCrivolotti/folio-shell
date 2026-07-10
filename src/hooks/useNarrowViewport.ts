import { useEffect, useState } from 'react'

/** True when viewport width is at most maxWidthPx (default 720 — catalyst mobile breakpoint). */
export function useNarrowViewport(maxWidthPx = 720) {
  const [narrow, setNarrow] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(`(max-width: ${maxWidthPx}px)`).matches : false,
  )

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${maxWidthPx}px)`)
    const onChange = () => setNarrow(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [maxWidthPx])

  return narrow
}
