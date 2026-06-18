import '../../theme/tokens.css'
import {
  createContext,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ComponentType,
  type RefObject,
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

type NavLocation = Pick<Location, 'origin' | 'pathname'>

/** Excludes the page the user is already on (origin + pathname, not pathname alone). */
export function filterNavItemsForPath(items: HubNavItem[], location: NavLocation): HubNavItem[] {
  return items.filter((item) => {
    try {
      const url = new URL(item.href, location.origin)
      return url.origin !== location.origin || url.pathname !== location.pathname
    } catch {
      return item.href !== location.pathname
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

function useFocusTrap(active: boolean, containerRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!active) return
    const root = containerRef.current
    if (!root) return
    const focusables = root.querySelectorAll<HTMLElement>(
      'button, a[href], [tabindex]:not([tabindex="-1"])',
    )
    if (focusables.length === 0) return
    const first = focusables[0]
    const last = focusables[focusables.length - 1]
    if (!first || !last) return
    first.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    root.addEventListener('keydown', onKey)
    return () => root.removeEventListener('keydown', onKey)
  }, [active, containerRef])
}

function HubMenuPanel({ anchor, onClose }: { anchor: HubMenuAnchor; onClose: () => void }) {
  const { navItems } = useHubMenuContext()
  const location: NavLocation =
    typeof window !== 'undefined' ? window.location : { origin: '', pathname: '' }
  const items = useMemo(
    () => filterNavItemsForPath(navItems, location),
    [navItems, location.origin, location.pathname],
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
