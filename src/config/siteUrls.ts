/**
 * Cross-app URLs for hub navigation. Set via Vite env in each consumer:
 * VITE_LANDING_URL, VITE_ADMIN_HUB_URL, VITE_EXPENSES_URL
 */
export interface SiteUrls {
  landing: string
  adminHub: string
  expenses: string
}

function siteUrl(value: string | undefined, fallback: string): string {
  const trimmed = value?.trim()
  return trimmed && trimmed.length > 0 ? trimmed : fallback
}

export function getSiteUrls(): SiteUrls {
  return {
    landing: siteUrl(import.meta.env.VITE_LANDING_URL, 'https://roy.crivolotti.com'),
    adminHub: siteUrl(import.meta.env.VITE_ADMIN_HUB_URL, 'https://roy-admin.crivolotti.com'),
    expenses: siteUrl(import.meta.env.VITE_EXPENSES_URL, 'https://expenses.crivolotti.com'),
  }
}
