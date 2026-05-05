import { useEffect, useMemo, useRef } from 'react'
import type { InternalFormApi } from '@tanstack/form-core-v2/internals'
import type { ReactFormFieldProps } from './useForm.public'
import type { FormValidator } from '@tanstack/form-core-v2'

export interface InternalFieldProps<
  TData,
  TFormValidators extends Array<FormValidator<TData>>,
> extends ReactFormFieldProps<TData, TFormValidators> {
  form: InternalFormApi<TData, any>
}

export function useField<
  TData,
  TFormValidators extends Array<FormValidator<TData>>,
>(options: InternalFieldProps<TData, TFormValidators>) {
  const validatorsRef = useRef(options.validators)
  const fieldApi = useMemo(
    () =>
      options.form._getOrCreateFieldApi(options.name, validatorsRef.current),
    [options.name, options.form],
  )

  useEffect(() => fieldApi._update(options))

  return fieldApi
}
