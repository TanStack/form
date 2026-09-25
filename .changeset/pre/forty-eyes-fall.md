---
'@tanstack/angular-form': patch
'@tanstack/preact-form': patch
'@tanstack/svelte-form': patch
'@tanstack/react-form': patch
'@tanstack/solid-form': patch
'@tanstack/form-core': patch
'@tanstack/lit-form': patch
'@tanstack/vue-form': patch
---

Refactor: Adapter `formOptions`/`appFormOptions` no longer shim the core types and runtime.

BREAKING: `formOptions.looseSchema` and `formOptions.strictSchema` now require a schema as
first parameter. This locks down inference to get the best type safety out of it vs. the options object alone.

Fix: `formOptions.looseSchema` now allows `defaultValues` to omit properties instead of
requiring them to be explicitly undefined.
