---
name: type-error-debugging
description: >
  Use when explaining large TanStack React Form v2 TypeScript errors involving
  ReactFormType, FieldWithValue, AnyFieldApi, formOptions, appFormOptions,
  strictSchema, looseSchema, createErrorVisibility, createValidators, FormGroup,
  field groups, fieldComponent.strict or loose, DeepKeys, DeepValue, and public
  atom APIs.
metadata:
  type: framework
  library: "@tanstack/react-form"
  framework: react
  library_version: "0.0.0"
requires:
  - react-form-composition-setup
  - choosing-form-options-modes
sources:
  - TanStack/form-v2:packages/form-core/tests/validation.test-d.ts
  - TanStack/form-v2:packages/form-core/tests/deep-keys.test-d.ts
  - TanStack/form-v2:packages/react-form/tests/submit-return.test-d.tsx
  - TanStack/form-v2:packages/react-form/tests/FormGroup.test-d.tsx
  - TanStack/form-v2:packages/react-form/tests/FieldGroupApi.test-d.tsx
---

This skill builds on `react-form-composition-setup` and `choosing-form-options-modes`. Read those first for the intended API boundaries.

# TanStack React Form - Type Error Debugging

Do not solve TanStack Form type errors with assertions. Find the API boundary that stopped inference.

## Setup

```ts
type DebugBoundary =
  | 'schema option mode'
  | 'schema output'
  | 'submit return'
  | 'child form prop'
  | 'error visibility'
  | 'validator helper arity'
  | 'form group scope'
  | 'field group virtual path'
  | 'deep key path'
  | 'public API surface'
```

Classify the error first, then fix the boundary with the library helper designed for it.

## Hooks And Components

### Preserve field inference

```tsx
<form.Field name="firstName">
  {(field) => (
    <input
      value={field.value}
      onBlur={field.handleBlur}
      onChange={(event) => field.handleChange(event.target.value)}
    />
  )}
</form.Field>
```

Do not annotate the render-prop child unless you are extracting a reusable component prop.

### Use field prop helper types

```tsx
import type { FieldWithValue } from '@tanstack/react-form'

function StringInput({ field }: { field: FieldWithValue<string> }) {
  return (
    <input
      value={field.value}
      onBlur={field.handleBlur}
      onChange={(event) => field.handleChange(event.target.value)}
    />
  )
}
```

Use `FieldWithValue<T>` or `AnyFieldApi` instead of structural shims.

### Debug long schema errors from the first mismatch

```ts
const options = formOptions.looseSchema({
  defaultValues: {
    startDate: null,
  },
  validators: [{ run: dateSchema, triggers: ['blur'] }],
})
```

For schema errors, check mode, default value shape, validator presence, and whether submit reads `schemaOutputs`.

## Common Mistakes

### HIGH Hiding inference with assertions

Wrong:

```tsx
<form.Field name={`users[${index}].name` as const}>
  {(field: any) => <input value={field.value} />}
</form.Field>
```

Correct:

```tsx
<form.Field name={`users[${index}].name`}>
  {(field) => <input value={field.value} />}
</form.Field>
```

Assertions hide the concrete path or render-prop mismatch that TypeScript is reporting.

Source: maintainer interview

### HIGH Typing shared sections as form unions

Wrong:

```ts
type FormA = ReactFormType<typeof formAOptions>
type FormB = ReactFormType<typeof formBOptions>

interface SharedProps {
  form: FormA | FormB
}
```

Correct:

```ts
const sharedFields = defineFields({
  value: helper.strict<string>(),
})
```

Use field groups for cross-form shared sections; `ReactFormType` is for one known shared options type.

Source: TanStack/form-v2:packages/react-form/tests/FieldGroupApi.test-d.tsx

### HIGH Passing real paths inside field groups

Wrong:

```tsx
<fields.Field name="user.name">{(field) => <input value={field.value} />}</fields.Field>
```

Correct:

```tsx
<fields.Field name="name">{(field) => <input value={field.value} />}</fields.Field>
```

Inside the group, use virtual paths defined by `defineFields`; real paths are supplied through `withFields` bindings.

Source: TanStack/form-v2:packages/react-form/tests/FieldGroupApi.test-d.tsx

### MEDIUM Reusable visibility reads typed values

Wrong:

```ts
const policy = createErrorVisibility(({ state }) => state.values.email !== '')
```

Correct:

```ts
const policy = createErrorVisibility(
  ({ fieldState }) => fieldState.meta.isBlurred,
)
```

`createErrorVisibility` is form-agnostic, so `state.values` is unknown.

Source: TanStack/form-v2:packages/form-core/tests/validation.test-d.ts

### MEDIUM Mismatching createValidators arity

Wrong:

```ts
const makeValidators = createValidators([
  { triggers: ['change'] },
  { triggers: ['blur'] },
])

const validators = makeValidators(emailSchema)
```

Correct:

```ts
const makeValidators = createValidators([
  { triggers: ['change'] },
  { triggers: ['blur'] },
])

const validators = makeValidators(emailSchema, serverSchema)
```

`createValidators` expects one run function for each options object.

Source: TanStack/form-v2:packages/form-core/tests/validation.test-d.ts

### MEDIUM Confusing schema strict with field strict

Wrong:

```ts
const TextField = fieldComponent.strict(TextInput, 'field')
```

Correct:

```ts
const options = formOptions.strictSchema({
  defaultValues,
  validators: [{ run: schema, triggers: ['change'] }],
})
```

Field component strict/loose controls component value compatibility; schema strict/loose controls form option inference.

Source: TanStack/form-v2:packages/react-form/src/AppForm/getFormHookHelpers.public.ts

## References

- [Type error boundaries](references/type-error-boundaries.md)
