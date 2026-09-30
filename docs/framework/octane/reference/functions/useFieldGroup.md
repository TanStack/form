---
id: useFieldGroup
title: useFieldGroup
---

```ts
function useFieldGroup<TFormData, TFieldGroupData, TFields, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TOnServer, TComponents, TFormComponents, TSubmitMeta>(opts): AppFieldExtendedOctaneFieldGroupApi<TFormData, TFieldGroupData, TFields, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TOnServer, TSubmitMeta, TComponents, TFormComponents>;
```

Defined in: [packages/octane-form/src/useFieldGroup.tsrx.d.ts:75](https://github.com/TanStack/form/blob/main/packages/octane-form/src/useFieldGroup.tsrx.d.ts#L75)

## Type Parameters

### TFormData

`TFormData`

### TFieldGroupData

`TFieldGroupData`

### TFields

`TFields` *extends* 
  \| `string`
  \| \{ \[K in string \| number \| symbol\]: DeepKeysOfType\<TFormData, TFieldGroupData\[K\]\> \}

### TOnMount

`TOnMount` *extends* `FormValidateOrFn`\<`TFormData`\> \| `undefined`

### TOnChange

`TOnChange` *extends* `FormValidateOrFn`\<`TFormData`\> \| `undefined`

### TOnChangeAsync

`TOnChangeAsync` *extends* `FormAsyncValidateOrFn`\<`TFormData`\> \| `undefined`

### TOnBlur

`TOnBlur` *extends* `FormValidateOrFn`\<`TFormData`\> \| `undefined`

### TOnBlurAsync

`TOnBlurAsync` *extends* `FormAsyncValidateOrFn`\<`TFormData`\> \| `undefined`

### TOnSubmit

`TOnSubmit` *extends* `FormValidateOrFn`\<`TFormData`\> \| `undefined`

### TOnSubmitAsync

`TOnSubmitAsync` *extends* `FormAsyncValidateOrFn`\<`TFormData`\> \| `undefined`

### TOnDynamic

`TOnDynamic` *extends* `FormValidateOrFn`\<`TFormData`\> \| `undefined`

### TOnDynamicAsync

`TOnDynamicAsync` *extends* `FormAsyncValidateOrFn`\<`TFormData`\> \| `undefined`

### TOnServer

`TOnServer` *extends* `FormAsyncValidateOrFn`\<`TFormData`\> \| `undefined`

### TComponents

`TComponents` *extends* `Record`\<`string`, `FieldGroupComponentType`\<`any`\>\>

### TFormComponents

`TFormComponents` *extends* `Record`\<`string`, `FieldGroupComponentType`\<`any`\>\>

### TSubmitMeta

`TSubmitMeta` = `never`

## Parameters

### opts

#### defaultValues?

`TFieldGroupData`

#### fields

`TFields`

#### form

  \| `AppFieldExtendedOctaneFormApi`\<`TFormData`, `TOnMount`, `TOnChange`, `TOnChangeAsync`, `TOnBlur`, `TOnBlurAsync`, `TOnSubmit`, `TOnSubmitAsync`, `TOnDynamic`, `TOnDynamicAsync`, `TOnServer`, `TSubmitMeta`, `TComponents`, `TFormComponents`\>
  \| `AppFieldExtendedOctaneFieldGroupApi`\<`unknown`, `TFormData`, `string` \| `FieldsMap`\<`unknown`, `TFormData`\>, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `TSubmitMeta`, `TComponents`, `TFormComponents`\>

#### formComponents

`TFormComponents`

#### onSubmitMeta?

`TSubmitMeta`

## Returns

`AppFieldExtendedOctaneFieldGroupApi`\<`TFormData`, `TFieldGroupData`, `TFields`, `TOnMount`, `TOnChange`, `TOnChangeAsync`, `TOnBlur`, `TOnBlurAsync`, `TOnSubmit`, `TOnSubmitAsync`, `TOnDynamic`, `TOnDynamicAsync`, `TOnServer`, `TSubmitMeta`, `TComponents`, `TFormComponents`\>
