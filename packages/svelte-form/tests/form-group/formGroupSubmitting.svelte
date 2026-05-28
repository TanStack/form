<svelte:options runes />

<script lang="ts">
  import { createForm } from '../../src/index.js'

  let {
    onGroupSubmit,
  }: {
    onGroupSubmit: (...args: any[]) => Promise<void>
  } = $props()

  const form = createForm(() => ({
    defaultValues: {
      step1: { name: 'test' },
      step2: { name: 'test2' },
    },
  }))
</script>

<form.FormGroup name="step1" {onGroupSubmit}>
  {#snippet children(group)}
    <form
      onsubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        void group.handleSubmit()
      }}
    >
      <button
        type="submit"
        data-testid="submit-group"
        disabled={group.state.meta.isSubmitting}
      >
        {group.state.meta.isSubmitting ? 'Saving...' : 'Continue'}
      </button>
    </form>
  {/snippet}
</form.FormGroup>
