---
id: InferredErrorMapItem
title: InferredErrorMapItem
---

```ts
type InferredErrorMapItem<TError> = [ErrorMapItem<TError>] extends [never] ? ValidationFailureItem : ErrorMapItem<TError>;
```

Defined in: [validation/state.public.ts:106](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation/state.public.ts#L106)

## Type Parameters

### TError

`TError`
