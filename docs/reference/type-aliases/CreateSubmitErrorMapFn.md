---
id: CreateSubmitErrorMapFn
title: CreateSubmitErrorMapFn
---

```ts
type CreateSubmitErrorMapFn<TFormData> = (initial?) => ValidationErrorMap<TFormData> & OnSubmitError<ValidationErrorMap<TFormData>>;
```

Defined in: [FormApi/FormApi.public.ts:66](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L66)

## Type Parameters

### TFormData

`TFormData`

## Parameters

### initial?

`Partial`\<[`ValidationErrorMap`](../interfaces/ValidationErrorMap.md)\<`TFormData`\>\>

## Returns

[`ValidationErrorMap`](../interfaces/ValidationErrorMap.md)\<`TFormData`\> & [`OnSubmitError`](OnSubmitError.md)\<[`ValidationErrorMap`](../interfaces/ValidationErrorMap.md)\<`TFormData`\>\>
