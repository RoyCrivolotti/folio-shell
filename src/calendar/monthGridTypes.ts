import type { ReactNode } from 'react'

export type MonthDayMarkerItem = {
  kind: string
  label: string
  hidden?: boolean
}

export type MonthDayMarkers = {
  /** Marker kinds rendered as one dot each (e.g. on-call, holiday). */
  kinds: string[]
  /** Optional stacked dot count (e.g. multiple incidents on one day). */
  stackedCount?: number
  /** Max dots before showing +N overflow. Defaults to 3. */
  stackedMaxDots?: number
  /** Pill labels when markerDisplay is pills. */
  items?: MonthDayMarkerItem[]
  /** Extra events beyond maxVisiblePills. */
  overflowCount?: number
}

export type MonthGridLegendItem = {
  kind: string
  label: string
  muted?: boolean
}

export type MonthGridProps = {
  monthKey: string
  timezone: string
  markersByDay: ReadonlyMap<string, MonthDayMarkers> | Record<string, MonthDayMarkers>
  markerClassName: (kind: string) => string
  stackedMarkerKind?: string
  selectedDay: string | null
  onDaySelect: (dayKey: string) => void
  onMonthChange: (monthKey: string) => void
  legend?: MonthGridLegendItem[]
  legendHint?: ReactNode
  subtitle?: string
  weekdayLabels?: string[]
  monthPickerTitle?: string
  monthPickerHint?: string
  ariaLabelForDay?: (dayKey: string, markers: MonthDayMarkers) => string
  markerDisplay?: 'dots' | 'pills'
  maxVisiblePills?: number
}
