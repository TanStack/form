<!-- Take "form" as an prop, pass it to context, and render children -->
<script lang="ts">
  import type { Snippet } from 'svelte'
  import InnerAppField from './InnerAppField.svelte'

  interface Props {
    form: any
    fieldComponents: any
    children: Snippet
    fieldProps: any
  }
  const { children, form, fieldComponents, fieldProps }: Props = $props()
</script>

<form.Field {...fieldProps}>
  {#snippet children(field: any)}
    <InnerAppField field={field} children={children} fieldComponents={fieldComponents}/>
  {/snippet}
</form.Field>
