# site-ui

Shared React UI for the personal site family: design tokens, layout primitives,
hub navigation shell, and profile content.

Consumed by `landing`, `admin-hub`, and `expense-tracker`.

## Local development

From the workspace root:

```bash
cd ~/Repos/personal
./link-site-ui.sh
npm install
```

Each app uses `"@crivolotti/site-ui": "file:./site-ui"` with the symlink created by
`link-site-ui.sh`.

## CI (consumers)

Deploy workflows check out this repo at a **pinned tag** into `./site-ui` before
`npm install`. Bump the tag in all three consumer workflows when releasing.

## Release / bump workflow

1. Change and verify here: `npm run verify`
2. Commit and tag: `git tag v1.0.x && git push origin v1.0.x`
3. Update `ref: v1.0.x` in the site-ui checkout step of:
   - `landing/.github/workflows/deploy.yml`
   - `admin-hub/.github/workflows/deploy.yml`
   - `expense-tracker/.github/workflows/deploy.yml`
4. Push each consumer repo (or verify locally with `link-site-ui.sh`)

Current pin: **v1.0.0**

## Verify

```bash
npm run verify   # lint + typecheck + test
```
