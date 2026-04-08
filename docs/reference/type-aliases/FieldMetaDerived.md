---
id: FieldMetaDerived
title: FieldMetaDerived
---

# Type Alias: FieldMetaDerived\<TParentData, TName, TData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TFormOnMount, TFormOnChange, TFormOnChangeAsync, TFormOnBlur, TFormOnBlurAsync, TFormOnSubmit, TFormOnSubmitAsync, TFormOnDynamic, TFormOnDynamicAsync\>

```ts
type FieldMetaDerived<TParentData, TName, TData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TFormOnMount, TFormOnChange, TFormOnChangeAsync, TFormOnBlur, TFormOnBlurAsync, TFormOnSubmit, TFormOnSubmitAsync, TFormOnDynamic, TFormOnDynamicAsync> = object;
```

Defined in: [packages/form-core/src/FieldApi.ts:660](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L660)

## Type Parameters

### TParentData

`TParentData`

### TName

`TName` *extends* [`DeepKeys`](DeepKeys.md)\<`TParentData`\>

### TData

`TData` *extends* [`DeepValue`](DeepValue.md)\<`TParentData`, `TName`\>

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

## Properties

### errors

```ts
errors: (
  | UnwrapOneLevelOfArray<UnwrapFieldValidateOrFn<TName, TOnMount, TFormOnMount>>
  | UnwrapOneLevelOfArray<UnwrapFieldValidateOrFn<TName, TOnChange, TFormOnChange>>
  | UnwrapOneLevelOfArray<UnwrapFieldAsyncValidateOrFn<TName, TOnChangeAsync, TFormOnChangeAsync>>
  | UnwrapOneLevelOfArray<UnwrapFieldValidateOrFn<TName, TOnBlur, TFormOnBlur>>
  | UnwrapOneLevelOfArray<UnwrapFieldAsyncValidateOrFn<TName, TOnBlurAsync, TFormOnBlurAsync>>
  | UnwrapOneLevelOfArray<UnwrapFieldValidateOrFn<TName, TOnSubmit, TFormOnSubmit>>
  | UnwrapOneLevelOfArray<UnwrapFieldAsyncValidateOrFn<TName, TOnSubmitAsync, TFormOnSubmitAsync>>
  | UnwrapOneLevelOfArray<UnwrapFieldValidateOrFn<TName, TOnDynamic, TFormOnDynamic>>
  | UnwrapOneLevelOfArray<UnwrapFieldAsyncValidateOrFn<TName, TOnDynamicAsync, TFormOnDynamicAsync>>)[];
```

Defined in: [packages/form-core/src/FieldApi.ts:694](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L694)

An array of errors related to the field value.

***

### isDefaultValue

```ts
isDefaultValue: boolean;
```

Defined in: [packages/form-core/src/FieldApi.ts:738](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L738)

A flag indicating whether the field's current value is the default value

***

### isPristine

```ts
isPristine: boolean;
```

Defined in: [packages/form-core/src/FieldApi.ts:730](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L730)

A flag that is `true` if the field's value has not been modified by the user. Opposite of `isDirty`.

***

### isValid

```ts
isValid: boolean;
```

Defined in: [packages/form-core/src/FieldApi.ts:734](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L734)

A boolean indicating if the field is valid. Evaluates `true` if there are no field errors.
