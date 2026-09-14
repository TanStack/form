---
'@tanstack/vue-form': patch
---

Fix: Field components registered through `createFormHook` now rerender when their field state changes and stay connected to the current field API after `form.reset()`
