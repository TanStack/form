---
id: async-initial-values
title: Async Initial Values
---

Forms often edit data loaded from an API. A server-state library such as
TanStack Query (`@tanstack/solid-query` v6 for Solid 2) should own fetching, caching, loading, and retries; TanStack Form
should own the editable copy.

In Solid 2, wait to create the form until the data is ready. Query data is
async, so don't read it inside the `createForm` options: those options are read
when the form is created, before the data has loaded.

## Wait for data before creating the editor

Render a loading or error state first, then mount a component whose
`defaultValues` are complete.

```tsx
// UserPage.tsx
import { Errored, Loading, Show } from 'solid-js'
import { useQuery } from '@tanstack/solid-query'
import { UserEditor } from './UserEditor'
import type { User } from './types'

export function UserPage(props: { userId: string }) {
  const userQuery = useQuery(() => ({
    queryKey: ['user', props.userId],
    queryFn: async (): Promise<User> => {
      const response = await fetch(`/api/users/${props.userId}`)
      return response.json()
    },
  }))

  return (
    <Errored fallback={<p role="alert">Could not load the user.</p>}>
      <Loading fallback={<p>Loading…</p>}>
        <Show when={userQuery.data} keyed>
          {(user) => <UserEditor user={user} />}
        </Show>
      </Loading>
    </Errored>
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

In Solid 2, query data is async: reading `userQuery.data` before it has loaded
suspends to the nearest `Loading` boundary. The keyed `Show` creates the editor
once the user has loaded, and recreates it when a different user object
arrives.

This is the approach demonstrated by the repository's
`examples/solid/query-integration` example.

## Background refetches and record changes

`defaultValues` establish the form's baseline; they are not a fully controlled
`values` prop.

If background refetches arrive while a user is editing, decide at the product
level whether to keep local edits, prompt before replacing them, or call
`form.reset(nextValues)` deliberately. Do not overwrite in-progress input merely
because a query refreshed.

When switching to a different record, either recreate a keyed editor as above
or deliberately reset the existing form.
