import { describe, expect, it } from 'vitest'
import { ADMIN_HUB_PAGES } from './hubResources'
import { buildHubNavItems } from './buildHubNavItems'

const allGrants = { expenses: true, finance: true, legacy: true, oncall: true }

describe('ADMIN_HUB_PAGES', () => {
  it('has unique ids', () => {
    const ids = ADMIN_HUB_PAGES.map((page) => page.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('includes catalysts', () => {
    expect(ADMIN_HUB_PAGES.some((page) => page.id === 'catalysts')).toBe(true)
  })
})

describe('buildHubNavItems', () => {
  it('includes catalyst calendar when finance grant is true', () => {
    const items = buildHubNavItems(allGrants, { adminHubBase: 'https://admin.example' })
    expect(items.some((item) => item.label === 'Catalyst calendar')).toBe(true)
    expect(items.some((item) => item.href === 'https://admin.example/catalysts.html')).toBe(true)
  })

  it('omits finance pages without finance grant', () => {
    const items = buildHubNavItems(
      { expenses: true, finance: false, legacy: false, oncall: false },
      { adminHubBase: 'https://admin.example' },
    )
    expect(items.some((item) => item.label === 'Catalyst calendar')).toBe(false)
    expect(items.some((item) => item.label === 'Expense Tracker')).toBe(true)
  })

  it('uses custom strategy title when provided', () => {
    const items = buildHubNavItems(allGrants, {
      strategy: { href: '/strategy.html', label: 'Strategy Note — H2 2026' },
    })
    expect(items.some((item) => item.label === 'Strategy Note — H2 2026')).toBe(true)
  })

  it('uses root-relative hrefs on admin-hub origin', () => {
    const items = buildHubNavItems(allGrants)
    expect(items[0]?.href).toBe('/')
    expect(items.some((item) => item.href === '/catalysts.html')).toBe(true)
  })
})
