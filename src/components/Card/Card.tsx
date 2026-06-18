import type { ReactNode } from 'react'
import styles from './Card.module.css'

interface CardProps {
  href: string
  title: string
  description: string
  icon?: ReactNode
  /** External links open in a new tab with safe rel attributes. */
  external?: boolean
}

/**
 * Tappable resource card used by the admin hub. The whole card is a single
 * link target with a generous hit area, which works well on touch screens.
 */
export function Card({ href, title, description, icon, external = false }: CardProps) {
  const externalProps = external ? { target: '_blank', rel: 'noopener noreferrer' } : {}

  return (
    <a className={styles.card} href={href} {...externalProps}>
      {icon ? (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <span className={styles.body}>
        <span className={styles.title}>{title}</span>
        <span className={styles.description}>{description}</span>
      </span>
    </a>
  )
}
