# @tanstack/form-core

## 1.27.7

### Patch Changes

- Fix double-rendering of Solid fields ([#1959](https://github.com/TanStack/form/pull/1959))

## 1.27.6

### Patch Changes

- fix(form-core): Prevent runtime errors during validation ([#1948](https://github.com/TanStack/form/pull/1948))

## 1.27.5

### Patch Changes

- fix(form-core): Resolve memory leaks for SSR / Devtools ([#1866](https://github.com/TanStack/form/pull/1866))

- Ensure dynamically rendered fields receive form validation errors ([#1691](https://github.com/TanStack/form/pull/1691))

## 1.27.4

### Patch Changes

- fix: prevent unnecessary re-renders when there are no async validators ([#1929](https://github.com/TanStack/form/pull/1929))

  Fields were re-rendering twice on each keystroke because `isValidating` was being set to `true` then `false` even when there were no async validators to run. This fix checks if there are actual async validators before toggling the `isValidating` state.

  Fixes #1130

## 1.27.3

### Patch Changes

- Bump TanStack pacer to pacer-lite for reduced custom event emissions. ([#1876](https://github.com/TanStack/form/pull/1876))

## 1.27.2

## 1.27.1

### Patch Changes

- Fix issues with methods not being present in React adapter ([#1903](https://github.com/TanStack/form/pull/1903))

## 1.27.0

### Patch Changes

- Fixed issues with React Compiler ([#1893](https://github.com/TanStack/form/pull/1893))

- Fix issue with deleteField and numeric keys ([#1891](https://github.com/TanStack/form/pull/1891))

## 1.26.0

### Patch Changes

- fix stale fields on array changes ([#1729](https://github.com/TanStack/form/pull/1729))
- allow explicitly setting `field.handleChange(undefined)` ([#1729](https://github.com/TanStack/form/pull/1729))

## 1.25.0

### Patch Changes

- Removes debug config from event client in form-core ([#1852](https://github.com/TanStack/form/pull/1852))

## 1.24.5

### Patch Changes

- - Make `fieldMeta` record type `Partial<>` to reflect runtime behaviour ([#1787](https://github.com/TanStack/form/pull/1787))

## 1.24.4

### Patch Changes

- Optimise event client emissions and minor layout tweaks ([#1758](https://github.com/TanStack/form/pull/1758))

## 1.24.3

### Patch Changes

- respect dontValidate option in formApi array modifiers ([#1775](https://github.com/TanStack/form/pull/1775))

## 1.24.2

### Patch Changes

- fix(form-core): prevent runtime errors when using `deleteField` ([#1706](https://github.com/TanStack/form/pull/1706))

## 1.24.1

### Patch Changes

- fix(form-core): call `onSubmitInvalid` even when `canSubmit` is false ([#1697](https://github.com/TanStack/form/pull/1697))

## 1.24.0

### Minor Changes

- Removes UUID from package.json for native environments. Reverts formId to a getter function. ([#1753](https://github.com/TanStack/form/pull/1753))

## 1.23.3

### Patch Changes

- Bump @tanstack/devtools-event-client to 0.3.2, patches side effects in event client. ([#1767](https://github.com/TanStack/form/pull/1767))

## 1.23.2

### Patch Changes

- fix(form-core): handle string array indices in prefixSchemaToErrors ([#1689](https://github.com/TanStack/form/pull/1689))

## 1.23.1

### Patch Changes

- bump to latest event client, for angular ssr ([#1761](https://github.com/TanStack/form/pull/1761))

## 1.23.0

### Minor Changes

- ssr, dayjs, uuid, version bump patch ([#1747](https://github.com/TanStack/form/pull/1747))

- Jumping v1.22.0 as it's incorrectly published, fixed adapter to core. ([#1749](https://github.com/TanStack/form/pull/1749))

## 1.22.0

### Minor Changes

- Bump core to match devtools, docs config update ([#1739](https://github.com/TanStack/form/pull/1739))
