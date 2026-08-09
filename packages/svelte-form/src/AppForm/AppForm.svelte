<script lang="ts">
  import { setContext, untrack, type Snippet } from 'svelte'
  import { formContextKey } from '../context-keys.js'

  interface Props {
    form: any
    children: Snippet
  }

  const { children, form }: Props = $props()
  setContext(formContextKey, untrack(() => form))
</script>

{@render children()}
