/** Landing `<head>` meta — no import.meta (safe to import from vite.config). */
import { profile } from './profileData'

const LANDING_URL = 'https://roy.crivolotti.com/'

export function getProfileDocumentMeta(): {
  title: string
  description: string
  canonical: string
} {
  return {
    title: profile.name,
    description: profile.tagline,
    canonical: LANDING_URL,
  }
}
