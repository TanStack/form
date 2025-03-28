<script lang="ts">
  import { createForm } from '@tanstack/svelte-form'
  import FieldInfo from './FieldInfo.svelte'

  const form = createForm(() => ({
    defaultValues: {
      firstName: '',
      lastName: '',
      employed: false,
      jobTitle: '',
    },
    onSubmit: async ({ value }) => {
      // Do something with form data
      alert(JSON.stringify(value))
    },
  }))
</script>

<form
  id="form"
  onsubmit={(e) => {
    e.preventDefault()
    e.stopPropagation()
    form.handleSubmit()
  }}
>
  <h1>TanStack Form - Svelte Demo</h1>

  <form.Field
    name="firstName"
    validators={{
      onChange: ({ value }) =>
        value.length < 3 ? 'Not long enough' : undefined,
      onChangeAsyncDebounceMs: 500,
      onChangeAsync: async ({ value }) => {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        return value.includes('error') && 'No "error" allowed in first name'
      },
    }}
  >
    {#snippet children(field)}
      <div>
        <label for={field.name}>First Name</label>
        <input
          id={field.name}
          type="text"
          placeholder="First Name"
          value={field.state.value}
          onblur={() => field.handleBlur()}
          oninput={(e: Event) => {
            const target = e.target as HTMLInputElement
            field.handleChange(target.value)
          }}
        />
        <FieldInfo {field} />
      </div>
    {/snippet}
  </form.Field>
  <form.Field
    name="lastName"
    validators={{
      onChange: ({ value }) =>
        value.length < 3 ? 'Not long enough' : undefined,
    }}
  >
    {#snippet children(field)}
      <div>
        <label for={field.name}>Last Name</label>
        <input
          id={field.name}
          type="text"
          placeholder="Last Name"
          value={field.state.value}
          onblur={() => field.handleBlur()}
          oninput={(e: Event) => {
            const target = e.target as HTMLInputElement
            field.handleChange(target.value)
          }}
        />
        <FieldInfo {field} />
      </div>
    {/snippet}
  </form.Field>
  <form.Field name="employed">
    {#snippet children(field)}
      <div>
        <label for={field.name}>Employed?</label>
        <input
          oninput={() => field.handleChange(!field.state.value)}
          checked={field.state.value}
          onblur={() => field.handleBlur()}
          id={field.name}
          type="checkbox"
        />
      </div>
      {#if field.state.value}
        <form.Field
          name="jobTitle"
          validators={{
            onChange: ({ value }) =>
              value.length === 0 ? 'If you have a job, you need a title' : null,
          }}
        >
          {#snippet children(field)}
            <div>
              <label for={field.name}>Job Title</label>
              <input
                type="text"
                id={field.name}
                placeholder="Job Title"
                value={field.state.value}
                onblur={field.handleBlur}
                oninput={(e: Event) => {
                  const target = e.target as HTMLInputElement
                  field.handleChange(target.value)
                }}
              />
              <FieldInfo {field} />
            </div>
          {/snippet}
        </form.Field>
      {/if}
    {/snippet}
  </form.Field>
  <div>
    <form.Subscribe
      selector={(state) => ({
        canSubmit: state.canSubmit,
        isSubmitting: state.isSubmitting,
      })}
    >
      {#snippet children({ canSubmit, isSubmitting })}
        <button type="submit" disabled={!canSubmit}>
          {isSubmitting ? 'Submitting' : 'Submit'}
        </button>
      {/snippet}
    </form.Subscribe>
    <button
      type="button"
      id="reset"
      onclick={() => {
        form.reset()
      }}
    >
      Reset
    </button>
  </div>
</form>
