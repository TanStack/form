import { useEffect } from 'react'
import { useStore } from '@tanstack/react-store'
import { Template } from '@tanstack/form-core'

export function useTemplate(template: Template) {
  console.log('Hello from @tanstack/react-form!')
  const state = useStore(template.store)

  useEffect(() => {
    console.log('Template hook mounted')
  }, [])

  return state
}
