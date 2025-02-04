---
id: ValidationMeta
title: ValidationMeta
---

# Type Alias: ValidationMeta

```ts
type ValidationMeta = object;
```

Defined in: [packages/form-core/src/FormApi.ts:229](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L229)

An object representing the validation metadata for a field. Not intended for public usage.

## Type declaration

### lastAbortController

```ts
lastAbortController: AbortController;
```

An abort controller stored in memory to cancel previous async validation attempts.
