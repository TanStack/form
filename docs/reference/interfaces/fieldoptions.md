---
id: FieldOptions
title: FieldOptions
---

# Interface: FieldOptions\<TParentData, TName, TFieldValidator, TFormValidator, TData\>

An object type representing the options for a field in a form.

## Extended by

- [`FieldApiOptions`](fieldapioptions.md)

## Type Parameters

• **TParentData**

• **TName** *extends* [`DeepKeys`](../type-aliases/deepkeys.md)\<`TParentData`\>

• **TFieldValidator** *extends* `Validator`\<[`DeepValue`](../type-aliases/deepvalue.md)\<`TParentData`, `TName`\>, `unknown`\> \| `undefined` = `undefined`

• **TFormValidator** *extends* `Validator`\<`TParentData`, `unknown`\> \| `undefined` = `undefined`

• **TData** *extends* [`DeepValue`](../type-aliases/deepvalue.md)\<`TParentData`, `TName`\> = [`DeepValue`](../type-aliases/deepvalue.md)\<`TParentData`, `TName`\>

## Properties

### asyncAlways?

```ts
optional asyncAlways: boolean;
```

If `true`, always run async validation, even if there are errors emitted during synchronous validation.

#### Defined in

[packages/form-core/src/FieldApi.ts:319](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L319)

***

### asyncDebounceMs?

```ts
optional asyncDebounceMs: number;
```

The default time to debounce async validation if there is not a more specific debounce time passed.

#### Defined in

[packages/form-core/src/FieldApi.ts:315](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L315)

***

### defaultMeta?

```ts
optional defaultMeta: Partial<FieldMeta>;
```

An optional object with default metadata for the field.

#### Defined in

[packages/form-core/src/FieldApi.ts:337](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L337)

***

### defaultValue?

```ts
optional defaultValue: NoInfer<TData>;
```

An optional default value for the field.

#### Defined in

[packages/form-core/src/FieldApi.ts:311](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L311)

***

### listeners?

```ts
optional listeners: FieldListeners<TParentData, TName, TFieldValidator, TFormValidator, TData>;
```

A list of listeners which attach to the corresponding events

#### Defined in

[packages/form-core/src/FieldApi.ts:341](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L341)

***

### name

```ts
name: TName;
```

The field name. The type will be `DeepKeys<TParentData>` to ensure your name is a deep key of the parent dataset.

#### Defined in

[packages/form-core/src/FieldApi.ts:307](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L307)

***

### validatorAdapter?

```ts
optional validatorAdapter: TFieldValidator;
```

A validator provided by an extension, like `yupValidator` from `@tanstack/yup-form-adapter`

#### Defined in

[packages/form-core/src/FieldApi.ts:323](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L323)

***

### validators?

```ts
optional validators: FieldValidators<TParentData, TName, TFieldValidator, TFormValidator, TData>;
```

A list of validators to pass to the field

#### Defined in

[packages/form-core/src/FieldApi.ts:327](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L327)
