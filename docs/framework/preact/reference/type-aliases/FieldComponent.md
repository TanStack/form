---
id: FieldComponent
title: FieldComponent
---

# Type Alias: FieldComponent()\<TParentData, TFormOnMount, TFormOnChange, TFormOnChangeAsync, TFormOnBlur, TFormOnBlurAsync, TFormOnSubmit, TFormOnSubmitAsync, TFormOnDynamic, TFormOnDynamicAsync, TFormOnServer, TPatentSubmitMeta, ExtendedApi\>

```ts
type FieldComponent<TParentData, TFormOnMount, TFormOnChange, TFormOnChangeAsync, TFormOnBlur, TFormOnBlurAsync, TFormOnSubmit, TFormOnSubmitAsync, TFormOnDynamic, TFormOnDynamicAsync, TFormOnServer, TPatentSubmitMeta, ExtendedApi> = <TName, TData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync>({
  children,
  ...fieldOptions
}) => ReturnType<FunctionComponent>;
```

Defined in: [packages/react-form/src/useField.tsx:523](https://github.com/TanStack/form/blob/main/packages/react-form/src/useField.tsx#L523)

A type alias representing a field component for a specific form data type.

## Type Parameters

### TParentData

`TParentData`

### TFormOnMount

`TFormOnMount` *extends* `undefined` \| `FormValidateOrFn`\<`TParentData`\>

### TFormOnChange

`TFormOnChange` *extends* `undefined` \| `FormValidateOrFn`\<`TParentData`\>

### TFormOnChangeAsync

`TFormOnChangeAsync` *extends* `undefined` \| `FormAsyncValidateOrFn`\<`TParentData`\>

### TFormOnBlur

`TFormOnBlur` *extends* `undefined` \| `FormValidateOrFn`\<`TParentData`\>

### TFormOnBlurAsync

`TFormOnBlurAsync` *extends* `undefined` \| `FormAsyncValidateOrFn`\<`TParentData`\>

### TFormOnSubmit

`TFormOnSubmit` *extends* `undefined` \| `FormValidateOrFn`\<`TParentData`\>

### TFormOnSubmitAsync

`TFormOnSubmitAsync` *extends* `undefined` \| `FormAsyncValidateOrFn`\<`TParentData`\>

### TFormOnDynamic

`TFormOnDynamic` *extends* `undefined` \| `FormValidateOrFn`\<`TParentData`\>

### TFormOnDynamicAsync

`TFormOnDynamicAsync` *extends* `undefined` \| `FormAsyncValidateOrFn`\<`TParentData`\>

### TFormOnServer

`TFormOnServer` *extends* `undefined` \| `FormAsyncValidateOrFn`\<`TParentData`\>

### TPatentSubmitMeta

`TPatentSubmitMeta`

### ExtendedApi

`ExtendedApi` = \{
\}

## Type Parameters

### TName

`TName` *extends* `DeepKeys`\<`TParentData`\>

### TData

`TData` *extends* `DeepValue`\<`TParentData`, `TName`\>

### TOnMount

`TOnMount` *extends* `undefined` \| `FieldValidateOrFn`\<`TParentData`, `TName`, `TData`\>

### TOnChange

`TOnChange` *extends* `undefined` \| `FieldValidateOrFn`\<`TParentData`, `TName`, `TData`\>

### TOnChangeAsync

`TOnChangeAsync` *extends* `undefined` \| `FieldAsyncValidateOrFn`\<`TParentData`, `TName`, `TData`\>

### TOnBlur

`TOnBlur` *extends* `undefined` \| `FieldValidateOrFn`\<`TParentData`, `TName`, `TData`\>

### TOnBlurAsync

`TOnBlurAsync` *extends* `undefined` \| `FieldAsyncValidateOrFn`\<`TParentData`, `TName`, `TData`\>

### TOnSubmit

`TOnSubmit` *extends* `undefined` \| `FieldValidateOrFn`\<`TParentData`, `TName`, `TData`\>

### TOnSubmitAsync

`TOnSubmitAsync` *extends* `undefined` \| `FieldAsyncValidateOrFn`\<`TParentData`, `TName`, `TData`\>

### TOnDynamic

`TOnDynamic` *extends* `undefined` \| `FieldValidateOrFn`\<`TParentData`, `TName`, `TData`\>

### TOnDynamicAsync

`TOnDynamicAsync` *extends* `undefined` \| `FieldAsyncValidateOrFn`\<`TParentData`, `TName`, `TData`\>

## Parameters

### \{
  children,
  ...fieldOptions
\}

`FieldComponentBoundProps`\<`TParentData`, `TName`, `TData`, `TOnMount`, `TOnChange`, `TOnChangeAsync`, `TOnBlur`, `TOnBlurAsync`, `TOnSubmit`, `TOnSubmitAsync`, `TOnDynamic`, `TOnDynamicAsync`, `TFormOnMount`, `TFormOnChange`, `TFormOnChangeAsync`, `TFormOnBlur`, `TFormOnBlurAsync`, `TFormOnSubmit`, `TFormOnSubmitAsync`, `TFormOnDynamic`, `TFormOnDynamicAsync`, `TFormOnServer`, `TPatentSubmitMeta`, `ExtendedApi`\>

## Returns

`ReturnType`\<`FunctionComponent`\>
