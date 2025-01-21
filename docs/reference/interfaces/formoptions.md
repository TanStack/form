---
id: FormOptions
title: FormOptions
---

# Interface: FormOptions\<TFormData, TFormValidator\>

Defined in: [packages/form-core/src/FormApi.ts:149](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L149)

An object representing the options for a form.

## Type Parameters

• **TFormData**

• **TFormValidator** *extends* `Validator`\<`TFormData`, `unknown`\> \| `undefined` = `undefined`

## Properties

### asyncAlways?

```ts
optional asyncAlways: boolean;
```

Defined in: [packages/form-core/src/FormApi.ts:164](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L164)

If true, always run async validation, even when sync validation has produced an error. Defaults to undefined.

***

### asyncDebounceMs?

```ts
optional asyncDebounceMs: number;
```

Defined in: [packages/form-core/src/FormApi.ts:168](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L168)

Optional time in milliseconds if you want to introduce a delay before firing off an async action.

***

### defaultState?

```ts
optional defaultState: Partial<FormState<TFormData>>;
```

Defined in: [packages/form-core/src/FormApi.ts:160](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L160)

The default state for the form.

***

### defaultValues?

```ts
optional defaultValues: TFormData;
```

Defined in: [packages/form-core/src/FormApi.ts:156](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L156)

Set initial values for your form.

***

### onSubmit()?

```ts
optional onSubmit: (props) => any;
```

Defined in: [packages/form-core/src/FormApi.ts:180](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L180)

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

Defined in: [packages/form-core/src/FormApi.ts:187](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L187)

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

Defined in: [packages/form-core/src/FormApi.ts:191](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L191)

***

### validatorAdapter?

```ts
optional validatorAdapter: TFormValidator;
```

Defined in: [packages/form-core/src/FormApi.ts:172](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L172)

A validator adapter to support usage of extra validation types (IE: Zod, Yup, or Valibot usage)

***

### validators?

```ts
optional validators: FormValidators<TFormData, TFormValidator>;
```

Defined in: [packages/form-core/src/FormApi.ts:176](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L176)

A list of validators to pass to the form
