import { InternalFormApi } from '@tanstack/form-core/internals'
import { onMounted, onUnmounted, useId, watchEffect } from 'vue'
import { attachVueFormComponents } from './Components.lib'
import type { AnyInternalFormApi } from '@tanstack/form-core/internals'
import type { FormOptions } from '@tanstack/form-core'
import type { VueTanStackFormComponents } from './Components.public'

export interface InternalVueFormApi
  extends AnyInternalFormApi, VueTanStackFormComponents<any, any, any> {}

export function initializeForm(
  options: FormOptions<any, any, any, unknown>,
): InternalVueFormApi {
  return attachVueFormComponents(new InternalFormApi(options), null)
}

export function useInternalForm(
  options: FormOptions<any, any, any, unknown>,
  initializeFn: (
    options: FormOptions<any, any, any, unknown>,
  ) => InternalVueFormApi,
) {
  const vueFormId = useId()
  const resolveOptions = () =>
    options.formId === undefined ? { ...options, formId: vueFormId } : options
  const form = initializeFn(resolveOptions())

  watchEffect(() => form._update(resolveOptions()))

  let unmount: (() => void) | undefined
  onMounted(() => {
    unmount = form.mount()
  })
  onUnmounted(() => unmount?.())

  return form
}
