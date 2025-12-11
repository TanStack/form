---
id: ValidationMeta
title: ValidationMeta
---

# Type Alias: ValidationMeta

```ts
type ValidationMeta = object;
```

Defined in: [packages/form-core/src/FormApi.ts:535](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L535)

An object representing the validation metadata for a field. Not intended for public usage.

## Properties

### lastAbortController

```ts
lastAbortController: AbortController;
```

Defined in: [packages/form-core/src/FormApi.ts:539](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L539)

An abort controller stored in memory to cancel previous async validation attempts.
