import { useId, useMemo, useRef } from 'react'
import { XIcon } from '../icons/icons'
import { filterNavItemsForPath, useHubMenuContext } from './HubMenuContext'
import type { HubMenuAnchor } from './HubMenuContext'
import { useFocusTrap } from './hubMenuHooks'
import { HubMenuLogoutFooter, HubMenuNavList } from './HubMenuNavList'
import styles from './HubMenu.module.css'

export function HubMenuPanel({
  anchor,
  onClose,
  logoutHref,
}: {
  anchor: HubMenuAnchor
  onClose: () => void
  logoutHref: string | null
}) {
  const { navItems } = useHubMenuContext()
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const pathname = typeof window !== 'undefined' ? window.location.pathname : ''
  const items = useMemo(
    () => filterNavItemsForPath(navItems, { origin, pathname }),
    [navItems, origin, pathname],
  )
  const panelClass = anchor === 'fixed' ? styles.panelFixed : styles.panelInline
  const titleId = useId()
  const panelRef = useRef<HTMLElement>(null)
  useFocusTrap(true, panelRef)

  return (
    <>
      <div className={styles.backdrop} onClick={onClose} aria-hidden="true" />
      <nav
        ref={panelRef}
        className={`${styles.panel} ${panelClass}`}
        aria-label="Site navigation"
        aria-labelledby={titleId}
        role="dialog"
        aria-modal="true"
      >
        <div className={styles.head}>
          <span id={titleId} className={styles.headLabel}>
            Navigate to
          </span>
          <button type="button" className={styles.close} onClick={onClose} aria-label="Close">
            <span className={styles.ico}>
              <XIcon />
            </span>
          </button>
        </div>
        <HubMenuNavList items={items} />
        {logoutHref ? <HubMenuLogoutFooter logoutHref={logoutHref} /> : null}
      </nav>
    </>
  )
}
