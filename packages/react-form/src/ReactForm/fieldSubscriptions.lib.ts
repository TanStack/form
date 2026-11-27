import { useSelector } from '@tanstack/react-store'
import { useMemo } from 'react'
import type { AnyInternalFieldApi } from '@tanstack/form-core/internals'

export function useValueFieldSubscription(
  fieldApi: AnyInternalFieldApi,
): AnyInternalFieldApi {
  const state = useSelector(fieldApi.atom, (s) => s)

  return useMemo(() => {
    void state
    return Object.create(fieldApi)
  }, [fieldApi, state])
}

export function useArrayFieldSubscription(
  fieldApi: AnyInternalFieldApi,
  subscribeToMeta = false,
): AnyInternalFieldApi {
  const length = useSelector(fieldApi.atom, (s) => s.value.length)
  const metaOrArrayVersion = useSelector(fieldApi.atom, (s) => {
    if (subscribeToMeta) {
      return s.meta
    } else {
      return s.meta._arrayVersion
    }
  })

  return useMemo(() => {
    void length
    void metaOrArrayVersion
    return Object.create(fieldApi)
  }, [fieldApi, metaOrArrayVersion, length])
}
