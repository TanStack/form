import { useSelector } from '@tanstack/react-store'
import type { AnyInternalFieldApi } from '@tanstack/form-core-v2/internals'

export function useValueFieldSubscription(fieldApi: AnyInternalFieldApi): void {
  useSelector(fieldApi.store, (state) => state.value)
  useSelector(fieldApi.store, (state) => state.meta)
}

export function useArrayFieldSubscription(fieldApi: AnyInternalFieldApi): void {
  useSelector(fieldApi.store, (state) => state.value.length)
  useSelector(fieldApi.store, (state) => state.meta._arrayVersion)
}
