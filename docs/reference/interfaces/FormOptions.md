---
id: FormOptions
title: FormOptions
---

Defined in: [FormApi/formOptions.public.ts:53](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/formOptions.public.ts#L53)

Configures a form's initial values, validation, listeners, and submission.

Pass these options to a framework adapter's form creation API. Use
`formOptions` when defining reusable options so values and callbacks retain
their inferred types.

## Type Parameters

### TFormData

`TFormData`

Library-managed. Do not specify explicitly.

### TValidatorConfig

`TValidatorConfig` *extends* `unknown`[]

Library-managed. Do not specify explicitly.

### TValidators

`TValidators`

Library-managed. Do not specify explicitly.

### TSubmitReturn

`TSubmitReturn`

### TPayload

`TPayload`

Library-managed. Do not specify explicitly.

## Properties

### \[formOptionsTypePayloadSymbol\]?

```ts
readonly optional [formOptionsTypePayloadSymbol]?: TPayload;
```

Defined in: [FormApi/formOptions.public.ts:65](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/formOptions.public.ts#L65)

INTERNAL USE ONLY

A custom type payload that adapters need for things like form composition. Not a real runtime value.

***

### defaultValues

```ts
defaultValues: TFormData;
```

Defined in: [FormApi/formOptions.public.ts:92](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/formOptions.public.ts#L92)

The values your form starts with.

`reset()` restores these values, and `isDefaultValue` checks whether the
current values match them.

You can supply a new object whenever options are updated. Defaults are
compared deeply, so recreating equal objects and arrays leaves them unchanged.

When defaults change, untouched top-level fields receive the new values.
Values under touched top-level fields are preserved.

#### Example

```ts
formOptions({
  defaultValues: {
    name: '',
    age: 0,
    interests: [] as string[],
  },
  onSubmit: ({ value }) => {
     // Use values
  },
})
```

***

### errorVisibility?

```ts
optional errorVisibility?: ErrorVisibilityFn<NoInfer<TFormData>>;
```

Defined in: [FormApi/formOptions.public.ts:117](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/formOptions.public.ts#L117)

Controls when fields expose validation errors. Return `true` to show errors
or `false` to hide them. This only affects their visibility and does not
change the form's validity.

Applies to every field unless the field supplies its own `errorVisibility`.
When no `errorVisibility` is provided, errors are always exposed.

#### Example

```ts
formOptions({
  defaultValues: { name: '' },
  errorVisibility: ({ state, fieldState }) =>
    fieldState.meta.isBlurred || state.submissionAttempts > 0,
})
```

***

### formId?

```ts
optional formId?: string;
```

Defined in: [FormApi/formOptions.public.ts:99](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/formOptions.public.ts#L99)

Identifies this form through `formApi.formId`.

When omitted, an identifier is generated when the form is created and
preserved across option updates. Supplying a new `formId` replaces it.

***

### listeners?

```ts
optional listeners?: FormListeners<NoInfer<TFormData>, NoInfer<GetFormErrorTypes<TValidators, unknown>>>;
```

Defined in: [FormApi/formOptions.public.ts:176](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/formOptions.public.ts#L176)

Callbacks for change, blur, submit, mount, and reset events.

Use listeners for work that does not depend on other listeners. Return
values are ignored, and returned promises are not awaited.

#### Example

```ts
formOptions({
  defaultValues: { name: '' },
  listeners: [
    {
      triggers: ['change'],
      triggerDebounceMs: 200,
      run: ({ value }) => {
        localStorage.setItem('profile-draft', JSON.stringify(value))
      },
    },
  ],
})
```

***

### onSubmit?

```ts
optional onSubmit?: FormOptionsOnSubmitFn<NoInfer<TFormData>, NoInfer<TryGetValidatorOutputs<TValidators>>, TSubmitReturn>;
```

Defined in: [FormApi/formOptions.public.ts:212](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/formOptions.public.ts#L212)

Handles submission after field and form submission validation succeeds.
A returned promise is awaited before submission finishes.

The context provides form values, validator outputs, the form instance, and
helpers for reporting submission errors.

You can also report form and field errors discovered during submission,
such as validation errors returned by the server.

#### Example

```ts
formOptions({
  defaultValues: { name: '' },
  onSubmit: async ({ value, createErrorMap }) => {
    const response = await createProfile();
    if (response.error === 'username_taken') {
      return createErrorMap({ fields: { name: 'This name is taken' }})
    }
    return redirect({ to: '/my-profile' })
  },
})
```

***

### onSubmitInvalid?

```ts
optional onSubmitInvalid?: FormOptionsOnSubmitInvalidFn<NoInfer<TFormData>, NoInfer<GetFormErrorTypes<TValidators, TSubmitReturn>>>;
```

Defined in: [FormApi/formOptions.public.ts:235](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/formOptions.public.ts#L235)

Handles a failed submission, including submission validation failures,
errors returned from `onSubmit`, and exceptions during validation or
`onSubmit`.

A returned promise is awaited before submission finishes.

#### Example

```ts
formOptions({
  defaultValues: { name: '' },
  onSubmitInvalid: () => {
    // Focus on first invalid input
    document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
  },
})
```

***

### serverState?

```ts
optional serverState?: 
  | NoInfer<ServerFormState<TFormData>>
  | null;
```

Defined in: [FormApi/formOptions.public.ts:187](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/formOptions.public.ts#L187)

Used by server-side rendering (SSR) integrations to restore form state
from the server on the client.

***

### validators?

```ts
optional validators?: TValidators & FormOptionsValidators<NoInfer<TFormData>, TValidatorConfig, NoInfer<TValidators>>;
```

Defined in: [FormApi/formOptions.public.ts:148](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/formOptions.public.ts#L148)

An ordered array of validators for the complete form values.

By default, validators run only on submission. See `triggers` and
`skipOnSubmit` to change when they run.

Submission outputs follow the same array order.

Make sure to not dynamically change the array length.

#### Example

```ts
formOptions({
  defaultValues: { name: '' },
  validators: [
    {
      triggers: ['change'],
      run: ({ value, createErrorMap }) => {
        // Form validators can set errors on fields
        const map = createErrorMap();
        if (!value.name.trim()) {
          map.fields.name = 'Enter a name';
        }
        return map;
      },
    },
  ],
})
```
