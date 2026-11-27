---
name: subscriptions
description: Use when React TanStack Form values or status do not rerender,
  selecting reactive form state, or limiting rerenders with Subscribe,
  useSelector, and ArrayField.
metadata:
  purpose: Render reactive React form state through focused subscriptions and the correct atom shape.
  type: framework
  framework: React
  library: '@tanstack/react-form'
  library_version: '2.0.0-alpha.3'
requires: []
sources:
  - TanStack/form:packages/react-form/src/Subscribe.public.tsx
  - TanStack/form:packages/react-form/src/ReactForm/Components.public.ts
  - TanStack/form:packages/react-form/src/ReactForm/Components.lib.tsx
  - TanStack/form:packages/react-form/src/FieldGroup/FieldGroupApi.public.ts
  - TanStack/form:docs/migrate-from-v1.md
  - TanStack/form:packages/react-form/tests/public/array-field-subscriptions/*
---

Find the value rendered by the component, choose its state source, and subscribe where the output is needed. These examples are self-contained; no other skill is required.

## Use Subscribe for rendered state

```tsx
import { useForm } from '@tanstack/react-form'

export function ProfileEditor() {
  const form = useForm({ defaultValues: { name: '' } })
  return (
    <>
      <form.Field name="name">
        {(field) => (
          <label>
            Name
            <input
              value={field.value}
              onChange={(event) => field.handleChange(event.target.value)}
              onBlur={field.handleBlur}
            />
          </label>
        )}
      </form.Field>
      <form.Subscribe selector={(state) => state.values.name}>
        {(name) => <output aria-label="Name preview">{name}</output>}
      </form.Subscribe>
      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
      >
        {([canSubmit, isSubmitting]) => (
          <button
            type="button"
            disabled={!canSubmit || isSubmitting}
            onClick={() => {
              form.handleSubmit().catch(console.error)
            }}
          >
            {isSubmitting ? 'Saving…' : 'Save'}
          </button>
        )}
      </form.Subscribe>
    </>
  )
}
```

`form.Subscribe` rerenders its children when its selected state changes, using shallow comparison. Select the fields needed by that output. Selecting the full state makes the subscriber depend on every state change.

`form.state` and `group.state` are imperative snapshots. Reading them in an event callback is appropriate; reading them in JSX does not subscribe the component. Destructuring a snapshot or receiving the form from context does not make it reactive.

## Use useSelector for component logic

```tsx
import { formOptions, useForm, useSelector } from '@tanstack/react-form'
import type { ReactFormType } from '@tanstack/react-form'

const profileOptions = formOptions({ defaultValues: { name: '' } })
type ProfileForm = ReactFormType<typeof profileOptions>

function NameLength({ form }: { form: ProfileForm }) {
  const length = useSelector(form.atom, (state) => state.values.name.length)
  return <output aria-label="Name length">{length}</output>
}

export function ProfileEditor() {
  const form = useForm(profileOptions)
  return (
    <>
      <form.Field name="name">
        {(field) => (
          <input
            aria-label="Name"
            value={field.value}
            onChange={(event) => field.handleChange(event.target.value)}
          />
        )}
      </form.Field>
      <NameLength form={form} />
    </>
  )
}
```

`useSelector` rerenders the component that calls it. Extract that component when the rest of the editor should not subscribe. Call hooks at component top level; do not call `useSelector` inside a field's render callback.

This is v2.0.0-alpha.3: use `useSelector` and `.atom`, rather than v1's `useStore` and `.store`.

## Match the source shape

| Source                                         | Selector receives                                                    |
| ---------------------------------------------- | -------------------------------------------------------------------- |
| `form.atom` or `form.Subscribe`                | Full form state, including `values`, `canSubmit`, and `isSubmitting` |
| `field.atom`                                   | Field state, including `value` and `meta`                            |
| Form group's `group.atom` or `group.Subscribe` | Scoped group state                                                   |
| Field group's `fields.atom`                    | Typed virtual values directly                                        |
| Field group's `fields.Subscribe`               | Parent form state; `state.values` is `unknown`                       |

For example, a virtual field read uses `useSelector(fields.atom, (values) => values.start)`, not `state.values.start`. Read [field groups](../field-groups/SKILL.md) when defining that contract.

For a generic source or a field atom inside a render callback, render the public `Subscribe` component with `source={field.atom}` and a selector. That avoids calling a hook from the callback.

The optional `when` prop on `Subscribe` controls whether selected output renders. Returning false renders `null`; it does not configure validation or stop the underlying subscription.

## Keep array structure separate from item values

`ArrayField` subscribes to array structure. Its `subscribeToMeta` prop adds metadata updates, including subfield flags, but does not subscribe to every item edit. An initial metadata change can incidentally refresh an item preview, making a missing value subscription look correct on the first edit.

For totals, summaries, or other item-derived output, subscribe explicitly to the needed values. Read [arrays](../arrays/SKILL.md) when rendering editable rows or handling structural changes.

## Check reactive output

Change a field repeatedly and verify the preview or total updates on every relevant change. Change an unrelated field and confirm the subscription does not select it. Check status through submission start and completion. For array metadata, verify blur-only changes as well as structural edits; for value summaries, repeat edits after metadata has stopped changing.

The [Subscribe implementation](https://github.com/TanStack/form/blob/main/packages/react-form/src/Subscribe.public.tsx), [v2 migration guide](https://github.com/TanStack/form/blob/main/docs/migrate-from-v1.md), and [public array subscription cases](https://github.com/TanStack/form/tree/main/packages/react-form/tests/public/array-field-subscriptions) establish these boundaries.
