---
'@tanstack/vue-form': patch
---

Generate the default `formId` with Vue's `useId` so it is SSR-safe, falling back to a random uuid on `vue@3.4` (where `useId` does not exist) and outside of a component instance.

Fixes #2254
