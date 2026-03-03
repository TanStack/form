---
"@tanstack/solid-form": patch
---

Fix props passed to `withForm` and `withFieldGroup` not being reactive.

Object spread (`{ ...props, ...innerProps }`) was eagerly evaluating SolidJS reactive getters, producing a static snapshot that broke signal tracking. Replaced with `mergeProps()` to preserve getter descriptors and `createComponent()` to maintain the correct reactive context.
