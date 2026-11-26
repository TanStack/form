import { createContext, useContext } from 'react'
import type { AnyFormApi } from '@tanstack/form-core'
import type { AnyInternalFieldApi } from '@tanstack/form-core/internals'

export const FieldContext = createContext<AnyInternalFieldApi | null>(null)
export const FormContext = createContext<AnyFormApi | null>(null)

export function useFormComponentContext(): AnyFormApi {
  const form = useContext(FormContext)
  if (form === null) {
    throw new Error(
      'TanStack Form: Components prepared with `formComponent.create()` must be rendered within a registered form component.',
    )
  }

  return form
}

export function useFormContext() {
  const form = useContext(FormContext)
  if (form === null) {
    throw new Error(
      'TanStack Form: `useFormContext()` must be used within a `Provider` returned by `formContext.create()` or a registered form component.',
    )
  }

  return form
}

export function useFieldContext(): AnyInternalFieldApi {
  const field = useContext(FieldContext)
  if (field === null) {
    throw new Error(
      'TanStack Form: Field components must be used within a `form.Field` component.',
    )
  }

  return field
}
