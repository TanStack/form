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

[packages/form-core/src/FormApi.ts:158](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L158)

***

### asyncDebounceMs?

```ts
optional asyncDebounceMs: number;
```

Optional time in milliseconds if you want to introduce a delay before firing off an async action.

#### Defined in

[packages/form-core/src/FormApi.ts:162](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L162)

***

### defaultState?

```ts
optional defaultState: Partial<FormState<TFormData>>;
```

The default state for the form.

#### Defined in

[packages/form-core/src/FormApi.ts:154](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L154)

***

### defaultValues?

```ts
optional defaultValues: TFormData;
```

Set initial values for your form.

#### Defined in

[packages/form-core/src/FormApi.ts:150](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L150)

***

### onSubmit()?

```ts
optional onSubmit: (props) => any;
```

A function to be called when the form is submitted, what should happen once the user submits a valid form returns `any` or a promise `Promise<any>`

#### Parameters

##### props

###### formApi

[`FormApi`](../classes/formapi.md)\<`TFormData`, `TFormValidator`\>

###### value

`TFormData`

#### Returns

`any`

#### Defined in

[packages/form-core/src/FormApi.ts:174](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L174)

***

### onSubmitInvalid()?

```ts
optional onSubmitInvalid: (props) => void;
```

Specify an action for scenarios where the user tries to submit an invalid form.

#### Parameters

##### props

###### formApi

[`FormApi`](../classes/formapi.md)\<`TFormData`, `TFormValidator`\>

###### value

`TFormData`

#### Returns

`void`

#### Defined in

[packages/form-core/src/FormApi.ts:181](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L181)

***

### transform?

```ts
optional transform: FormTransform<TFormData, TFormValidator>;
```

#### Defined in

[packages/form-core/src/FormApi.ts:185](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L185)

***

### validatorAdapter?

```ts
optional validatorAdapter: TFormValidator;
```

A validator adapter to support usage of extra validation types (IE: Zod, Yup, or Valibot usage)

#### Defined in

[packages/form-core/src/FormApi.ts:166](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L166)

***

### validators?

```ts
optional validators: FormValidators<TFormData, TFormValidator>;
```

A list of validators to pass to the form

#### Defined in

[packages/form-core/src/FormApi.ts:170](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L170)
