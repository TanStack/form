---
id: FormOptions
title: FormOptions
---

# Interface: FormOptions\<TFormData, TFormValidator, TFormSubmitMeta\>

Defined in: [packages/form-core/src/FormApi.ts:167](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L167)

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

Defined in: [packages/form-core/src/FormApi.ts:183](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L183)

If true, always run async validation, even when sync validation has produced an error. Defaults to undefined.

***

### asyncDebounceMs?

```ts
optional asyncDebounceMs: number;
```

Defined in: [packages/form-core/src/FormApi.ts:187](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L187)

Optional time in milliseconds if you want to introduce a delay before firing off an async action.

***

### defaultState?

```ts
optional defaultState: Partial<FormState<TFormData>>;
```

Defined in: [packages/form-core/src/FormApi.ts:179](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L179)

The default state for the form.

***

### defaultValues?

```ts
optional defaultValues: TFormData;
```

Defined in: [packages/form-core/src/FormApi.ts:175](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L175)

Set initial values for your form.

***

### onSubmit()?

```ts
optional onSubmit: (props) => any;
```

Defined in: [packages/form-core/src/FormApi.ts:199](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L199)

A function to be called when the form is submitted, what should happen once the user submits a valid form returns `any` or a promise `Promise<any>`

#### Parameters

##### props

`object` & `TFormSubmitMeta` *extends* `never` ? `object` : `object`

#### Returns

`any`

***

### onSubmitInvalid()?

```ts
optional onSubmitInvalid: (props) => void;
```

Defined in: [packages/form-core/src/FormApi.ts:208](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L208)

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

Defined in: [packages/form-core/src/FormApi.ts:215](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L215)

onSubmitMeta, the data passed from the handleSubmit handler, to the onSubmit function props

***

### transform?

```ts
optional transform: FormTransform<TFormData, TFormValidator, TFormSubmitMeta>;
```

Defined in: [packages/form-core/src/FormApi.ts:217](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L217)

***

### validatorAdapter?

```ts
optional validatorAdapter: TFormValidator;
```

Defined in: [packages/form-core/src/FormApi.ts:191](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L191)

A validator adapter to support usage of extra validation types (IE: Zod, Yup, or Valibot usage)

***

### validators?

```ts
optional validators: FormValidators<TFormData, TFormValidator, TFormSubmitMeta>;
```

Defined in: [packages/form-core/src/FormApi.ts:195](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L195)

A list of validators to pass to the form
