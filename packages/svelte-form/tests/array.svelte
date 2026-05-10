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
    <div id="val">{JSON.stringify(field.state.value)}</div>
    <button id="push" type="button" onclick={() => field.pushValue('b')}>
      push
    </button>
  {/snippet}
</form.Field>
