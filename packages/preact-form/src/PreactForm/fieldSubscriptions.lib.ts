import { shallow, useSelector } from '@tanstack/preact-store'
import { useMemo } from 'preact/compat'
import type { AnyInternalFieldApi } from '@tanstack/form-core/internals'

export function useValueFieldSubscription(
  fieldApi: AnyInternalFieldApi,
): AnyInternalFieldApi {
  const value = useSelector(fieldApi.atom, (state) => state.value)
  const meta = useSelector(fieldApi.atom, (state) => state.meta)

  return useMemo(() => {
    void meta
    void value
    return Object.create(fieldApi)
  }, [fieldApi, meta, value])
}

export function useArrayFieldSubscription(
  fieldApi: AnyInternalFieldApi,
): AnyInternalFieldApi {
  const length = useSelector(fieldApi.atom, (state) => state.value.length)
  const arrayVersion = useSelector(
    fieldApi.atom,
    (state) => state.meta._arrayVersion,
  )
  const errors = useSelector(fieldApi.atom, (state) => state.meta.errors, {
    compare: shallow,
  })

  return useMemo(() => {
    void length
    void arrayVersion
    void errors
    return Object.create(fieldApi)
  }, [fieldApi, arrayVersion, length, errors])
}
