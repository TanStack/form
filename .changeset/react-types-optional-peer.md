---
'@tanstack/react-form': patch
'@tanstack/react-form-devtools': patch
'@tanstack/react-form-nextjs': patch
'@tanstack/react-form-remix': patch
'@tanstack/react-form-start': patch
---

Declare `@types/react` as an optional peer dependency. The published type declarations import from `react`, so with install layouts where `@types/react` is not resolvable from the package's real path (such as pnpm's global virtual store), React types silently became `any`. Marking it optional keeps JavaScript consumers unaffected.
