<!-- Take "form" as an prop, pass it to context, and render children -->
<script lang="ts">
  import { Snippet } from 'svelte'
  import InnerAppField from './InnerAppField.svelte'

  interface Props {
    form: any
    children: Snippet
  }
  const { children, form }: Props = $props()
</script>

<form.Field name="fullName">
  {#snippet children(field: any)}
    <InnerAppField field={field} children={children}/>
  {/snippet}
</form.Field>
