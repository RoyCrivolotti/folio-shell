# Agent Guide — folio-shell

Shared design tokens, layout components, and navigation helpers for the crivolotti.com app suite.
This is a **public GitHub repository**. Never commit personal data, account IDs, or anything
that shouldn't be on the public internet permanently — including in git history.

## Branch protection

`main` is protected. All changes go through a pull request with the `verify` check passing.
Direct pushes are blocked, including for the repo owner.

## PR workflow

1. Branch off `main` with a descriptive name (e.g. `feat/hub-menu-highlight`, `fix/token-contrast`).
2. Run `npm run verify` locally before pushing.
3. Push and open a draft PR: `gh pr create --draft`.
4. Wait for the `verify` CI check to pass.
5. Mark ready and squash-merge: `gh pr ready <n> && gh pr merge <n> --squash --delete-branch`.
6. Return to main: `git checkout main && git pull`.

## Verify

`npm run verify` runs lint, typecheck, and tests. If it passes locally, CI will pass.

## Publishing

This is a shared npm package. After merging a change that consumers should pick up:

1. Tag the release: `git tag v1.x.y && git push origin v1.x.y`
2. Publish: `npm publish`
3. Bump the dependency in each consuming app repo.

Consumers pin a semver range in their `package.json`. Do not break that contract without
a major version bump.

## Public source

This repo has public GitHub source. Before adding anything to a tracked file, ask: would
this be fine on the public internet permanently? If not, gitignore it and commit a
placeholder/example version instead.
