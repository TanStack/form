<svelte:options runes />

<script lang="ts">
  import { appForm } from './app-form.svelte.js'

  const form = appForm.useAppForm(() => ({
    defaultValues: { guest: { name: 'Tony' } },
  }))
  let label = $state('Name')
</script>

<form.AppForm>
  <form.FormGroup name="guest">
    {#snippet children(group)}
      <group.Field name="name">
        {#snippet children(field)}
          <field.TextField {label} />
        {/snippet}
      </group.Field>
    {/snippet}
  </form.FormGroup>
  <form.Summary />
  <button type="button" onclick={() => (label = 'Guest name')}>
    Update label
  </button>
</form.AppForm>
