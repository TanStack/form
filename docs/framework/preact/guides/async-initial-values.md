---
id: async-initial-values
title: Async Initial Values
---

Forms often edit data loaded from an API. A server-state library such as
TanStack Query should own fetching, caching, loading, and retries; TanStack Form
should own the editable copy.

TanStack Query does not publish a separate Preact adapter. With
`@preact/preset-vite`, use `@tanstack/react-query` through Preact's compatibility
aliases, as shown below and in the repository example.

There are two supported ways to provide async initial values: wait to create the
form until the data is ready, or create it immediately with complete fallback
values. Choose the approach that best matches the loading experience your UI
needs.

## Wait for data before creating the editor

Render a loading or error state first, then mount a component whose
`defaultValues` are complete.

```tsx
import { useQuery } from '@tanstack/react-query'
import { useForm } from '@tanstack/preact-form'

type User = {
  firstName: string
  lastName: string
}

export function UserPage({ userId }: { userId: string }) {
  const userQuery = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetch(`/api/users/${userId}`).then((res) => res.json()),
  })

  if (userQuery.isPending) return <p>Loading…</p>
  if (userQuery.isError) return <p role="alert">Could not load the user.</p>

  return <UserEditor key={userId} user={userQuery.data} />
}

function UserEditor({ user }: { user: User }) {
  const form = useForm({
    defaultValues: user,
    onSubmit: async ({ value }) => {
      await fetch('/api/users', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(value),
      })
    },
  })

  return <form>{/* fields */}</form>
}
```

This pattern is useful when no form state is needed during loading. Mounting the
editor only after data exists also makes it explicit when switching records
should create a fresh form.

## Create the form before data arrives

You can instead call `useForm` in the same component as `useQuery`. Provide a
static, shape-complete fallback so `defaultValues` are never `undefined`.

```tsx
const emptyUser: User = {
  firstName: '',
  lastName: '',
}

export function UserPage({ userId }: { userId: string }) {
  const userQuery = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetch(`/api/users/${userId}`).then((res) => res.json()),
  })

  const form = useForm({
    defaultValues: userQuery.data ?? emptyUser,
    onSubmit: async ({ value }) => {
      await fetch('/api/users', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(value),
      })
    },
  })

  if (userQuery.isPending) return <p>Loading…</p>
  if (userQuery.isError) return <p role="alert">Could not load the user.</p>

  return <form>{/* fields */}</form>
}
```

When the query data replaces the fallback, TanStack Form applies the new
`defaultValues` to untouched fields while preserving fields the user has
already touched. In this example, the fields remain unmounted during loading,
so the user cannot edit them before the loaded values arrive. You can also
render the empty form immediately when that better suits the UI.

This is the approach demonstrated by the repository's
`examples/preact/query-integration` example.

## Background refetches and record changes

`defaultValues` establish the form's baseline; they are not a fully controlled
`values` prop. In the fallback pattern, later `defaultValues` updates use the
same touched-field-preserving behavior.

If background refetches arrive while a user is editing, decide at the product
level whether to keep local edits, prompt before replacing them, or call
`form.reset(nextValues)` deliberately. Do not overwrite in-progress input merely
because a query refreshed.

When switching to a different record, either remount a keyed editor as in the
first pattern or deliberately reset the existing form. Otherwise, touched
values from the previous record can be preserved when the new defaults arrive.
