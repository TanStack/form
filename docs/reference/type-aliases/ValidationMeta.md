---
id: ValidationMeta
title: ValidationMeta
---

```ts
type ValidationMeta = object;
```

Defined in: [packages/form-core/src/FormApi.ts:601](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L601)

An object representing the validation metadata for a field. Not intended for public usage.

## Properties

### lastAbortController

```ts
lastAbortController: AbortController;
```

Defined in: [packages/form-core/src/FormApi.ts:605](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L605)

An abort controller stored in memory to cancel previous async validation attempts.
