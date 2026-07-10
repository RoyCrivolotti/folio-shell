import { uniqueDateKeysBetween } from './dateKeys'
import { toLocalParts } from './timeParts'
import type { CalendarRangedEvent } from './types'

export function parseMonthKey(monthKey: string): { year: number; month: number } {
  const [yearRaw, monthRaw] = monthKey.split('-')
  const year = Number(yearRaw)
  const month = Number(monthRaw)
  if (!yearRaw || !monthRaw || !Number.isFinite(year) || !Number.isFinite(month)) {
    throw new Error(`Invalid month key: ${monthKey}`)
  }
  return { year, month }
}

export function shiftMonthKey(monthKey: string, delta: number): string {
  const { year, month } = parseMonthKey(monthKey)
  const d = new Date(year, month - 1 + delta, 1)
  const m = String(d.getMonth() + 1).padStart(2, '0')
  return `${d.getFullYear()}-${m}`
}

export function formatMonthTitle(monthKey: string): string {
  const { year, month } = parseMonthKey(monthKey)
  return new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric' }).format(
    new Date(year, month - 1, 1),
  )
}

export function formatDayTitle(dayKey: string): string {
  const parts = dayKey.split('-').map(Number)
  const year = parts[0]
  const month = parts[1]
  const day = parts[2]
  if (year === undefined || month === undefined || day === undefined) return dayKey
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(year, month - 1, day))
}

export function todayKey(timezone: string): string {
  return toLocalParts(new Date().toISOString(), timezone).dateKey
}

export function buildMonthGrid(monthKey: string, timezone: string): (string | null)[] {
  const { year, month } = parseMonthKey(monthKey)
  const firstWeekday = toLocalParts(`${monthKey}-01T12:00:00Z`, timezone).weekday
  const daysInMonth = new Date(year, month, 0).getDate()
  const cells: (string | null)[] = []
  for (let i = 0; i < firstWeekday; i += 1) cells.push(null)
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(`${monthKey}-${String(day).padStart(2, '0')}`)
  }
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

export function eventTouchesDay(
  event: CalendarRangedEvent,
  dayKey: string,
  timezone: string,
): boolean {
  return uniqueDateKeysBetween(event.start, event.end, timezone).includes(dayKey)
}

export function eventsForDay<T extends CalendarRangedEvent>(
  events: ReadonlyArray<T>,
  dayKey: string,
  timezone: string,
): T[] {
  return events.filter((event) => eventTouchesDay(event, dayKey, timezone))
}

export function eventTouchesMonth(
  event: CalendarRangedEvent,
  monthKey: string,
  timezone: string,
): boolean {
  return uniqueDateKeysBetween(event.start, event.end, timezone).some((dayKey) =>
    dayKey.startsWith(`${monthKey}-`),
  )
}
