/** Profile strings only — safe to import from Node/vite.config (no import.meta). */
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
