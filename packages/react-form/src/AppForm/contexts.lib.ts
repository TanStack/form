import { createContext, useContext } from 'react'
import type { AnyInternalFieldApi } from '@tanstack/form-core/internals'
import type { InternalReactFormApi } from '../ReactForm/ReactFormApi.lib'

export const FormContext = createContext<InternalReactFormApi | null>(null)
export const FieldContext = createContext<AnyInternalFieldApi | null>(null)

export function useFieldContext(): AnyInternalFieldApi {
  const field = useContext(FieldContext)
  if (field === null) {
    throw new Error(
      'TanStack Form: Field components must be used within a `form.Field` component.',
    )
  }

  return field
}

export function useFormContext(): InternalReactFormApi {
  const form = useContext(FormContext)
  if (form === null) {
    throw new Error(
      'TanStack Form: Form components must be used within a `form.AppForm` component.',
    )
  }

  return form
}
