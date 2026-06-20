import type { HubNavItem } from './HubMenuContext'
import styles from './HubMenu.module.css'

export function HubMenuNavList({ items }: { items: HubNavItem[] }) {
  return (
    <ul className={styles.list}>
      {items.map(({ href, label, Icon }) => (
        <li key={href}>
          <a href={href} className={styles.item}>
            <span className={styles.ico}>
              <Icon />
            </span>
            <span>{label}</span>
          </a>
        </li>
      ))}
    </ul>
  )
}

export function HubMenuLogoutFooter({ logoutHref }: { logoutHref: string }) {
  return (
    <div className={styles.footer}>
      <a href={logoutHref} className={styles.logout}>
        Sign out
      </a>
    </div>
  )
}
