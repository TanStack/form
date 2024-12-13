---
id: FieldApiOptions
title: FieldApiOptions
---

# Interface: FieldApiOptions\<TParentData, TName, TFieldValidator, TFormValidator, TData\>

An object type representing the required options for the FieldApi class.

## Extends

- [`FieldOptions`](fieldoptions.md)\<`TParentData`, `TName`, `TFieldValidator`, `TFormValidator`, `TData`\>

## Type Parameters

• **TParentData**

• **TName** *extends* [`DeepKeys`](../type-aliases/deepkeys.md)\<`TParentData`\>

• **TFieldValidator** *extends* `Validator`\<[`DeepValue`](../type-aliases/deepvalue.md)\<`TParentData`, `TName`\>, `unknown`\> = `Validator`\<[`DeepValue`](../type-aliases/deepvalue.md)\<`TParentData`, `TName`\>, [`StandardSchemaV1`](../type-aliases/standardschemav1.md)\<[`DeepValue`](../type-aliases/deepvalue.md)\<`TParentData`, `TName`\>\>\>

• **TFormValidator** *extends* `Validator`\<`TParentData`, `unknown`\> = `Validator`\<`TParentData`, [`StandardSchemaV1`](../type-aliases/standardschemav1.md)\<`TParentData`\>\>

• **TData** *extends* [`DeepValue`](../type-aliases/deepvalue.md)\<`TParentData`, `TName`\> = [`DeepValue`](../type-aliases/deepvalue.md)\<`TParentData`, `TName`\>

## Properties

### asyncAlways?

```ts
optional asyncAlways: boolean;
```

If `true`, always run async validation, even if there are errors emitted during synchronous validation.

#### Inherited from

[`FieldOptions`](fieldoptions.md).[`asyncAlways`](FieldOptions.md#asyncalways)

#### Defined in

[packages/form-core/src/FieldApi.ts:349](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L349)

***

### asyncDebounceMs?

```ts
optional asyncDebounceMs: number;
```

The default time to debounce async validation if there is not a more specific debounce time passed.

#### Inherited from

[`FieldOptions`](fieldoptions.md).[`asyncDebounceMs`](FieldOptions.md#asyncdebouncems)

#### Defined in

[packages/form-core/src/FieldApi.ts:345](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L345)

***

### defaultMeta?

```ts
optional defaultMeta: Partial<FieldMeta>;
```

An optional object with default metadata for the field.

#### Inherited from

[`FieldOptions`](fieldoptions.md).[`defaultMeta`](FieldOptions.md#defaultmeta)

#### Defined in

[packages/form-core/src/FieldApi.ts:367](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L367)

***

### defaultValue?

```ts
optional defaultValue: NoInfer<TData>;
```

An optional default value for the field.

#### Inherited from

[`FieldOptions`](fieldoptions.md).[`defaultValue`](FieldOptions.md#defaultvalue)

#### Defined in

[packages/form-core/src/FieldApi.ts:341](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L341)

***

### form

```ts
form: FormApi<TParentData, TFormValidator>;
```

#### Defined in

[packages/form-core/src/FieldApi.ts:405](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L405)

***

### listeners?

```ts
optional listeners: FieldListeners<TParentData, TName, TFieldValidator, TFormValidator, TData>;
```

A list of listeners which attach to the corresponding events

#### Inherited from

[`FieldOptions`](fieldoptions.md).[`listeners`](FieldOptions.md#listeners)

#### Defined in

[packages/form-core/src/FieldApi.ts:371](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L371)

***

### name

```ts
name: TName;
```

The field name. The type will be `DeepKeys<TParentData>` to ensure your name is a deep key of the parent dataset.

#### Inherited from

[`FieldOptions`](fieldoptions.md).[`name`](FieldOptions.md#name)

#### Defined in

[packages/form-core/src/FieldApi.ts:337](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L337)

***

### validatorAdapter?

```ts
optional validatorAdapter: TFieldValidator;
```

A validator provided by an extension, like `yupValidator` from `@tanstack/yup-form-adapter`

#### Inherited from

[`FieldOptions`](fieldoptions.md).[`validatorAdapter`](FieldOptions.md#validatoradapter)

#### Defined in

[packages/form-core/src/FieldApi.ts:353](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L353)

***

### validators?

```ts
optional validators: FieldValidators<TParentData, TName, TFieldValidator, TFormValidator, TData>;
```

A list of validators to pass to the field

#### Inherited from

[`FieldOptions`](fieldoptions.md).[`validators`](FieldOptions.md#validators)

#### Defined in

[packages/form-core/src/FieldApi.ts:357](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L357)
