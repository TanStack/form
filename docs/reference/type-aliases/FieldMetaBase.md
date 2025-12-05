---
id: FieldMetaBase
title: FieldMetaBase
---

# Type Alias: FieldMetaBase\<TParentData, TName, TData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TFormOnMount, TFormOnChange, TFormOnChangeAsync, TFormOnBlur, TFormOnBlurAsync, TFormOnSubmit, TFormOnSubmitAsync, TFormOnDynamic, TFormOnDynamicAsync\>

```ts
type FieldMetaBase<TParentData, TName, TData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TFormOnMount, TFormOnChange, TFormOnChangeAsync, TFormOnBlur, TFormOnBlurAsync, TFormOnSubmit, TFormOnSubmitAsync, TFormOnDynamic, TFormOnDynamicAsync> = object;
```

Defined in: [packages/form-core/src/FieldApi.ts:567](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L567)

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

### errorMap

```ts
errorMap: ValidationErrorMap<UnwrapFieldValidateOrFn<TName, TOnMount, TFormOnMount>, UnwrapFieldValidateOrFn<TName, TOnChange, TFormOnChange>, UnwrapFieldAsyncValidateOrFn<TName, TOnChangeAsync, TFormOnChangeAsync>, UnwrapFieldValidateOrFn<TName, TOnBlur, TFormOnBlur>, UnwrapFieldAsyncValidateOrFn<TName, TOnBlurAsync, TFormOnBlurAsync>, UnwrapFieldValidateOrFn<TName, TOnSubmit, TFormOnSubmit>, UnwrapFieldAsyncValidateOrFn<TName, TOnSubmitAsync, TFormOnSubmitAsync>, UnwrapFieldValidateOrFn<TName, TOnDynamic, TFormOnDynamic>, UnwrapFieldAsyncValidateOrFn<TName, TOnDynamicAsync, TFormOnDynamicAsync>>;
```

Defined in: [packages/form-core/src/FieldApi.ts:613](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L613)

A map of errors related to the field value.

***

### isBlurred

```ts
isBlurred: boolean;
```

Defined in: [packages/form-core/src/FieldApi.ts:605](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L605)

A flag indicating whether the field has been blurred.

***

### isDirty

```ts
isDirty: boolean;
```

Defined in: [packages/form-core/src/FieldApi.ts:609](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L609)

A flag that is `true` if the field's value has been modified by the user. Opposite of `isPristine`.

***

### isTouched

```ts
isTouched: boolean;
```

Defined in: [packages/form-core/src/FieldApi.ts:601](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L601)

A flag indicating whether the field has been touched.

***

### isValidating

```ts
isValidating: boolean;
```

Defined in: [packages/form-core/src/FieldApi.ts:632](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L632)

A flag indicating whether the field is currently being validated.
