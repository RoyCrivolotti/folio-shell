import styles from './monthGrid.module.css'
import type { MonthDayMarkers } from './monthGridTypes'
import { MonthGridDayCell } from './MonthGridDayCell'

export function MonthGridCells({
  cells,
  timezone,
  markersByDay,
  selectedDay,
  stackedMarkerKind,
  markerClassName,
  ariaLabelForDay,
  onDaySelect,
  resolveMarkers,
}: {
  cells: (string | null)[]
  timezone: string
  markersByDay: ReadonlyMap<string, MonthDayMarkers> | Record<string, MonthDayMarkers>
  selectedDay: string | null
  stackedMarkerKind: string
  markerClassName: (kind: string) => string
  ariaLabelForDay?: (dayKey: string, markers: MonthDayMarkers) => string
  onDaySelect: (dayKey: string) => void
  resolveMarkers: (
    markersByDay: ReadonlyMap<string, MonthDayMarkers> | Record<string, MonthDayMarkers>,
    dayKey: string,
  ) => MonthDayMarkers
}) {
  return (
    <div className={styles.grid}>
      {cells.map((dayKey, index) =>
        dayKey ? (
          <MonthGridDayCell
            key={dayKey}
            dayKey={dayKey}
            markers={resolveMarkers(markersByDay, dayKey)}
            timezone={timezone}
            selected={selectedDay === dayKey}
            stackedMarkerKind={stackedMarkerKind}
            markerClassName={markerClassName}
            ariaLabel={ariaLabelForDay?.(dayKey, resolveMarkers(markersByDay, dayKey)) ?? dayKey}
            onSelect={onDaySelect}
          />
        ) : (
          <div key={`pad-${index}`} className={`${styles.cell} ${styles.cellEmpty}`} aria-hidden />
        ),
      )}
    </div>
  )
}
