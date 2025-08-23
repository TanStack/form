<!-- Take "form" as an prop, pass it to context, and render children -->
<script lang="ts">
  import { setContext, Snippet } from 'svelte'
  import { formContextKey } from './context-keys.js'

  interface Props {
    form: any
    children: Snippet
  }

  const { children, form }: Props = $props()

  setContext(formContextKey, form)
</script>

{@render children?.()}
