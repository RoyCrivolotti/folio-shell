import { renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { isBodyScrollLocked, useBodyScrollLock } from './useBodyScrollLock'

function setScrollY(value: number) {
  Object.defineProperty(window, 'scrollY', { value, configurable: true })
}

describe('useBodyScrollLock', () => {
  afterEach(() => {
    setScrollY(0)
    vi.restoreAllMocks()
  })

  it('switches scrolling off while held, then restores the styles', () => {
    const { unmount } = renderHook(() => useBodyScrollLock(true))

    expect(document.documentElement.style.overflow).toBe('hidden')
    expect(document.documentElement.style.overscrollBehavior).toBe('none')
    expect(document.body.style.overflow).toBe('hidden')
    expect(isBodyScrollLocked()).toBe(true)

    unmount()

    expect(document.documentElement.style.overflow).toBe('')
    expect(document.documentElement.style.overscrollBehavior).toBe('')
    expect(document.body.style.overflow).toBe('')
    expect(isBodyScrollLocked()).toBe(false)
  })

  it('never repositions the page: no fixed body, no scroll restore', () => {
    // The old pin (`position: fixed; top: -scrollY`) broke sticky headers and, in an
    // installed iOS app, shortened the layout viewport so fixed bars sat 62px too high.
    const scrollTo = vi.spyOn(window, 'scrollTo')
    setScrollY(120)
    const { unmount } = renderHook(() => useBodyScrollLock(true))

    expect(document.body.style.position).toBe('')
    expect(document.body.style.top).toBe('')
    expect(window.scrollY).toBe(120)

    unmount()
    expect(scrollTo).not.toHaveBeenCalled()
  })

  it('does nothing while inactive, and locks when it turns active', () => {
    const { rerender } = renderHook(({ on }) => useBodyScrollLock(on), { initialProps: { on: false } })
    expect(document.body.style.overflow).toBe('')

    rerender({ on: true })
    expect(document.body.style.overflow).toBe('hidden')

    rerender({ on: false })
    expect(document.body.style.overflow).toBe('')
  })

  it('keeps scrolling off until the last of several holders lets go', () => {
    const first = renderHook(() => useBodyScrollLock(true))
    const second = renderHook(() => useBodyScrollLock(true))

    first.unmount()
    expect(document.body.style.overflow).toBe('hidden')

    second.unmount()
    expect(document.body.style.overflow).toBe('')
  })

  it('is not left locked when holders release in the opposite order to how they took it', () => {
    // The regression the counter exists for: a second lock that snapshots styles while
    // the page is already locked, released last, used to "restore" the locked state.
    const first = renderHook(() => useBodyScrollLock(true))
    const second = renderHook(() => useBodyScrollLock(true))

    first.unmount()
    second.unmount()

    expect(document.documentElement.style.overflow).toBe('')
    expect(document.body.style.overflow).toBe('')
    expect(isBodyScrollLocked()).toBe(false)
  })

  it('restores styles a caller had set before the lock took hold', () => {
    document.documentElement.style.overscrollBehavior = 'contain'
    const { unmount } = renderHook(() => useBodyScrollLock(true))
    expect(document.documentElement.style.overscrollBehavior).toBe('none')

    unmount()
    expect(document.documentElement.style.overscrollBehavior).toBe('contain')
    document.documentElement.style.overscrollBehavior = ''
  })
})
