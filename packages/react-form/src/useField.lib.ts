import { useEffect, useMemo, useRef } from 'react'
import { useSelector } from '@tanstack/react-store'
import type { FunctionComponent } from 'react'
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
  any,
  any
> {
  form: InternalFormApi<any, any, any>
}

export function useField(
  options: InternalFieldProps,
  fieldComponents: Record<string, FunctionComponent<any>> | null,
): AnyInternalFieldApi {
  const optionsRef = useRef(options)
  optionsRef.current = options

  const resetVersion = useSelector(options.form._resetVersionAtom)

  const fieldApi = useMemo(() => {
    void resetVersion
    const field = options.form._getOrCreateFieldApi({
      ...optionsRef.current,
      name: options.name,
    })
    if (fieldComponents === null) return field
    Object.assign(field, fieldComponents)

    return field
  }, [options.name, options.form, resetVersion, fieldComponents])

  useEffect(() => fieldApi._update(options))

  useEffect(() => {
    const cleanup = fieldApi._register()
    return cleanup
  })

  return fieldApi
}

export function useValueFieldSubscription(fieldApi: AnyInternalFieldApi): void {
  useSelector(fieldApi.store, (state) => state.value)
  useSelector(fieldApi.store, (state) => state.meta)
}

export function useArrayFieldSubscription(fieldApi: AnyInternalFieldApi): void {
  useSelector(fieldApi.store, (state) => state.value.length)
  useSelector(fieldApi.store, (state) => state.meta._arrayVersion)
}
