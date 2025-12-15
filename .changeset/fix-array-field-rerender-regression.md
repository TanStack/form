---
'@tanstack/react-form': patch
---

fix(react-form): prevent array field re-render when child property changes

Array fields with `mode="array"` were incorrectly re-rendering when a property on any array element was mutated. This was a regression introduced in v1.27.0 by the React Compiler compatibility changes.

The fix ensures that `mode="array"` fields only re-render when the array length changes (items added/removed), not when individual item properties are modified.

Fixes #1925
