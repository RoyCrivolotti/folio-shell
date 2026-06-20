import styles from './StagingBanner.module.css'

interface StagingBannerProps {
  /** Production site URL linked from the banner. */
  productionUrl: string
}

/** Shown only on staging builds (`VITE_APP_ENV=staging`). */
export function StagingBanner({ productionUrl }: StagingBannerProps) {
  if (import.meta.env.VITE_APP_ENV !== 'staging') {
    return null
  }

  return (
    <div className={styles.banner} role="status">
      Staging — experiments only · not production ·{' '}
      <a href={productionUrl}>{productionUrl.replace(/^https?:\/\//, '')}</a>
    </div>
  )
}
