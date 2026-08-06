<script lang="ts">
  import type { FieldWithValue } from '@tanstack/svelte-form'
  import FieldError from './FieldError.svelte'

  interface Props {
    field: FieldWithValue<string>
    label: string
  }

  const { field, label }: Props = $props()
</script>

<label class:validating={field.meta.isValidating}>
  <span>{label}</span>
  <input
    name={field.name}
    value={field.value}
    onblur={field.handleBlur}
    oninput={(event) => field.handleChange(event.currentTarget.value)}
    aria-invalid={field.meta.isInvalid}
  />
  <FieldError {field} />
</label>
