<!-- Take "form" as an prop, pass it to context, and render children -->
<script lang="ts">
  import { setContext, Snippet } from 'svelte'
  import { fieldContextKey } from './context-keys.js'

  interface Props {
    field: any
    children: Snippet
  }

  const { children, field }: Props = $props()

  setContext(fieldContextKey, field)
</script>

{@render children?.()}
