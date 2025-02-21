---
id: FieldOptions
title: FieldOptions
---

# Interface: FieldOptions\<TParentData, TName, TData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync\>

Defined in: [packages/form-core/src/FieldApi.ts:337](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L337)

An object type representing the options for a field in a form.

## Extended by

- [`FieldApiOptions`](fieldapioptions.md)

## Type Parameters

• **TParentData**

• **TName** *extends* [`DeepKeys`](../type-aliases/deepkeys.md)\<`TParentData`\>

• **TData** *extends* [`DeepValue`](../type-aliases/deepvalue.md)\<`TParentData`, `TName`\>

• **TOnMount** *extends* `undefined` \| `FieldValidateOrFn`\<`TParentData`, `TName`, `TData`\>

• **TOnChange** *extends* `undefined` \| `FieldValidateOrFn`\<`TParentData`, `TName`, `TData`\>

• **TOnChangeAsync** *extends* `undefined` \| `FieldAsyncValidateOrFn`\<`TParentData`, `TName`, `TData`\>

• **TOnBlur** *extends* `undefined` \| `FieldValidateOrFn`\<`TParentData`, `TName`, `TData`\>

• **TOnBlurAsync** *extends* `undefined` \| `FieldAsyncValidateOrFn`\<`TParentData`, `TName`, `TData`\>

• **TOnSubmit** *extends* `undefined` \| `FieldValidateOrFn`\<`TParentData`, `TName`, `TData`\>

• **TOnSubmitAsync** *extends* `undefined` \| `FieldAsyncValidateOrFn`\<`TParentData`, `TName`, `TData`\>

## Properties

### asyncAlways?

```ts
optional asyncAlways: boolean;
```

Defined in: [packages/form-core/src/FieldApi.ts:370](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L370)

If `true`, always run async validation, even if there are errors emitted during synchronous validation.

***

### asyncDebounceMs?

```ts
optional asyncDebounceMs: number;
```

Defined in: [packages/form-core/src/FieldApi.ts:366](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L366)

The default time to debounce async validation if there is not a more specific debounce time passed.

***

### defaultMeta?

```ts
optional defaultMeta: Partial<FieldMeta<TParentData, TName, TData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, any, any, any, any, any, any, any>>;
```

Defined in: [packages/form-core/src/FieldApi.ts:389](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L389)

An optional object with default metadata for the field.

***

### defaultValue?

```ts
optional defaultValue: NoInfer<TData>;
```

Defined in: [packages/form-core/src/FieldApi.ts:362](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L362)

An optional default value for the field.

***

### disableErrorFlat?

```ts
optional disableErrorFlat: boolean;
```

Defined in: [packages/form-core/src/FieldApi.ts:417](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L417)

Disable the `flat(1)` operation on `field.errors`. This is useful if you want to keep the error structure as is. Not suggested for most use-cases.

***

### listeners?

```ts
optional listeners: FieldListeners<TParentData, TName, TData>;
```

Defined in: [packages/form-core/src/FieldApi.ts:413](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L413)

A list of listeners which attach to the corresponding events

***

### name

```ts
name: TName;
```

Defined in: [packages/form-core/src/FieldApi.ts:358](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L358)

The field name. The type will be `DeepKeys<TParentData>` to ensure your name is a deep key of the parent dataset.

***

### validators?

```ts
optional validators: FieldValidators<TParentData, TName, TData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync>;
```

Defined in: [packages/form-core/src/FieldApi.ts:374](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L374)

A list of validators to pass to the field
