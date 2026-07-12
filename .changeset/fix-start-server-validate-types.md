---
'@tanstack/react-form-start': patch
---

Fix `createServerValidate` second parameter type to use `FormDataInfo` instead of `Parameters<typeof decode>[1]`, matching `@tanstack/react-form-nextjs` and fixing TypeScript errors when passing `booleans`, `dates`, etc.

Fixes #2239
