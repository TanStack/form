import { useSelector } from '@tanstack/react-store'
import { useMemo } from 'react'
import type { AnyInternalFieldApi } from '@tanstack/form-core-v2/internals'

export function useValueFieldSubscription(
  fieldApi: AnyInternalFieldApi,
): AnyInternalFieldApi {
  const value = useSelector(fieldApi.store, (state) => state.value)
  const meta = useSelector(fieldApi.store, (state) => state.meta)

  return useMemo(() => {
    void meta
    void value
    return Object.create(fieldApi)
  }, [fieldApi, meta, value])
}

export function useArrayFieldSubscription(
  fieldApi: AnyInternalFieldApi,
): AnyInternalFieldApi {
  const length = useSelector(fieldApi.store, (state) => state.value.length)
  const arrayVersion = useSelector(
    fieldApi.store,
    (state) => state.meta._arrayVersion,
  )

  return useMemo(() => {
    void length
    void arrayVersion
    return Object.create(fieldApi)
  }, [fieldApi, arrayVersion, length])
}
