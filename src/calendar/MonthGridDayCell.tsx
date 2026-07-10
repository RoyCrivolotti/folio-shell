import { cappedDotDisplay } from './cappedDotDisplay'
import { todayKey } from './calendarUtils'
import styles from './monthGrid.module.css'
import type { MonthDayMarkers } from './monthGridTypes'

export function MonthGridDayCell({
  dayKey,
  markers,
  timezone,
  selected,
  stackedMarkerKind,
  markerClassName,
  ariaLabel,
  onSelect,
}: {
  dayKey: string
  markers: MonthDayMarkers
  timezone: string
  selected: boolean
  stackedMarkerKind: string
  markerClassName: (kind: string) => string
  ariaLabel: string
  onSelect: (dayKey: string) => void
}) {
  const stacked = cappedDotDisplay(markers.stackedCount ?? 0, markers.stackedMaxDots)
  const isToday = dayKey === todayKey(timezone)
  const dayNum = Number(dayKey.slice(8, 10))

  return (
    <button
      type="button"
      className={`${styles.cell} ${isToday ? styles.cellToday : ''} ${selected ? styles.cellSelected : ''}`}
      onClick={() => onSelect(dayKey)}
      aria-label={ariaLabel}
    >
      <span className={styles.dayNum}>{dayNum}</span>
      <span className={styles.markers}>
        {markers.kinds.map((kind) => (
          <span key={kind} className={`${styles.marker} ${markerClassName(kind)}`} />
        ))}
        {Array.from({ length: stacked.dots }, (_, index) => (
          <span
            key={`${stackedMarkerKind}-${index}`}
            className={`${styles.marker} ${markerClassName(stackedMarkerKind)}`}
          />
        ))}
        {stacked.overflow > 0 && <span className={styles.overflow}>+{stacked.overflow}</span>}
      </span>
    </button>
  )
}
