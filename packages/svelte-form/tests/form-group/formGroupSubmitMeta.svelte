<svelte:options runes />

<script lang="ts">
  import { createForm } from '../../src/index.js'

  let {
    onGroupSubmit,
  }: {
    onGroupSubmit: (...args: any[]) => void
  } = $props()

  const form = createForm(() => ({
    defaultValues: {
      step1: { name: 'test' },
      step2: { name: 'test2' },
    },
  }))
</script>

<form.FormGroup
  name="step1"
  {onGroupSubmit}
  onSubmitMeta={{} as { source: string }}
>
  {#snippet children(group)}
    <button
      type="button"
      data-testid="submit-group"
      onclick={() => group.handleSubmit({ source: 'button' })}
    >
      Submit Group
    </button>
  {/snippet}
</form.FormGroup>
