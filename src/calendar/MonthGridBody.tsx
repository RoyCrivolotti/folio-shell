import { useCallback } from 'react'
import { CalendarLegend } from './CalendarLegend'
import { shiftMonthKey } from './calendarUtils'
import styles from './monthGrid.module.css'
import type { MonthDayMarkers, MonthGridLegendItem } from './monthGridTypes'
import { MonthGridCells } from './MonthGridCells'
import { resolveMonthDayMarkers } from './resolveMonthDayMarkers'
import { useMonthSwipe } from './useMonthSwipe'

function useMonthGridSwipe(monthKey: string, onMonthChange: (monthKey: string) => void) {
  const goPrev = useCallback(
    () => onMonthChange(shiftMonthKey(monthKey, -1)),
    [monthKey, onMonthChange],
  )
  const goNext = useCallback(
    () => onMonthChange(shiftMonthKey(monthKey, 1)),
    [monthKey, onMonthChange],
  )
  return useMonthSwipe({ onPrevMonth: goPrev, onNextMonth: goNext })
}

export function MonthGridBody({
  monthKey,
  cells,
  timezone,
  markersByDay,
  selectedDay,
  stackedMarkerKind,
  markerClassName,
  markerDisplay,
  maxVisiblePills,
  legend,
  legendHint,
  weekdayLabels,
  onDaySelect,
  onMonthChange,
  ariaLabelForDay,
}: {
  monthKey: string
  cells: (string | null)[]
  timezone: string
  markersByDay: ReadonlyMap<string, MonthDayMarkers> | Record<string, MonthDayMarkers>
  selectedDay: string | null
  stackedMarkerKind: string
  markerClassName: (kind: string) => string
  markerDisplay: 'dots' | 'pills'
  maxVisiblePills: number
  legend: MonthGridLegendItem[]
  legendHint?: React.ReactNode
  weekdayLabels: string[]
  onDaySelect: (dayKey: string) => void
  onMonthChange: (monthKey: string) => void
  ariaLabelForDay?: (dayKey: string, markers: MonthDayMarkers) => string
}) {
  const { zoneRef, pointerHandlers } = useMonthGridSwipe(monthKey, onMonthChange)

  return (
    <div ref={zoneRef} className={styles.swipeZone} {...pointerHandlers}>
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
        markerDisplay={markerDisplay}
        maxVisiblePills={maxVisiblePills}
        onDaySelect={onDaySelect}
        resolveMarkers={resolveMonthDayMarkers}
        {...(ariaLabelForDay ? { ariaLabelForDay } : {})}
      />
    </div>
  )
}
