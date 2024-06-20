# Interface: FormOptions\<TFormData, TFormValidator\>

An object representing the options for a form.

## Type parameters

• **TFormData**

• **TFormValidator** *extends* `Validator`\<`TFormData`, `unknown`\> \| `undefined` = `undefined`

## Properties

### asyncAlways?

```ts
optional asyncAlways: boolean;
```

If true, always run async validation, even when sync validation has produced an error. Defaults to undefined.

#### Source

[packages/form-core/src/FormApi.ts:132](https://github.com/TanStack/form/blob/5aaf73c63cd794485f5bed1e917a8daa05a297dc/packages/form-core/src/FormApi.ts#L132)

***

### asyncDebounceMs?

```ts
optional asyncDebounceMs: number;
```

Optional time in milliseconds if you want to introduce a delay before firing off an async action.

#### Source

[packages/form-core/src/FormApi.ts:136](https://github.com/TanStack/form/blob/5aaf73c63cd794485f5bed1e917a8daa05a297dc/packages/form-core/src/FormApi.ts#L136)

***

### defaultState?

```ts
optional defaultState: Partial<FormState<TFormData>>;
```

The default state for the form.

#### Source

[packages/form-core/src/FormApi.ts:128](https://github.com/TanStack/form/blob/5aaf73c63cd794485f5bed1e917a8daa05a297dc/packages/form-core/src/FormApi.ts#L128)

***

### defaultValues?

```ts
optional defaultValues: TFormData;
```

Set initial values for your form.

#### Source

[packages/form-core/src/FormApi.ts:124](https://github.com/TanStack/form/blob/5aaf73c63cd794485f5bed1e917a8daa05a297dc/packages/form-core/src/FormApi.ts#L124)

***

### onSubmit()?

```ts
optional onSubmit: (props) => any;
```

A function to be called when the form is submitted, what should happen once the user submits a valid form returns `any` or a promise `Promise<any>`

#### Parameters

• **props**

• **props.formApi**: [`FormApi`](Class.FormApi.md)\<`TFormData`, `TFormValidator`\>

• **props.value**: `TFormData`

#### Returns

`any`

#### Source

[packages/form-core/src/FormApi.ts:148](https://github.com/TanStack/form/blob/5aaf73c63cd794485f5bed1e917a8daa05a297dc/packages/form-core/src/FormApi.ts#L148)

***

### onSubmitInvalid()?

```ts
optional onSubmitInvalid: (props) => void;
```

Specify an action for scenarios where the user tries to submit an invalid form.

#### Parameters

• **props**

• **props.formApi**: [`FormApi`](Class.FormApi.md)\<`TFormData`, `TFormValidator`\>

• **props.value**: `TFormData`

#### Returns

`void`

#### Source

[packages/form-core/src/FormApi.ts:155](https://github.com/TanStack/form/blob/5aaf73c63cd794485f5bed1e917a8daa05a297dc/packages/form-core/src/FormApi.ts#L155)

***

### transform?

```ts
optional transform: FormTransform<TFormData, TFormValidator>;
```

#### Source

[packages/form-core/src/FormApi.ts:159](https://github.com/TanStack/form/blob/5aaf73c63cd794485f5bed1e917a8daa05a297dc/packages/form-core/src/FormApi.ts#L159)

***

### validatorAdapter?

```ts
optional validatorAdapter: TFormValidator;
```

A validator adapter to support usage of extra validation types (IE: Zod, Yup, or Valibot usage)

#### Source

[packages/form-core/src/FormApi.ts:140](https://github.com/TanStack/form/blob/5aaf73c63cd794485f5bed1e917a8daa05a297dc/packages/form-core/src/FormApi.ts#L140)

***

### validators?

```ts
optional validators: FormValidators<TFormData, TFormValidator>;
```

A list of validators to pass to the form

#### Source

[packages/form-core/src/FormApi.ts:144](https://github.com/TanStack/form/blob/5aaf73c63cd794485f5bed1e917a8daa05a297dc/packages/form-core/src/FormApi.ts#L144)
