import { useMemo } from 'react'
import type { InternalFormApi } from '@tanstack/form-core-v2/internals'
import type { FieldProps } from './useForm.public'

export interface InternalFieldProps<TData> extends FieldProps<TData> {
  form: InternalFormApi<TData>
}

export function useField<TData>(options: InternalFieldProps<TData>) {
  const fieldApi = useMemo(
    () => options.form._requestField(options.name),
    [options.name, options.form],
  )

  return fieldApi
}
