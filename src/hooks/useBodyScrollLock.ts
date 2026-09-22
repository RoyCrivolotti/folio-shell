import { useEffect } from 'react'

let lockCount = 0
let saved: { htmlOverflow: string; htmlOverscroll: string; bodyOverflow: string } | null = null

/**
 * True while anything holds the page's scrolling switched off.
 *
 * Interactions that only make sense on a free page (pull-to-refresh, say) check this
 * rather than working it out from scroll state.
 */
export function isBodyScrollLocked(): boolean {
  return lockCount > 0
}

/**
 * Stop the page behind a sheet or menu from scrolling.
 *
 * `overflow: hidden` on the root and the body, and nothing that moves the page. The
 * document stays a scroll container, so `position: sticky` headers stay stuck and
 * `window.scrollY` keeps its real value, and because the body is never repositioned an
 * installed iOS app keeps its full layout viewport. The previous implementation pinned
 * the body with `position: fixed; top: -scrollY`, which broke sticky positioning
 * outright and, in standalone mode, shortened the layout viewport by the status bar so
 * fixed bars sat 62px too high behind every sheet. `overscroll-behavior: none` on the
 * root keeps a rubber-band at the edge from chaining anywhere.
 *
 * Reference-counted and shared by every caller: the first lock snapshots the styles,
 * later locks only add to the count, and the last release restores them. Two
 * independent locks that each take a snapshot break as soon as they overlap and release
 * out of order, because the second snapshot is of a page that is already locked.
 */
export function useBodyScrollLock(active: boolean): void {
  useEffect(() => {
    if (!active) return
    if (lockCount === 0) {
      const html = document.documentElement.style
      const body = document.body.style
      saved = {
        htmlOverflow: html.overflow,
        htmlOverscroll: html.overscrollBehavior,
        bodyOverflow: body.overflow,
      }
      html.overflow = 'hidden'
      html.overscrollBehavior = 'none'
      body.overflow = 'hidden'
    }
    lockCount++
    return () => {
      lockCount--
      if (lockCount === 0 && saved) {
        const html = document.documentElement.style
        const body = document.body.style
        html.overflow = saved.htmlOverflow
        html.overscrollBehavior = saved.htmlOverscroll
        body.overflow = saved.bodyOverflow
        saved = null
      }
    }
  }, [active])
}
