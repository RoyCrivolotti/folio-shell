import { useState } from 'react'
import { buildMonthGrid } from './calendarUtils'
import styles from './monthGrid.module.css'
import type { MonthGridProps } from './monthGridTypes'
import { MonthGridBody } from './MonthGridBody'
import { MonthGridPicker } from './MonthGridPicker'
import { MonthNavStrip } from './MonthNavStrip'

const DEFAULT_WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const COMPACT_WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

function resolveWeekdayLabels(
  weekdayLabels: string[] | undefined,
  compactWeekdayLabels: boolean,
): string[] {
  if (weekdayLabels) return weekdayLabels
  return compactWeekdayLabels ? COMPACT_WEEKDAYS : DEFAULT_WEEKDAYS
}

function MonthGridPickerOverlay({
  open,
  monthKey,
  onMonthChange,
  onClose,
  monthPickerTitle,
  monthPickerHint,
}: {
  open: boolean
  monthKey: string
  onMonthChange: (monthKey: string) => void
  onClose: () => void
  monthPickerTitle?: string
  monthPickerHint?: string
}) {
  if (!open) return null
  return (
    <MonthGridPicker
      open={open}
      monthKey={monthKey}
      onMonthChange={onMonthChange}
      onClose={onClose}
      {...(monthPickerTitle ? { monthPickerTitle } : {})}
      {...(monthPickerHint ? { monthPickerHint } : {})}
    />
  )
}

export function MonthGrid({
  monthKey,
  timezone,
  markersByDay,
  markerClassName,
  stackedMarkerKind = 'stacked',
  selectedDay,
  onDaySelect,
  onMonthChange,
  legend = [],
  legendHint,
  subtitle,
  weekdayLabels,
  compactWeekdayLabels = false,
  monthPickerTitle,
  monthPickerHint,
  ariaLabelForDay,
  markerDisplay = 'dots',
  maxVisiblePills = 2,
}: MonthGridProps) {
  const cells = buildMonthGrid(monthKey, timezone)
  const [pickerOpen, setPickerOpen] = useState(false)
  const resolvedWeekdayLabels = resolveWeekdayLabels(weekdayLabels, compactWeekdayLabels)

  return (
    <section>
      <MonthNavStrip
        monthKey={monthKey}
        onMonthChange={onMonthChange}
        onOpenPicker={() => setPickerOpen(true)}
      />
      {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
      <MonthGridBody
        monthKey={monthKey}
        cells={cells}
        timezone={timezone}
        markersByDay={markersByDay}
        selectedDay={selectedDay}
        stackedMarkerKind={stackedMarkerKind}
        markerClassName={markerClassName}
        markerDisplay={markerDisplay}
        maxVisiblePills={maxVisiblePills}
        legend={legend}
        legendHint={legendHint}
        weekdayLabels={resolvedWeekdayLabels}
        onDaySelect={onDaySelect}
        onMonthChange={onMonthChange}
        {...(ariaLabelForDay ? { ariaLabelForDay } : {})}
      />
      <MonthGridPickerOverlay
        open={pickerOpen}
        monthKey={monthKey}
        onMonthChange={onMonthChange}
        onClose={() => setPickerOpen(false)}
        {...(monthPickerTitle ? { monthPickerTitle } : {})}
        {...(monthPickerHint ? { monthPickerHint } : {})}
      />
    </section>
  )
}
