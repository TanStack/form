---
id: FormOptions
title: FormOptions
---

# Interface: FormOptions\<TFormData, TFormValidator\>

An object representing the options for a form.

## Type Parameters

• **TFormData**

• **TFormValidator** *extends* `Validator`\<`TFormData`, `unknown`\> \| `undefined` = `undefined`

## Properties

### asyncAlways?

```ts
optional asyncAlways: boolean;
```

If true, always run async validation, even when sync validation has produced an error. Defaults to undefined.

#### Defined in

[packages/form-core/src/FormApi.ts:133](https://github.com/TanStack/form/blob/bde3b1cb3de955b47034f0bfaa43dec13c67999a/packages/form-core/src/FormApi.ts#L133)

***

### asyncDebounceMs?

```ts
optional asyncDebounceMs: number;
```

Optional time in milliseconds if you want to introduce a delay before firing off an async action.

#### Defined in

[packages/form-core/src/FormApi.ts:137](https://github.com/TanStack/form/blob/bde3b1cb3de955b47034f0bfaa43dec13c67999a/packages/form-core/src/FormApi.ts#L137)

***

### defaultState?

```ts
optional defaultState: Partial<FormState<TFormData>>;
```

The default state for the form.

#### Defined in

[packages/form-core/src/FormApi.ts:129](https://github.com/TanStack/form/blob/bde3b1cb3de955b47034f0bfaa43dec13c67999a/packages/form-core/src/FormApi.ts#L129)

***

### defaultValues?

```ts
optional defaultValues: TFormData;
```

Set initial values for your form.

#### Defined in

[packages/form-core/src/FormApi.ts:125](https://github.com/TanStack/form/blob/bde3b1cb3de955b47034f0bfaa43dec13c67999a/packages/form-core/src/FormApi.ts#L125)

***

### onSubmit()?

```ts
optional onSubmit: (props) => any;
```

A function to be called when the form is submitted, what should happen once the user submits a valid form returns `any` or a promise `Promise<any>`

#### Parameters

• **props**

• **props.formApi**: [`FormApi`](../classes/formapi.md)\<`TFormData`, `TFormValidator`\>

• **props.value**: `TFormData`

#### Returns

`any`

#### Defined in

[packages/form-core/src/FormApi.ts:149](https://github.com/TanStack/form/blob/bde3b1cb3de955b47034f0bfaa43dec13c67999a/packages/form-core/src/FormApi.ts#L149)

***

### onSubmitInvalid()?

```ts
optional onSubmitInvalid: (props) => void;
```

Specify an action for scenarios where the user tries to submit an invalid form.

#### Parameters

• **props**

• **props.formApi**: [`FormApi`](../classes/formapi.md)\<`TFormData`, `TFormValidator`\>

• **props.value**: `TFormData`

#### Returns

`void`

#### Defined in

[packages/form-core/src/FormApi.ts:156](https://github.com/TanStack/form/blob/bde3b1cb3de955b47034f0bfaa43dec13c67999a/packages/form-core/src/FormApi.ts#L156)

***

### transform?

```ts
optional transform: FormTransform<TFormData, TFormValidator>;
```

#### Defined in

[packages/form-core/src/FormApi.ts:160](https://github.com/TanStack/form/blob/bde3b1cb3de955b47034f0bfaa43dec13c67999a/packages/form-core/src/FormApi.ts#L160)

***

### validatorAdapter?

```ts
optional validatorAdapter: TFormValidator;
```

A validator adapter to support usage of extra validation types (IE: Zod, Yup, or Valibot usage)

#### Defined in

[packages/form-core/src/FormApi.ts:141](https://github.com/TanStack/form/blob/bde3b1cb3de955b47034f0bfaa43dec13c67999a/packages/form-core/src/FormApi.ts#L141)

***

### validators?

```ts
optional validators: FormValidators<TFormData, TFormValidator>;
```

A list of validators to pass to the form

#### Defined in

[packages/form-core/src/FormApi.ts:145](https://github.com/TanStack/form/blob/bde3b1cb3de955b47034f0bfaa43dec13c67999a/packages/form-core/src/FormApi.ts#L145)
