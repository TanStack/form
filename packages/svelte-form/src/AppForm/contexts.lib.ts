import { getContext } from 'svelte'
import { fieldContextKey, formContextKey } from '../context-keys.js'
import type { AnyInternalFieldApi } from '@tanstack/form-core/internals'
import type { InternalSvelteFormApi } from '../createForm.svelte.js'

export function useFieldContext(): AnyInternalFieldApi {
  const field = getContext<AnyInternalFieldApi | undefined>(fieldContextKey)
  if (field === undefined) {
    throw new Error(
      'TanStack Form: Field components must be used within a `form.Field` component.',
    )
  }
  return field
}

export function useFormContext(): InternalSvelteFormApi {
  const form = getContext<InternalSvelteFormApi | undefined>(formContextKey)
  if (form === undefined) {
    throw new Error(
      'TanStack Form: Form components must be used within a `form.AppForm` component.',
    )
  }
  return form
}
