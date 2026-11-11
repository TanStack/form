---
'@tanstack/react-form': patch
'@tanstack/preact-form': patch
---

Rerender `ArrayField` when the array's own errors change, so an array-level validator error shows without a change to the array's length.
