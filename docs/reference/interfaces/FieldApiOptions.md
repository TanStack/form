---
id: FieldApiOptions
title: FieldApiOptions
---

# Interface: FieldApiOptions\<TParentData, TName, TData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TFormOnMount, TFormOnChange, TFormOnChangeAsync, TFormOnBlur, TFormOnBlurAsync, TFormOnSubmit, TFormOnSubmitAsync, TFormOnDynamic, TFormOnDynamicAsync, TFormOnServer, TParentSubmitMeta\>

Defined in: [packages/form-core/src/FieldApi.ts:383](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L383)

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

### TParentSubmitMeta

`TParentSubmitMeta`

## Properties

### asyncAlways?

```ts
optional asyncAlways: boolean;
```

Defined in: [packages/form-core/src/types.ts:972](https://github.com/TanStack/form/blob/main/packages/form-core/src/types.ts#L972)

If `true`, always run async validation, even if there are errors emitted during synchronous validation.

#### Inherited from

```ts
FieldLikeApiOptions.asyncAlways
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
FieldLikeApiOptions.asyncDebounceMs
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
FieldLikeApiOptions.defaultMeta
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
FieldLikeApiOptions.defaultValue
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
FieldLikeApiOptions.disableErrorFlat
```

***

### form

```ts
form: FormApi<TParentData, TFormOnMount, TFormOnChange, TFormOnChangeAsync, TFormOnBlur, TFormOnBlurAsync, TFormOnSubmit, TFormOnSubmitAsync, TFormOnDynamic, TFormOnDynamicAsync, TFormOnServer, TParentSubmitMeta>;
```

Defined in: [packages/form-core/src/types.ts:1084](https://github.com/TanStack/form/blob/main/packages/form-core/src/types.ts#L1084)

#### Inherited from

```ts
FieldLikeApiOptions.form
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
FieldLikeApiOptions.name
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
