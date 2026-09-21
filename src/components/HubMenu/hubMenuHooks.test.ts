import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { HUB_MENU_EXIT_MS, isStandaloneDisplay, useExitHold } from './hubMenuHooks'

function setStandaloneNav(value: boolean | undefined) {
  Object.defineProperty(window.navigator, 'standalone', {
    value,
    configurable: true,
  })
}

describe('isStandaloneDisplay', () => {
  afterEach(() => {
    setStandaloneNav(undefined)
    vi.unstubAllGlobals()
  })

  it('is true when navigator.standalone is true (iOS home-screen app)', () => {
    setStandaloneNav(true)
    expect(isStandaloneDisplay()).toBe(true)
  })

  it('is true when the display-mode media query matches (non-iOS)', () => {
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: query === '(display-mode: standalone)',
    }))
    expect(isStandaloneDisplay()).toBe(true)
  })

  it('is false in a normal browser tab', () => {
    setStandaloneNav(false)
    vi.stubGlobal('matchMedia', () => ({ matches: false }))
    expect(isStandaloneDisplay()).toBe(false)
  })
})

describe('useExitHold', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.stubGlobal('matchMedia', () => ({ matches: false }))
  })
  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  const hold = (open: boolean) => renderHook(({ o }) => useExitHold(o, HUB_MENU_EXIT_MS), { initialProps: { o: open } })

  it('is not mounted while it has never been open', () => {
    expect(hold(false).result.current).toEqual({ mounted: false, leaving: false })
  })

  it('is mounted, and not leaving, while open', () => {
    expect(hold(true).result.current).toEqual({ mounted: true, leaving: false })
  })

  it('stays mounted and leaving for the exit after it closes, then unmounts', () => {
    const { result, rerender } = hold(true)

    rerender({ o: false })
    expect(result.current).toEqual({ mounted: true, leaving: true })

    act(() => {
      vi.advanceTimersByTime(HUB_MENU_EXIT_MS - 1)
    })
    expect(result.current.mounted).toBe(true)

    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(result.current).toEqual({ mounted: false, leaving: false })
  })

  it('stops leaving when it is reopened during the exit, and stays for good', () => {
    const { result, rerender } = hold(true)
    rerender({ o: false })

    rerender({ o: true })
    expect(result.current).toEqual({ mounted: true, leaving: false })

    act(() => {
      vi.advanceTimersByTime(HUB_MENU_EXIT_MS * 2)
    })
    expect(result.current.mounted).toBe(true)
  })

  it('unmounts at once where nothing can be animated', () => {
    vi.unstubAllGlobals()
    vi.stubGlobal('matchMedia', undefined)
    const { result, rerender } = hold(true)

    rerender({ o: false })

    expect(result.current).toEqual({ mounted: false, leaving: false })
  })

  it('unmounts at once for a viewer who asked for reduced motion', () => {
    vi.stubGlobal('matchMedia', (query: string) => ({ matches: query.includes('prefers-reduced-motion') }))
    const { result, rerender } = hold(true)

    rerender({ o: false })

    expect(result.current).toEqual({ mounted: false, leaving: false })
  })
})
