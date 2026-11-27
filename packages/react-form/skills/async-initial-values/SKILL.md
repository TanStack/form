---
name: async-initial-values
description: Use when populating a React TanStack Form from fetched data,
  preserving edits during refetches, or switching the record being edited.
metadata:
  purpose: Initialize React editors from asynchronous data with deliberate policies for local edits and record changes.
  type: framework
  framework: React
  library: '@tanstack/react-form'
  library_version: '2.0.0-alpha.3'
requires: []
sources:
  - TanStack/form:docs/framework/react/guides/async-initial-values.md
  - TanStack/form:examples/react/query-integration/src/app.tsx
  - TanStack/form:packages/react-form/src/ReactForm/ReactFormApi.lib.tsx
  - TanStack/form:packages/react-form/tests/public/touched-state/*
---

Choose when to create the editor and what should happen when fetched data changes. These examples are self-contained; no other skill is required. Keep fetching, caching, loading, and retries in the application's existing server-state layer.

## Mount an editor after data arrives

Use this approach when the UI can wait for a complete record. Keep hooks unconditional by mounting a separate editor component after loading succeeds.

```tsx
import { useForm } from '@tanstack/react-form'

type Profile = { name: string }

export function ProfilePage({
  recordId,
  profile,
  isPending,
  error,
}: {
  recordId: string
  profile: Profile | undefined
  isPending: boolean
  error: Error | null
}) {
  if (isPending) return <p>Loading…</p>
  if (!profile) return <p role="alert">Could not load the profile.</p>
  return (
    <>
      {error && <p role="alert">Could not load the profile.</p>}
      <ProfileEditor key={recordId} profile={profile} />
    </>
  )
}

function ProfileEditor({ profile }: { profile: Profile }) {
  const form = useForm({ defaultValues: profile })
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
```

The data layer must supply the record corresponding to `recordId`. A changed key creates fresh form state when switching records. Do not show the previous record's placeholder data as the newly selected record.

## Create the form before loading finishes

Use complete fallback defaults when form state is needed during loading. The fetched value below can come from TanStack Query, a route loader, or the application's existing data hook.

```tsx
import { useForm } from '@tanstack/react-form'

type Profile = { name: string; email: string }
const emptyProfile: Profile = { name: '', email: '' }

export function ProfileEditor({ profile }: { profile: Profile | undefined }) {
  const form = useForm({ defaultValues: profile ?? emptyProfile })
  return (
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
  )
}
```

Updated `defaultValues` apply to untouched fields while preserving touched fields. A field that was edited and then changed back can still be touched. Do not use dirty state as a substitute for this rule.

For schema-derived defaults or value inference, load `@tanstack/form-core#form-options` through Intent.

## Decide how refetches and record changes behave

`defaultValues` establish a baseline; they are not a controlled `values` prop. Later defaults use the same touched-field-preserving behavior in both patterns above.

- For background refetches, decide whether untouched values may update, local edits should remain, or the UI should request a deliberate reload.
- To replace edits and establish a new baseline deliberately, call `form.reset(nextValues)` after the application has chosen to accept those values.
- For a different record, remount a keyed editor or deliberately reset the existing form. Updating defaults alone can preserve touched values from the previous record.

## Common mistakes

| Avoid                                                          | Why                                                                 | Use instead                                                                    |
| -------------------------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Calling `useForm` after a loading return in the same component | Hook order changes when loading finishes.                           | Put the editor in a child component, or call the hook before loading returns.  |
| Passing `undefined` defaults while waiting                     | The initial value shape and controlled input values are incomplete. | Wait to mount, or supply typed, shape-complete fallback defaults.              |
| Resetting on every query update                                | A background refresh can replace in-progress input.                 | Choose an explicit refetch policy and reset only when replacement is intended. |
| Updating defaults to switch records without resetting          | Touched fields can retain the previous record's values.             | Use record identity as an editor key or reset deliberately.                    |

These boundaries follow the [async defaults guide](https://github.com/TanStack/form/blob/main/docs/framework/react/guides/async-initial-values.md) and [query integration example](https://github.com/TanStack/form/blob/main/examples/react/query-integration/src/app.tsx) for v2.0.0-alpha.3.

## Check the editor

Check loading and error states, the first successful load, a refetch before editing, and a refetch after touching a field. Switch between two records after editing and confirm that the second editor contains only the selected record's values. Verify reset establishes the intended baseline.
