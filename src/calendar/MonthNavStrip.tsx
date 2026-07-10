import { useCallback } from 'react'
import { formatMonthTitle, shiftMonthKey } from './calendarUtils'
import styles from './monthGrid.module.css'
import { useMonthSwipe } from './useMonthSwipe'

export function MonthNavStrip({
  monthKey,
  onMonthChange,
  onOpenPicker,
}: {
  monthKey: string
  onMonthChange: (monthKey: string) => void
  onOpenPicker: () => void
}) {
  const goPrev = useCallback(() => onMonthChange(shiftMonthKey(monthKey, -1)), [monthKey, onMonthChange])
  const goNext = useCallback(() => onMonthChange(shiftMonthKey(monthKey, 1)), [monthKey, onMonthChange])
  const { zoneRef, pointerHandlers } = useMonthSwipe({ onPrevMonth: goPrev, onNextMonth: goNext })

  return (
    <div ref={zoneRef} className={styles.navStrip} {...pointerHandlers}>
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
