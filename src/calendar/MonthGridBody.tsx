import { CalendarLegend } from './CalendarLegend'
import styles from './monthGrid.module.css'
import type { MonthDayMarkers, MonthGridLegendItem } from './monthGridTypes'
import { MonthGridCells } from './MonthGridCells'
import { resolveMonthDayMarkers } from './resolveMonthDayMarkers'

export function MonthGridBody({
  cells,
  timezone,
  markersByDay,
  selectedDay,
  stackedMarkerKind,
  markerClassName,
  markerDisplay,
  maxVisiblePills,
  legend,
  legendHint,
  weekdayLabels,
  onDaySelect,
  ariaLabelForDay,
}: {
  cells: (string | null)[]
  timezone: string
  markersByDay: ReadonlyMap<string, MonthDayMarkers> | Record<string, MonthDayMarkers>
  selectedDay: string | null
  stackedMarkerKind: string
  markerClassName: (kind: string) => string
  markerDisplay: 'dots' | 'pills'
  maxVisiblePills: number
  legend: MonthGridLegendItem[]
  legendHint?: React.ReactNode
  weekdayLabels: string[]
  onDaySelect: (dayKey: string) => void
  ariaLabelForDay?: (dayKey: string, markers: MonthDayMarkers) => string
}) {
  return (
    <div className={styles.swipeZone}>
      <CalendarLegend legend={legend} legendHint={legendHint} markerClassName={markerClassName} />
      <div className={styles.weekdays}>
        {weekdayLabels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
      <MonthGridCells
        cells={cells}
        timezone={timezone}
        markersByDay={markersByDay}
        selectedDay={selectedDay}
        stackedMarkerKind={stackedMarkerKind}
        markerClassName={markerClassName}
        markerDisplay={markerDisplay}
        maxVisiblePills={maxVisiblePills}
        onDaySelect={onDaySelect}
        resolveMarkers={resolveMonthDayMarkers}
        {...(ariaLabelForDay ? { ariaLabelForDay } : {})}
      />
    </div>
  )
}
