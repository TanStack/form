# Interface: FieldApiOptions\<TParentData, TName, TFieldValidator, TFormValidator, TData\>

An object type representing the required options for the FieldApi class.

## Extends

- [`FieldOptions`](Interface.FieldOptions.md)\<`TParentData`, `TName`, `TFieldValidator`, `TFormValidator`, `TData`\>

## Type parameters

• **TParentData**

• **TName** *extends* [`DeepKeys`](Type.DeepKeys.md)\<`TParentData`\>

• **TFieldValidator** *extends* `Validator`\<[`DeepValue`](Type.DeepValue.md)\<`TParentData`, `TName`\>, `unknown`\> \| `undefined` = `undefined`

• **TFormValidator** *extends* `Validator`\<`TParentData`, `unknown`\> \| `undefined` = `undefined`

• **TData** *extends* [`DeepValue`](Type.DeepValue.md)\<`TParentData`, `TName`\> = [`DeepValue`](Type.DeepValue.md)\<`TParentData`, `TName`\>

## Properties

### asyncAlways?

```ts
optional asyncAlways: boolean;
```

If `true`, always run async validation, even if there are errors emitted during synchronous validation.

#### Inherited from

[`FieldOptions`](Interface.FieldOptions.md).[`asyncAlways`](Interface.FieldOptions.md#asyncalways)

#### Source

[packages/form-core/src/FieldApi.ts:283](https://github.com/TanStack/form/blob/15a69d908f9285338889d60e93b689d265e4136c/packages/form-core/src/FieldApi.ts#L283)

***

### asyncDebounceMs?

```ts
optional asyncDebounceMs: number;
```

The default time to debounce async validation if there is not a more specific debounce time passed.

#### Inherited from

[`FieldOptions`](Interface.FieldOptions.md).[`asyncDebounceMs`](Interface.FieldOptions.md#asyncdebouncems)

#### Source

[packages/form-core/src/FieldApi.ts:279](https://github.com/TanStack/form/blob/15a69d908f9285338889d60e93b689d265e4136c/packages/form-core/src/FieldApi.ts#L279)

***

### defaultMeta?

```ts
optional defaultMeta: Partial<FieldMeta>;
```

An optional object with default metadata for the field.

#### Inherited from

[`FieldOptions`](Interface.FieldOptions.md).[`defaultMeta`](Interface.FieldOptions.md#defaultmeta)

#### Source

[packages/form-core/src/FieldApi.ts:302](https://github.com/TanStack/form/blob/15a69d908f9285338889d60e93b689d265e4136c/packages/form-core/src/FieldApi.ts#L302)

***

### defaultValue?

```ts
optional defaultValue: NoInfer<TData>;
```

An optional default value for the field.

#### Inherited from

[`FieldOptions`](Interface.FieldOptions.md).[`defaultValue`](Interface.FieldOptions.md#defaultvalue)

#### Source

[packages/form-core/src/FieldApi.ts:275](https://github.com/TanStack/form/blob/15a69d908f9285338889d60e93b689d265e4136c/packages/form-core/src/FieldApi.ts#L275)

***

### form

```ts
form: FormApi<TParentData, TFormValidator>;
```

#### Source

[packages/form-core/src/FieldApi.ts:325](https://github.com/TanStack/form/blob/15a69d908f9285338889d60e93b689d265e4136c/packages/form-core/src/FieldApi.ts#L325)

***

### name

```ts
name: TName;
```

The field name. The type will be `DeepKeys<TParentData>` to ensure your name is a deep key of the parent dataset.

#### Inherited from

[`FieldOptions`](Interface.FieldOptions.md).[`name`](Interface.FieldOptions.md#name)

#### Source

[packages/form-core/src/FieldApi.ts:271](https://github.com/TanStack/form/blob/15a69d908f9285338889d60e93b689d265e4136c/packages/form-core/src/FieldApi.ts#L271)

***

### preserveValue?

```ts
optional preserveValue: boolean;
```

#### Inherited from

[`FieldOptions`](Interface.FieldOptions.md).[`preserveValue`](Interface.FieldOptions.md#preservevalue)

#### Source

[packages/form-core/src/FieldApi.ts:284](https://github.com/TanStack/form/blob/15a69d908f9285338889d60e93b689d265e4136c/packages/form-core/src/FieldApi.ts#L284)

***

### validatorAdapter?

```ts
optional validatorAdapter: TFieldValidator;
```

A validator provided by an extension, like `yupValidator` from `@tanstack/yup-form-adapter`

#### Inherited from

[`FieldOptions`](Interface.FieldOptions.md).[`validatorAdapter`](Interface.FieldOptions.md#validatoradapter)

#### Source

[packages/form-core/src/FieldApi.ts:288](https://github.com/TanStack/form/blob/15a69d908f9285338889d60e93b689d265e4136c/packages/form-core/src/FieldApi.ts#L288)

***

### validators?

```ts
optional validators: FieldValidators<TParentData, TName, TFieldValidator, TFormValidator, TData>;
```

A list of validators to pass to the field

#### Inherited from

[`FieldOptions`](Interface.FieldOptions.md).[`validators`](Interface.FieldOptions.md#validators)

#### Source

[packages/form-core/src/FieldApi.ts:292](https://github.com/TanStack/form/blob/15a69d908f9285338889d60e93b689d265e4136c/packages/form-core/src/FieldApi.ts#L292)
