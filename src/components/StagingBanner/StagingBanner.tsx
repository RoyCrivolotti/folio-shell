import styles from './StagingBanner.module.css'

/** Shown only on roy-dev builds (`VITE_APP_ENV=staging`). */
export function StagingBanner() {
  if (import.meta.env.VITE_APP_ENV !== 'staging') {
    return null
  }

  return (
    <div className={styles.banner} role="status">
      Staging — experiments only · not production ·{' '}
      <a href="https://roy.crivolotti.com">roy.crivolotti.com</a>
    </div>
  )
}
