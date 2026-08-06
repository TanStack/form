<script lang="ts">
  import { useSelector } from '@tanstack/svelte-store'
  import { untrack, type Snippet } from 'svelte'

  interface Props {
    children: Snippet<[any]>
    source: any
    selector: (state: any) => any
    when?: (selected: any) => boolean
  }

  let {
    children,
    source,
    selector,
    when = () => true,
  }: Props = $props()
  const value = useSelector(
    untrack(() => source),
    untrack(() => selector),
  )
</script>

{#if when(value.current)}
  {@render children(value.current)}
{/if}
