---
name: form-context
description: Use when sharing a typed React TanStack Form with descendant
  components through a provider, or fixing missing-provider and nonreactive
  context reads.
metadata:
  purpose: Share an existing typed React form with descendants while keeping reactive reads explicit.
  type: framework
  framework: React
  library: '@tanstack/react-form'
  library_version: '2.0.0-alpha.3'
requires: []
sources:
  - TanStack/form:packages/react-form/src/AppForm/helpers/formContext.public.ts
  - TanStack/form:packages/react-form/src/AppForm/helpers/getFormHookHelpers.public.ts
  - TanStack/form:packages/react-form/src/AppForm/helpers/helperFactories.lib.tsx
  - TanStack/form:packages/react-form/src/AppForm/contexts.lib.ts
  - TanStack/form:packages/react-form/src/ReactForm/formType.public.ts
---

Create the typed provider and hook at module scope, then pass the existing form instance to that provider. No other skill is required. This works with `useForm`; creating a component registry is optional.

## Share one concrete form type

```tsx
import { formOptions, getFormHookHelpers, useForm } from '@tanstack/react-form'

const profileOptions = formOptions({ defaultValues: { name: '' } })
const { formContext } = getFormHookHelpers()
const { Provider: ProfileProvider, useFormContext: useProfileForm } =
  formContext.create(profileOptions)

function NameField() {
  const form = useProfileForm()
  return (
    <form.Field name="name">
      {(field) => (
        <label>
          Name
          <input
            name={field.name}
            value={field.value}
            onChange={(event) => field.handleChange(event.target.value)}
            onBlur={field.handleBlur}
          />
        </label>
      )}
    </form.Field>
  )
}

function NamePreview() {
  const form = useProfileForm()
  return (
    <form.Subscribe selector={(state) => state.values.name}>
      {(name) => <output aria-label="Name preview">{name}</output>}
    </form.Subscribe>
  )
}

export function ProfileEditor() {
  const form = useForm(profileOptions)
  return (
    <ProfileProvider form={form}>
      <NameField />
      <NamePreview />
    </ProfileProvider>
  )
}
```

`formContext.create(options)` supplies a type contract. It does not create a form, validate values, or apply options at runtime. The form is still created by `useForm` or `useAppForm`.

The provider's `form` prop and the returned hook use `ReactFormType<typeof options>`. Keep options in a typed declaration so descendants retain field paths and value types. For registered components, derive the context from the application's `appFormOptions` rather than erasing those types.

## Keep subscriptions explicit

The hook returns the current form API. Reading `form.state.values.name` inside rendered JSX is an imperative snapshot and does not subscribe that component. Use `form.Field`, `form.Subscribe`, or `useSelector(form.atom, selector)` for reactive reads. Read [subscriptions](../subscriptions/SKILL.md) when choosing where those reads belong.

For an extracted section used by one known form, accepting a typed form prop is also sufficient. Use `ReactFormType<typeof options>` for that prop. A component that only needs general status can accept `AnyReactFormApi`; that utility intentionally omits specific field-value knowledge.

When a section should work across different form shapes, read [field groups](../field-groups/SKILL.md). When building a reusable registered control library, read [app forms](../app-forms/SKILL.md).

## Respect the provider's runtime scope

Call the returned hook only below a provider carrying a compatible form. A missing provider throws. A registered `form.Component` also supplies its owning form context, and nested providers or registered form components select the nearest owner.

Typed contexts share the library's underlying runtime context. Creating another typed helper does not create an isolated runtime channel or check the form's shape at runtime. Do not call a hook typed for one form below an incompatible form's provider or registered component.

Do not import internal context hooks or introduce v1's `createFormHookContexts`. The public v2 entry point is `getFormHookHelpers().formContext.create(options)`.

## Check the context

Edit a field through a descendant and confirm another subscribed descendant updates. Render two compatible providers and verify each consumer reads its nearest form. Check that incompatible form props and unknown field names fail type checking. When a consumer reports a missing provider, move it under the owning provider rather than creating a second form instance.

The [public context types](https://github.com/TanStack/form/blob/main/packages/react-form/src/AppForm/helpers/formContext.public.ts) and [context factory](https://github.com/TanStack/form/blob/main/packages/react-form/src/AppForm/helpers/helperFactories.lib.tsx) establish these rules for v2.0.0-alpha.3.
