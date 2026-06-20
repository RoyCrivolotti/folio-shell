import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ComponentType,
  type ReactNode,
  type SVGProps,
} from 'react'
import { cloudflareAccessLogoutUrl } from '../../auth/cloudflareAccessLogout'
import { useMenuLock } from './hubMenuHooks'
import { HubMenuPanel } from './HubMenuPanel'
import styles from './HubMenu.module.css'

export type HubMenuAnchor = 'fixed' | 'inline'
/** `onLight` = dark icon on white report pages when the OS is in dark mode. */
export type HubMenuTriggerVariant = 'default' | 'onLight'

export interface HubNavItem {
  href: string
  label: string
  Icon: ComponentType<SVGProps<SVGSVGElement>>
}

export interface HubMenuContextValue {
  open: boolean
  toggle: () => void
  close: () => void
  anchor: HubMenuAnchor
  triggerVariant: HubMenuTriggerVariant
  navItems: HubNavItem[]
  logoutHref: string | null
}

export const HubMenuContext = createContext<HubMenuContextValue | null>(null)

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

export function useHubMenuContext(): HubMenuContextValue {
  const ctx = useContext(HubMenuContext)
  if (!ctx) throw new Error('HubMenu components must be used within HubMenuRoot')
  return ctx
}

function resolveLogoutHref(logoutHref: string | null | undefined): string | null {
  if (logoutHref === undefined) return cloudflareAccessLogoutUrl()
  return logoutHref
}

export function HubMenuRoot({
  anchor,
  triggerVariant = 'default',
  navItems,
  logoutHref,
  children,
}: {
  anchor: HubMenuAnchor
  triggerVariant?: HubMenuTriggerVariant | undefined
  navItems: HubNavItem[]
  /** Pass `null` to hide sign-out (e.g. public landing). Default: Cloudflare Access logout. */
  logoutHref?: string | null | undefined
  children: ReactNode
}) {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)
  const toggle = () => setOpen((v) => !v)
  useMenuLock(open, close)

  const resolvedLogout = resolveLogoutHref(logoutHref)

  const value = useMemo(
    () => ({ open, toggle, close, anchor, triggerVariant, navItems, logoutHref: resolvedLogout }),
    [open, anchor, triggerVariant, navItems, resolvedLogout],
  )

  return (
    <HubMenuContext.Provider value={value}>
      {children}
      {open ? <HubMenuPanel anchor={anchor} onClose={close} logoutHref={resolvedLogout} /> : null}
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
