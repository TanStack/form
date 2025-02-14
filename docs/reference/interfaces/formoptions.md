---
id: FormOptions
title: FormOptions
---

# Interface: FormOptions\<TFormData, TFormValidator\>

Defined in: [packages/form-core/src/FormApi.ts:150](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L150)

An object representing the options for a form.

## Type Parameters

• **TFormData**

• **TFormValidator** *extends* `Validator`\<`TFormData`, `unknown`\> \| `undefined` = `undefined`

## Properties

### asyncAlways?

```ts
optional asyncAlways: boolean;
```

Defined in: [packages/form-core/src/FormApi.ts:165](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L165)

If true, always run async validation, even when sync validation has produced an error. Defaults to undefined.

***

### asyncDebounceMs?

```ts
optional asyncDebounceMs: number;
```

Defined in: [packages/form-core/src/FormApi.ts:169](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L169)

Optional time in milliseconds if you want to introduce a delay before firing off an async action.

***

### defaultState?

```ts
optional defaultState: Partial<FormState<TFormData>>;
```

Defined in: [packages/form-core/src/FormApi.ts:161](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L161)

The default state for the form.

***

### defaultValues?

```ts
optional defaultValues: TFormData;
```

Defined in: [packages/form-core/src/FormApi.ts:157](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L157)

Set initial values for your form.

***

### onSubmit()?

```ts
optional onSubmit: (props) => any;
```

Defined in: [packages/form-core/src/FormApi.ts:181](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L181)

A function to be called when the form is submitted, what should happen once the user submits a valid form returns `any` or a promise `Promise<any>`

#### Parameters

##### props

###### formApi

[`FormApi`](../classes/formapi.md)\<`TFormData`, `TFormValidator`\>

###### value

`TFormData`

#### Returns

`any`

***

### onSubmitInvalid()?

```ts
optional onSubmitInvalid: (props) => void;
```

Defined in: [packages/form-core/src/FormApi.ts:188](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L188)

Specify an action for scenarios where the user tries to submit an invalid form.

#### Parameters

##### props

###### formApi

[`FormApi`](../classes/formapi.md)\<`TFormData`, `TFormValidator`\>

###### value

`TFormData`

#### Returns

`void`

***

### transform?

```ts
optional transform: FormTransform<TFormData, TFormValidator>;
```

Defined in: [packages/form-core/src/FormApi.ts:192](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L192)

***

### validatorAdapter?

```ts
optional validatorAdapter: TFormValidator;
```

Defined in: [packages/form-core/src/FormApi.ts:173](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L173)

A validator adapter to support usage of extra validation types (IE: Zod, Yup, or Valibot usage)

***

### validators?

```ts
optional validators: FormValidators<TFormData, TFormValidator>;
```

Defined in: [packages/form-core/src/FormApi.ts:177](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L177)

A list of validators to pass to the form
