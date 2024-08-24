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

[packages/form-core/src/FormApi.ts:135](https://github.com/TanStack/form/blob/03de1e83ad6580cff66ab58566f3003d93d4e34d/packages/form-core/src/FormApi.ts#L135)

***

### asyncDebounceMs?

```ts
optional asyncDebounceMs: number;
```

Optional time in milliseconds if you want to introduce a delay before firing off an async action.

#### Defined in

[packages/form-core/src/FormApi.ts:139](https://github.com/TanStack/form/blob/03de1e83ad6580cff66ab58566f3003d93d4e34d/packages/form-core/src/FormApi.ts#L139)

***

### defaultState?

```ts
optional defaultState: Partial<FormState<TFormData>>;
```

The default state for the form.

#### Defined in

[packages/form-core/src/FormApi.ts:131](https://github.com/TanStack/form/blob/03de1e83ad6580cff66ab58566f3003d93d4e34d/packages/form-core/src/FormApi.ts#L131)

***

### defaultValues?

```ts
optional defaultValues: TFormData;
```

Set initial values for your form.

#### Defined in

[packages/form-core/src/FormApi.ts:127](https://github.com/TanStack/form/blob/03de1e83ad6580cff66ab58566f3003d93d4e34d/packages/form-core/src/FormApi.ts#L127)

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

[packages/form-core/src/FormApi.ts:151](https://github.com/TanStack/form/blob/03de1e83ad6580cff66ab58566f3003d93d4e34d/packages/form-core/src/FormApi.ts#L151)

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

[packages/form-core/src/FormApi.ts:158](https://github.com/TanStack/form/blob/03de1e83ad6580cff66ab58566f3003d93d4e34d/packages/form-core/src/FormApi.ts#L158)

***

### transform?

```ts
optional transform: FormTransform<TFormData, TFormValidator>;
```

#### Defined in

[packages/form-core/src/FormApi.ts:162](https://github.com/TanStack/form/blob/03de1e83ad6580cff66ab58566f3003d93d4e34d/packages/form-core/src/FormApi.ts#L162)

***

### validatorAdapter?

```ts
optional validatorAdapter: TFormValidator;
```

A validator adapter to support usage of extra validation types (IE: Zod, Yup, or Valibot usage)

#### Defined in

[packages/form-core/src/FormApi.ts:143](https://github.com/TanStack/form/blob/03de1e83ad6580cff66ab58566f3003d93d4e34d/packages/form-core/src/FormApi.ts#L143)

***

### validators?

```ts
optional validators: FormValidators<TFormData, TFormValidator>;
```

A list of validators to pass to the form

#### Defined in

[packages/form-core/src/FormApi.ts:147](https://github.com/TanStack/form/blob/03de1e83ad6580cff66ab58566f3003d93d4e34d/packages/form-core/src/FormApi.ts#L147)
