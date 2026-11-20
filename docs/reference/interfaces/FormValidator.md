---
id: FormValidator
title: FormValidator
---

Defined in: [validation/formValidators.public.ts:515](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation/formValidators.public.ts#L515)

Validates the complete form values with a function or Standard Schema.

Configure when this validator runs by setting `skipOnSubmit` and `triggers`.

The context a validator function gets is dependent on the chosen triggers and submission behaviour.

## Example

```ts
formOptions({
  defaultValues: { name: '' },
  validators: [
    {
      triggers: [
        'blur', // Always run on blur
        {
          // Only run on change after a submission attempt
          trigger: 'change',
          when: ({ formApi }) => formApi.state.submissionAttempts > 0
        },
      ],
      triggerDebounceMs: 300,
      run: ({ value }) => {
         if (value.name.trim().length === 0) {
           return 'Name is required'
         }
      }
    },
  ],
})
```

## Extends

- `FormValidatorConfig`\<`TFormData`, `TValidatorConfig`, `TValidatorConfig`\>.`FormValidatorRunner`\<`TFormData`, `NoInfer`\<`GetValidatorEvents`\<`TValidatorConfig`\>\>\>

## Type Parameters

### TFormData

`TFormData`

Library-managed. Do not specify explicitly.

### TValidatorConfig

`TValidatorConfig`

Library-managed. Do not specify explicitly.

## Properties

### bailIfInvalid?

```ts
optional bailIfInvalid?: boolean;
```

Defined in: [validation/formValidators.public.ts:322](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation/formValidators.public.ts#L322)

If `true`, skips this validator and all later validators when earlier
validation in the current run has failed.

Waits for earlier asynchronous validators to finish before checking for
failures. If `false`, earlier failures do not prevent this validator from
running.

#### Default

```ts
false
```

#### Inherited from

```ts
FormValidatorRunner.bailIfInvalid
```

***

### fieldErrorTarget?

```ts
optional fieldErrorTarget?: "field" | "self" | "field-and-self";
```

Defined in: [validation/formValidators.public.ts:311](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation/formValidators.public.ts#L311)

Selects where issues with field paths from a Standard Schema or
`parseIssues` are reported.

- `'field'`: Report issues on their corresponding fields.
- `'field-and-self'`: Report issues on their fields and the form.
- `'self'`: Report issues only on the form.

Issues without a path, including paths that normalize to empty, always
go to the form. This option affects runtime routing only; inferred self
and subfield error types stay unchanged.

#### Default

```ts
'field'
```

#### Inherited from

```ts
FormValidatorRunner.fieldErrorTarget
```

***

### run

```ts
run: 
  | StandardSchemaV1<TFormData, any>
| FormValidatorFn<TFormData, NoInfer<GetValidatorEvents<TValidatorConfig>>>;
```

Defined in: [validation/formValidators.public.ts:293](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation/formValidators.public.ts#L293)

Validates the complete form values with a function or Standard Schema.

A function receives the context for the current event and may return a
promise. A schema validates the form values and provides its parsed data
as output on success.

#### Inherited from

```ts
FormValidatorRunner.run
```

***

### skipOnSubmit?

```ts
optional skipOnSubmit?: SkipOnSubmitConfig<TFormData, TValidatorConfig>;
```

Defined in: [validation/formValidators.public.ts:477](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation/formValidators.public.ts#L477)

Whether to skip this validator during a client submission attempt,
independently of its configured triggers.

Pass `true` to skip it, or a synchronous callback that returns `true` to
skip it for the current attempt. `false` or an omitted option allows
submission validation. Configured triggers still use their own conditions.

A skipped validator's entry in submission `validatorOutputs` is `undefined`.

#### Example

```ts
const isDraft = false

formOptions({
  defaultValues: { email: '' },
  validators: [
    {
      skipOnSubmit: isDraft,
      run: ({ value }) => {
         if (!value.email.includes('@')) {
           return 'Enter a valid email'
         }
      }
    },
  ],
})
```

#### Inherited from

```ts
FormValidatorConfig.skipOnSubmit
```

***

### triggerDebounceMs?

```ts
optional triggerDebounceMs?: number;
```

Defined in: [validation/formValidators.public.ts:427](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation/formValidators.public.ts#L427)

How long change and blur validation waits after the latest matching event
before it runs.

The delay is measured in milliseconds. Repeated events restart the delay
for this validator.

#### Important

Mount, server, and submission validation are not delayed.

#### Default

```ts
0
```

#### Inherited from

```ts
FormValidatorConfig.triggerDebounceMs
```

***

### triggers?

```ts
optional triggers?: TriggerConfig<TFormData, TValidatorConfig>[];
```

Defined in: [validation/formValidators.public.ts:410](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation/formValidators.public.ts#L410)

Events that run this validator in addition to submission, optionally with
a `when` condition.

- `'change'`: A form value changed.
- `'blur'`: A field was blurred.
- `'mount'`: The form is being constructed.
- `'server'`: Form values are being validated on the server.

Use a string to enable an event unconditionally, or an object with
`trigger` and `when` to add a condition.

Submission is controlled separately by `skipOnSubmit`.

#### Default

```ts
[]
```

#### Example

```ts
triggers: [
   'blur', // Always run on blur
   {
     // Only run on change after a submission attempt
     trigger: 'change',
     when: ({ formApi }) => formApi.state.submissionAttempts > 0
   },
]
```

#### Inherited from

```ts
FormValidatorConfig.triggers
```
