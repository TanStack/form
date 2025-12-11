---
id: formOptions
title: formOptions
---

# Function: formOptions()

```ts
function formOptions<TOptions, TFormData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TOnServer, TSubmitMeta>(defaultOpts): TOptions;
```

Defined in: [packages/form-core/src/formOptions.ts:23](https://github.com/TanStack/form/blob/main/packages/form-core/src/formOptions.ts#L23)

## Type Parameters

### TOptions

`TOptions` *extends* `Partial`\<[`FormOptions`](../interfaces/FormOptions.md)\<`TFormData`, `TOnMount`, `TOnChange`, `TOnChangeAsync`, `TOnBlur`, `TOnBlurAsync`, `TOnSubmit`, `TOnSubmitAsync`, `TOnDynamic`, `TOnDynamicAsync`, `TOnServer`, `TSubmitMeta`\>\>

### TFormData

`TFormData`

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

### TSubmitMeta

`TSubmitMeta` = `never`

## Parameters

### defaultOpts

`Partial`\<[`FormOptions`](../interfaces/FormOptions.md)\<`TFormData`, `TOnMount`, `TOnChange`, `TOnChangeAsync`, `TOnBlur`, `TOnBlurAsync`, `TOnSubmit`, `TOnSubmitAsync`, `TOnDynamic`, `TOnDynamicAsync`, `TOnServer`, `TSubmitMeta`\>\> & `TOptions`

## Returns

`TOptions`
