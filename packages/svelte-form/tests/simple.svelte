<script module lang="ts">
  interface Employee {
    firstName: string
    lastName: string
  }

  export const sampleData: Employee = {
    firstName: 'Christian',
    lastName: '',
  }
</script>

<script lang="ts">
  import { createForm } from '../src/index.js'

  const form = createForm(() => ({
    defaultValues: sampleData,
    onSubmit: async ({ value }) => {
      // Do something with form data
      console.log(JSON.stringify(value))
    },
  }))

  const state = form.useStore()
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
        {#each field.state.meta.errors as error}
          <em>{error}</em>
        {/each}
      </div>
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

<pre>{JSON.stringify(state.current, null, 2)}</pre>
