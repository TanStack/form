---
id: CreateSubmitErrorMapFn
title: CreateSubmitErrorMapFn
---

```ts
type CreateSubmitErrorMapFn<TFormData> = (initial?) => CreatedSubmitErrorMap<TFormData>;
```

Defined in: [FormApi/formSubmit.public.ts:81](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/formSubmit.public.ts#L81)

Builds a mutable error map to return from `onSubmit` and report validation errors.

## Type Parameters

### TFormData

`TFormData`

Library-managed. Do not specify explicitly.

## Parameters

### initial?

`Partial`\<[`ValidationErrorMap`](../interfaces/ValidationErrorMap.md)\<`TFormData`, [`ValidationFailure`](ValidationFailure.md), [`ValidationFailure`](ValidationFailure.md)\>\>

## Returns

[`CreatedSubmitErrorMap`](CreatedSubmitErrorMap.md)\<`TFormData`\>
