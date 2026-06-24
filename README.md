# folio-shell

Shared React UI for multi-app personal sites: design tokens, layout primitives,
hub navigation shell, and icons.

GitHub repo: [RoyCrivolotti/folio-shell](https://github.com/RoyCrivolotti/folio-shell)  
(Old URLs `site-ui` and `folio-ui` redirect here after renames.)

Proprietary — see [LICENSE](./LICENSE). Source is public for transparency.

Consumed by `landing`, `admin-hub`, `expense-tracker`, and `oncall-tracker`:

```bash
npm install folio-shell
```

## Peer dependencies

`react` and `react-dom` (^19) are peer dependencies. Install them in the
consumer app if they are not already present:

```bash
npm install react react-dom folio-shell
```

## Usage

### Design tokens

Import once at app entry (before app CSS) so components can use `var(--…)`:

```tsx
// main.tsx
import 'folio-shell/theme/tokens.css'
```

Tokens define colours, spacing, typography, and light/dark scheme variables.
Apps add local CSS modules on top; do not redefine palette values outside
`tokens.css`.

### Layout

Full-viewport page shell for landing and hub surfaces:

```tsx
import { Layout } from 'folio-shell'

export function MyPage() {
  return (
    <Layout>
      <h1>Title</h1>
      <p>Content centred in a single column.</p>
    </Layout>
  )
}
```

Pass `centered={false}` for full-width content, or `className` for layout
tweaks (e.g. staging banner offset).

### Card

Tappable resource link for hub grids:

```tsx
import { Card, WalletIcon } from 'folio-shell'

<Card
  href="https://expenses.example.com"
  title="Expense Tracker"
  description="Budgets, transactions, and cash flow."
  icon={<WalletIcon />}
/>
```

Set `external` for links that open in a new tab.

### Hub menu

Cross-app navigation drawer. Wrap the page (or shell) in `HubMenuRoot`, place
one or more triggers, and pass hub destinations as `navItems`:

```tsx
import { HubMenuRoot, HubMenuTrigger, getSiteUrls, HomeIcon, WalletIcon } from 'folio-shell'
import type { HubNavItem } from 'folio-shell'

const navItems: HubNavItem[] = [
  { href: '/', label: 'Hub', Icon: HomeIcon },
  { href: getSiteUrls().expenses, label: 'Expenses', Icon: WalletIcon },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <HubMenuRoot anchor="inline" navItems={navItems}>
      <header>
        <HubMenuTrigger iconOnly />
        <h1>My app</h1>
      </header>
      {children}
    </HubMenuRoot>
  )
}
```

For fixed-position report pages, use `anchor="fixed"`, `triggerVariant="onLight"`,
and `HubMenuTriggerFixed` instead of inline triggers.

Hub menu shows **Sign out** by default (`/cdn-cgi/access/logout`). Pass
`logoutHref={null}` on public pages (e.g. landing).

### getSiteUrls()

Returns cross-app URLs from Vite env at build time:

```tsx
import { getSiteUrls } from 'folio-shell'

const { landing, adminHub, expenses, oncall } = getSiteUrls()
```

See [Environment variables](#environment-variables-consumers) below.

## Environment variables (consumers)

Hub cross-links read build-time Vite env:

| Variable | Purpose |
| --- | --- |
| `VITE_LANDING_URL` | Public landing URL |
| `VITE_ADMIN_HUB_URL` | Private admin hub URL |
| `VITE_EXPENSES_URL` | Expense tracker URL |
| `VITE_ONCALL_URL` | On-call tracker URL |
| `VITE_APP_ENV` | Set to `staging` on dev/staging builds (enables `StagingFrame` banner) |
| `VITE_STAGING_PRODUCTION_URL` | Production URL linked from the staging banner |

Commit `.env.production` in each consumer app so CI/production builds embed the
correct hub URLs. `getSiteUrls()` also has production fallbacks as a safety net.

Profile content and private-area links live in each app, not in this package.

## Release workflow

Publishing is automated when you create a **GitHub Release** (tag push → release
published). CI runs verify, then `npm publish` via
[`.github/workflows/publish.yml`](./.github/workflows/publish.yml).

1. Change and verify here: `npm run verify`
2. Commit and push to `main`
3. Tag and push: `git tag v1.x.y && git push origin v1.x.y`
4. Create a GitHub Release for that tag (Publish release). CI publishes to npm.
5. Bump `"folio-shell"` semver in consumer `package.json` files

**Manual fallback** (if CI publish fails or you need a one-off retry):

```bash
cd ~/Repos/personal/folio-shell
npm publish --access public
```

Requires `NPM_TOKEN` locally or an npm login with publish rights.

Current version: **1.0.4**

## Local development (sibling checkout)

From `~/Repos/personal`:

```bash
./link-folio-shell.sh
```

## Verify

```bash
npm run verify   # lint + typecheck + test
```

## License

Proprietary — see [LICENSE](./LICENSE). Source is public for transparency;
unauthorized copying, modification, or distribution is prohibited.
