import { useEffect, useMemo, useRef } from 'react'
import { useSelector } from '@tanstack/react-store'
import type { InternalFormApi } from '@tanstack/form-core-v2/internals'
import type { ReactFormFieldProps } from './useForm.public'
import type { DeepKeys, DeepValue, FormValidator } from '@tanstack/form-core-v2'

export interface InternalFieldProps<
  TFormData,
  TFormValidators extends ReadonlyArray<FormValidator<TFormData>>,
  TFieldName extends DeepKeys<TFormData>,
  TFieldValue extends DeepValue<TFormData, TFieldName>,
> extends ReactFormFieldProps<
  TFormData,
  TFormValidators,
  TFieldName,
  TFieldValue
> {
  form: InternalFormApi<TFormData, TFormValidators>
}

export function useField<
  TFormData,
  TFormValidators extends ReadonlyArray<FormValidator<TFormData>>,
  TFieldName extends DeepKeys<TFormData>,
  TFieldValue extends DeepValue<TFormData, TFieldName>,
>(
  options: InternalFieldProps<
    TFormData,
    TFormValidators,
    TFieldName,
    TFieldValue
  >,
) {
  const optionsRef = useRef(options)
  optionsRef.current = options

  const resetVersion = useSelector(options.form._resetVersionAtom)

  const fieldApi = useMemo(() => {
    void resetVersion
    return options.form._getOrCreateFieldApi({
      ...optionsRef.current,
      name: options.name,
    })
  }, [options.name, options.form, resetVersion])

  useEffect(() => fieldApi._update(options))

  useEffect(() => {
    const cleanup = fieldApi._register()
    return cleanup
  })

  return fieldApi
}
