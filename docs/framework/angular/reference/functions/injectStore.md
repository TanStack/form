---
id: injectStore
title: injectStore
---

# Function: injectStore()

```ts
function injectStore<TFormData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TOnServer, TSubmitMeta, TSelected>(form, selector?): Signal<TSelected>;
```

Defined in: [inject-store.ts:9](https://github.com/TanStack/form/blob/main/packages/angular-form/src/inject-store.ts#L9)

## Type Parameters

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

`TSubmitMeta`

### TSelected

`TSelected` = `NoInfer`\<`FormState`\<`TFormData`, `TOnMount`, `TOnChange`, `TOnChangeAsync`, `TOnBlur`, `TOnBlurAsync`, `TOnSubmit`, `TOnSubmitAsync`, `TOnDynamic`, `TOnDynamicAsync`, `TOnServer`\>\>

## Parameters

### form

`FormApi`\<`TFormData`, `TOnMount`, `TOnChange`, `TOnChangeAsync`, `TOnBlur`, `TOnBlurAsync`, `TOnSubmit`, `TOnSubmitAsync`, `TOnDynamic`, `TOnDynamicAsync`, `TOnServer`, `TSubmitMeta`\>

### selector?

(`state`) => `TSelected`

## Returns

`Signal`\<`TSelected`\>
