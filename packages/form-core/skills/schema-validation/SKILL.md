---
name: schema-validation
description: Use when integrating Zod, Valibot, ArkType, Effect, or another
  Standard Schema with TanStack Form in any adapter, routing schema issues to
  fields, or submitting transformed schema output.
metadata:
  purpose: Integrate Standard Schema validation and use parsed submission output while preserving editable form values.
  type: core
  library: '@tanstack/form-core'
  library_version: '2.0.0-alpha.3'
sources:
  - TanStack/form:examples/react/standard-schema/src/index.tsx
  - TanStack/form:examples/react/next-server-actions-zod/src/app/shared-code.ts
  - TanStack/form:packages/form-core/src/pipeline/validation/standardSchema.lib.ts
  - TanStack/form:packages/form-core/src/validation/results/parseIssues.lib.ts
  - TanStack/form:packages/react-form/tests/public/form-options/ValidatorOutputs.test-d.tsx
  - TanStack/form:packages/form-core/tests/validation-output.test.ts
  - TanStack/form:packages/react-form/tests/public/submission-handling/SubmissionWizard.tsx
  - TanStack/form:packages/react-form/tests/public/submission-handling/group-submission.spec.tsx
  - TanStack/form:examples/react/standard-schema/package.json
---

Use the project's existing schema library through Standard Schema. Keep the existing framework adapter and its form creation API.

## Register the schema as a validator

```ts
import { formOptions } from '@tanstack/form-core'
import { z } from 'zod'

const profileSchema = z.object({
  name: z.string().min(3, 'Enter at least three characters'),
  email: z.email('Enter a valid email'),
})

export const profileOptions = formOptions.strictSchema(profileSchema, {
  defaultValues: { name: '', email: '' },
  validators: [{ run: profileSchema, triggers: ['change'] }],
})
```

Pass the options to the adapter's form creation API. Its public package can also supply the core helpers.

Put the schema directly in `run`. A compatible schema needs no TanStack-specific schema adapter. `strictSchema` and `looseSchema` provide types without registering runtime validation. Read [form options](../form-options/SKILL.md) when choosing between complete and incomplete defaults.

This validator runs on change and on submission. Omitting `triggers` on a form validator leaves submission validation enabled. Read [validation](../validation/SKILL.md) for scheduling and async policies.

When using Valibot, ArkType, or Effect, read [schema providers](references/schema-providers.md) for the supported integration shape. Check the installed provider version for Standard Schema support.

## Choose the schema's scope

Use an object schema at form level for rules covering multiple fields. Use a value schema in a field's validator for a rule concerning that field. A field validator receives that field's value.

Form-level schema issues with paths are routed to their fields. Issues without a path remain form errors. Render field errors through `field.errors.map((error) => error.message)`. Configure `errorVisibility` separately when errors should remain hidden until interaction.

Keep a complete schema at form level when submission must validate values belonging to unmounted wizard steps. Do not rely solely on validators attached to currently rendered fields or groups.

## Submit parsed output

```ts
import { formOptions } from '@tanstack/form-core'
import { z } from 'zod'

const schema = z.object({
  name: z.string().trim().min(1, 'Enter a name'),
  age: z.string().regex(/^\d+$/, 'Enter an age').transform(Number),
})

export const personOptions = formOptions.strictSchema(schema, {
  defaultValues: { name: '', age: '' },
  validators: [{ run: schema }],
  onSubmit: ({ value, validatorOutputs: [parsed] }) => {
    console.log(value.age) // Editable input: string
    console.log(parsed.age) // Validated output: number
  },
})
```

Schema transforms do not replace editable form values. Each form validator contributes one submission output at its array position. A skipped validator contributes `undefined`. Use the schema's output entry when saving parsed data.

Do not modify form values from a validator. Apply input conversions in input handlers when the form itself should store a different type.

## Wrap parsing only when custom work requires it

```ts
import { formOptions } from '@tanstack/form-core'
import { z } from 'zod'

const schema = z.object({ name: z.string().trim().min(1, 'Enter a name') })

export const customOptions = formOptions({
  defaultValues: { name: '' },
  validators: [
    {
      run: async ({ value, parseIssues, createOutput }) => {
        const result = await schema.safeParseAsync(value)
        if (!result.success) return parseIssues(result.error.issues)
        return createOutput(result.data)
      },
    },
  ],
})
```

`parseIssues` preserves schema field paths. `createOutput` marks parsed data as successful output. Returning parsed data directly can be interpreted as a validation error. Prefer direct `run: schema` when no custom work is needed.

## Check the result

Submit invalid data and confirm that submission is blocked and messages reach the expected fields. Submit valid data and check the parsed output's type and value. Confirm that the editable input remains unchanged by schema transforms.

The [public schema example](https://github.com/TanStack/form/blob/main/examples/react/standard-schema/src/index.tsx), [adapter output type cases](https://github.com/TanStack/form/blob/main/packages/react-form/tests/public/form-options/ValidatorOutputs.test-d.tsx), and [schema runner](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/validation/standardSchema.lib.ts) establish these integration rules for v2.0.0-alpha.3.
