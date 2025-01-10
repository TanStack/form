---
id: FieldApiOptions
title: FieldApiOptions
---

# Interface: FieldApiOptions\<TParentData, TName, TFieldValidator, TFormValidator, TData, TOnMountReturn, TOnChangeReturn, TOnChangeAsyncReturn, TOnBlurReturn, TOnBlurAsyncReturn, TOnSubmitReturn, TOnSubmitAsyncReturn, TFormOnMountReturn, TFormOnChangeReturn, TFormOnChangeAsyncReturn, TFormOnBlurReturn, TFormOnBlurAsyncReturn, TFormOnSubmitReturn, TFormOnSubmitAsyncReturn\>

Defined in: [packages/form-core/src/FieldApi.ts:467](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L467)

An object type representing the required options for the FieldApi class.

## Extends

- [`FieldOptions`](fieldoptions.md)\<`TParentData`, `TName`, `TFieldValidator`, `TFormValidator`, `TData`, `TOnMountReturn`, `TOnChangeReturn`, `TOnChangeAsyncReturn`, `TOnBlurReturn`, `TOnBlurAsyncReturn`, `TOnSubmitReturn`, `TOnSubmitAsyncReturn`\>

## Type Parameters

• **TParentData**

• **TName** *extends* [`DeepKeys`](../type-aliases/deepkeys.md)\<`TParentData`\>

• **TFieldValidator** *extends* 
  \| `Validator`\<[`DeepValue`](../type-aliases/deepvalue.md)\<`TParentData`, `TName`\>, `unknown`\>
  \| `undefined` = `undefined`

• **TFormValidator** *extends* `Validator`\<`TParentData`, `unknown`\> \| `undefined` = `undefined`

• **TData** *extends* [`DeepValue`](../type-aliases/deepvalue.md)\<`TParentData`, `TName`\> = [`DeepValue`](../type-aliases/deepvalue.md)\<`TParentData`, `TName`\>

• **TOnMountReturn** = `undefined`

• **TOnChangeReturn** = `undefined`

• **TOnChangeAsyncReturn** = `undefined`

• **TOnBlurReturn** = `undefined`

• **TOnBlurAsyncReturn** = `undefined`

• **TOnSubmitReturn** = `undefined`

• **TOnSubmitAsyncReturn** = `undefined`

• **TFormOnMountReturn** = `undefined`

• **TFormOnChangeReturn** = `undefined`

• **TFormOnChangeAsyncReturn** = `undefined`

• **TFormOnBlurReturn** = `undefined`

• **TFormOnBlurAsyncReturn** = `undefined`

• **TFormOnSubmitReturn** = `undefined`

• **TFormOnSubmitAsyncReturn** = `undefined`

## Properties

### asyncAlways?

```ts
optional asyncAlways: boolean;
```

Defined in: [packages/form-core/src/FieldApi.ts:426](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L426)

If `true`, always run async validation, even if there are errors emitted during synchronous validation.

#### Inherited from

[`FieldOptions`](fieldoptions.md).[`asyncAlways`](FieldOptions.md#asyncalways)

***

### asyncDebounceMs?

```ts
optional asyncDebounceMs: number;
```

Defined in: [packages/form-core/src/FieldApi.ts:422](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L422)

The default time to debounce async validation if there is not a more specific debounce time passed.

#### Inherited from

[`FieldOptions`](fieldoptions.md).[`asyncDebounceMs`](FieldOptions.md#asyncdebouncems)

***

### defaultMeta?

```ts
optional defaultMeta: Partial<FieldMeta<undefined, undefined, undefined, undefined, undefined, undefined, undefined>>;
```

Defined in: [packages/form-core/src/FieldApi.ts:451](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L451)

An optional object with default metadata for the field.

#### Inherited from

[`FieldOptions`](fieldoptions.md).[`defaultMeta`](FieldOptions.md#defaultmeta)

***

### defaultValue?

```ts
optional defaultValue: NoInfer<TData>;
```

Defined in: [packages/form-core/src/FieldApi.ts:418](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L418)

An optional default value for the field.

#### Inherited from

[`FieldOptions`](fieldoptions.md).[`defaultValue`](FieldOptions.md#defaultvalue)

***

### form

```ts
form: FormApi<TParentData, TFormValidator, TFormOnMountReturn, TFormOnChangeReturn, TFormOnChangeAsyncReturn, TFormOnBlurReturn, TFormOnBlurAsyncReturn, TFormOnSubmitReturn, TFormOnSubmitAsyncReturn>;
```

Defined in: [packages/form-core/src/FieldApi.ts:505](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L505)

***

### listeners?

```ts
optional listeners: FieldListeners<TParentData, TName, TFieldValidator, TFormValidator, TData>;
```

Defined in: [packages/form-core/src/FieldApi.ts:455](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L455)

A list of listeners which attach to the corresponding events

#### Inherited from

[`FieldOptions`](fieldoptions.md).[`listeners`](FieldOptions.md#listeners)

***

### name

```ts
name: TName;
```

Defined in: [packages/form-core/src/FieldApi.ts:414](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L414)

The field name. The type will be `DeepKeys<TParentData>` to ensure your name is a deep key of the parent dataset.

#### Inherited from

[`FieldOptions`](fieldoptions.md).[`name`](FieldOptions.md#name)

***

### validatorAdapter?

```ts
optional validatorAdapter: TFieldValidator;
```

Defined in: [packages/form-core/src/FieldApi.ts:430](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L430)

A validator provided by an extension, like `yupValidator` from `@tanstack/yup-form-adapter`

#### Inherited from

[`FieldOptions`](fieldoptions.md).[`validatorAdapter`](FieldOptions.md#validatoradapter)

***

### validators?

```ts
optional validators: FieldValidators<TParentData, TName, TFieldValidator, TFormValidator, TData, TOnMountReturn, TOnChangeReturn, TOnChangeAsyncReturn, TOnBlurReturn, TOnBlurAsyncReturn, TOnSubmitReturn, TOnSubmitAsyncReturn>;
```

Defined in: [packages/form-core/src/FieldApi.ts:434](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L434)

A list of validators to pass to the field

#### Inherited from

[`FieldOptions`](fieldoptions.md).[`validators`](FieldOptions.md#validators)
