---
id: async-initial-values
title: Async Initial Values
---

Forms often edit data loaded from an API. A server-state library such as
TanStack Query should own fetching, caching, loading, and retries; TanStack Form
should own the editable copy.

There are two supported ways to provide async initial values: wait to create the
form until the data is ready, or create it immediately with complete fallback
values. Choose the approach that best matches the loading experience your UI
needs.

## Wait for data before creating the editor

Render a loading or error state first, then mount a component whose
`defaultValues` are complete.

```tsx
// UserPage.tsx
import { Show } from 'solid-js'
import { createQuery } from '@tanstack/solid-query'
import { UserEditor } from './UserEditor'
import type { User } from './types'

export function UserPage(props: { userId: string }) {
  const userQuery = createQuery(() => ({
    queryKey: ['user', props.userId],
    queryFn: async (): Promise<User> => {
      const response = await fetch(`/api/users/${props.userId}`)
      return response.json()
    },
  }))

  return (
    <Show
      when={!userQuery.isError}
      fallback={<p role="alert">Could not load the user.</p>}
    >
      <Show when={userQuery.data} keyed fallback={<p>Loading…</p>}>
        {(user) => <UserEditor user={user} />}
      </Show>
    </Show>
  )
}
```

```tsx
// UserEditor.tsx
import { createForm } from '@tanstack/solid-form'
import type { User } from './types'

export function UserEditor(props: { user: User }) {
  const form = createForm(() => ({
    defaultValues: props.user,
    onSubmit: async ({ value }) => {
      await fetch('/api/users', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(value),
      })
    },
  }))

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        form.handleSubmit()
      }}
    >
      {/* fields */}
    </form>
  )
}
```

This pattern is useful when no form state is needed during loading. The keyed
`Show` recreates the editor when a different user object arrives.

## Create the form before data arrives

You can instead call `createForm` in the same component as `createQuery`.
Provide a static, shape-complete fallback so `defaultValues` are never
`undefined`.

```tsx
import { Show } from 'solid-js'
import { createQuery } from '@tanstack/solid-query'
import { createForm } from '@tanstack/solid-form'
import type { User } from './types'

const emptyUser: User = {
  firstName: '',
  lastName: '',
}

export function UserPage(props: { userId: string }) {
  const userQuery = createQuery(() => ({
    queryKey: ['user', props.userId],
    queryFn: async (): Promise<User> => {
      const response = await fetch(`/api/users/${props.userId}`)
      return response.json()
    },
  }))

  const form = createForm(() => ({
    defaultValues: userQuery.data ?? emptyUser,
    onSubmit: async ({ value }) => {
      await fetch('/api/users', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(value),
      })
    },
  }))

  return (
    <Show
      when={!userQuery.isError}
      fallback={<p role="alert">Could not load the user.</p>}
    >
      <Show when={!userQuery.isPending} fallback={<p>Loading…</p>}>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            form.handleSubmit()
          }}
        >
          {/* fields */}
        </form>
      </Show>
    </Show>
  )
}
```

Because both integrations receive accessors, reading `userQuery.data` inside
the form options accessor keeps the options reactive. When query data replaces
the fallback, TanStack Form applies the new `defaultValues` to untouched fields
while preserving fields the user has already touched.

This is the approach demonstrated by the repository's
`examples/solid/query-integration` example.

## Background refetches and record changes

`defaultValues` establish the form's baseline; they are not a fully controlled
`values` prop. In the fallback pattern, later `defaultValues` updates use the
same touched-field-preserving behavior.

If background refetches arrive while a user is editing, decide at the product
level whether to keep local edits, prompt before replacing them, or call
`form.reset(nextValues)` deliberately. Do not overwrite in-progress input merely
because a query refreshed.

When switching to a different record, either recreate a keyed editor as in the
first pattern or deliberately reset the existing form. Otherwise, touched
values from the previous record can be preserved when the new defaults arrive.
