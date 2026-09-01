import { useSelector } from '@tanstack/react-store'
import { useMemo } from 'react'
import type { AnyInternalFieldApi } from '@tanstack/form-core/internals'

export function useValueFieldSubscription(
  fieldApi: AnyInternalFieldApi,
): AnyInternalFieldApi {
  const state = useSelector(fieldApi.atom, state => state)

  return useMemo(() => {
    void state
    return Object.create(fieldApi)
  }, [fieldApi, state])
}

export function useArrayFieldSubscription(
  fieldApi: AnyInternalFieldApi,
): AnyInternalFieldApi {
  const length = useSelector(fieldApi.atom, (state) => state.value.length)
  const arrayVersion = useSelector(
    fieldApi.atom,
    (state) => state.meta._arrayVersion,
  )

  return useMemo(() => {
    void length
    void arrayVersion
    return Object.create(fieldApi)
  }, [fieldApi, arrayVersion, length])
}
