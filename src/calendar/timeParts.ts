export interface LocalParts {
  dateKey: string
  hour: number
  minute: number
  weekday: number
}

const WEEKDAY_INDEX: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
}

export function toLocalParts(iso: string, timezone: string): LocalParts {
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
    weekday: 'short',
  })
  const parts = formatter.formatToParts(new Date(iso))
  const pick = (type: Intl.DateTimeFormatPartTypes): string => {
    const value = parts.find((p) => p.type === type)?.value
    if (!value) throw new Error(`Missing ${type} for ${iso}`)
    return value
  }
  const weekdayLabel = pick('weekday')
  const weekday = WEEKDAY_INDEX[weekdayLabel]
  if (weekday === undefined) throw new Error(`Unknown weekday ${weekdayLabel}`)
  const dateKey = `${pick('year')}-${pick('month')}-${pick('day')}`
  return {
    dateKey,
    hour: Number(pick('hour')),
    minute: Number(pick('minute')),
    weekday,
  }
}
