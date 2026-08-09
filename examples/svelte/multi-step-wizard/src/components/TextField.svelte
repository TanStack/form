<script lang="ts">
  import type { FieldWithValue } from '@tanstack/svelte-form'

  interface Props {
    field: FieldWithValue<string>
    label: string
  }

  const { field, label }: Props = $props()
</script>

<div>
  <label>
    <span>{label}</span>
    <input
      name={field.name}
      value={field.value}
      oninput={(event) => field.handleChange(event.currentTarget.value)}
      onblur={field.handleBlur}
      aria-invalid={field.meta.isInvalid}
    />
  </label>
  {#each field.errors as error}
    <div role="alert" style="color: red">{error.message}</div>
  {/each}
</div>
