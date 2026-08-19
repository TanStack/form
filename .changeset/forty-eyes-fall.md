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

Refactor: Form option types are now no longer adapter-specific

Fix: `formOptions.looseSchema`/`strictSchema` now error on missing schema

Fix: `formOptions.looseSchema` now accepts optional `defaultValues` props
