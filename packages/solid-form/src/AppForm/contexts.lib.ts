import { createContext, useContext } from 'solid-js'
import type { Accessor, Context } from 'solid-js'
import type { AnyInternalFieldApi } from '@tanstack/form-core/internals'
import type { InternalSolidFormApi } from '../SolidFormApi.lib'

export const FormContext = createContext<InternalSolidFormApi>()
export const FieldContext = createContext<Accessor<AnyInternalFieldApi>>()

// Solid 2's `useContext` throws when no provider is found, so the lookup is
// wrapped to keep TanStack Form's error messages.
function readContext<T>(context: Context<T>, message: string): T {
  try {
    return useContext(context)
  } catch {
    throw new Error(message)
  }
}

export function useFieldContext(): Accessor<AnyInternalFieldApi> {
  return readContext(
    FieldContext,
    'TanStack Form: Field components must be used within a `form.Field` component.',
  )
}

export function useFormContext(): InternalSolidFormApi {
  return readContext(
    FormContext,
    'TanStack Form: Form components must be used within a `form.AppForm` component.',
  )
}
