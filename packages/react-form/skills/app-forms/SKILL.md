---
name: app-forms
description: Use when building an application-wide React TanStack Form hook with
  reusable registered field and form components, value-type matching, injected
  props, or shared defaults.
metadata:
  purpose: Register reusable typed React controls and shared defaults through an application form hook.
  type: framework
  framework: React
  library: '@tanstack/react-form'
  library_version: '2.0.0-alpha.3'
requires: []
sources:
  - TanStack/form:packages/react-form/src/AppForm/createFormHook.public.ts
  - TanStack/form:packages/react-form/src/AppForm/helpers/fieldComponent.public.ts
  - TanStack/form:packages/react-form/src/AppForm/helpers/formComponent.public.ts
  - TanStack/form:examples/react/large-form/src/hooks/form.tsx
  - TanStack/form:packages/react-form/tests/public/field-components/*
  - TanStack/form:packages/react-form/tests/public/form-components/*
---

Define reusable controls, prepare the props that should receive a field or form, and register them once at module scope. This workflow is self-contained; no other skill is required. Preserve an existing application form hook when one already exists.

## Register field and form components

```tsx
import { createFormHook, getFormHookHelpers } from '@tanstack/react-form'
import type { AnyReactFormApi, FieldWithValue } from '@tanstack/react-form'

function TextInput({
  field,
  label,
}: {
  field: FieldWithValue<string>
  label: string
}) {
  return (
    <label>
      {label}
      <input
        name={field.name}
        value={field.value}
        onChange={(event) => field.handleChange(event.target.value)}
        onBlur={field.handleBlur}
        aria-invalid={field.meta.isInvalid}
      />
      {field.errors.map((error) => (
        <span key={error.message} role="alert">
          {error.message}
        </span>
      ))}
    </label>
  )
}

function SubmitButton({
  form,
  label,
}: {
  form: AnyReactFormApi
  label: string
}) {
  return (
    <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
      {([canSubmit, isSubmitting]) => (
        <button type="submit" disabled={!canSubmit || isSubmitting}>
          {label}
        </button>
      )}
    </form.Subscribe>
  )
}

const { fieldComponent, formComponent } = getFormHookHelpers()

export const { useAppForm, appFormOptions, defineAppFieldGroup } =
  createFormHook({
    fieldComponents: {
      TextInput: fieldComponent.strict()({
        component: TextInput,
        replaceProperty: 'field',
      }),
    },
    formComponents: {
      SubmitButton: formComponent.create({
        component: SubmitButton,
        replaceProperty: 'form',
      }),
    },
    defaultFormOptions: {
      errorVisibility: ({ state, fieldState }) =>
        fieldState.meta.isBlurred || state.submissionAttempts > 0,
    },
  })

const profileOptions = appFormOptions({ defaultValues: { name: '' } })

export function ProfileEditor() {
  const form = useAppForm({
    ...profileOptions,
    onSubmit: ({ value }) => {
      console.log(value.name)
    },
  })

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        form.handleSubmit().catch(console.error)
      }}
    >
      <form.Field name="name">
        {(field) => <field.TextInput label="Name" />}
      </form.Field>
      <form.SubmitButton label="Save" />
    </form>
  )
}
```

`replaceProperty` supplies the current API and removes that prop from the prepared component's call site. The original `TextInput` still accepts an explicit field when used directly.

Field components render through `field.Component` inside a field render callback. Form components render through `form.Component`, which provides the owning form to prepared components below it. A prepared form component rendered directly needs an owning form provider; using the registered `form.Component` is the usual path.

This is the v2.0.0-alpha.3 API. Do not introduce v1's `createFormHookContexts`, `form.AppField`, or `form.AppForm` patterns.

## Choose component value matching

- Use `fieldComponent.strict()` for exact value-type matching. The example infers `string` from `FieldWithValue<string>`; its registered input is exposed on exact string fields.
- Use `fieldComponent.loose()` when a component supports fields with narrower compatible types. A generic control can preserve its call signature when registered without injection; it then still needs its explicit field prop.
- When there is no field prop from which to infer a value type, use a helper such as `fieldComponent.strict<string>()`. These helper type arguments are intentional. Let `createFormHook`, `useAppForm`, and options helpers infer their library-managed generic arguments.

Loose matching does not make an unsafe writer safe. For example, a text input that writes arbitrary strings cannot safely edit a field restricted to `'draft' | 'published'`. Design the control's props and allowed values for that field type.

Field component maps may contain namespaces, such as `inputs.TextInput`. Form component maps are flat. Register ordinary prop-only components directly when no API injection or value restriction is needed.

## Share defaults and typed options

`createFormHook` accepts `defaultFormOptions`, `defaultFieldOptions`, and `defaultFormGroupOptions`. Usage-site options override non-listener defaults, including an explicitly supplied `undefined`. Listener arrays follow `listenersMerge`; do not assume validator arrays concatenate. Keep validator and listener array lengths constant.

The example shares an error-visibility policy across application forms: show a field's errors after blur or a submission attempt. Visibility controls exposed errors; hidden errors still block submission.

Use the returned `appFormOptions` for shared options that need registered component types. For schema helpers and inferred defaults, load `@tanstack/form-core#form-options` through Intent. For validation policies, load `@tanstack/form-core#validation`.

When reusable sections need registered field controls, read [field groups](../field-groups/SKILL.md) and use this hook's `defineAppFieldGroup`. When descendants need a concrete typed form through context, read [form context](../form-context/SKILL.md). For reactive status, read [subscriptions](../subscriptions/SKILL.md).

## Check the controls

Render two forms and verify each registered control reads and changes its owning form. Confirm injected API props are absent from the prepared call sites, value-specific controls reject incompatible fields, and ordinary props remain required. Check that the status button updates during edits or submission.

The [large-form setup](https://github.com/TanStack/form/blob/main/examples/react/large-form/src/hooks/form.tsx), [field component cases](https://github.com/TanStack/form/tree/main/packages/react-form/tests/public/field-components), and [form component cases](https://github.com/TanStack/form/tree/main/packages/react-form/tests/public/form-components) establish these patterns.
