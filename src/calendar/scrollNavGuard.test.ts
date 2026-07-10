import { describe, expect, it, vi } from 'vitest'
import { blockScrollLinkedNavigationWheel } from './scrollNavGuard'

describe('blockScrollLinkedNavigationWheel', () => {
  it('blocks when horizontal delta dominates', () => {
    const preventDefault = vi.fn()
    blockScrollLinkedNavigationWheel({ deltaX: 12, deltaY: 4, preventDefault })
    expect(preventDefault).toHaveBeenCalledTimes(1)
  })

  it('blocks strong horizontal delta even when deltaY is larger', () => {
    const preventDefault = vi.fn()
    blockScrollLinkedNavigationWheel({ deltaX: 8, deltaY: 20, preventDefault })
    expect(preventDefault).toHaveBeenCalledTimes(1)
  })

  it('ignores mostly vertical movement', () => {
    const preventDefault = vi.fn()
    blockScrollLinkedNavigationWheel({ deltaX: 2, deltaY: 20, preventDefault })
    expect(preventDefault).not.toHaveBeenCalled()
  })
})
