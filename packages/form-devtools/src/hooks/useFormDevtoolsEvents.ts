import { onCleanup, onMount } from 'solid-js'
import { mountFormSelectorEvents } from '@/stores/formSelectorStore'

export function useFormDevtoolsEvents() {
  onMount(() => {
    const unsub1 = mountFormSelectorEvents()

    onCleanup(() => {
      unsub1()
    })
  })
}
