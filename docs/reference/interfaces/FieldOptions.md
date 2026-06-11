---
id: FieldOptions
title: FieldOptions
---

# Interface: FieldOptions\<TParentData, TName, TData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync\>

Defined in: [packages/form-core/src/FieldApi.ts:331](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L331)

An object type representing the options for a field in a form.

## Extends

- `FieldExtraOptions`\<`TParentData`, `TName`, `TData`, `TOnMount`, `TOnChange`, `TOnChangeAsync`, `TOnBlur`, `TOnBlurAsync`, `TOnSubmit`, `TOnSubmitAsync`, `TOnDynamic`, `TOnDynamicAsync`\>

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

Defined in: [packages/form-core/src/types.ts:972](https://github.com/TanStack/form/blob/main/packages/form-core/src/types.ts#L972)

If `true`, always run async validation, even if there are errors emitted during synchronous validation.

#### Inherited from

```ts
FieldLikeOptions.asyncAlways
```

***

### asyncDebounceMs?

```ts
optional asyncDebounceMs: number;
```

Defined in: [packages/form-core/src/types.ts:968](https://github.com/TanStack/form/blob/main/packages/form-core/src/types.ts#L968)

The default time to debounce async validation if there is not a more specific debounce time passed.

#### Inherited from

```ts
FieldLikeOptions.asyncDebounceMs
```

***

### defaultMeta?

```ts
optional defaultMeta: Partial<FieldLikeMeta<TParentData, TName, TData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, any, any, any, any, any, any, any, any, any>>;
```

Defined in: [packages/form-core/src/types.ts:976](https://github.com/TanStack/form/blob/main/packages/form-core/src/types.ts#L976)

An optional object with default metadata for the field.

#### Inherited from

```ts
FieldLikeOptions.defaultMeta
```

***

### defaultValue?

```ts
optional defaultValue: NoInfer<TData>;
```

Defined in: [packages/form-core/src/types.ts:964](https://github.com/TanStack/form/blob/main/packages/form-core/src/types.ts#L964)

An optional default value for the field.

#### Inherited from

```ts
FieldLikeOptions.defaultValue
```

***

### disableErrorFlat?

```ts
optional disableErrorFlat: boolean;
```

Defined in: [packages/form-core/src/types.ts:1004](https://github.com/TanStack/form/blob/main/packages/form-core/src/types.ts#L1004)

Disable the `flat(1)` operation on `field.errors`. This is useful if you want to keep the error structure as is. Not suggested for most use-cases.

#### Inherited from

```ts
FieldLikeOptions.disableErrorFlat
```

***

### listeners?

```ts
optional listeners: FieldListeners<TParentData, TName, TData>;
```

Defined in: [packages/form-core/src/FieldApi.ts:325](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L325)

A list of listeners which attach to the corresponding events

#### Inherited from

```ts
FieldExtraOptions.listeners
```

***

### name

```ts
name: TName;
```

Defined in: [packages/form-core/src/types.ts:960](https://github.com/TanStack/form/blob/main/packages/form-core/src/types.ts#L960)

The field name. The type will be `DeepKeys<TParentData>` to ensure your name is a deep key of the parent dataset.

#### Inherited from

```ts
FieldLikeOptions.name
```

***

### validators?

```ts
optional validators: FieldValidators<TParentData, TName, TData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync>;
```

Defined in: [packages/form-core/src/FieldApi.ts:307](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L307)

A list of validators to pass to the field

#### Inherited from

```ts
FieldExtraOptions.validators
```
