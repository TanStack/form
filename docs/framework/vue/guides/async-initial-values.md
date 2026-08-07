---
id: async-initial-values
title: Async Initial Values
---

Forms often edit data loaded from an API. A server-state library such as
TanStack Query should own fetching, caching, loading, and retries; TanStack Form
should own the editable copy.

There are two supported ways to provide async initial values: wait to create
the form until the data is ready, or create it immediately with complete
fallback values. Choose the approach that best matches the loading experience
your UI needs.

## Wait for data before creating the editor

Render a loading or error state first, then mount a component whose
`defaultValues` are complete.

```vue
<!-- UserPage.vue -->
<script setup lang="ts">
import { toRef } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import UserEditor from './UserEditor.vue'
import type { User } from './types.ts'

const props = defineProps<{ userId: string }>()
const userId = toRef(props, 'userId')
const {
  data: user,
  isPending,
  isError,
} = useQuery({
  queryKey: ['user', userId],
  queryFn: async (): Promise<User> => {
    const response = await fetch(`/api/users/${userId.value}`)
    return response.json()
  },
})
</script>

<template>
  <p v-if="isPending">Loading…</p>
  <p v-else-if="isError" role="alert">Could not load the user.</p>
  <UserEditor v-else-if="user" :key="userId" :user="user" />
</template>
```

```vue
<!-- UserEditor.vue -->
<script setup lang="ts">
import { useForm } from '@tanstack/vue-form'
import type { User } from './types.ts'

const props = defineProps<{ user: User }>()
const form = useForm({
  defaultValues: props.user,
  onSubmit: async ({ value }) => {
    await fetch('/api/users', {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(value),
    })
  },
})
</script>

<template>
  <form @submit.prevent="form.handleSubmit()">
    <!-- fields -->
  </form>
</template>
```

This pattern is useful when no form state is needed during loading. Mounting
the editor only after data exists also makes it explicit when switching records
should create a fresh form. The `:key` recreates the editor when `userId`
changes.

## Create the form before data arrives

You can instead call `useForm` in the same component as `useQuery`. Provide a
static, shape-complete fallback so `defaultValues` are never `undefined`, then
update a reactive options object when data arrives.

```vue
<script setup lang="ts">
import { reactive, toRef, watchEffect } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { useForm } from '@tanstack/vue-form'
import type { User } from './types.ts'

const props = defineProps<{ userId: string }>()
const userId = toRef(props, 'userId')
const emptyUser: User = {
  firstName: '',
  lastName: '',
}

const {
  data: user,
  isPending,
  isError,
} = useQuery({
  queryKey: ['user', userId],
  queryFn: async (): Promise<User> => {
    const response = await fetch(`/api/users/${userId.value}`)
    return response.json()
  },
})

const formOptions = reactive({
  defaultValues: emptyUser,
  onSubmit: async ({ value }: { value: User }) => {
    await fetch('/api/users', {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(value),
    })
  },
})

watchEffect(() => {
  if (user.value) {
    formOptions.defaultValues = user.value
  }
})

const form = useForm(formOptions)
</script>

<template>
  <p v-if="isPending">Loading…</p>
  <p v-else-if="isError" role="alert">Could not load the user.</p>
  <form v-else @submit.prevent="form.handleSubmit()">
    <!-- fields -->
  </form>
</template>
```

The Vue adapter observes the reactive options object. When query data replaces
the fallback, TanStack Form applies the new `defaultValues` to untouched fields
while preserving fields the user has already touched. In this example, the
fields remain unmounted during loading, so the user cannot edit them before the
loaded values arrive. You can also render the empty form immediately when that
better suits the UI.

## Background refetches and record changes

`defaultValues` establish the form's baseline; they are not a fully controlled
`values` prop. In the fallback pattern, later `defaultValues` updates use the
same touched-field-preserving behavior.

If background refetches arrive while a user is editing, decide at the product
level whether to keep local edits, prompt before replacing them, or call
`form.reset(nextValues)` deliberately. Do not overwrite in-progress input
merely because a query refreshed.

When switching to a different record, either remount a keyed editor as in the
first pattern or deliberately reset the existing form. Otherwise, touched
values from the previous record can be preserved when the new defaults arrive.
