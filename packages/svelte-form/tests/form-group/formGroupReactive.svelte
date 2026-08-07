<svelte:options runes />

<script lang="ts">
  import { createForm } from '../../src/index.js'

  const form = createForm(() => ({
    defaultValues: {
      step1: { name: 'initial' },
      step2: { name: 'other' },
    },
  }))
</script>

<form.FormGroup name="step1">
  {#snippet children(group)}
    <form.Field name="step1.name">
      {#snippet children(field)}
        <input
          data-testid="step1-name"
          value={field.state.value}
          oninput={(e: Event) =>
            field.handleChange((e.target as HTMLInputElement).value)}
        />
      {/snippet}
    </form.Field>
    <pre data-testid="group-value">{JSON.stringify(group.state.value)}</pre>
  {/snippet}
</form.FormGroup>
