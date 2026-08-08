import { createContext, useContext } from 'solid-js'
import type { Accessor } from 'solid-js'
import type { AnyInternalFieldApi } from '@tanstack/form-core/internals'
import type { InternalSolidFormApi } from '../SolidFormApi.lib'

export const FormContext = createContext<InternalSolidFormApi>()
export const FieldContext = createContext<Accessor<AnyInternalFieldApi>>()

export function useFieldContext(): Accessor<AnyInternalFieldApi> {
  const field = useContext(FieldContext)
  if (field === undefined) {
    throw new Error(
      'TanStack Form: Field components must be used within a `form.Field` component.',
    )
  }
  return field
}

export function useFormContext(): InternalSolidFormApi {
  const form = useContext(FormContext)
  if (form === undefined) {
    throw new Error(
      'TanStack Form: Form components must be used within a `form.AppForm` component.',
    )
  }
  return form
}
