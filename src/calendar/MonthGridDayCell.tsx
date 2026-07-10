import { todayKey } from './calendarUtils'
import styles from './monthGrid.module.css'
import type { MonthDayMarkers } from './monthGridTypes'
import { MonthGridDayMarkers } from './MonthGridDayMarkers'

export function MonthGridDayCell({
  dayKey,
  markers,
  timezone,
  selected,
  stackedMarkerKind,
  markerClassName,
  markerDisplay = 'dots',
  maxVisiblePills = 2,
  ariaLabel,
  onSelect,
}: {
  dayKey: string
  markers: MonthDayMarkers
  timezone: string
  selected: boolean
  stackedMarkerKind: string
  markerClassName: (kind: string) => string
  markerDisplay?: 'dots' | 'pills'
  maxVisiblePills?: number
  ariaLabel: string
  onSelect: (dayKey: string) => void
}) {
  const isToday = dayKey === todayKey(timezone)
  const dayNum = Number(dayKey.slice(8, 10))
  const usePills = markerDisplay === 'pills' && (markers.items?.length ?? 0) > 0

  return (
    <button
      type="button"
      className={`${styles.cell} ${isToday ? styles.cellToday : ''} ${selected ? styles.cellSelected : ''} ${usePills ? styles.cellPills : ''}`}
      onClick={() => onSelect(dayKey)}
      aria-label={ariaLabel}
    >
      <span className={styles.dayNum}>{dayNum}</span>
      <span className={styles.markers}>
        <MonthGridDayMarkers
          markers={markers}
          stackedMarkerKind={stackedMarkerKind}
          markerClassName={markerClassName}
          markerDisplay={markerDisplay}
          maxVisiblePills={maxVisiblePills}
        />
      </span>
    </button>
  )
}
