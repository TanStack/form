# Interface: FieldOptions\<TParentData, TName, TFieldValidator, TFormValidator, TData\>

An object type representing the options for a field in a form.

## Extended by

- [`FieldApiOptions`](fieldapioptions.md)

## Type Parameters

• **TParentData**

• **TName** *extends* [`DeepKeys`](deepkeys.md)\<`TParentData`\>

• **TFieldValidator** *extends* `Validator`\<[`DeepValue`](deepvalue.md)\<`TParentData`, `TName`\>, `unknown`\> \| `undefined` = `undefined`

• **TFormValidator** *extends* `Validator`\<`TParentData`, `unknown`\> \| `undefined` = `undefined`

• **TData** *extends* [`DeepValue`](deepvalue.md)\<`TParentData`, `TName`\> = [`DeepValue`](deepvalue.md)\<`TParentData`, `TName`\>

## Properties

### asyncAlways?

```ts
optional asyncAlways: boolean;
```

If `true`, always run async validation, even if there are errors emitted during synchronous validation.

#### Defined in

[packages/form-core/src/FieldApi.ts:284](https://github.com/TanStack/form/blob/2bebfd5214c4cdfbf6feacb7b1e25a6825957062/packages/form-core/src/FieldApi.ts#L284)

***

### asyncDebounceMs?

```ts
optional asyncDebounceMs: number;
```

The default time to debounce async validation if there is not a more specific debounce time passed.

#### Defined in

[packages/form-core/src/FieldApi.ts:280](https://github.com/TanStack/form/blob/2bebfd5214c4cdfbf6feacb7b1e25a6825957062/packages/form-core/src/FieldApi.ts#L280)

***

### defaultMeta?

```ts
optional defaultMeta: Partial<FieldMeta>;
```

An optional object with default metadata for the field.

#### Defined in

[packages/form-core/src/FieldApi.ts:302](https://github.com/TanStack/form/blob/2bebfd5214c4cdfbf6feacb7b1e25a6825957062/packages/form-core/src/FieldApi.ts#L302)

***

### defaultValue?

```ts
optional defaultValue: NoInfer<TData>;
```

An optional default value for the field.

#### Defined in

[packages/form-core/src/FieldApi.ts:276](https://github.com/TanStack/form/blob/2bebfd5214c4cdfbf6feacb7b1e25a6825957062/packages/form-core/src/FieldApi.ts#L276)

***

### name

```ts
name: TName;
```

The field name. The type will be `DeepKeys<TParentData>` to ensure your name is a deep key of the parent dataset.

#### Defined in

[packages/form-core/src/FieldApi.ts:272](https://github.com/TanStack/form/blob/2bebfd5214c4cdfbf6feacb7b1e25a6825957062/packages/form-core/src/FieldApi.ts#L272)

***

### validatorAdapter?

```ts
optional validatorAdapter: TFieldValidator;
```

A validator provided by an extension, like `yupValidator` from `@tanstack/yup-form-adapter`

#### Defined in

[packages/form-core/src/FieldApi.ts:288](https://github.com/TanStack/form/blob/2bebfd5214c4cdfbf6feacb7b1e25a6825957062/packages/form-core/src/FieldApi.ts#L288)

***

### validators?

```ts
optional validators: FieldValidators<TParentData, TName, TFieldValidator, TFormValidator, TData>;
```

A list of validators to pass to the field

#### Defined in

[packages/form-core/src/FieldApi.ts:292](https://github.com/TanStack/form/blob/2bebfd5214c4cdfbf6feacb7b1e25a6825957062/packages/form-core/src/FieldApi.ts#L292)
