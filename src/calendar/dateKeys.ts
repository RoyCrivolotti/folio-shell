import { toLocalParts } from './timeParts'

export function parseIsoMs(iso: string): number {
  return new Date(iso).getTime()
}

export function eachUtcHourBetween(startIso: string, endIso: string): string[] {
  const startMs = parseIsoMs(startIso)
  const endMs = parseIsoMs(endIso)
  const out: string[] = []
  let cursor = startMs
  while (cursor < endMs) {
    out.push(new Date(cursor).toISOString())
    cursor += 3600_000
  }
  return out
}

export function uniqueDateKeysBetween(startIso: string, endIso: string, timezone: string): string[] {
  const keys = new Set<string>()
  for (const hourIso of eachUtcHourBetween(startIso, endIso)) {
    keys.add(toLocalParts(hourIso, timezone).dateKey)
  }
  keys.add(toLocalParts(endIso, timezone).dateKey)
  return [...keys].sort()
}

/** UTC instant for a wall-clock time in the given IANA timezone. */
export function localWallTimeToIso(
  dateKey: string,
  hour: number,
  minute: number,
  timezone: string,
): string {
  const [year, month, day] = dateKey.split('-').map(Number)
  if (!year || !month || !day) throw new Error(`Invalid dateKey ${dateKey}`)
  for (let offsetHours = -14; offsetHours <= 14; offsetHours += 1) {
    const candidate = new Date(Date.UTC(year, month - 1, day, hour - offsetHours, minute, 0, 0))
    const parts = toLocalParts(candidate.toISOString(), timezone)
    if (parts.dateKey === dateKey && parts.hour === hour && parts.minute === minute) {
      return candidate.toISOString()
    }
  }
  throw new Error(`Could not resolve ${dateKey} ${hour}:${minute} in ${timezone}`)
}

export function addDaysToKey(dayKey: string, days: number): string {
  const parts = dayKey.split('-').map(Number)
  const y = parts[0]
  const m = parts[1]
  const d = parts[2]
  if (y === undefined || m === undefined || d === undefined) {
    throw new Error(`Invalid day key: ${dayKey}`)
  }
  const next = new Date(y, m - 1, d + days)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${next.getFullYear()}-${pad(next.getMonth() + 1)}-${pad(next.getDate())}`
}
