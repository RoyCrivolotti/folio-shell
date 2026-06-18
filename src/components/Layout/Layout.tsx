import type { ReactNode } from 'react'
import styles from './Layout.module.css'

interface LayoutProps {
  children: ReactNode
  /** When true, content is constrained to a single readable column. */
  centered?: boolean
  className?: string
}

/**
 * Full-viewport, vertically-centred page shell shared by the landing page and
 * the admin hub. Keeps both surfaces visually consistent and scroll-free on a
 * single screen.
 */
export function Layout({ children, centered = true, className }: LayoutProps) {
  const rootClass = [styles.root, className].filter(Boolean).join(' ')
  return (
    <main className={rootClass}>
      {centered ? <div className={styles.centered}>{children}</div> : children}
    </main>
  )
}
