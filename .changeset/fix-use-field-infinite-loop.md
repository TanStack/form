---
'@tanstack/react-form': patch
---

Fixed infinite re-render loop caused by `useField` running `fieldApi.update(opts)` in a layout effect with no dependency array. Now assigns options directly during render instead, matching the existing comment that this should behave "like a useRef".
