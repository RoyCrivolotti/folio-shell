import { describe, expect, it } from 'vitest'
import {
  buildMonthGrid,
  eventTouchesDay,
  eventTouchesMonth,
  eventsForDay,
  shiftMonthKey,
} from './calendarUtils'

const TZ = 'Europe/Madrid'

describe('calendarUtils', () => {
  it('builds a padded May 2026 grid', () => {
    const cells = buildMonthGrid('2026-05', TZ)
    expect(cells.filter(Boolean)).toHaveLength(31)
    expect(cells[5]).toBe('2026-05-01')
    expect(cells.slice(0, 5).every((cell) => cell === null)).toBe(true)
  })

  it('shifts months across year boundary', () => {
    expect(shiftMonthKey('2025-12', 1)).toBe('2026-01')
    expect(shiftMonthKey('2026-01', -1)).toBe('2025-12')
  })

  it('detects multi-day range overlap', () => {
    const event = {
      start: '2026-05-10T06:00:00Z',
      end: '2026-05-17T06:00:00Z',
    }
    expect(eventTouchesDay(event, '2026-05-12', TZ)).toBe(true)
    expect(eventTouchesDay(event, '2026-05-20', TZ)).toBe(false)
  })

  it('filters events for a day', () => {
    const events = [
      { start: '2026-05-01T08:00:00Z', end: '2026-05-01T09:00:00Z' },
      { start: '2026-05-02T08:00:00Z', end: '2026-05-02T09:00:00Z' },
    ]
    expect(eventsForDay(events, '2026-05-01', TZ)).toHaveLength(1)
  })

  it('detects month overlap', () => {
    const event = { start: '2026-05-28T08:00:00Z', end: '2026-06-02T08:00:00Z' }
    expect(eventTouchesMonth(event, '2026-05', TZ)).toBe(true)
    expect(eventTouchesMonth(event, '2026-07', TZ)).toBe(false)
  })
})
