# @tanstack/form-core

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
