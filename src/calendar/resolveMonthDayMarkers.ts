import type { MonthDayMarkers } from './monthGridTypes'

export function resolveMonthDayMarkers(
  markersByDay: ReadonlyMap<string, MonthDayMarkers> | Record<string, MonthDayMarkers>,
  dayKey: string,
): MonthDayMarkers {
  if (markersByDay instanceof Map) {
    return markersByDay.get(dayKey) ?? { kinds: [] }
  }
  const record = markersByDay as Record<string, MonthDayMarkers | undefined>
  return record[dayKey] ?? { kinds: [] }
}
