import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { cappedDotDisplay } from './cappedDotDisplay'
import { MonthGrid } from './MonthGrid'
import { MonthNavStrip } from './MonthNavStrip'

const markerClass = (kind: string) => `marker-${kind}`

describe('cappedDotDisplay', () => {
  it('caps dots and reports overflow', () => {
    expect(cappedDotDisplay(4, 3)).toEqual({ dots: 3, overflow: 1 })
    expect(cappedDotDisplay(2, 3)).toEqual({ dots: 2, overflow: 0 })
  })
})

describe('MonthNavStrip', () => {
  it('steps months with prev and next', async () => {
    const user = userEvent.setup()
    const onMonthChange = vi.fn()
    render(
      <MonthNavStrip monthKey="2026-05" onMonthChange={onMonthChange} onOpenPicker={() => {}} />,
    )

    await user.click(screen.getByRole('button', { name: 'Previous month' }))
    expect(onMonthChange).toHaveBeenCalledWith('2026-04')

    await user.click(screen.getByRole('button', { name: 'Next month' }))
    expect(onMonthChange).toHaveBeenCalledWith('2026-06')
  })
})

describe('MonthGrid', () => {
  it('selects a day and opens month picker', async () => {
    const user = userEvent.setup()
    const onDaySelect = vi.fn()
    const onMonthChange = vi.fn()

    render(
      <MonthGrid
        monthKey="2026-05"
        timezone="UTC"
        markersByDay={new Map([['2026-05-15', { kinds: ['macro'], stackedCount: 2 }]])}
        markerClassName={markerClass}
        stackedMarkerKind="incident"
        selectedDay={null}
        onDaySelect={onDaySelect}
        onMonthChange={onMonthChange}
        legend={[{ kind: 'macro', label: 'Macro' }]}
      />,
    )

    expect(screen.getByText('Macro')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '2026-05-15' }))
    expect(onDaySelect).toHaveBeenCalledWith('2026-05-15')

    await user.click(screen.getByRole('button', { name: 'Choose month' }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })
})
