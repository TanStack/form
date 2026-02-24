---
id: createFieldGroup
title: createFieldGroup
---

# Function: createFieldGroup()

```ts
function createFieldGroup<TFormData, TFieldGroupData, TFields, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TOnServer, TComponents, TFormComponents, TSubmitMeta>(opts): AppFieldExtendedSolidFieldGroupApi<TFormData, TFieldGroupData, TFields, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TOnServer, TSubmitMeta, TComponents, TFormComponents>;
```

Defined in: [packages/solid-form/src/createFieldGroup.tsx:74](https://github.com/TanStack/form/blob/main/packages/solid-form/src/createFieldGroup.tsx#L74)

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

`TComponents` *extends* `Record`\<`string`, `Component`\<`any`\>\>

### TFormComponents

`TFormComponents` *extends* `Record`\<`string`, `Component`\<`any`\>\>

### TSubmitMeta

`TSubmitMeta` = `never`

## Parameters

### opts

() => `object`

## Returns

`AppFieldExtendedSolidFieldGroupApi`\<`TFormData`, `TFieldGroupData`, `TFields`, `TOnMount`, `TOnChange`, `TOnChangeAsync`, `TOnBlur`, `TOnBlurAsync`, `TOnSubmit`, `TOnSubmitAsync`, `TOnDynamic`, `TOnDynamicAsync`, `TOnServer`, `TSubmitMeta`, `TComponents`, `TFormComponents`\>
