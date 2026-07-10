import type { ReactNode } from 'react'
import styles from './monthGrid.module.css'
import type { MonthGridLegendItem } from './monthGridTypes'

export function CalendarLegend({
  legend,
  legendHint,
  markerClassName,
}: {
  legend: MonthGridLegendItem[]
  legendHint?: ReactNode
  markerClassName: (kind: string) => string
}) {
  if (legend.length === 0 && !legendHint) return null

  return (
    <div className={styles.legend}>
      {legend.map((item) => (
        <span
          key={item.kind}
          className={`${styles.legendItem} ${item.muted ? styles.legendItemMuted : ''}`}
        >
          <span className={`${styles.dot} ${markerClassName(item.kind)}`} /> {item.label}
        </span>
      ))}
      {legendHint ? <span className={styles.legendHint}>{legendHint}</span> : null}
    </div>
  )
}
