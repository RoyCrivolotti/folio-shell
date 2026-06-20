const LOGOUT_PATH = '/cdn-cgi/access/logout'

/** Cloudflare Access sign-out URL (relative to current origin). */
export function cloudflareAccessLogoutUrl(redirectUrl?: string): string {
  if (!redirectUrl) return LOGOUT_PATH
  return `${LOGOUT_PATH}?redirect_url=${encodeURIComponent(redirectUrl)}`
}
