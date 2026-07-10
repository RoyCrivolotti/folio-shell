import { formatMonthTitle, shiftMonthKey } from './calendarUtils'
import styles from './monthGrid.module.css'

export function MonthNavStrip({
  monthKey,
  onMonthChange,
  onOpenPicker,
}: {
  monthKey: string
  onMonthChange: (monthKey: string) => void
  onOpenPicker: () => void
}) {
  const goPrev = () => onMonthChange(shiftMonthKey(monthKey, -1))
  const goNext = () => onMonthChange(shiftMonthKey(monthKey, 1))

  return (
    <div className={styles.navStrip}>
      <button type="button" className={styles.navBtn} onClick={goPrev} aria-label="Previous month">
        ←
      </button>
      <button type="button" className={styles.monthTitleBtn} onClick={onOpenPicker} aria-label="Choose month">
        {formatMonthTitle(monthKey)} ▾
      </button>
      <button type="button" className={styles.navBtn} onClick={goNext} aria-label="Next month">
        →
      </button>
    </div>
  )
}
