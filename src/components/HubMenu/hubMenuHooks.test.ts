import { afterEach, describe, expect, it, vi } from 'vitest'
import { isStandaloneDisplay } from './hubMenuHooks'

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
