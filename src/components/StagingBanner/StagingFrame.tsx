import type { ReactNode } from 'react'
import { StagingBanner } from './StagingBanner'
import styles from './StagingBanner.module.css'

interface StagingFrameProps {
  /** Production URL linked from the banner (not the staging hostname). */
  productionUrl: string
  children: ReactNode
  className?: string
}

/** Staging banner + top padding when `VITE_APP_ENV=staging`; passthrough otherwise. */
export function StagingFrame({ productionUrl, children, className }: StagingFrameProps) {
  if (import.meta.env.VITE_APP_ENV !== 'staging') return <>{children}</>

  const rootClass = className ? `${styles.withBanner} ${className}` : styles.withBanner
  return (
    <>
      <StagingBanner productionUrl={productionUrl} />
      <div className={rootClass}>{children}</div>
    </>
  )
}
