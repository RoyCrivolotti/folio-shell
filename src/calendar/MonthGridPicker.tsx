import { MonthPickerSheet } from './MonthPickerSheet'

export function MonthGridPicker({
  open,
  monthKey,
  monthPickerTitle,
  monthPickerHint,
  onMonthChange,
  onClose,
}: {
  open: boolean
  monthKey: string
  monthPickerTitle?: string
  monthPickerHint?: string
  onMonthChange: (monthKey: string) => void
  onClose: () => void
}) {
  if (!open) return null
  return (
    <MonthPickerSheet
      monthKey={monthKey}
      onSelect={(key) => {
        onMonthChange(key)
        onClose()
      }}
      onClose={onClose}
      {...(monthPickerTitle ? { title: monthPickerTitle } : {})}
      {...(monthPickerHint ? { hint: monthPickerHint } : {})}
    />
  )
}
