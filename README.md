# site-ui

Shared React UI for the personal site family: design tokens, layout primitives,
hub navigation shell, and profile content.

Consumed by `landing`, `admin-hub`, and `expense-tracker` via git dependency:

```json
"@crivolotti/site-ui": "github:RoyCrivolotti/site-ui#main"
```

Local development: `"file:../site-ui"` in the consuming app's `package.json`.

## Bump workflow

1. Tag a release on this repo (`v1.0.1`).
2. Update the dependency ref in each consuming app.
