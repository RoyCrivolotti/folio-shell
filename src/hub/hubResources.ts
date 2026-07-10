import type { ComponentType, SVGProps } from 'react'
import { ArchiveIcon, BookIcon, ChartIcon, CompassIcon } from '../components/icons/icons'
import type { AccessGroupId } from './accessGroups'

/**
 * Canonical admin-hub pages for cross-app Hub menu navigation.
 * Add new pages here — expense-tracker and oncall-tracker pick them up automatically.
 */
export type AdminHubPage = {
  id: string
  title: string
  /** Root-relative path on the admin-hub origin. */
  href: string
  groupId: AccessGroupId
  Icon: ComponentType<SVGProps<SVGSVGElement>>
}

export const ADMIN_HUB_PAGES: AdminHubPage[] = [
  {
    id: 'constitution',
    title: 'Investment Constitution',
    href: '/constitution.html',
    groupId: 'finance',
    Icon: BookIcon,
  },
  {
    id: 'catalysts',
    title: 'Catalyst calendar',
    href: '/catalysts.html',
    groupId: 'finance',
    Icon: ChartIcon,
  },
  {
    id: 'primer',
    title: 'Investing Primer',
    href: '/primer.html',
    groupId: 'finance',
    Icon: CompassIcon,
  },
  {
    id: 'legacy',
    title: 'Legacy site (2019)',
    href: '/legacy/',
    groupId: 'legacy',
    Icon: ArchiveIcon,
  },
]
