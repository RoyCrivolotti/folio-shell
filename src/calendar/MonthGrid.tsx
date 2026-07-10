import { useState } from 'react'
import { CalendarLegend } from './CalendarLegend'
import { buildMonthGrid } from './calendarUtils'
import styles from './monthGrid.module.css'
import type { MonthGridProps } from './monthGridTypes'
import { MonthGridCells } from './MonthGridCells'
import { MonthGridPicker } from './MonthGridPicker'
import { MonthNavStrip } from './MonthNavStrip'
import { resolveMonthDayMarkers } from './resolveMonthDayMarkers'

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
      <div className={styles.swipeZone}>
        <CalendarLegend legend={legend} legendHint={legendHint} markerClassName={markerClassName} />
        <div className={styles.weekdays}>
          {weekdayLabels.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
        <MonthGridCells
          cells={cells}
          timezone={timezone}
          markersByDay={markersByDay}
          selectedDay={selectedDay}
          stackedMarkerKind={stackedMarkerKind}
          markerClassName={markerClassName}
          onDaySelect={onDaySelect}
          resolveMarkers={resolveMonthDayMarkers}
          {...(ariaLabelForDay ? { ariaLabelForDay } : {})}
        />
      </div>
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
