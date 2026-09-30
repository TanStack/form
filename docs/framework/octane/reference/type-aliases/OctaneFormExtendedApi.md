---
id: OctaneFormExtendedApi
title: OctaneFormExtendedApi
---

```ts
type OctaneFormExtendedApi<TFormData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TOnServer, TSubmitMeta> = FormApi<TFormData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TOnServer, TSubmitMeta> & OctaneFormApi<TFormData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TOnServer, TSubmitMeta>;
```

Defined in: [packages/octane-form/src/useForm.tsrx.d.ts:82](https://github.com/TanStack/form/blob/main/packages/octane-form/src/useForm.tsrx.d.ts#L82)

An extended version of the `FormApi` class that includes renderer-specific components from `OctaneFormApi`

## Type Parameters

### TFormData

`TFormData`

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

`TSubmitMeta`
