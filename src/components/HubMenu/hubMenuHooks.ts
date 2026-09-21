import { useEffect, useState, type RefObject } from 'react'
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock'

/**
 * How long the menu stays on screen after it is closed, while it animates out. Also what the
 * CSS reads as `--hub-exit-ms`, so the animation and the mount cannot disagree.
 */
export const HUB_MENU_EXIT_MS = 150

/** False where nothing can be animated, or where the person asked for less movement. */
function canAnimate(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

/**
 * Keeps something mounted for `ms` after `open` turns false, so it can animate out.
 * `mounted` is what to render, and `leaving` says it is on its way out.
 *
 * A menu removed in the same commit that closes it has nothing left to animate out of.
 */
export function useExitHold(open: boolean, ms: number): { mounted: boolean; leaving: boolean } {
  const [mounted, setMounted] = useState(open)
  // Following a prop while rendering avoids a second commit; both branches are guarded.
  if (open && !mounted) setMounted(true)
  else if (!open && mounted && !canAnimate()) setMounted(false)

  useEffect(() => {
    if (open || !mounted) return
    const timer = setTimeout(() => setMounted(false), ms)
    return () => clearTimeout(timer)
  }, [open, mounted, ms])

  return { mounted, leaving: mounted && !open }
}

/**
 * Escape closes the menu while it is open. The scroll lock is held for as long as the menu is
 * mounted, so the page cannot start scrolling under the menu while it animates out.
 */
export function useMenuLock(open: boolean, onClose: () => void, locked = open) {
  useBodyScrollLock(locked)
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])
}

/**
 * Home-screen / installed PWA. iOS Safari does not support the
 * `(display-mode: standalone)` media query, so check the iOS-specific
 * `navigator.standalone` first, then the standard query for other platforms.
 */
export function isStandaloneDisplay(): boolean {
  if (typeof window === 'undefined') return false
  const nav = window.navigator as Navigator & { standalone?: boolean }
  return nav.standalone === true || window.matchMedia?.('(display-mode: standalone)').matches === true
}

export function useFocusTrap(active: boolean, containerRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!active) return
    const root = containerRef.current
    if (!root) return
    const focusables = root.querySelectorAll<HTMLElement>(
      'button, a[href], [tabindex]:not([tabindex="-1"])',
    )
    if (focusables.length === 0) return
    const first = focusables[0]
    const last = focusables[focusables.length - 1]
    if (!first || !last) return
    first.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    root.addEventListener('keydown', onKey)
    return () => root.removeEventListener('keydown', onKey)
  }, [active, containerRef])
}
