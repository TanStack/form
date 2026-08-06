<script lang="ts">
  import { createForm } from '@tanstack/svelte-form'
  import {
    createMutation,
    createQuery,
    keepPreviousData,
  } from '@tanstack/svelte-query'
  import { get } from 'svelte/store'
  import FieldInfo from './FieldInfo.svelte'
  import { db, sleep } from './mock-db.js'
  import type { StoredUser } from './mock-db.js'

  const emptyUser: StoredUser = { firstName: '', lastName: '' }
  const userQuery = createQuery({
    queryKey: ['data'],
    queryFn: () => db.getData(),
    placeholderData: keepPreviousData,
  })
  const saveUserMutation = createMutation<StoredUser, Error, StoredUser>({
    mutationFn: (value: StoredUser) => db.saveUser(value),
    onSuccess: async () => {
      await get(userQuery).refetch()
    },
  })
  const form = createForm(() => ({
    defaultValues: $userQuery.data ?? emptyUser,
    onSubmit: async ({ formApi, value }) => {
      await get(saveUserMutation).mutateAsync(value)
      formApi.reset(value)
    },
    errorVisibility: ({ fieldState }) => fieldState.meta.isTouched,
  }))
</script>

{#if $userQuery.isPending}
  <p>Loading...</p>
{:else if $userQuery.isError}
  <p role="alert">{$userQuery.error.message}</p>
{:else}
  <div>
    <h1>Query Integration Form Example</h1>
    <form
      onsubmit={(event) => {
        event.preventDefault()
        event.stopPropagation()
        form.handleSubmit()
      }}
    >
      <form.Field
        name="firstName"
        validators={[
          {
            run: ({ value }) =>
              !value
                ? 'A first name is required'
                : value.length < 3
                  ? 'First name must be at least 3 characters'
                  : undefined,
            triggers: ['change'],
          },
          {
            run: async ({ value }) => {
              await sleep(1000)
              return (
                value.includes('error') &&
                'No "error" allowed in first name'
              )
            },
            triggers: ['change'],
            triggerDebounceMs: 500,
          },
        ]}
      >
        {#snippet children(field)}
          <div>
            <label for={field.name}>First Name:</label>
            <input
              id={field.name}
              name={field.name}
              value={field.value}
              onblur={field.handleBlur}
              oninput={(event) => field.handleChange(event.currentTarget.value)}
              aria-invalid={field.meta.isInvalid}
            />
            <FieldInfo {field} />
          </div>
        {/snippet}
      </form.Field>
      <form.Field name="lastName">
        {#snippet children(field)}
          <div>
            <label for={field.name}>Last Name:</label>
            <input
              id={field.name}
              name={field.name}
              value={field.value}
              onblur={field.handleBlur}
              oninput={(event) => field.handleChange(event.currentTarget.value)}
              aria-invalid={field.meta.isInvalid}
            />
            <FieldInfo {field} />
          </div>
        {/snippet}
      </form.Field>
      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting] as const}
      >
        {#snippet children([canSubmit, isSubmitting])}
          <button type="submit" disabled={!canSubmit}>
            {isSubmitting ? '...' : 'Submit'}
          </button>
          <button type="reset" onclick={() => form.reset()}>Reset</button>
        {/snippet}
      </form.Subscribe>
    </form>
  </div>
{/if}
