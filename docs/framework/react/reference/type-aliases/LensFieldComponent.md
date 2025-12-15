---
id: LensFieldComponent
title: LensFieldComponent
---

# Type Alias: LensFieldComponent()\<TLensData, TParentSubmitMeta, ExtendedApi\>

```ts
type LensFieldComponent<TLensData, TParentSubmitMeta, ExtendedApi> = <TName, TData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync>({
  children,
  ...fieldOptions
}) => ReturnType<FunctionComponent>;
```

Defined in: [packages/react-form/src/useField.tsx:598](https://github.com/TanStack/form/blob/main/packages/react-form/src/useField.tsx#L598)

A type alias representing a field component for a form lens data type.

## Type Parameters

### TLensData

`TLensData`

### TParentSubmitMeta

`TParentSubmitMeta`

### ExtendedApi

`ExtendedApi` = \{
\}

## Type Parameters

### TName

`TName` *extends* `DeepKeys`\<`TLensData`\>

### TData

`TData` *extends* `DeepValue`\<`TLensData`, `TName`\>

### TOnMount

`TOnMount` *extends* `undefined` \| `FieldValidateOrFn`\<`unknown`, `string`, `TData`\>

### TOnChange

`TOnChange` *extends* `undefined` \| `FieldValidateOrFn`\<`unknown`, `string`, `TData`\>

### TOnChangeAsync

`TOnChangeAsync` *extends* `undefined` \| `FieldAsyncValidateOrFn`\<`unknown`, `string`, `TData`\>

### TOnBlur

`TOnBlur` *extends* `undefined` \| `FieldValidateOrFn`\<`unknown`, `string`, `TData`\>

### TOnBlurAsync

`TOnBlurAsync` *extends* `undefined` \| `FieldAsyncValidateOrFn`\<`unknown`, `string`, `TData`\>

### TOnSubmit

`TOnSubmit` *extends* `undefined` \| `FieldValidateOrFn`\<`unknown`, `string`, `TData`\>

### TOnSubmitAsync

`TOnSubmitAsync` *extends* `undefined` \| `FieldAsyncValidateOrFn`\<`unknown`, `string`, `TData`\>

### TOnDynamic

`TOnDynamic` *extends* `undefined` \| `FieldValidateOrFn`\<`unknown`, `string`, `TData`\>

### TOnDynamicAsync

`TOnDynamicAsync` *extends* `undefined` \| `FieldAsyncValidateOrFn`\<`unknown`, `string`, `TData`\>

## Parameters

### \{
  children,
  ...fieldOptions
\}

`Omit`\<`FieldComponentBoundProps`\<`unknown`, `string`, `TData`, `TOnMount`, `TOnChange`, `TOnChangeAsync`, `TOnBlur`, `TOnBlurAsync`, `TOnSubmit`, `TOnSubmitAsync`, `TOnDynamic`, `TOnDynamicAsync`, `undefined` \| `FormValidateOrFn`\<`unknown`\>, `undefined` \| `FormValidateOrFn`\<`unknown`\>, `undefined` \| `FormAsyncValidateOrFn`\<`unknown`\>, `undefined` \| `FormValidateOrFn`\<`unknown`\>, `undefined` \| `FormAsyncValidateOrFn`\<`unknown`\>, `undefined` \| `FormValidateOrFn`\<`unknown`\>, `undefined` \| `FormAsyncValidateOrFn`\<`unknown`\>, `undefined` \| `FormValidateOrFn`\<`unknown`\>, `undefined` \| `FormAsyncValidateOrFn`\<`unknown`\>, `undefined` \| `FormAsyncValidateOrFn`\<`unknown`\>, `TParentSubmitMeta`, `ExtendedApi`\>, `"name"` \| `"validators"`\> & `object`

## Returns

`ReturnType`\<`FunctionComponent`\>
