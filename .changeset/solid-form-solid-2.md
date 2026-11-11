---
'@tanstack/solid-form': patch
---

BREAKING: `@tanstack/solid-form` now targets Solid 2 and no longer supports Solid 1.

Migration:

- upgrade to Solid 2 (`solid-js` and `@solidjs/web` 2.0)
- import `render` and JSX types from `@solidjs/web` instead of `solid-js/web`
- `useSelector` and `useStore` are now exported by `@tanstack/solid-form` itself, which no longer depends on `@tanstack/solid-store`
