<svelte:options runes />

<script module lang="ts">
  interface Employee {
    firstName: string
  }

  let sampleData: Employee = $state({
    firstName: 'Corbin',
  })

  export const getSampleData = () => sampleData
</script>

<script lang="ts">
  import { createAppForm } from './large-components/rune.js'

  const form = createAppForm(() => ({
    defaultValues: sampleData,
  }))

  const formState = form.useStore()
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

  <form.AppField name="firstName">
    {#snippet children(field)}
      <field.TextField label="First name" />
    {/snippet}
  </form.AppField>
</form>

<pre>{JSON.stringify(formState.current, null, 2)}</pre>
