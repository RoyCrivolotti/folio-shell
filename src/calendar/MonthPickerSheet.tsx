import { useState } from 'react'
import { BottomSheet } from '../components/BottomSheet/BottomSheet'
import { formatMonthTitle } from './calendarUtils'
import styles from './MonthPickerSheet.module.css'

export function MonthPickerSheet({
  monthKey,
  title = 'Choose month',
  hint = 'Jump to any month.',
  onSelect,
  onClose,
}: {
  monthKey: string
  title?: string
  hint?: string
  onSelect: (monthKey: string) => void
  onClose: () => void
}) {
  const [value, setValue] = useState(monthKey)

  return (
    <BottomSheet title={title} onClose={onClose}>
      <p className={styles.hint}>{hint}</p>
      <label className={styles.label}>
        Month
        <input
          type="month"
          className={styles.input}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </label>
      <p className={styles.preview}>{formatMonthTitle(value)}</p>
      <button type="button" className={styles.btn} onClick={() => onSelect(value)}>
        Go to month
      </button>
    </BottomSheet>
  )
}
