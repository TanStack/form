<svelte:options runes />

<script lang="ts">
  import { createForm } from '../src/index.js'

  const form = createForm(() => ({
    defaultValues: {
      test: ['a', 'b'] as string[],
    },
  }))
</script>

<form.Field name="test" mode="array">
  {#snippet children(field)}
    <div data-testid="val">{JSON.stringify(field.state.value)}</div>
    <button
      data-testid="swap"
      type="button"
      onclick={() => form.swapFieldValues('test', 0, 1)}
    >
      swap
    </button>
  {/snippet}
</form.Field>
