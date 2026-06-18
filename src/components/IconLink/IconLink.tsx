import type { ReactNode } from 'react'
import styles from './IconLink.module.css'

interface IconLinkProps {
  href: string
  label: string
  icon: ReactNode
  /** External links open in a new tab with safe rel attributes. */
  external?: boolean
}

/**
 * Accessible labelled link with a leading icon. Used for the landing page's
 * social links and the admin resource cards. External links get
 * rel="noopener noreferrer" and open in a new tab.
 */
export function IconLink({ href, label, icon, external = false }: IconLinkProps) {
  const externalProps = external ? { target: '_blank', rel: 'noopener noreferrer' } : {}

  return (
    <a className={styles.link} href={href} {...externalProps}>
      <span className={styles.icon} aria-hidden="true">
        {icon}
      </span>
      <span className={styles.label}>{label}</span>
    </a>
  )
}
