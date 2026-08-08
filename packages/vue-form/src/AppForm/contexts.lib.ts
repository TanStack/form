import { inject } from 'vue'
import type { InjectionKey } from 'vue'
import type { AnyInternalFieldApi } from '@tanstack/form-core/internals'
import type { InternalVueFormApi } from '../VueForm/VueFormApi.lib'

export const FormContext = Symbol(
  'TanStackForm.FormContext',
) as InjectionKey<InternalVueFormApi>
export const FieldContext = Symbol(
  'TanStackForm.FieldContext',
) as InjectionKey<AnyInternalFieldApi>

export function useFieldContext(): AnyInternalFieldApi {
  const field = inject(FieldContext)
  if (field === undefined) {
    throw new Error(
      'TanStack Form: Field components must be used within a `form.Field` component.',
    )
  }
  return field
}

export function useFormContext(): InternalVueFormApi {
  const form = inject(FormContext)
  if (form === undefined) {
    throw new Error(
      'TanStack Form: Form components must be used within a `form.AppForm` component.',
    )
  }
  return form
}
