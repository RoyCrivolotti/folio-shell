/** Shared wheel guard for Chrome scroll-linked back/forward navigation. */
export function blockScrollLinkedNavigationWheel(
  event: Pick<WheelEvent, 'deltaX' | 'deltaY' | 'preventDefault'>,
): boolean {
  const absX = Math.abs(event.deltaX)
  const absY = Math.abs(event.deltaY)
  if (absX < 1) return false

  if (absX >= absY || absX >= 4) {
    event.preventDefault()
    return true
  }

  return false
}

export const FOLIO_CALENDAR_SELECTOR = '[data-folio-calendar]'

export function wheelEventTargetsCalendar(event: WheelEvent): boolean {
  const path = typeof event.composedPath === 'function' ? event.composedPath() : [event.target]
  return path.some(
    (node) => node instanceof Element && node.closest(FOLIO_CALENDAR_SELECTOR) != null,
  )
}
