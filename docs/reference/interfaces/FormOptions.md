---
id: FormOptions
title: FormOptions
---

# Interface: FormOptions\<TFormData, TFormValidators, TSubmitReturn\>

Defined in: [FormApi/FormApi.public.ts:230](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L230)

Configures initial values, validation, listeners, and submission.

Pass these options to a framework adapter's form creation API. Use
`formOptions` when declaring them separately so data and validator types
remain inferred.

## Example

```ts
const profileFormOptions = formOptions({
  defaultValues: { name: '' },
  onSubmit: async ({ value }) => {
    await saveProfile(value)
  },
})
```

## Type Parameters

### TFormData

`TFormData`

Library-managed. Do not specify explicitly.

### TFormValidators

`TFormValidators` *extends* [`FormValidators`](../type-aliases/FormValidators.md)\<`TFormData`\>

Library-managed. Do not specify explicitly.

### TSubmitReturn

`TSubmitReturn`

Library-managed. Do not specify explicitly.

## Properties

### defaultValues

```ts
defaultValues: TFormData;
```

Defined in: [FormApi/FormApi.public.ts:256](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L256)

Initial values and the source of the inferred data shape.

They also define the reset baseline and what `isDefaultValue` compares
against.

**Async initial values:** The passed value may change over time. While data
is loading, pass fallback values containing the complete data shape, then
pass the resolved values when they become available.

When this option changes, untouched top-level values adopt the new defaults
while values under touched top-level fields are preserved.

***

### errorVisibility?

```ts
optional errorVisibility?: ErrorVisibility<TFormData, ToFormErrorTypes<TFormValidators, unknown>>;
```

Defined in: [FormApi/FormApi.public.ts:271](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L271)

Controls when fields expose validation errors through public state.

This is the default policy for every field. A field can override it with a field-level
`errorVisibility` option.

When omitted, errors are always exposed.

#### Example

```ts
errorVisibility: ({ state, fieldState }) =>
  fieldState.meta.isBlurred || state.submissionAttempts > 0,
```

***

### formId?

```ts
optional formId?: string;
```

Defined in: [FormApi/FormApi.public.ts:242](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L242)

A stable identifier for this form.

When omitted, an identifier is generated and preserved across option
updates until a new `formId` is supplied. Read the supplied or generated
identifier from `formApi.formId`.

***

### listeners?

```ts
optional listeners?: FormListeners<TFormData, ToFormErrorTypes<TFormValidators, unknown>>;
```

Defined in: [FormApi/FormApi.public.ts:318](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L318)

Listener configurations for change, blur, submit, mount, and reset events.

Matching listeners are evaluated in array order. Their return values are
ignored, and returned promises are not awaited.

#### Example

```ts
listeners: [
  {
    triggers: ['change'],
    triggerDebounceMs: 200,
    run: ({ value }) => {
      saveDraft(value)
    },
  },
],
```

***

### onSubmit?

```ts
optional onSubmit?: (context) => TSubmitReturn;
```

Defined in: [FormApi/FormApi.public.ts:355](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L355)

Called after submission validation succeeds.

Return an error created with `createValidationError` or `parseIssues` to
mark the submission as invalid. A returned promise is awaited before
submission finishes. If the callback throws, `onSubmitInvalid` is called.

#### Parameters

##### context

[`FormSubmitContext`](FormSubmitContext.md)\<`TFormData`, [`ToFormSchemaOutputs`](../type-aliases/ToFormSchemaOutputs.md)\<`TFormValidators`\>, [`ToFormErrorTypes`](../type-aliases/ToFormErrorTypes.md)\<`TFormValidators`, `unknown`\>\>

#### Returns

`TSubmitReturn`

#### Example

```ts
{
  // ...
  onSubmit: async ({ value }) => {
    await saveUser(value)
  },
}
```

***

### onSubmitInvalid?

```ts
optional onSubmitInvalid?: (context) => void | Promise<void>;
```

Defined in: [FormApi/FormApi.public.ts:381](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L381)

Called after an invalid submission is detected.

This includes validation failures, errors returned from `onSubmit`, and
exceptions thrown during validation or submission. A returned promise is
awaited before submission finishes.

#### Parameters

##### context

[`FormSubmitInvalidContext`](FormSubmitInvalidContext.md)\<`TFormData`, [`ToFormErrorTypes`](../type-aliases/ToFormErrorTypes.md)\<`TFormValidators`, `unknown`\>\>

#### Returns

`void` \| `Promise`\<`void`\>

#### Example

```ts
{
  // ...
  onSubmitInvalid: () => {
    document
      .querySelector<HTMLElement>('[aria-invalid="true"]')
      ?.focus()
  },
}
```

***

### serverState?

```ts
optional serverState?: 
  | ServerFormState<NoInfer<TFormData>, NoInfer<TFormValidators>>
  | null;
```

Defined in: [FormApi/FormApi.public.ts:334](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L334)

Server-validation state supplied by a server or SSR adapter during
hydration.

Pass a failed result's `serverState` through unchanged. Constructing or
mutating this state directly is discouraged.

#### Example

```ts
serverState: failedResult.serverState,
```

***

### validators?

```ts
optional validators?: TFormValidators;
```

Defined in: [FormApi/FormApi.public.ts:298](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L298)

An ordered pipeline of form-level validators.

Validators run for their configured triggers and, by default, during
submission. Keep the array length stable after initialization so
validator-indexed errors and schema outputs remain aligned.

#### Example

```ts
validators: [
  {
    triggers: ['change'],
    run: ({ value, createErrorMap }) => {
      if (value.name) {
        return null
      }

      return createErrorMap({ fields: { name: 'Name is required' } })
    },
  },
],
```
