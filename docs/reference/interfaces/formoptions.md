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

[packages/form-core/src/FormApi.ts:163](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L163)

***

### asyncDebounceMs?

```ts
optional asyncDebounceMs: number;
```

Optional time in milliseconds if you want to introduce a delay before firing off an async action.

#### Defined in

[packages/form-core/src/FormApi.ts:167](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L167)

***

### defaultState?

```ts
optional defaultState: Partial<FormState<TFormData>>;
```

The default state for the form.

#### Defined in

[packages/form-core/src/FormApi.ts:159](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L159)

***

### defaultValues?

```ts
optional defaultValues: TFormData;
```

Set initial values for your form.

#### Defined in

[packages/form-core/src/FormApi.ts:155](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L155)

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

[packages/form-core/src/FormApi.ts:179](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L179)

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

[packages/form-core/src/FormApi.ts:186](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L186)

***

### transform?

```ts
optional transform: FormTransform<TFormData, TFormValidator>;
```

#### Defined in

[packages/form-core/src/FormApi.ts:190](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L190)

***

### validatorAdapter?

```ts
optional validatorAdapter: TFormValidator;
```

A validator adapter to support usage of extra validation types (IE: Zod, Yup, or Valibot usage)

#### Defined in

[packages/form-core/src/FormApi.ts:171](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L171)

***

### validators?

```ts
optional validators: FormValidators<TFormData, TFormValidator>;
```

A list of validators to pass to the form

#### Defined in

[packages/form-core/src/FormApi.ts:175](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L175)
