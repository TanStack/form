import { onMount } from 'solid-js'
import { useStore } from '@tanstack/solid-store'
import { Template } from '@tanstack/form-core'

export function createTemplateSignal(template: Template) {
  console.log('Hello from @tanstack/solid-form!')
  const state = useStore(template.store)

  onMount(() => {
    console.log('Template signal mounted')
  })

  return state
}
