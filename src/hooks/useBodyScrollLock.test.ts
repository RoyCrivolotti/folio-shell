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

  it('pins the body while held, then restores it and the scroll position', () => {
    const scrollTo = vi.spyOn(window, 'scrollTo')
    setScrollY(120)
    const { unmount } = renderHook(() => useBodyScrollLock(true))

    expect(document.body.style.position).toBe('fixed')
    expect(document.body.style.overflow).toBe('hidden')
    expect(document.body.style.top).toBe('-120px')
    expect(isBodyScrollLocked()).toBe(true)

    unmount()

    expect(document.body.style.position).toBe('')
    expect(document.body.style.overflow).toBe('')
    expect(document.body.style.top).toBe('')
    expect(scrollTo).toHaveBeenCalledWith(0, 120)
    expect(isBodyScrollLocked()).toBe(false)
  })

  it('does nothing while inactive, and locks when it turns active', () => {
    const { rerender } = renderHook(({ on }) => useBodyScrollLock(on), { initialProps: { on: false } })
    expect(document.body.style.position).toBe('')

    rerender({ on: true })
    expect(document.body.style.position).toBe('fixed')

    rerender({ on: false })
    expect(document.body.style.position).toBe('')
  })

  it('keeps the page pinned until the last of several holders lets go', () => {
    const first = renderHook(() => useBodyScrollLock(true))
    const second = renderHook(() => useBodyScrollLock(true))

    first.unmount()
    expect(document.body.style.position).toBe('fixed')

    second.unmount()
    expect(document.body.style.position).toBe('')
  })

  it('is not left pinned when holders release in the opposite order to how they took it', () => {
    // The regression: a second lock that snapshots the body while it is already pinned, released
    // last, used to "restore" the pinned state and leave the page stuck.
    const first = renderHook(() => useBodyScrollLock(true))
    const second = renderHook(() => useBodyScrollLock(true))

    first.unmount()
    second.unmount()

    expect(document.body.style.position).toBe('')
    expect(document.body.style.overflow).toBe('')
    expect(document.body.style.top).toBe('')
    expect(isBodyScrollLocked()).toBe(false)
  })

  it('captures the scroll position once, even though the pinned body then reads scrollY as 0', () => {
    const scrollTo = vi.spyOn(window, 'scrollTo')
    setScrollY(200)
    const first = renderHook(() => useBodyScrollLock(true))
    setScrollY(0)
    const second = renderHook(() => useBodyScrollLock(true))

    expect(document.body.style.top).toBe('-200px')

    second.unmount()
    first.unmount()

    expect(scrollTo).toHaveBeenCalledWith(0, 200)
  })
})
