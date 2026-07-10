import { cappedDotDisplay } from './cappedDotDisplay'
import styles from './monthGrid.module.css'
import type { MonthDayMarkers } from './monthGridTypes'

export function MonthGridDayMarkers({
  markers,
  stackedMarkerKind,
  markerClassName,
  markerDisplay = 'dots',
  maxVisiblePills = 2,
}: {
  markers: MonthDayMarkers
  stackedMarkerKind: string
  markerClassName: (kind: string) => string
  markerDisplay?: 'dots' | 'pills'
  maxVisiblePills?: number
}) {
  const stacked = cappedDotDisplay(markers.stackedCount ?? 0, markers.stackedMaxDots)
  const pillItems = markers.items ?? []
  const usePills = markerDisplay === 'pills' && pillItems.length > 0

  if (usePills) {
    return (
      <>
        {pillItems.slice(0, maxVisiblePills).map((item, index) => (
          <span
            key={`${item.kind}-${index}`}
            className={`${styles.pill} ${markerClassName(item.kind)} ${item.hidden ? styles.pillHidden : ''}`}
            title={item.label}
          >
            {item.label}
          </span>
        ))}
        {(markers.overflowCount ?? 0) > 0 ? (
          <span className={styles.overflow}>+{markers.overflowCount}</span>
        ) : null}
      </>
    )
  }

  return (
    <>
      {markers.kinds.map((kind) => (
        <span key={kind} className={`${styles.marker} ${markerClassName(kind)}`} />
      ))}
      {Array.from({ length: stacked.dots }, (_, index) => (
        <span
          key={`${stackedMarkerKind}-${index}`}
          className={`${styles.marker} ${markerClassName(stackedMarkerKind)}`}
        />
      ))}
      {stacked.overflow > 0 ? <span className={styles.overflow}>+{stacked.overflow}</span> : null}
    </>
  )
}
