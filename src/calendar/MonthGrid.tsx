import { useState } from 'react'
import { buildMonthGrid } from './calendarUtils'
import styles from './monthGrid.module.css'
import type { MonthGridProps } from './monthGridTypes'
import { MonthGridBody } from './MonthGridBody'
import { MonthGridPicker } from './MonthGridPicker'
import { MonthNavStrip } from './MonthNavStrip'

const DEFAULT_WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

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
  weekdayLabels = DEFAULT_WEEKDAYS,
  monthPickerTitle,
  monthPickerHint,
  ariaLabelForDay,
  markerDisplay = 'dots',
  maxVisiblePills = 2,
}: MonthGridProps) {
  const cells = buildMonthGrid(monthKey, timezone)
  const [pickerOpen, setPickerOpen] = useState(false)

  return (
    <section>
      <MonthNavStrip
        monthKey={monthKey}
        onMonthChange={onMonthChange}
        onOpenPicker={() => setPickerOpen(true)}
      />
      {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
      <MonthGridBody
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
        weekdayLabels={weekdayLabels}
        onDaySelect={onDaySelect}
        {...(ariaLabelForDay ? { ariaLabelForDay } : {})}
      />
      {pickerOpen ? (
        <MonthGridPicker
          open={pickerOpen}
          monthKey={monthKey}
          onMonthChange={onMonthChange}
          onClose={() => setPickerOpen(false)}
          {...(monthPickerTitle ? { monthPickerTitle } : {})}
          {...(monthPickerHint ? { monthPickerHint } : {})}
        />
      ) : null}
    </section>
  )
}
