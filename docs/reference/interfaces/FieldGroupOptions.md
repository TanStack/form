---
id: FieldGroupOptions
title: FieldGroupOptions
---

# Interface: FieldGroupOptions\<TFormData, TFieldGroupData, TFields, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TOnServer, TSubmitMeta\>

Defined in: [packages/form-core/src/FieldGroupApi.ts:49](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldGroupApi.ts#L49)

An object representing the options for a field group.

## Type Parameters

### TFormData

`TFormData`

### TFieldGroupData

`TFieldGroupData`

### TFields

`TFields` *extends* 
  \| [`DeepKeysOfType`](../type-aliases/DeepKeysOfType.md)\<`TFormData`, `TFieldGroupData` \| `null` \| `undefined`\>
  \| [`FieldsMap`](../type-aliases/FieldsMap.md)\<`TFormData`, `TFieldGroupData`\>

### TOnMount

`TOnMount` *extends* `undefined` \| `FormValidateOrFn`\<`TFormData`\>

### TOnChange

`TOnChange` *extends* `undefined` \| `FormValidateOrFn`\<`TFormData`\>

### TOnChangeAsync

`TOnChangeAsync` *extends* `undefined` \| `FormAsyncValidateOrFn`\<`TFormData`\>

### TOnBlur

`TOnBlur` *extends* `undefined` \| `FormValidateOrFn`\<`TFormData`\>

### TOnBlurAsync

`TOnBlurAsync` *extends* `undefined` \| `FormAsyncValidateOrFn`\<`TFormData`\>

### TOnSubmit

`TOnSubmit` *extends* `undefined` \| `FormValidateOrFn`\<`TFormData`\>

### TOnSubmitAsync

`TOnSubmitAsync` *extends* `undefined` \| `FormAsyncValidateOrFn`\<`TFormData`\>

### TOnDynamic

`TOnDynamic` *extends* `undefined` \| `FormValidateOrFn`\<`TFormData`\>

### TOnDynamicAsync

`TOnDynamicAsync` *extends* `undefined` \| `FormAsyncValidateOrFn`\<`TFormData`\>

### TOnServer

`TOnServer` *extends* `undefined` \| `FormAsyncValidateOrFn`\<`TFormData`\>

### TSubmitMeta

`TSubmitMeta` = `never`

## Properties

### defaultValues?

```ts
optional defaultValues: TFieldGroupData;
```

Defined in: [packages/form-core/src/FieldGroupApi.ts:105](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldGroupApi.ts#L105)

The expected subsetValues that the form must provide.

***

### fields

```ts
fields: TFields;
```

Defined in: [packages/form-core/src/FieldGroupApi.ts:101](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldGroupApi.ts#L101)

The path to the field group data.

***

### form

```ts
form: 
  | FormApi<TFormData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TOnServer, TSubmitMeta>
| FieldGroupApi<any, TFormData, any, any, any, any, any, any, any, any, any, any, any, TSubmitMeta>;
```

Defined in: [packages/form-core/src/FieldGroupApi.ts:67](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldGroupApi.ts#L67)

***

### onSubmitMeta?

```ts
optional onSubmitMeta: TSubmitMeta;
```

Defined in: [packages/form-core/src/FieldGroupApi.ts:109](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldGroupApi.ts#L109)

onSubmitMeta, the data passed from the handleSubmit handler, to the onSubmit function props
