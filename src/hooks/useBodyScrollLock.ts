import { useEffect } from 'react'

let lockCount = 0
let savedScrollY = 0
let savedStyle: { overflow: string; position: string; top: string; width: string } | null = null

/**
 * True while anything holds the page pinned.
 *
 * With `body` at `position: fixed; top: -<scrollY>px`, `window.scrollY` reads 0 no matter
 * where the page actually sits, so code that reads "scrollY is 0" as "at the top of the page"
 * has to check this first.
 */
export function isBodyScrollLocked(): boolean {
  return lockCount > 0
}

/**
 * Prevent the page behind a sheet or menu from scrolling (reliable on iOS PWA).
 *
 * Reference-counted and shared by every caller: the first lock captures the scroll position and
 * the body's styles, later locks only add to the count, and the last release restores the body.
 * Two independent locks that each snapshot the body break as soon as they overlap and release out
 * of order, because the second snapshot is of a body that is already pinned. Releasing that
 * snapshot last leaves the page pinned for good, and in an installed iOS app that also leaves the
 * layout viewport short by the status bar, so fixed bars sit too high.
 */
export function useBodyScrollLock(active: boolean): void {
  useEffect(() => {
    if (!active) return
    if (lockCount === 0) {
      const { style } = document.body
      savedScrollY = window.scrollY
      savedStyle = {
        overflow: style.overflow,
        position: style.position,
        top: style.top,
        width: style.width,
      }
      style.overflow = 'hidden'
      style.position = 'fixed'
      style.top = `-${savedScrollY}px`
      style.width = '100%'
    }
    lockCount++
    return () => {
      lockCount--
      if (lockCount === 0 && savedStyle) {
        const { style } = document.body
        style.overflow = savedStyle.overflow
        style.position = savedStyle.position
        style.top = savedStyle.top
        style.width = savedStyle.width
        window.scrollTo(0, savedScrollY)
        savedStyle = null
      }
    }
  }, [active])
}
