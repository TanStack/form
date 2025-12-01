---
id: createForm
title: createForm
---

# Function: createForm()

```ts
function createForm<TParentData, TFormOnMount, TFormOnChange, TFormOnChangeAsync, TFormOnBlur, TFormOnBlurAsync, TFormOnSubmit, TFormOnSubmitAsync, TFormOnDynamic, TFormOnDynamicAsync, TFormOnServer, TSubmitMeta>(opts?): FormApi<TParentData, TFormOnMount, TFormOnChange, TFormOnChangeAsync, TFormOnBlur, TFormOnBlurAsync, TFormOnSubmit, TFormOnSubmitAsync, TFormOnDynamic, TFormOnDynamicAsync, TFormOnServer, TSubmitMeta> & SolidFormApi<TParentData, TFormOnMount, TFormOnChange, TFormOnChangeAsync, TFormOnBlur, TFormOnBlurAsync, TFormOnSubmit, TFormOnSubmitAsync, TFormOnDynamic, TFormOnDynamicAsync, TFormOnServer, TSubmitMeta>;
```

Defined in: [packages/solid-form/src/createForm.tsx:173](https://github.com/TanStack/form/blob/main/packages/solid-form/src/createForm.tsx#L173)

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

() => `FormOptions`\<`TParentData`, `TFormOnMount`, `TFormOnChange`, `TFormOnChangeAsync`, `TFormOnBlur`, `TFormOnBlurAsync`, `TFormOnSubmit`, `TFormOnSubmitAsync`, `TFormOnDynamic`, `TFormOnDynamicAsync`, `TFormOnServer`, `TSubmitMeta`\>

## Returns

`FormApi`\<`TParentData`, `TFormOnMount`, `TFormOnChange`, `TFormOnChangeAsync`, `TFormOnBlur`, `TFormOnBlurAsync`, `TFormOnSubmit`, `TFormOnSubmitAsync`, `TFormOnDynamic`, `TFormOnDynamicAsync`, `TFormOnServer`, `TSubmitMeta`\> & [`SolidFormApi`](../../interfaces/SolidFormApi.md)\<`TParentData`, `TFormOnMount`, `TFormOnChange`, `TFormOnChangeAsync`, `TFormOnBlur`, `TFormOnBlurAsync`, `TFormOnSubmit`, `TFormOnSubmitAsync`, `TFormOnDynamic`, `TFormOnDynamicAsync`, `TFormOnServer`, `TSubmitMeta`\>
