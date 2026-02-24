<script lang="ts">
  import { useFieldContext } from './context.js'

  const field = useFieldContext<string>()

  const { label }: { label: string } = $props()
</script>

<label>
  <span>{label}</span>
  <input
    id={field.name}
    value={field.state.value}
    oninput={(e) => field.handleChange((e.target as any).value)}
  />
</label>
