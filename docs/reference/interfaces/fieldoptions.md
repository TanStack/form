---
id: FieldOptions
title: FieldOptions
---

# Interface: FieldOptions\<TParentData, TName, TFieldValidator, TFormValidator, TData, TParentMetaExtension\>

Defined in: [packages/form-core/src/FieldApi.ts:328](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L328)

An object type representing the options for a field in a form.

## Extended by

- [`FieldApiOptions`](fieldapioptions.md)

## Type Parameters

• **TParentData**

• **TName** *extends* [`DeepKeys`](../type-aliases/deepkeys.md)\<`TParentData`\>

• **TFieldValidator** *extends* 
  \| `Validator`\<[`DeepValue`](../type-aliases/deepvalue.md)\<`TParentData`, `TName`\>, `unknown`\>
  \| `undefined` = `undefined`

• **TFormValidator** *extends* `Validator`\<`TParentData`, `unknown`\> \| `undefined` = `undefined`

• **TData** *extends* [`DeepValue`](../type-aliases/deepvalue.md)\<`TParentData`, `TName`\> = [`DeepValue`](../type-aliases/deepvalue.md)\<`TParentData`, `TName`\>

• **TParentMetaExtension** *extends* `object` = `never`

## Properties

### asyncAlways?

```ts
optional asyncAlways: boolean;
```

Defined in: [packages/form-core/src/FieldApi.ts:355](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L355)

If `true`, always run async validation, even if there are errors emitted during synchronous validation.

***

### asyncDebounceMs?

```ts
optional asyncDebounceMs: number;
```

Defined in: [packages/form-core/src/FieldApi.ts:351](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L351)

The default time to debounce async validation if there is not a more specific debounce time passed.

***

### defaultMeta?

```ts
optional defaultMeta: Partial<FieldMeta>;
```

Defined in: [packages/form-core/src/FieldApi.ts:374](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L374)

An optional object with default metadata for the field.

***

### defaultValue?

```ts
optional defaultValue: NoInfer<TData>;
```

Defined in: [packages/form-core/src/FieldApi.ts:347](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L347)

An optional default value for the field.

***

### listeners?

```ts
optional listeners: FieldListeners<TParentData, TName, TFieldValidator, TFormValidator, TData, TParentMetaExtension>;
```

Defined in: [packages/form-core/src/FieldApi.ts:378](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L378)

A list of listeners which attach to the corresponding events

***

### name

```ts
name: TName;
```

Defined in: [packages/form-core/src/FieldApi.ts:343](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L343)

The field name. The type will be `DeepKeys<TParentData>` to ensure your name is a deep key of the parent dataset.

***

### validatorAdapter?

```ts
optional validatorAdapter: TFieldValidator;
```

Defined in: [packages/form-core/src/FieldApi.ts:359](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L359)

A validator provided by an extension, like `yupValidator` from `@tanstack/yup-form-adapter`

***

### validators?

```ts
optional validators: FieldValidators<TParentData, TName, TFieldValidator, TFormValidator, TData, TParentMetaExtension>;
```

Defined in: [packages/form-core/src/FieldApi.ts:363](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L363)

A list of validators to pass to the field
