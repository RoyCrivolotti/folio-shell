import { describe, expect, it } from 'vitest'
import { cloudflareAccessLogoutUrl } from './cloudflareAccessLogout'

describe('cloudflareAccessLogoutUrl', () => {
  it('returns the logout path without window', () => {
    expect(cloudflareAccessLogoutUrl()).toBe('/cdn-cgi/access/logout')
  })

  it('appends redirect_url when provided without window', () => {
    expect(cloudflareAccessLogoutUrl('https://example.com/')).toBe(
      '/cdn-cgi/access/logout?redirect_url=https%3A%2F%2Fexample.com%2F',
    )
  })
})
