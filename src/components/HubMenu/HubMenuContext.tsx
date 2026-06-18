import '../../theme/tokens.css'
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ComponentType,
  type ReactNode,
  type SVGProps,
} from 'react'
import { XIcon } from '../icons/icons'
import styles from './HubMenu.module.css'

export type HubMenuAnchor = 'fixed' | 'inline'
/** `onLight` = dark icon on white report pages when the OS is in dark mode. */
export type HubMenuTriggerVariant = 'default' | 'onLight'

export interface HubNavItem {
  href: string
  label: string
  Icon: ComponentType<SVGProps<SVGSVGElement>>
}

interface HubMenuContextValue {
  open: boolean
  toggle: () => void
  close: () => void
  anchor: HubMenuAnchor
  triggerVariant: HubMenuTriggerVariant
  navItems: HubNavItem[]
}

const HubMenuContext = createContext<HubMenuContextValue | null>(null)

function useHubMenuContext(): HubMenuContextValue {
  const ctx = useContext(HubMenuContext)
  if (!ctx) throw new Error('HubMenu components must be used within HubMenuRoot')
  return ctx
}

/** Excludes the page the user is already on (matched by pathname or full URL). */
export function filterNavItemsForPath(items: HubNavItem[], pathname: string): HubNavItem[] {
  return items.filter((item) => {
    try {
      const url = new URL(item.href, window.location.origin)
      return url.pathname !== pathname
    } catch {
      return item.href !== pathname
    }
  })
}

function useMenuLock(open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])
}

function HubMenuPanel({ anchor, onClose }: { anchor: HubMenuAnchor; onClose: () => void }) {
  const { navItems } = useHubMenuContext()
  const path = typeof window !== 'undefined' ? window.location.pathname : ''
  const items = useMemo(() => filterNavItemsForPath(navItems, path), [navItems, path])
  const panelClass = anchor === 'fixed' ? styles.panelFixed : styles.panelInline

  return (
    <>
      <div className={styles.backdrop} onClick={onClose} aria-hidden="true" />
      <nav
        className={`${styles.panel} ${panelClass}`}
        aria-label="Site navigation"
        role="dialog"
        aria-modal="true"
      >
        <div className={styles.head}>
          <span className={styles.headLabel}>Navigate to</span>
          <button type="button" className={styles.close} onClick={onClose} aria-label="Close">
            <span className={styles.ico}>
              <XIcon />
            </span>
          </button>
        </div>
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
      </nav>
    </>
  )
}

export function HubMenuRoot({
  anchor,
  triggerVariant = 'default',
  navItems,
  children,
}: {
  anchor: HubMenuAnchor
  triggerVariant?: HubMenuTriggerVariant | undefined
  navItems: HubNavItem[]
  children: ReactNode
}) {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)
  const toggle = () => setOpen((v) => !v)
  useMenuLock(open, close)

  const value = useMemo(
    () => ({ open, toggle, close, anchor, triggerVariant, navItems }),
    [open, anchor, triggerVariant, navItems],
  )

  return (
    <HubMenuContext.Provider value={value}>
      {children}
      {open ? <HubMenuPanel anchor={anchor} onClose={close} /> : null}
    </HubMenuContext.Provider>
  )
}

export function HubMenuTrigger({
  className,
  iconOnly = false,
  label = 'Navigate',
}: {
  className?: string | undefined
  iconOnly?: boolean | undefined
  label?: string | undefined
}) {
  const { open, toggle, triggerVariant } = useHubMenuContext()
  const extra = className ?? ''
  const variantClass = triggerVariant === 'onLight' ? styles.triggerOnLight : ''
  const btnClass = iconOnly
    ? `${styles.triggerIcon} ${variantClass} ${extra}`.trim()
    : `${styles.triggerLabeled} ${variantClass} ${extra}`.trim()

  return (
    <button
      type="button"
      className={btnClass}
      onClick={toggle}
      aria-label={iconOnly ? 'Open navigation' : undefined}
      aria-expanded={open}
    >
      <span className={styles.menuGlyph} aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
      {!iconOnly && <span>{label}</span>}
    </button>
  )
}

/** Report pages: fixed trigger; wrap page content as children of HubMenuRoot. */
export function HubMenuTriggerFixed() {
  return <HubMenuTrigger className={styles.triggerFixed} iconOnly />
}
