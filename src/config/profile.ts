/**
 * Editable profile content for the public landing page. Update these values to
 * change what the card shows - no component changes required.
 */
export type { Profile } from './profileData'
export { profile } from './profileData'

export { getProfileDocumentMeta } from './profileMeta'

/**
 * URL of the private admin area (a separate Cloudflare Pages project protected
 * by Cloudflare Access). Not a secret - Access enforces who can actually open
 * it. Override at build time with VITE_PRIVATE_URL.
 */
export const privateAreaUrl: string =
  import.meta.env.VITE_PRIVATE_URL ?? 'https://roy-admin.crivolotti.com'
