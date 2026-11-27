---
name: validation
description: 'Use when configuring TanStack Form validation in any adapter:
  submission and interaction timing, conditional checks, debouncing, async
  checks, cross-field rules, reusable validator policies, or error visibility.'
metadata:
  purpose: Configure validation timing, conditional and async checks, field errors, and error visibility through the shared form-core API.
  type: core
  library: '@tanstack/form-core'
  library_version: '2.0.0-alpha.3'
sources:
  - TanStack/form:examples/react/basic/src/index.tsx
  - TanStack/form:packages/form-core/src/pipeline/validation/validation.public.ts
  - TanStack/form:packages/form-core/src/pipeline/validation/formValidators.public.ts
  - TanStack/form:packages/form-core/src/FormApi/errorVisibility.public.ts
  - TanStack/form:packages/react-form/tests/public/error-visibility/*
  - TanStack/form:packages/react-form/tests/public/validation-execution/*
  - TanStack/form:packages/react-form/tests/public/submission-handling/group-submission.spec.tsx
---

Choose the validation scope, then configure when its validators run. Keep the application's adapter and rendering APIs.

## Configure form validators

```ts
import { formOptions } from '@tanstack/form-core'

export const profileOptions = formOptions({
  defaultValues: { name: '' },
  errorVisibility: ({ state, fieldState }) =>
    fieldState.meta.isBlurred || state.submissionAttempts > 0,
  validators: [
    {
      triggers: ['blur', 'change'],
      run: ({ value, createErrorMap }) =>
        createErrorMap({
          fields: { name: value.name.trim() ? undefined : 'Enter a name' },
        }),
    },
  ],
})
```

Pass these options to the adapter's form creation API. Its public package can also supply the core helpers. Keep callbacks inside a typed options declaration. Read [form options](../form-options/SKILL.md) when sharing configuration.

Use an ordered `validators` array of objects with `run`. This is the v2.0.0-alpha.3 API. The v1 `validators: { onChange, onChangeAsync }` configuration does not apply.

## Select events independently from submission

| Configuration                                                                | Behavior                                                                  |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Form validator with omitted `triggers`, or any validator with `triggers: []` | Runs on submission by default.                                            |
| `triggers: ['change']`                                                       | Also runs on value changes.                                               |
| `triggers: ['blur']`                                                         | Also runs on blur. Wire the input's blur handler.                         |
| `triggers: ['mount']`                                                        | Also runs during initialization or mounting for that scope.               |
| `skipOnSubmit: true`                                                         | Skips client submission validation independently of interaction triggers. |
| `triggerDebounceMs: 300`                                                     | Delays change and blur validation. Submission validation is immediate.    |

Field and group validators require `triggers`. Form validators can omit it. Do not put `'submit'` in `triggers`; submission has its own policy.

For validation after the first submission attempt, use a trigger condition:

```ts
import { createValidator, formOptions } from '@tanstack/form-core'
import { z } from 'zod'

const afterSubmit = createValidator({
  triggers: [
    'blur',
    {
      trigger: 'change',
      when: ({ formApi }) => formApi.state.submissionAttempts > 0,
    },
  ],
})

const schema = z.object({ email: z.email('Enter a valid email') })

export const contactOptions = formOptions.strictSchema(schema, {
  defaultValues: { email: '' },
  validators: [afterSubmit(schema)],
})
```

`createValidator` shares one scheduling policy. `createValidators` pairs an ordered tuple of policies with the same number of runners. Keep validator and listener array lengths constant. Use `when` and `skipOnSubmit` for conditions instead of adding or removing entries.

Predicates and debounce callbacks must be synchronous and have no side effects. They can inspect values, touched state, or submission attempts. Their call count is unspecified. Validation-state reads in predicates have no ordering guarantee. Use `bailIfInvalid` when a check depends on earlier validation succeeding.

## Order inexpensive and expensive checks

```ts
import { formOptions } from '@tanstack/form-core'
import { z } from 'zod'

export function usernameOptions(
  isAvailable: (username: string, signal: AbortSignal) => Promise<boolean>,
) {
  return formOptions({
    defaultValues: { username: '' },
    validators: [
      {
        run: z.object({
          username: z.string().min(3, 'Enter three characters'),
        }),
        triggers: ['change'],
      },
      {
        triggers: ['change'],
        triggerDebounceMs: 300,
        bailIfInvalid: true,
        run: async ({ value, signal, createErrorMap }) => {
          const available = await isAvailable(value.username, signal)
          if (signal.aborted || available) return undefined
          return createErrorMap({ fields: { username: 'Username is taken' } })
        },
      },
    ],
  })
}
```

`run` accepts synchronous and asynchronous functions. There is no separate async-validator slot. Forward the context's `signal` to cancellable work such as `fetch`.

`bailIfInvalid: true` skips that validator and subsequent validators when earlier validation fails. Put the inexpensive checks first. Debouncing does not replace submission validation. Form-level mount validation runs during construction and has a different context without `formApi` or a client abort signal.

## Choose field or form errors

For a field validator, return a message, an issue object with `message`, or an array of either. Return `undefined`, `null`, or `false` for success. Field errors are exposed as issue objects through `field.errors`.

For a form validator, return a form message for a form-wide error. Use the context's `createErrorMap` to target fields, as in the examples above. Use canonical paths such as `users[0].name`.

For a cross-field rule on one field, set that validator's `watchFields` to the other field paths. Its `run` still receives its own field's value; read the other values from `formApi`. Use a form validator and an error map when the rule belongs to the complete form.

For schemas, transforms, or custom parsing, read [schema validation](../schema-validation/SKILL.md). Do not change form values inside a validator.

## Control error visibility separately

`errorVisibility` controls exposed errors and invalid flags. It does not change validity or permit submission. With no policy, errors are exposed immediately. A field can override the form policy.

Use `fieldState.meta.isBlurred`, `isTouched`, and `state.submissionAttempts` to express interaction policies. Use `createErrorVisibility` to share a policy across forms. Keep an inline callback when it needs the consuming form's typed values.

## Check the result

Check invalid and valid submission, each configured interaction trigger, and any conditional or async path. Verify that hidden errors still block submission. Confirm that changing a watched field checks the dependent field. Display messages with `error.message`.

The [basic example](https://github.com/TanStack/form/blob/main/examples/react/basic/src/index.tsx), [public validation types](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/validation/validation.public.ts), [form validator types](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/validation/formValidators.public.ts), and [public error-visibility tests](https://github.com/TanStack/form/tree/main/packages/react-form/tests/public/error-visibility) establish these rules for v2.0.0-alpha.3.
