---
id: FieldOptions
title: FieldOptions
---

# Interface: FieldOptions\<TParentData, TName, TFieldValidator, TFormValidator, TData, TOnMountReturn, TOnChangeReturn, TOnChangeAsyncReturn, TOnBlurReturn, TOnBlurAsyncReturn, TOnSubmitReturn, TOnSubmitAsyncReturn\>

An object type representing the options for a field in a form.

## Extended by

- [`FieldApiOptions`](fieldapioptions.md)

## Type Parameters

• **TParentData**

• **TName** *extends* [`DeepKeys`](../type-aliases/deepkeys.md)\<`TParentData`\>

• **TFieldValidator** *extends* `Validator`\<[`DeepValue`](../type-aliases/deepvalue.md)\<`TParentData`, `TName`\>, `unknown`\> \| `undefined` = `undefined`

• **TFormValidator** *extends* `Validator`\<`TParentData`, `unknown`\> \| `undefined` = `undefined`

• **TData** *extends* [`DeepValue`](../type-aliases/deepvalue.md)\<`TParentData`, `TName`\> = [`DeepValue`](../type-aliases/deepvalue.md)\<`TParentData`, `TName`\>

• **TOnMountReturn** = `undefined`

• **TOnChangeReturn** = `undefined`

• **TOnChangeAsyncReturn** = `undefined`

• **TOnBlurReturn** = `undefined`

• **TOnBlurAsyncReturn** = `undefined`

• **TOnSubmitReturn** = `undefined`

• **TOnSubmitAsyncReturn** = `undefined`

## Properties

### asyncAlways?

```ts
optional asyncAlways: boolean;
```

If `true`, always run async validation, even if there are errors emitted during synchronous validation.

#### Defined in

[packages/form-core/src/FieldApi.ts:426](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L426)

***

### asyncDebounceMs?

```ts
optional asyncDebounceMs: number;
```

The default time to debounce async validation if there is not a more specific debounce time passed.

#### Defined in

[packages/form-core/src/FieldApi.ts:422](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L422)

***

### defaultMeta?

```ts
optional defaultMeta: Partial<FieldMeta<undefined, undefined, undefined, undefined, undefined, undefined, undefined>>;
```

An optional object with default metadata for the field.

#### Defined in

[packages/form-core/src/FieldApi.ts:451](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L451)

***

### defaultValue?

```ts
optional defaultValue: NoInfer<TData>;
```

An optional default value for the field.

#### Defined in

[packages/form-core/src/FieldApi.ts:418](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L418)

***

### listeners?

```ts
optional listeners: FieldListeners<TParentData, TName, TFieldValidator, TFormValidator, TData>;
```

A list of listeners which attach to the corresponding events

#### Defined in

[packages/form-core/src/FieldApi.ts:455](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L455)

***

### name

```ts
name: TName;
```

The field name. The type will be `DeepKeys<TParentData>` to ensure your name is a deep key of the parent dataset.

#### Defined in

[packages/form-core/src/FieldApi.ts:414](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L414)

***

### validatorAdapter?

```ts
optional validatorAdapter: TFieldValidator;
```

A validator provided by an extension, like `yupValidator` from `@tanstack/yup-form-adapter`

#### Defined in

[packages/form-core/src/FieldApi.ts:430](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L430)

***

### validators?

```ts
optional validators: FieldValidators<TParentData, TName, TFieldValidator, TFormValidator, TData, TOnMountReturn, TOnChangeReturn, TOnChangeAsyncReturn, TOnBlurReturn, TOnBlurAsyncReturn, TOnSubmitReturn, TOnSubmitAsyncReturn>;
```

A list of validators to pass to the field

#### Defined in

[packages/form-core/src/FieldApi.ts:434](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L434)
