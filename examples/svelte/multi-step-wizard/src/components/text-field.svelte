<script lang="ts">
  import { useFieldContext } from '../runes/form-context.js'

  const field = useFieldContext<string>()

  const { label }: { label: string } = $props()
</script>

<div>
  <label>
    <div>{label}</div>
    <input
      id={field.name}
      value={field.state.value}
      oninput={(e) => field.handleChange((e.target as HTMLInputElement).value)}
    />
  </label>
  {#each field.state.meta.errors as error}
    <div style="color: red;">{error}</div>
  {/each}
</div>
