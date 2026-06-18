/**
 * Cross-app URLs for hub navigation and deep links. Override at build time via
 * Vite env vars when deploying staging or alternate hostnames.
 */
export interface SiteUrls {
  landing: string
  adminHub: string
  expenses: string
}

export function getSiteUrls(): SiteUrls {
  return {
    landing: import.meta.env.VITE_LANDING_URL ?? 'https://roy.crivolotti.com',
    adminHub: import.meta.env.VITE_ADMIN_HUB_URL ?? 'https://roy-admin.crivolotti.com',
    expenses: import.meta.env.VITE_EXPENSES_URL ?? 'https://expenses.crivolotti.com',
  }
}
