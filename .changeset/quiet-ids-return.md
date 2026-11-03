---
'@tanstack/react-form': patch
'@tanstack/preact-form': patch
---

Fix an infinite render loop in `useForm` and `useAppForm` when `formId` changes from a defined value to `undefined`. The form now falls back to its generated `formId` instead.
