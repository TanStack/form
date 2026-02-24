---
id: useForm
title: useForm
---

# Function: useForm()

```ts
function useForm<TParentData, TFormOnMount, TFormOnChange, TFormOnChangeAsync, TFormOnBlur, TFormOnBlurAsync, TFormOnSubmit, TFormOnSubmitAsync, TFormOnDynamic, TFormOnDynamicAsync, TFormOnServer, TSubmitMeta>(opts?): FormApi<TParentData, TFormOnMount, TFormOnChange, TFormOnChangeAsync, TFormOnBlur, TFormOnBlurAsync, TFormOnSubmit, TFormOnSubmitAsync, TFormOnDynamic, TFormOnDynamicAsync, TFormOnServer, TSubmitMeta> & VueFormApi<TParentData, TFormOnMount, TFormOnChange, TFormOnChangeAsync, TFormOnBlur, TFormOnBlurAsync, TFormOnSubmit, TFormOnSubmitAsync, TFormOnDynamic, TFormOnDynamicAsync, TFormOnServer, TSubmitMeta>;
```

Defined in: [packages/vue-form/src/useForm.tsx:217](https://github.com/TanStack/form/blob/main/packages/vue-form/src/useForm.tsx#L217)

## Type Parameters

### TParentData

`TParentData`

### TFormOnMount

`TFormOnMount` *extends* `FormValidateOrFn`\<`TParentData`\> \| `undefined`

### TFormOnChange

`TFormOnChange` *extends* `FormValidateOrFn`\<`TParentData`\> \| `undefined`

### TFormOnChangeAsync

`TFormOnChangeAsync` *extends* `FormAsyncValidateOrFn`\<`TParentData`\> \| `undefined`

### TFormOnBlur

`TFormOnBlur` *extends* `FormValidateOrFn`\<`TParentData`\> \| `undefined`

### TFormOnBlurAsync

`TFormOnBlurAsync` *extends* `FormAsyncValidateOrFn`\<`TParentData`\> \| `undefined`

### TFormOnSubmit

`TFormOnSubmit` *extends* `FormValidateOrFn`\<`TParentData`\> \| `undefined`

### TFormOnSubmitAsync

`TFormOnSubmitAsync` *extends* `FormAsyncValidateOrFn`\<`TParentData`\> \| `undefined`

### TFormOnDynamic

`TFormOnDynamic` *extends* `FormValidateOrFn`\<`TParentData`\> \| `undefined`

### TFormOnDynamicAsync

`TFormOnDynamicAsync` *extends* `FormAsyncValidateOrFn`\<`TParentData`\> \| `undefined`

### TFormOnServer

`TFormOnServer` *extends* `FormAsyncValidateOrFn`\<`TParentData`\> \| `undefined`

### TSubmitMeta

`TSubmitMeta`

## Parameters

### opts?

`FormOptions`\<`TParentData`, `TFormOnMount`, `TFormOnChange`, `TFormOnChangeAsync`, `TFormOnBlur`, `TFormOnBlurAsync`, `TFormOnSubmit`, `TFormOnSubmitAsync`, `TFormOnDynamic`, `TFormOnDynamicAsync`, `TFormOnServer`, `TSubmitMeta`\>

## Returns

`FormApi`\<`TParentData`, `TFormOnMount`, `TFormOnChange`, `TFormOnChangeAsync`, `TFormOnBlur`, `TFormOnBlurAsync`, `TFormOnSubmit`, `TFormOnSubmitAsync`, `TFormOnDynamic`, `TFormOnDynamicAsync`, `TFormOnServer`, `TSubmitMeta`\> & [`VueFormApi`](../interfaces/VueFormApi.md)\<`TParentData`, `TFormOnMount`, `TFormOnChange`, `TFormOnChangeAsync`, `TFormOnBlur`, `TFormOnBlurAsync`, `TFormOnSubmit`, `TFormOnSubmitAsync`, `TFormOnDynamic`, `TFormOnDynamicAsync`, `TFormOnServer`, `TSubmitMeta`\>
