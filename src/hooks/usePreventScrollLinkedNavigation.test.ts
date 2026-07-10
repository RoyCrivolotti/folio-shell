import { renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { usePreventScrollLinkedNavigation } from './usePreventScrollLinkedNavigation'

describe('usePreventScrollLinkedNavigation', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('prevents default on mostly-horizontal wheel gestures', () => {
    const preventDefault = vi.fn()
    const addSpy = vi.spyOn(document, 'addEventListener')

    renderHook(() => usePreventScrollLinkedNavigation())

    const wheelCall = addSpy.mock.calls.find(([type]) => type === 'wheel')
    expect(wheelCall).toBeDefined()
    const onWheel = wheelCall![1] as unknown as (
      event: Pick<WheelEvent, 'deltaX' | 'deltaY' | 'preventDefault'>,
    ) => void

    onWheel({ deltaX: 12, deltaY: 4, preventDefault })
    expect(preventDefault).toHaveBeenCalledTimes(1)
  })

  it('prevents default when horizontal delta is strong despite larger deltaY', () => {
    const preventDefault = vi.fn()
    const addSpy = vi.spyOn(document, 'addEventListener')

    renderHook(() => usePreventScrollLinkedNavigation())

    const onWheel = addSpy.mock.calls.find(([type]) => type === 'wheel')![1] as unknown as (
      event: Pick<WheelEvent, 'deltaX' | 'deltaY' | 'preventDefault'>,
    ) => void

    onWheel({ deltaX: 8, deltaY: 20, preventDefault })
    expect(preventDefault).toHaveBeenCalledTimes(1)
  })
})
