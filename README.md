# folio-shell

Shared React UI for multi-app personal sites: design tokens, layout primitives,
hub navigation shell, and icons.

Proprietary — see [LICENSE](./LICENSE). Source is public for transparency.

Consumed by `landing`, `admin-hub`, and `expense-tracker`:

```bash
npm install folio-shell
```

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
3. Publish from **this repo** (project `.npmrc` → public npm):

   ```bash
   cd ~/Repos/personal/folio-shell
   npm publish --access public
   ```

4. Bump `"folio-shell"` semver in consumer `package.json` files

Current version: **1.0.0**

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
