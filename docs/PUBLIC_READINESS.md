# Public release checklist

The **folio-ui** repo is safe to publish. It contains shared React UI only — no
expense data, allowlists, investing documents, or deploy credentials.

## Safe in git

- Design tokens, layout, Card, HubMenu, icons, StagingBanner
- Cloudflare Access sign-out helper (`/cdn-cgi/access/logout`)
- Tests and CI workflows

## Never belonged here (removed)

| Item | Status |
| --- | --- |
| Profile name / social links | Moved to `landing` and `admin-hub` (v1.1.0) |
| Hardcoded `*.crivolotti.com` URL defaults | Removed; consumers set `VITE_*_URL` |
| Monorepo private content paths | Not tracked; `.gitignore` trimmed |

## History notes

Older commits (before v1.1.0) included **public landing profile strings** and
site URL defaults — the same metadata already on roy.crivolotti.com. No real
email allowlists, API keys, or financial figures appear in history.

Spot-check before trusting a fork:

```bash
git log --all -S '@gmail.com' --oneline          # expect empty
git log --all -S 'allowed-emails' --oneline      # expect empty
git log --all -S 'client_secret_' --oneline      # .gitignore only
git ls-files | rg -i 'private|secret|content'    # expect empty
```

## npm

Package name: **`@crivolotti/folio-ui`** (unscoped `folio-ui` on npm is a
different project). Publish requires `NPM_TOKEN` on the repo — see README.
