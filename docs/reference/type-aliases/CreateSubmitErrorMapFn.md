---
id: CreateSubmitErrorMapFn
title: CreateSubmitErrorMapFn
---

```ts
type CreateSubmitErrorMapFn<TFormData> = (initial?) => CreatedSubmitErrorMap<TFormData, ValidationFailureItem[], ValidationFailure>;
```

Defined in: [FormApi/formSubmit.public.ts:88](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/formSubmit.public.ts#L88)

Builds a mutable error map to return from `onSubmit` and report validation errors.

## Type Parameters

### TFormData

`TFormData`

Library-managed. Do not specify explicitly.

## Parameters

### initial?

`Partial`\<[`ValidationErrorMap`](../interfaces/ValidationErrorMap.md)\<`TFormData`, [`ValidationFailure`](ValidationFailure.md), [`ValidationFailure`](ValidationFailure.md)\>\>

## Returns

[`CreatedSubmitErrorMap`](CreatedSubmitErrorMap.md)\<`TFormData`, [`ValidationFailureItem`](ValidationFailureItem.md)[], [`ValidationFailure`](ValidationFailure.md)\>
