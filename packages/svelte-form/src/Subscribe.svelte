<script lang="ts">
  import { useStore } from '@tanstack/svelte-store'

  // Don't bother typing this out, this component is only usable through a wrapper
  interface Props {
    children: any
    store: any
    selector?: (state: any) => any
  }

  let { children, store, selector = (state) => state }: Props = $props()

  const value = useStore(store, selector)
</script>

{@render children(value.current)}
