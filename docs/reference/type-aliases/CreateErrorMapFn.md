---
id: CreateErrorMapFn
title: CreateErrorMapFn
---

```ts
type CreateErrorMapFn<TFormData> = (initial?) => ValidationErrorMapHelper<TFormData>;
```

Defined in: [validation/results/results.public.ts:139](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation/results/results.public.ts#L139)

## Type Parameters

### TFormData

`TFormData`

## Parameters

### initial?

`Partial`\<[`ValidationErrorMap`](../interfaces/ValidationErrorMap.md)\<`TFormData`, [`ValidationFailure`](ValidationFailure.md), [`ValidationFailure`](ValidationFailure.md)\>\>

## Returns

[`ValidationErrorMapHelper`](../interfaces/ValidationErrorMapHelper.md)\<`TFormData`\>
