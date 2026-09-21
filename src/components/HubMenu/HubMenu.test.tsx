import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock'
import { GitHubIcon } from '../icons/icons'
import { HubMenuRoot, HubMenuTrigger } from './HubMenuContext'
import type { HubNavItem } from './HubMenuContext'
import { HUB_MENU_EXIT_MS } from './hubMenuHooks'

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

  it('shows sign-out when logoutHref is set', async () => {
    const user = userEvent.setup()
    render(
      <HubMenuRoot anchor="inline" navItems={navItems} logoutHref="/cdn-cgi/access/logout">
        <HubMenuTrigger label="Menu" />
      </HubMenuRoot>,
    )
    await user.click(screen.getByRole('button', { name: 'Menu' }))
    expect(screen.getByRole('link', { name: 'Sign out' })).toHaveAttribute(
      'href',
      '/cdn-cgi/access/logout',
    )
  })

  it('hides sign-out when logoutHref is null', async () => {
    const user = userEvent.setup()
    render(
      <HubMenuRoot anchor="inline" navItems={navItems} logoutHref={null}>
        <HubMenuTrigger label="Menu" />
      </HubMenuRoot>,
    )
    await user.click(screen.getByRole('button', { name: 'Menu' }))
    expect(screen.queryByRole('link', { name: 'Sign out' })).not.toBeInTheDocument()
  })

  it('closes when Escape is pressed', async () => {
    const user = userEvent.setup()
    render(
      <HubMenuRoot anchor="inline" navItems={navItems}>
        <HubMenuTrigger label="Menu" />
      </HubMenuRoot>,
    )
    await user.click(screen.getByRole('button', { name: 'Menu' }))
    expect(screen.getByRole('dialog', { name: 'Navigate to' })).toBeInTheDocument()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog', { name: 'Navigate to' })).not.toBeInTheDocument()
  })

  it('keeps cross-origin links when pathname matches', async () => {
    const user = userEvent.setup()
    const crossApp: HubNavItem[] = [
      { href: 'https://other.test/', label: 'Hub', Icon: GitHubIcon },
      { href: '/', label: 'This app', Icon: GitHubIcon },
    ]
    window.history.pushState({}, '', '/')
    render(
      <HubMenuRoot anchor="inline" navItems={crossApp}>
        <HubMenuTrigger label="Menu" />
      </HubMenuRoot>,
    )
    await user.click(screen.getByRole('button', { name: 'Menu' }))
    expect(screen.getByRole('link', { name: 'Hub' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'This app' })).not.toBeInTheDocument()
  })

  it('leaves the page scrollable when it closes after another sheet released first', async () => {
    // A sheet is open, the menu opens on top, the sheet goes away, then the menu closes. With
    // independent locks the menu restored a body that was already pinned and the page stuck.
    const user = userEvent.setup()
    function Sheet() {
      useBodyScrollLock(true)
      return null
    }
    const tree = (withSheet: boolean) => (
      <HubMenuRoot anchor="inline" navItems={navItems}>
        <HubMenuTrigger label="Menu" />
        {withSheet ? <Sheet /> : null}
      </HubMenuRoot>
    )
    const { rerender } = render(tree(true))

    await user.click(screen.getByRole('button', { name: 'Menu' }))
    rerender(tree(false))
    await user.keyboard('{Escape}')

    expect(document.body.style.position).toBe('')
    expect(document.body.style.overflow).toBe('')
  })
})

describe('HubMenu leaving', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.stubGlobal('matchMedia', () => ({ matches: false }))
  })
  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  function openMenu() {
    render(
      <HubMenuRoot anchor="inline" navItems={navItems}>
        <HubMenuTrigger label="Menu" />
      </HubMenuRoot>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Menu' }))
    return document.querySelector<HTMLElement>('nav[aria-label="Site navigation"]')!
  }

  it('stays up for its exit after it is closed, takes no input, then goes', () => {
    const panel = openMenu()
    const backdrop = panel.previousElementSibling as HTMLElement
    expect(panel.hasAttribute('inert')).toBe(false)

    fireEvent.keyDown(document, { key: 'Escape' })

    expect(panel.isConnected).toBe(true)
    expect(panel.hasAttribute('inert')).toBe(true)
    expect(panel.className).toContain('panelLeaving')
    expect(backdrop.className).toContain('backdropLeaving')
    expect(panel.style.getPropertyValue('--hub-exit-ms')).toBe(`${HUB_MENU_EXIT_MS}ms`)
    expect(screen.getByRole('button', { name: 'Menu' })).toHaveAttribute('aria-expanded', 'false')

    act(() => {
      vi.advanceTimersByTime(HUB_MENU_EXIT_MS)
    })
    expect(panel.isConnected).toBe(false)
  })

  it('keeps scrolling off until it has gone, and lets the page go when it is', () => {
    const panel = openMenu()
    expect(document.documentElement.style.overflow).toBe('hidden')

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(document.documentElement.style.overflow).toBe('hidden')

    act(() => {
      vi.advanceTimersByTime(HUB_MENU_EXIT_MS)
    })
    expect(panel.isConnected).toBe(false)
    expect(document.documentElement.style.overflow).toBe('')
  })

  it('closes on the backdrop as well as on Escape', () => {
    const panel = openMenu()

    fireEvent.click(panel.previousElementSibling as HTMLElement)

    expect(panel.className).toContain('panelLeaving')
  })

  it('comes straight back if it is opened again while it is leaving', () => {
    const panel = openMenu()
    fireEvent.keyDown(document, { key: 'Escape' })

    fireEvent.click(screen.getByRole('button', { name: 'Menu' }))

    expect(panel.className).not.toContain('panelLeaving')
    expect(panel.hasAttribute('inert')).toBe(false)
    act(() => {
      vi.advanceTimersByTime(HUB_MENU_EXIT_MS * 2)
    })
    expect(panel.isConnected).toBe(true)
  })
})
