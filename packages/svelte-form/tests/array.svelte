<svelte:options runes />

<script lang="ts">
  import { createForm } from '../src/index.js'

  const form = createForm(() => ({
    defaultValues: {
      test: ['a'] as string[],
    },
  }))
</script>

<form.Field name="test" mode="array">
  {#snippet children(field)}
    <div data-testid="val">{JSON.stringify(field.state.value)}</div>
    <button data-testid="push" type="button" onclick={() => field.pushValue('b')}>
      push
    </button>
  {/snippet}
</form.Field>
