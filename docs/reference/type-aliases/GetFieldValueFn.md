---
id: GetFieldValueFn
title: GetFieldValueFn
---

# Type Alias: GetFieldValueFn()\<TFormData\>

```ts
type GetFieldValueFn<TFormData> = <TDeepKeys>(DeepKeys) => DeepValue<TFormData, TDeepKeys>;
```

Defined in: [FormApi/FormApiFieldMethods.types.public.ts:12](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormApi/FormApiFieldMethods.types.public.ts#L12)

## Type Parameters

### TFormData

`TFormData`

## Type Parameters

### TDeepKeys

`TDeepKeys` *extends* [`DeepKeys`](DeepKeys.md)\<`TFormData`\>

## Parameters

### DeepKeys

`TDeepKeys`

## Returns

[`DeepValue`](DeepValue.md)\<`TFormData`, `TDeepKeys`\>
