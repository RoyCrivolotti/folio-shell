import { useId, useMemo, useRef, type CSSProperties } from 'react'
import { XIcon } from '../icons/icons'
import { filterNavItemsForPath, useHubMenuContext } from './HubMenuContext'
import type { HubMenuAnchor } from './HubMenuContext'
import { HUB_MENU_EXIT_MS, isStandaloneDisplay, useFocusTrap } from './hubMenuHooks'
import { HubMenuLogoutFooter, HubMenuNavList } from './HubMenuNavList'
import styles from './HubMenu.module.css'

/** `--hub-exit-ms` while the menu is leaving, so the CSS ends when the mount does. */
function exitStyle(leaving: boolean): CSSProperties | undefined {
  return leaving ? ({ '--hub-exit-ms': `${HUB_MENU_EXIT_MS}ms` } as CSSProperties) : undefined
}

function panelClassName(anchor: HubMenuAnchor, leaving: boolean): string {
  return [
    styles.panel,
    anchor === 'fixed' ? styles.panelFixed : styles.panelInline,
    isStandaloneDisplay() ? styles.panelStandalone : '',
    leaving ? styles.panelLeaving : '',
  ]
    .filter(Boolean)
    .join(' ')
}

export function HubMenuPanel({
  anchor,
  onClose,
  logoutHref,
  leaving = false,
}: {
  anchor: HubMenuAnchor
  onClose: () => void
  logoutHref: string | null
  /** The menu has been closed and is playing its exit. It takes no input meanwhile. */
  leaving?: boolean
}) {
  const { navItems } = useHubMenuContext()
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const pathname = typeof window !== 'undefined' ? window.location.pathname : ''
  const items = useMemo(
    () => filterNavItemsForPath(navItems, { origin, pathname }),
    [navItems, origin, pathname],
  )
  const titleId = useId()
  const panelRef = useRef<HTMLElement>(null)
  useFocusTrap(!leaving, panelRef)

  return (
    <>
      <div
        className={leaving ? `${styles.backdrop} ${styles.backdropLeaving}` : styles.backdrop}
        style={exitStyle(leaving)}
        onClick={onClose}
        aria-hidden="true"
      />
      <nav
        ref={panelRef}
        className={panelClassName(anchor, leaving)}
        style={exitStyle(leaving)}
        inert={leaving}
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
