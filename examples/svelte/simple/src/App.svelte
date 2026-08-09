<script lang="ts">
  import { createForm } from '@tanstack/svelte-form'
  import FieldInfo from './FieldInfo.svelte'

  const form = createForm(() => ({
    defaultValues: {
      firstName: '',
      lastName: '',
    },
    onSubmit: async ({ value }) => {
      console.log(value)
    },
  }))
</script>

<div>
  <h1>Simple Form Example</h1>
  <form
    onsubmit={(event) => {
      event.preventDefault()
      event.stopPropagation()
      form.handleSubmit()
    }}
  >
    <div>
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
              await new Promise((resolve) => setTimeout(resolve, 1000))
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
        {/snippet}
      </form.Field>
    </div>
    <div>
      <form.Field name="lastName">
        {#snippet children(field)}
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
        {/snippet}
      </form.Field>
    </div>
    <form.Subscribe
      selector={(state) => [state.canSubmit, state.isSubmitting] as const}
    >
      {#snippet children([canSubmit, isSubmitting])}
        <button type="submit" disabled={!canSubmit}>
          {isSubmitting ? '...' : 'Submit'}
        </button>
        <button
          type="reset"
          onclick={(event) => {
            event.preventDefault()
            form.reset()
          }}
        >
          Reset
        </button>
      {/snippet}
    </form.Subscribe>
  </form>
</div>
