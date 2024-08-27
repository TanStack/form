---
id: ValidationMeta
title: ValidationMeta
---

# Type Alias: ValidationMeta

```ts
type ValidationMeta: object;
```

An object representing the validation metadata for a field. Not intended for public usage.

## Type declaration

### lastAbortController

```ts
lastAbortController: AbortController;
```

An abort controller stored in memory to cancel previous async validation attempts.

## Defined in

[packages/form-core/src/FormApi.ts:185](https://github.com/TanStack/form/blob/eae56e9e6061dd35d01d0534f88a027f3f957e7f/packages/form-core/src/FormApi.ts#L185)
