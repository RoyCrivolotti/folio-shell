import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { GitHubIcon } from '../icons/icons'
import { HubMenuRoot, HubMenuTrigger } from './HubMenuContext'
import type { HubNavItem } from './HubMenuContext'

const navItems: HubNavItem[] = [
  { href: '/admin', label: 'Admin', Icon: GitHubIcon },
  { href: 'https://example.com', label: 'Example', Icon: GitHubIcon },
]

describe('HubMenu', () => {
  it('opens the dialog and exposes aria-expanded on the trigger', async () => {
    const user = userEvent.setup()
    render(
      <HubMenuRoot anchor="inline" navItems={navItems}>
        <HubMenuTrigger label="Menu" />
      </HubMenuRoot>,
    )

    const trigger = screen.getByRole('button', { name: 'Menu' })
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await user.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('dialog', { name: 'Navigate to' })).toBeInTheDocument()
  })

  it('filters out the current pathname from nav items', async () => {
    const user = userEvent.setup()
    window.history.pushState({}, '', '/admin')
    render(
      <HubMenuRoot anchor="inline" navItems={navItems}>
        <HubMenuTrigger label="Menu" />
      </HubMenuRoot>,
    )
    await user.click(screen.getByRole('button', { name: 'Menu' }))
    expect(screen.queryByRole('link', { name: 'Admin' })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Example' })).toBeInTheDocument()
  })
})
