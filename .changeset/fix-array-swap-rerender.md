---
'@tanstack/react-form': patch
---

fix(react-form): re-render mode="array" fields after swapValues/moveValue

When `swapValues` or `moveValue` was called on a `mode="array"` field, the
array field did not re-render because the array length didn't change and the
selector only tracked length (to avoid re-renders on child property changes,
see #1925).

The fix introduces a small version counter via `useReducer` that bumps
whenever `swapValues` or `moveValue` is called. This forces a re-render so
the displayed item order stays in sync with the form state.

Fixes #2018
