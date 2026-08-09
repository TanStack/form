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

```svelte
<!-- UserPage.svelte -->
<script lang="ts">
  import { createQuery } from '@tanstack/svelte-query'
  import { derived, toStore } from 'svelte/store'
  import UserEditor from './UserEditor.svelte'
  import type { User } from './types.js'

  const { userId }: { userId: string } = $props()
  const userIdStore = toStore(() => userId)
  const userQuery = createQuery(
    derived(userIdStore, (currentUserId) => ({
      queryKey: ['user', currentUserId],
      queryFn: async (): Promise<User> => {
        const response = await fetch(`/api/users/${currentUserId}`)
        return response.json()
      },
    })),
  )
</script>

{#if $userQuery.isPending}
  <p>Loading…</p>
{:else if $userQuery.isError}
  <p role="alert">Could not load the user.</p>
{:else}
  {#key userId}
    <UserEditor user={$userQuery.data} />
  {/key}
{/if}
```

```svelte
<!-- UserEditor.svelte -->
<script lang="ts">
  import { createForm } from '@tanstack/svelte-form'
  import type { User } from './types.js'

  const { user }: { user: User } = $props()
  const form = createForm(() => ({
    defaultValues: user,
    onSubmit: async ({ value }) => {
      await fetch('/api/users', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(value),
      })
    },
  }))
</script>

<form
  onsubmit={(event) => {
    event.preventDefault()
    form.handleSubmit()
  }}
>
  <!-- fields -->
</form>
```

This pattern is useful when no form state is needed during loading. Mounting the
editor only after data exists also makes it explicit when switching records
should create a fresh form. The keyed block recreates the editor when `userId`
changes.

## Create the form before data arrives

You can instead call `createForm` in the same component as `createQuery`.
Provide a static, shape-complete fallback so `defaultValues` are never
`undefined`.

```svelte
<script lang="ts">
  import { createForm } from '@tanstack/svelte-form'
  import { createQuery } from '@tanstack/svelte-query'
  import { derived, toStore } from 'svelte/store'
  import type { User } from './types.js'

  const { userId }: { userId: string } = $props()
  const emptyUser: User = {
    firstName: '',
    lastName: '',
  }

  const userIdStore = toStore(() => userId)
  const userQuery = createQuery(
    derived(userIdStore, (currentUserId) => ({
      queryKey: ['user', currentUserId],
      queryFn: async (): Promise<User> => {
        const response = await fetch(`/api/users/${currentUserId}`)
        return response.json()
      },
    })),
  )

  const form = createForm(() => ({
    defaultValues: $userQuery.data ?? emptyUser,
    onSubmit: async ({ value }) => {
      await fetch('/api/users', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(value),
      })
    },
  }))
</script>

{#if $userQuery.isPending}
  <p>Loading…</p>
{:else if $userQuery.isError}
  <p role="alert">Could not load the user.</p>
{:else}
  <form
    onsubmit={(event) => {
      event.preventDefault()
      form.handleSubmit()
    }}
  >
    <!-- fields -->
  </form>
{/if}
```

Because `createForm` receives an options function, reading `$userQuery` inside
that function keeps the options reactive. When the query data replaces the
fallback, TanStack Form applies the new `defaultValues` to untouched fields
while preserving fields the user has already touched.

This is the approach demonstrated by the repository's
`examples/svelte/query-integration` example.

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
