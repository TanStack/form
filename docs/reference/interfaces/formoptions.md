---
id: FormOptions
title: FormOptions
---

# Interface: FormOptions\<TFormData, TFormValidator, TFormSubmitMeta\>

Defined in: [packages/form-core/src/FormApi.ts:168](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L168)

An object representing the options for a form.

## Type Parameters

• **TFormData**

• **TFormValidator** *extends* `Validator`\<`TFormData`, `unknown`\> \| `undefined` = `undefined`

• **TFormSubmitMeta** = `never`

## Properties

### asyncAlways?

```ts
optional asyncAlways: boolean;
```

Defined in: [packages/form-core/src/FormApi.ts:184](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L184)

If true, always run async validation, even when sync validation has produced an error. Defaults to undefined.

***

### asyncDebounceMs?

```ts
optional asyncDebounceMs: number;
```

Defined in: [packages/form-core/src/FormApi.ts:188](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L188)

Optional time in milliseconds if you want to introduce a delay before firing off an async action.

***

### defaultState?

```ts
optional defaultState: Partial<FormState<TFormData>>;
```

Defined in: [packages/form-core/src/FormApi.ts:180](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L180)

The default state for the form.

***

### defaultValues?

```ts
optional defaultValues: TFormData;
```

Defined in: [packages/form-core/src/FormApi.ts:176](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L176)

Set initial values for your form.

***

### onSubmit()?

```ts
optional onSubmit: (props) => any;
```

Defined in: [packages/form-core/src/FormApi.ts:200](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L200)

A function to be called when the form is submitted, what should happen once the user submits a valid form returns `any` or a promise `Promise<any>`

#### Parameters

##### props

\[`TFormSubmitMeta`\] *extends* \[`never`\] ? `object` : `object`

#### Returns

`any`

***

### onSubmitInvalid()?

```ts
optional onSubmitInvalid: (props) => void;
```

Defined in: [packages/form-core/src/FormApi.ts:215](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L215)

Specify an action for scenarios where the user tries to submit an invalid form.

#### Parameters

##### props

###### formApi

[`FormApi`](../classes/formapi.md)\<`TFormData`, `TFormValidator`, `TFormSubmitMeta`\>

###### value

`TFormData`

#### Returns

`void`

***

### onSubmitMeta?

```ts
optional onSubmitMeta: TFormSubmitMeta;
```

Defined in: [packages/form-core/src/FormApi.ts:222](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L222)

onSubmitMeta, the data passed from the handleSubmit handler, to the onSubmit function props

***

### transform?

```ts
optional transform: FormTransform<TFormData, TFormValidator, TFormSubmitMeta>;
```

Defined in: [packages/form-core/src/FormApi.ts:224](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L224)

***

### validatorAdapter?

```ts
optional validatorAdapter: TFormValidator;
```

Defined in: [packages/form-core/src/FormApi.ts:192](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L192)

A validator adapter to support usage of extra validation types (IE: Zod, Yup, or Valibot usage)

***

### validators?

```ts
optional validators: FormValidators<TFormData, TFormValidator, TFormSubmitMeta>;
```

Defined in: [packages/form-core/src/FormApi.ts:196](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L196)

A list of validators to pass to the form
