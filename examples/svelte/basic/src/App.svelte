<script lang="ts">
  import { createForm } from '@tanstack/svelte-form'
  import FieldError from './FieldError.svelte'
  import './index.css'

  const form = createForm(() => ({
    defaultValues: {
      firstName: '',
      lastName: '',
    },
    onSubmit: ({ value, createValidationError }) => {
      console.log(value)
      return createValidationError({
        fields: {
          firstName: 'Name already exists',
          lastName: 'Name already exists',
        },
      })
    },
  }))
</script>

<div>
  <h1>Basic Form Example</h1>
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
          run: ({ value }) => {
            if (value.length === 0) return 'A first name is required'
            if (value.length < 3) return 'First name is too short'
          },
          triggers: ['change', 'blur'],
          triggerDebounceMs: 300,
        },
        {
          run: async ({ value }) => {
            await new Promise((resolve) => setTimeout(resolve, 1000))
            return (
              value.toLowerCase().includes('error') &&
              'No "error" allowed in first name'
            )
          },
          triggers: ['change'],
          bailIfInvalid: true,
        },
      ]}
    >
      {#snippet children(field)}
        <label class:validating={field.meta.isValidating}>
          <span>First Name</span>
          <input
            name={field.name}
            value={field.value}
            onblur={field.handleBlur}
            oninput={(event) => field.handleChange(event.currentTarget.value)}
            aria-invalid={field.meta.isInvalid}
          />
          <FieldError {field} />
        </label>
      {/snippet}
    </form.Field>
    <form.Field name="lastName">
      {#snippet children(field)}
        <label class:validating={field.meta.isValidating}>
          <span>Last Name</span>
          <input
            name={field.name}
            value={field.value}
            onblur={field.handleBlur}
            oninput={(event) => field.handleChange(event.currentTarget.value)}
            aria-invalid={field.meta.isInvalid}
          />
          <FieldError {field} />
        </label>
      {/snippet}
    </form.Field>
    <form.Subscribe
      selector={(state) => [state.canSubmit, state.isSubmitting] as const}
    >
      {#snippet children([canSubmit, isSubmitting])}
        <button type="submit" disabled={!canSubmit || isSubmitting}>
          {isSubmitting ? '...' : 'Submit'}
        </button>
      {/snippet}
    </form.Subscribe>
    <button
      type="reset"
      onclick={(event) => {
        event.preventDefault()
        form.reset()
      }}
    >
      Reset
    </button>
  </form>
</div>
