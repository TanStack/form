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

[packages/form-core/src/FormApi.ts:168](https://github.com/TanStack/form/blob/782e82ea1fb36627b62d0f588484b4a9c3249fed/packages/form-core/src/FormApi.ts#L168)
