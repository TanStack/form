---
id: InferredErrorMapItem
title: InferredErrorMapItem
---

```ts
type InferredErrorMapItem<TError> = [ErrorMapItem<TError>] extends [never] ? ValidationFailureItem : ErrorMapItem<TError>;
```

Defined in: [validation/results/results.public.ts:133](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation/results/results.public.ts#L133)

## Type Parameters

### TError

`TError`
