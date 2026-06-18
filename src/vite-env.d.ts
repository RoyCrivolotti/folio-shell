/// <reference types="vite/client" />

declare module '*.module.css' {
  const classes: { readonly [key: string]: string }
  export default classes
}

interface ImportMetaEnv {
  readonly VITE_APP_ENV?: string
  readonly VITE_PRIVATE_URL?: string
  readonly VITE_LANDING_URL?: string
  readonly VITE_ADMIN_HUB_URL?: string
  readonly VITE_EXPENSES_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
