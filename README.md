# folio-ui

Shared React UI for the personal site family: design tokens, layout primitives,
hub navigation shell, and icons.

Proprietary — see [LICENSE](./LICENSE). Source is public for transparency.

Consumed by `landing`, `admin-hub`, and `expense-tracker`:

```bash
npm install @crivolotti/folio-ui
```

The unscoped name `folio-ui` on npm is a different package — always use `@crivolotti/folio-ui`.

Until the package is on the npm registry, consumers pin the GitHub tag:

```json
"@crivolotti/folio-ui": "git+https://github.com/RoyCrivolotti/folio-ui.git#v1.1.0"
```

After publish (GitHub release + `NPM_TOKEN` secret), switch to `"^1.1.0"`.

## Environment variables (consumers)

Hub cross-links read build-time Vite env:

| Variable | Purpose |
| --- | --- |
| `VITE_LANDING_URL` | Public landing URL |
| `VITE_ADMIN_HUB_URL` | Private admin hub URL |
| `VITE_EXPENSES_URL` | Expense tracker URL |

Profile content and private-area links live in each app, not in this package.

## Cloudflare Access sign-out

Hub menu shows **Sign out** by default (`/cdn-cgi/access/logout`). Pass
`logoutHref={null}` on public pages (e.g. landing).

## Release workflow

1. Change and verify here: `npm run verify`
2. Commit, tag, and push: `git tag v1.x.y && git push origin v1.x.y`
3. Publish: `npm publish --access public`
4. Bump `"@crivolotti/folio-ui"` semver in consumer `package.json` files

Current version: **1.1.0**

## Local development (sibling checkout)

From `~/Repos/personal`:

```bash
./link-folio-ui.sh   # optional symlink for active library work
```

## Verify

```bash
npm run verify   # lint + typecheck + test
```
