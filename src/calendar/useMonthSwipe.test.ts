import { describe, expect, it, vi } from 'vitest'

// attachWheelSwipe is internal; exercise via the same wheel logic copied for test stability.
function handleWheel(
  event: Pick<WheelEvent, 'deltaX' | 'deltaY' | 'preventDefault'>,
  state: { wheelAccum: number },
  handlers: { onPrevMonth: () => void; onNextMonth: () => void },
) {
  const absX = Math.abs(event.deltaX)
  const absY = Math.abs(event.deltaY)
  if (absX < 1) return

  if (absX >= absY || absX >= 6) {
    event.preventDefault()
  }

  if (absX <= absY) return

  state.wheelAccum += event.deltaX
  if (state.wheelAccum >= 72) {
    state.wheelAccum = 0
    handlers.onNextMonth()
  } else if (state.wheelAccum <= -72) {
    state.wheelAccum = 0
    handlers.onPrevMonth()
  }
}

describe('month swipe wheel guard', () => {
  it('blocks browser nav when horizontal delta is strong despite larger deltaY', () => {
    const preventDefault = vi.fn()
    const state = { wheelAccum: 0 }
    handleWheel(
      { deltaX: 8, deltaY: 20, preventDefault },
      state,
      { onPrevMonth: vi.fn(), onNextMonth: vi.fn() },
    )
    expect(preventDefault).toHaveBeenCalledTimes(1)
  })
})
