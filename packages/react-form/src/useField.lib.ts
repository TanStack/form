import { useEffect, useMemo, useRef } from 'react'
import type { InternalFormApi } from '@tanstack/form-core-v2/internals'
import type { ReactFormFieldProps } from './useForm.public'

export interface InternalFieldProps<TData> extends ReactFormFieldProps<TData> {
  form: InternalFormApi<TData, any>
}

export function useField<TData>(options: InternalFieldProps<TData>) {
  const validatorsRef = useRef(options.validators)
  const fieldApi = useMemo(
    () =>
      options.form._getOrCreateFieldApi(options.name, validatorsRef.current),
    [options.name, options.form],
  )

  useEffect(() => fieldApi._update(options))

  return fieldApi
}
