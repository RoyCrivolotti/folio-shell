/**
 * Cross-app URLs for hub navigation. Set via Vite env in each consumer:
 * VITE_LANDING_URL, VITE_ADMIN_HUB_URL, VITE_EXPENSES_URL
 */
export interface SiteUrls {
  landing: string
  adminHub: string
  expenses: string
}

function siteUrl(value: string | undefined): string {
  return value?.trim() ?? ''
}

export function getSiteUrls(): SiteUrls {
  return {
    landing: siteUrl(import.meta.env.VITE_LANDING_URL),
    adminHub: siteUrl(import.meta.env.VITE_ADMIN_HUB_URL),
    expenses: siteUrl(import.meta.env.VITE_EXPENSES_URL),
  }
}
