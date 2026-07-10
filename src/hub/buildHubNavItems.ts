import type { HubNavItem } from '../components/HubMenu/HubMenuContext'
import { ChartIcon, HomeIcon, WalletIcon } from '../components/icons/icons'
import { getSiteUrls } from '../config/siteUrls'
import type { GroupGrants } from './accessGroups'
import { filterByGroupAccess, hasGroupGrant } from './accessGroups'
import { ADMIN_HUB_PAGES } from './hubResources'

const DEFAULT_STRATEGY = { href: '/strategy.html', label: 'Strategy' }

export type BuildHubNavOptions = {
  /** Admin-hub origin prefix. Empty on admin-hub; full URL base for satellite apps. */
  adminHubBase?: string
  /** Strategy link after constitution. Pass `null` to omit. Default: generic Strategy page. */
  strategy?: { href: string; label: string } | null
}

function resolveAdminHref(adminBase: string, path: string): string {
  return adminBase ? `${adminBase}${path}` : path
}

/** Cross-app hub menu in display order, filtered by group grants. */
export function buildHubNavItems(grants: GroupGrants, options: BuildHubNavOptions = {}): HubNavItem[] {
  const adminBase = (options.adminHubBase ?? '').replace(/\/$/, '')
  const hubHref = adminBase ? `${adminBase}/` : '/'
  const { expenses, oncall } = getSiteUrls()

  const items: HubNavItem[] = [{ href: hubHref, label: 'Hub', Icon: HomeIcon }]

  if (hasGroupGrant(grants, 'expenses')) {
    items.push({ href: expenses, label: 'Expense Tracker', Icon: WalletIcon })
  }
  if (hasGroupGrant(grants, 'oncall')) {
    items.push({ href: oncall, label: 'On-call pay', Icon: ChartIcon })
  }

  const strategy =
    options.strategy === undefined ? DEFAULT_STRATEGY : options.strategy
  const pages = filterByGroupAccess(ADMIN_HUB_PAGES, grants)

  for (const page of pages) {
    items.push({
      href: resolveAdminHref(adminBase, page.href),
      label: page.title,
      Icon: page.Icon,
    })
    if (page.id === 'constitution' && strategy && hasGroupGrant(grants, 'finance')) {
      items.push({
        href: resolveAdminHref(adminBase, strategy.href),
        label: strategy.label,
        Icon: ChartIcon,
      })
    }
  }

  return items
}
