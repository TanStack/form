---
name: form-options
description: Use when choosing or sharing typed TanStack Form options, defining
  initial values, or deciding between formOptions, strictSchema, and looseSchema
  in any framework adapter.
metadata:
  purpose: Choose reusable form options that preserve value and callback inference across framework adapters.
  type: core
  library: '@tanstack/form-core'
  library_version: '2.0.0-alpha.3'
sources:
  - TanStack/form:packages/form-core/src/FormApi/formOptions.public.ts
  - TanStack/form:packages/form-core/tests/FormApi/formOptions.public.test-d.ts
  - TanStack/form:packages/react-form/src/ReactForm/useForm.public.ts
  - TanStack/form:packages/react-form/src/ReactForm/formType.public.ts
  - TanStack/form:examples/react/basic-splitting-form/src/sharedForm.ts
---

Choose the helper from the form's editable values and the available schema. Keep the application's existing framework adapter.

## Choose the options helper

| Situation                                                                   | Use                                         | Result                                                                                                      |
| --------------------------------------------------------------------------- | ------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Options stay inside one adapter form declaration                            | Inline options                              | The adapter infers values and callbacks.                                                                    |
| Options are shared or declared outside the form                             | `formOptions(options)`                      | Defaults determine the value type. Callbacks retain contextual types.                                       |
| A Standard Schema defines the input type and defaults match it              | `formOptions.strictSchema(schema, options)` | Values follow the schema's input type, including unions and required properties.                            |
| A Standard Schema defines the input type but the initial form is incomplete | `formOptions.looseSchema(schema, options)`  | Defaults can omit properties or contain `null` or `undefined`. These empty states remain in the value type. |

The helpers return the supplied options object unchanged. They neither create a form nor validate values. Register a schema in `validators` when runtime validation is required.

## Share inferred options

```ts
import { formOptions } from '@tanstack/form-core'

export const profileOptions = formOptions({
  defaultValues: {
    name: '',
    interests: [] as string[],
  },
  onSubmit: ({ value }) => {
    console.log(value.name, value.interests)
  },
})
```

Pass the result to the adapter's form creation API. Spread it before local overrides when extending it. JavaScript spread replaces properties, including entire validator arrays.

Use the adapter's public package for imports when it already exports these helpers. The core import above shows the shared API. Preserve an existing adapter helper such as `appFormOptions` when it carries registered component types.

## Type complete schema defaults

```ts
import { formOptions } from '@tanstack/form-core'
import { z } from 'zod'

const schema = z.object({
  status: z.enum(['draft', 'published']),
  age: z.number(),
})

export const articleOptions = formOptions.strictSchema(schema, {
  defaultValues: { status: 'draft', age: 0 },
  validators: [{ run: schema }],
})
```

`status` accepts either schema member even though the default is `'draft'`. Type compatibility does not imply validity: a numeric default can still fail a schema's minimum constraint.

## Type incomplete schema defaults

```ts
import { formOptions } from '@tanstack/form-core'
import { z } from 'zod'

const schema = z.object({ name: z.string(), age: z.number() })

export const registrationOptions = formOptions.looseSchema(schema, {
  defaultValues: { name: '', age: null },
  validators: [{ run: schema }],
  onSubmit: ({ value, validatorOutputs: [parsed] }) => {
    console.log(value.age, parsed.age)
  },
})
```

The editable `value.age` includes `null`. Successful schema output has a numeric `age`. Loose defaults do not make the schema accept empty values.

When adding schema validation or using transformed output, read [schema validation](../schema-validation/SKILL.md). When selecting triggers or error visibility, read [validation](../validation/SKILL.md).

## Common mistakes

Do not supply explicit generic arguments to form creation APIs or the `formOptions` helpers. These APIs infer connected value, validator, and callback types. Their generic parameters are library-managed.

| Avoid                                                                          | Why                                                                                                                                                | Use instead                                                                     |
| ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `formOptions<Profile>(...)` or an adapter call such as `useForm<Profile>(...)` | Supplying only a value type does not match the APIs' connected generic parameters. Filling the remaining arguments manually can discard inference. | Type `defaultValues`, or use `strictSchema` or `looseSchema`.                   |
| `const options: AnyFormOptions = ...`                                          | The annotation erases value, validator, and submission types.                                                                                      | Declare shared options through `formOptions`.                                   |
| Callback parameters or option objects cast to `any`                            | The cast bypasses checks that should reveal a configuration mismatch.                                                                              | Keep callbacks inside the typed helper call and correct the defaults or schema. |
| `satisfies Profile` as the only way to widen defaults                          | `satisfies` checks compatibility but does not widen empty arrays or single literals into the intended value type.                                  | Give the defaults an application type.                                          |

For a value type without a schema, type the defaults:

```ts
import { formOptions } from '@tanstack/form-core'

interface Profile {
  status: 'draft' | 'published'
  interests: string[]
}

const defaultValues: Profile = { status: 'draft', interests: [] }

export const profileOptions = formOptions({
  defaultValues,
  onSubmit: ({ value }) => {
    console.log(value.status, value.interests)
  },
})
```

Application data types and supported utility types can still take explicit type arguments. For example, an adapter utility such as `ReactFormType<typeof options>` describes an inferred form. It does not replace inference at the form creation call.

## Check the result

Check types where the options are consumed by the adapter. A union field must accept every intended member. Empty arrays must accept the intended items. Loose defaults must retain their empty states in callbacks. Confirm that schema validation is registered separately when required.

The helper behavior and these boundaries are established in the [public options source](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/formOptions.public.ts) and [options type cases](https://github.com/TanStack/form/blob/main/packages/form-core/tests/FormApi/formOptions.public.test-d.ts). These instructions target v2.0.0-alpha.3; use the installed version's API when working with another release.
