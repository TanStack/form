---
id: FieldOptions
title: FieldOptions
---

# Interface: FieldOptions\<TParentData, TName, TData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync\>

Defined in: [packages/form-core/src/FieldApi.ts:397](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L397)

An object type representing the options for a field in a form.

## Extended by

- [`FieldApiOptions`](FieldApiOptions.md)

## Type Parameters

### TParentData

`TParentData`

### TName

`TName` *extends* [`DeepKeys`](../type-aliases/DeepKeys.md)\<`TParentData`\>

### TData

`TData` *extends* [`DeepValue`](../type-aliases/DeepValue.md)\<`TParentData`, `TName`\>

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

## Properties

### asyncAlways?

```ts
optional asyncAlways: boolean;
```

Defined in: [packages/form-core/src/FieldApi.ts:434](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L434)

If `true`, always run async validation, even if there are errors emitted during synchronous validation.

***

### asyncDebounceMs?

```ts
optional asyncDebounceMs: number;
```

Defined in: [packages/form-core/src/FieldApi.ts:430](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L430)

The default time to debounce async validation if there is not a more specific debounce time passed.

***

### defaultMeta?

```ts
optional defaultMeta: Partial<FieldMeta<TParentData, TName, TData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, any, any, any, any, any, any, any, any, any>>;
```

Defined in: [packages/form-core/src/FieldApi.ts:455](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L455)

An optional object with default metadata for the field.

***

### defaultValue?

```ts
optional defaultValue: NoInfer<TData>;
```

Defined in: [packages/form-core/src/FieldApi.ts:426](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L426)

An optional default value for the field.

***

### disableErrorFlat?

```ts
optional disableErrorFlat: boolean;
```

Defined in: [packages/form-core/src/FieldApi.ts:487](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L487)

Disable the `flat(1)` operation on `field.errors`. This is useful if you want to keep the error structure as is. Not suggested for most use-cases.

***

### listeners?

```ts
optional listeners: FieldListeners<TParentData, TName, TData>;
```

Defined in: [packages/form-core/src/FieldApi.ts:483](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L483)

A list of listeners which attach to the corresponding events

***

### name

```ts
name: TName;
```

Defined in: [packages/form-core/src/FieldApi.ts:422](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L422)

The field name. The type will be `DeepKeys<TParentData>` to ensure your name is a deep key of the parent dataset.

***

### validators?

```ts
optional validators: FieldValidators<TParentData, TName, TData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync>;
```

Defined in: [packages/form-core/src/FieldApi.ts:438](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L438)

A list of validators to pass to the field
