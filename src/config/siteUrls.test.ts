import { describe, expect, it } from 'vitest'
import { getSiteUrls } from './siteUrls'

describe('getSiteUrls', () => {
  it('includes oncall with default fallback', () => {
    const urls = getSiteUrls()
    expect(urls.oncall).toBe('https://oncall.crivolotti.com')
  })
})
