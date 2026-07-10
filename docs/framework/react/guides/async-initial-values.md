---
id: async-initial-values
title: Async Initial Values
---

Forms often edit data loaded from an API. A server-state library such as
TanStack Query should own fetching, caching, loading, and retries; TanStack Form
should own the editable copy.

## Wait for data before creating the editor

Render a loading or error state first, then mount a component whose
`defaultValues` are complete.

```tsx
import { useQuery } from '@tanstack/react-query'
import { useForm } from '@tanstack/react-form'

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

`defaultValues` are initialization data, not a continuously synchronized prop.
Mounting the editor only after data exists avoids uncontrolled inputs and makes
it explicit when switching records should create a fresh form.

If background refetches arrive while a user is editing, decide at the product
level whether to keep local edits, prompt before replacing them, or call
`form.reset(nextValues)` deliberately. Do not overwrite in-progress input merely
because a query refreshed.
