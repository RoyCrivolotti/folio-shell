import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { formatDayTitle } from './calendarUtils'
import { DayDetailSheet } from './DayDetailSheet'

describe('formatDayTitle', () => {
  it('formats a calendar day key', () => {
    expect(formatDayTitle('2026-05-15')).toMatch(/15/)
    expect(formatDayTitle('2026-05-15')).toMatch(/May/)
    expect(formatDayTitle('2026-05-15')).toMatch(/2026/)
  })
})

describe('DayDetailSheet', () => {
  it('renders rows and calls onClick', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(
      <DayDetailSheet
        title="Friday 15 May 2026"
        rows={[{ id: '1', label: 'Macro', sublabel: '10:00', onClick: onSelect }]}
        onClose={() => {}}
      />,
    )

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /Macro/ }))
    expect(onSelect).toHaveBeenCalledOnce()
  })

  it('shows empty state and footer', () => {
    render(
      <DayDetailSheet
        title="Quiet day"
        rows={[]}
        emptyMessage="Nothing scheduled."
        onClose={() => {}}
        footer={<button type="button">Add</button>}
      />,
    )

    expect(screen.getByText('Nothing scheduled.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument()
  })
})
