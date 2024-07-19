---
id: FieldApiOptions
title: FieldApiOptions
---

# Interface: FieldApiOptions\<TParentData, TName, TFieldValidator, TFormValidator, TData\>

An object type representing the required options for the FieldApi class.

## Extends

- [`FieldOptions`](FieldOptions.md)\<`TParentData`, `TName`, `TFieldValidator`, `TFormValidator`, `TData`\>

## Type Parameters

• **TParentData**

• **TName** *extends* [`DeepKeys`](DeepKeys.md)\<`TParentData`\>

• **TFieldValidator** *extends* `Validator`\<[`DeepValue`](DeepValue.md)\<`TParentData`, `TName`\>, `unknown`\> \| `undefined` = `undefined`

• **TFormValidator** *extends* `Validator`\<`TParentData`, `unknown`\> \| `undefined` = `undefined`

• **TData** *extends* [`DeepValue`](DeepValue.md)\<`TParentData`, `TName`\> = [`DeepValue`](DeepValue.md)\<`TParentData`, `TName`\>

## Properties

### asyncAlways?

```ts
optional asyncAlways: boolean;
```

If `true`, always run async validation, even if there are errors emitted during synchronous validation.

#### Inherited from

[`FieldOptions`](FieldOptions.md).[`asyncAlways`](Interface.FieldOptions.md#asyncalways)

#### Defined in

[packages/form-core/src/FieldApi.ts:284](https://github.com/TanStack/form/blob/a6313b7699753752ae30ff16c169e0b08c2369e8/packages/form-core/src/FieldApi.ts#L284)

***

### asyncDebounceMs?

```ts
optional asyncDebounceMs: number;
```

The default time to debounce async validation if there is not a more specific debounce time passed.

#### Inherited from

[`FieldOptions`](FieldOptions.md).[`asyncDebounceMs`](Interface.FieldOptions.md#asyncdebouncems)

#### Defined in

[packages/form-core/src/FieldApi.ts:280](https://github.com/TanStack/form/blob/a6313b7699753752ae30ff16c169e0b08c2369e8/packages/form-core/src/FieldApi.ts#L280)

***

### defaultMeta?

```ts
optional defaultMeta: Partial<FieldMeta>;
```

An optional object with default metadata for the field.

#### Inherited from

[`FieldOptions`](FieldOptions.md).[`defaultMeta`](Interface.FieldOptions.md#defaultmeta)

#### Defined in

[packages/form-core/src/FieldApi.ts:302](https://github.com/TanStack/form/blob/a6313b7699753752ae30ff16c169e0b08c2369e8/packages/form-core/src/FieldApi.ts#L302)

***

### defaultValue?

```ts
optional defaultValue: NoInfer<TData>;
```

An optional default value for the field.

#### Inherited from

[`FieldOptions`](FieldOptions.md).[`defaultValue`](Interface.FieldOptions.md#defaultvalue)

#### Defined in

[packages/form-core/src/FieldApi.ts:276](https://github.com/TanStack/form/blob/a6313b7699753752ae30ff16c169e0b08c2369e8/packages/form-core/src/FieldApi.ts#L276)

***

### form

```ts
form: FormApi<TParentData, TFormValidator>;
```

#### Defined in

[packages/form-core/src/FieldApi.ts:325](https://github.com/TanStack/form/blob/a6313b7699753752ae30ff16c169e0b08c2369e8/packages/form-core/src/FieldApi.ts#L325)

***

### name

```ts
name: TName;
```

The field name. The type will be `DeepKeys<TParentData>` to ensure your name is a deep key of the parent dataset.

#### Inherited from

[`FieldOptions`](FieldOptions.md).[`name`](Interface.FieldOptions.md#name)

#### Defined in

[packages/form-core/src/FieldApi.ts:272](https://github.com/TanStack/form/blob/a6313b7699753752ae30ff16c169e0b08c2369e8/packages/form-core/src/FieldApi.ts#L272)

***

### validatorAdapter?

```ts
optional validatorAdapter: TFieldValidator;
```

A validator provided by an extension, like `yupValidator` from `@tanstack/yup-form-adapter`

#### Inherited from

[`FieldOptions`](FieldOptions.md).[`validatorAdapter`](Interface.FieldOptions.md#validatoradapter)

#### Defined in

[packages/form-core/src/FieldApi.ts:288](https://github.com/TanStack/form/blob/a6313b7699753752ae30ff16c169e0b08c2369e8/packages/form-core/src/FieldApi.ts#L288)

***

### validators?

```ts
optional validators: FieldValidators<TParentData, TName, TFieldValidator, TFormValidator, TData>;
```

A list of validators to pass to the field

#### Inherited from

[`FieldOptions`](FieldOptions.md).[`validators`](Interface.FieldOptions.md#validators)

#### Defined in

[packages/form-core/src/FieldApi.ts:292](https://github.com/TanStack/form/blob/a6313b7699753752ae30ff16c169e0b08c2369e8/packages/form-core/src/FieldApi.ts#L292)
