import { useEffect, useMemo, useRef } from 'react'
import { useSelector } from '@tanstack/react-store'
import type {
  AnyInternalFieldApi,
  InternalFormApi,
} from '@tanstack/form-core-v2/internals'
import type { ReactFormFieldProps } from './ReactForm/Components.public'

export interface InternalFieldProps extends ReactFormFieldProps<
  any,
  any,
  any,
  any,
  any,
  any
> {
  form: InternalFormApi<any, any, any>
}

export function useField(options: InternalFieldProps): AnyInternalFieldApi {
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

export function useValueField(
  options: InternalFieldProps,
): AnyInternalFieldApi {
  const fieldApi = useField(options)
  useSelector(fieldApi.store, (state) => state.value)
  useSelector(fieldApi.store, (state) => state.meta)
  return fieldApi
}

export function useArrayField(
  options: InternalFieldProps,
): AnyInternalFieldApi {
  const fieldApi = useField(options)

  useSelector(fieldApi.store, (state) => state.value.length)
  useSelector(fieldApi.store, (state) => state.meta._arrayVersion)

  return fieldApi
}
