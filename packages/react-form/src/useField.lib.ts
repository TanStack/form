import { useEffect, useMemo, useRef } from 'react'
import type { InternalFormApi } from '@tanstack/form-core-v2/internals'
import type { ReactFormFieldProps } from './useForm.public'
import type { FormValidator } from '@tanstack/form-core-v2'

export interface InternalFieldProps<
  TData,
  TFormValidators extends Array<FormValidator<TData>>,
  TFieldValue,
> extends ReactFormFieldProps<TData, TFormValidators, TFieldValue> {
  form: InternalFormApi<TData, TFormValidators>
}

export function useField<
  TData,
  TFormValidators extends Array<FormValidator<TData>>,
  TFieldValue,
>(options: InternalFieldProps<TData, TFormValidators, TFieldValue>) {
  const optionsRef = useRef(options)
  optionsRef.current = options

  const fieldApi = useMemo(
    () =>
      options.form._getOrCreateFieldApi({
        ...optionsRef.current,
        name: options.name,
      }),
    [options.name, options.form],
  )

  useEffect(() => fieldApi._update(options))

  useEffect(() => {
    const cleanup = fieldApi._register()
    return cleanup
  })

  return fieldApi
}
