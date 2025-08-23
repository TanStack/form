<!-- Take "form" as an prop, pass it to context, and render children -->
<script lang="ts">
  import { setContext, Snippet } from 'svelte'
  import { fieldContextKey } from './context-keys.js'

  interface Props {
    field: any
    fieldComponents: any
    children: Snippet<[any]>
  }

  const { children, field, fieldComponents }: Props = $props()

  setContext(fieldContextKey, field)
</script>

{@render children?.(Object.assign(field, fieldComponents))}
