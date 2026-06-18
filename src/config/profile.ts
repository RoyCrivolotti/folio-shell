/**
 * Editable profile content for the public landing page. Update these values to
 * change what the card shows - no component changes required.
 */
export interface Profile {
  name: string
  tagline: string
  githubUrl: string
  linkedinUrl: string
}

export const profile: Profile = {
  name: 'Roy Crivolotti',
  tagline: 'Software Engineer',
  githubUrl: 'https://github.com/RoyCrivolotti',
  linkedinUrl: 'https://www.linkedin.com/in/roy-gabriel-crivolotti-53b448103',
}

/**
 * URL of the private admin area (a separate Cloudflare Pages project protected
 * by Cloudflare Access). Not a secret - Access enforces who can actually open
 * it. Override at build time with VITE_PRIVATE_URL.
 */
export const privateAreaUrl: string =
  import.meta.env.VITE_PRIVATE_URL ?? 'https://roy-admin.crivolotti.com'
