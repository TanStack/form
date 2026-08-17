import * as Vue from 'vue'
import { uuid } from '@tanstack/form-core'

/**
 * `useId` was added in vue@3.5, but this package supports `vue@^3.4.0`. It is
 * read off the namespace, typed as optional, rather than imported by name: a
 * named import would make bundlers fail to resolve it on 3.4.
 * Read more: https://github.com/webpack/webpack/issues/14814
 */
const vueUseId: { useId?: () => string } = Vue

/**
 * Returns an SSR-safe id for the form, so the server-rendered markup and the
 * client hydration agree on it. Falls back to a random uuid when `useId` is
 * unavailable, or when called outside of a component instance, where `useId`
 * cannot produce a stable value.
 */
export function useFormId(): string {
  const useId = vueUseId.useId
  if (useId && Vue.getCurrentInstance()) {
    return useId()
  }
  return uuid()
}
