---
id: useFormGroup
title: useFormGroup
---

# Function: useFormGroup()

```ts
function useFormGroup<TParentData, TName, TData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TSubmitMeta, TFormOnMount, TFormOnChange, TFormOnChangeAsync, TFormOnBlur, TFormOnBlurAsync, TFormOnSubmit, TFormOnSubmitAsync, TFormOnDynamic, TFormOnDynamicAsync, TFormOnServer, TParentSubmitMeta>(opts): object;
```

Defined in: [packages/vue-form/src/useFormGroup.tsx:221](https://github.com/TanStack/form/blob/main/packages/vue-form/src/useFormGroup.tsx#L221)

## Type Parameters

### TParentData

`TParentData`

### TName

`TName` *extends* `string`

### TData

`TData`

### TOnMount

`TOnMount` *extends* `FormGroupValidateOrFn`\<`TParentData`, `TName`, `TData`\> \| `undefined`

### TOnChange

`TOnChange` *extends* `FormGroupValidateOrFn`\<`TParentData`, `TName`, `TData`\> \| `undefined`

### TOnChangeAsync

`TOnChangeAsync` *extends* 
  \| `FormGroupAsyncValidateOrFn`\<`TParentData`, `TName`, `TData`\>
  \| `undefined`

### TOnBlur

`TOnBlur` *extends* `FormGroupValidateOrFn`\<`TParentData`, `TName`, `TData`\> \| `undefined`

### TOnBlurAsync

`TOnBlurAsync` *extends* 
  \| `FormGroupAsyncValidateOrFn`\<`TParentData`, `TName`, `TData`\>
  \| `undefined`

### TOnSubmit

`TOnSubmit` *extends* `FormGroupValidateOrFn`\<`TParentData`, `TName`, `TData`\> \| `undefined`

### TOnSubmitAsync

`TOnSubmitAsync` *extends* 
  \| `FormGroupAsyncValidateOrFn`\<`TParentData`, `TName`, `TData`\>
  \| `undefined`

### TOnDynamic

`TOnDynamic` *extends* `FormGroupValidateOrFn`\<`TParentData`, `TName`, `TData`\> \| `undefined`

### TOnDynamicAsync

`TOnDynamicAsync` *extends* 
  \| `FormGroupAsyncValidateOrFn`\<`TParentData`, `TName`, `TData`\>
  \| `undefined`

### TSubmitMeta

`TSubmitMeta`

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

### TParentSubmitMeta

`TParentSubmitMeta`

## Parameters

### opts

`FormGroupApiOptions`\<`TParentData`, `TName`, `TData`, `TOnMount`, `TOnChange`, `TOnChangeAsync`, `TOnBlur`, `TOnBlurAsync`, `TOnSubmit`, `TOnSubmitAsync`, `TOnDynamic`, `TOnDynamicAsync`, `TSubmitMeta`, `TFormOnMount`, `TFormOnChange`, `TFormOnChangeAsync`, `TFormOnBlur`, `TFormOnBlurAsync`, `TFormOnSubmit`, `TFormOnSubmitAsync`, `TFormOnDynamic`, `TFormOnDynamicAsync`, `TFormOnServer`, `TParentSubmitMeta`\>

## Returns

`object`

### api

```ts
readonly api: FormGroupApi<TParentData, TName, TData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TSubmitMeta, TFormOnMount, TFormOnChange, TFormOnChangeAsync, TFormOnBlur, TFormOnBlurAsync, TFormOnSubmit, TFormOnSubmitAsync, TFormOnDynamic, TFormOnDynamicAsync, TFormOnServer, TParentSubmitMeta> = formGroupApi;
```

### state

```ts
readonly state: Readonly<Ref<FormGroupStoreState<TParentData, TName, TData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TFormOnMount, TFormOnChange, TFormOnChangeAsync, TFormOnBlur, TFormOnBlurAsync, TFormOnSubmit, TFormOnSubmitAsync, TFormOnDynamic, TFormOnDynamicAsync>, FormGroupStoreState<TParentData, TName, TData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TFormOnMount, TFormOnChange, TFormOnChangeAsync, TFormOnBlur, TFormOnBlurAsync, TFormOnSubmit, TFormOnSubmitAsync, TFormOnDynamic, TFormOnDynamicAsync>>> = groupState;
```
