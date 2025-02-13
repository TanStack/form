---
id: FieldApiOptions
title: FieldApiOptions
---

# Interface: FieldApiOptions\<TParentData, TName, TFieldValidator, TFormValidator, TData, TParentMetaExtension\>

Defined in: [packages/form-core/src/FieldApi.ts:391](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L391)

An object type representing the required options for the FieldApi class.

## Extends

- [`FieldOptions`](fieldoptions.md)\<`TParentData`, `TName`, `TFieldValidator`, `TFormValidator`, `TData`, `TParentMetaExtension`\>

## Type Parameters

• **TParentData**

• **TName** *extends* [`DeepKeys`](../type-aliases/deepkeys.md)\<`TParentData`\>

• **TFieldValidator** *extends* 
  \| `Validator`\<[`DeepValue`](../type-aliases/deepvalue.md)\<`TParentData`, `TName`\>, `unknown`\>
  \| `undefined` = `undefined`

• **TFormValidator** *extends* `Validator`\<`TParentData`, `unknown`\> \| `undefined` = `undefined`

• **TData** *extends* [`DeepValue`](../type-aliases/deepvalue.md)\<`TParentData`, `TName`\> = [`DeepValue`](../type-aliases/deepvalue.md)\<`TParentData`, `TName`\>

• **TParentMetaExtension** = `never`

## Properties

### asyncAlways?

```ts
optional asyncAlways: boolean;
```

Defined in: [packages/form-core/src/FieldApi.ts:355](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L355)

If `true`, always run async validation, even if there are errors emitted during synchronous validation.

#### Inherited from

[`FieldOptions`](fieldoptions.md).[`asyncAlways`](FieldOptions.md#asyncalways)

***

### asyncDebounceMs?

```ts
optional asyncDebounceMs: number;
```

Defined in: [packages/form-core/src/FieldApi.ts:351](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L351)

The default time to debounce async validation if there is not a more specific debounce time passed.

#### Inherited from

[`FieldOptions`](fieldoptions.md).[`asyncDebounceMs`](FieldOptions.md#asyncdebouncems)

***

### defaultMeta?

```ts
optional defaultMeta: Partial<FieldMeta>;
```

Defined in: [packages/form-core/src/FieldApi.ts:374](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L374)

An optional object with default metadata for the field.

#### Inherited from

[`FieldOptions`](fieldoptions.md).[`defaultMeta`](FieldOptions.md#defaultmeta)

***

### defaultValue?

```ts
optional defaultValue: NoInfer<TData>;
```

Defined in: [packages/form-core/src/FieldApi.ts:347](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L347)

An optional default value for the field.

#### Inherited from

[`FieldOptions`](fieldoptions.md).[`defaultValue`](FieldOptions.md#defaultvalue)

***

### form

```ts
form: FormApi<TParentData, TFormValidator, TParentMetaExtension>;
```

Defined in: [packages/form-core/src/FieldApi.ts:410](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L410)

***

### listeners?

```ts
optional listeners: FieldListeners<TParentData, TName, TFieldValidator, TFormValidator, TData, TParentMetaExtension>;
```

Defined in: [packages/form-core/src/FieldApi.ts:378](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L378)

A list of listeners which attach to the corresponding events

#### Inherited from

[`FieldOptions`](fieldoptions.md).[`listeners`](FieldOptions.md#listeners)

***

### name

```ts
name: TName;
```

Defined in: [packages/form-core/src/FieldApi.ts:343](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L343)

The field name. The type will be `DeepKeys<TParentData>` to ensure your name is a deep key of the parent dataset.

#### Inherited from

[`FieldOptions`](fieldoptions.md).[`name`](FieldOptions.md#name)

***

### validatorAdapter?

```ts
optional validatorAdapter: TFieldValidator;
```

Defined in: [packages/form-core/src/FieldApi.ts:359](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L359)

A validator provided by an extension, like `yupValidator` from `@tanstack/yup-form-adapter`

#### Inherited from

[`FieldOptions`](fieldoptions.md).[`validatorAdapter`](FieldOptions.md#validatoradapter)

***

### validators?

```ts
optional validators: FieldValidators<TParentData, TName, TFieldValidator, TFormValidator, TData, TParentMetaExtension>;
```

Defined in: [packages/form-core/src/FieldApi.ts:363](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L363)

A list of validators to pass to the field

#### Inherited from

[`FieldOptions`](fieldoptions.md).[`validators`](FieldOptions.md#validators)
