import { InternalFormApi } from '@tanstack/form-core/internals'
import * as Preact from 'preact/compat'
import { useEffect, useRef } from 'preact/compat'
import { attachPreactFormComponents } from './Components.lib'
import type { AnyInternalFormApi } from '@tanstack/form-core/internals'
import type { FormOptions } from '@tanstack/form-core'
import type { PreactTanStackFormComponents } from './Components.public'

const usePreactId =
  (Preact as typeof Preact & { useId?: () => string }).useId ??
  (() => undefined)

export interface InternalPreactFormApi
  extends AnyInternalFormApi, PreactTanStackFormComponents<any, any, any> {}

export function initializeForm(
  options: FormOptions<any, any, any, unknown>,
): InternalPreactFormApi {
  const form = new InternalFormApi(options)

  const preactFormApi = attachPreactFormComponents(form, null)

  return preactFormApi
}

export function useInternalForm(
  options: FormOptions<any, any, any, unknown>,
  initializeFn: (
    options: FormOptions<any, any, any, unknown>,
  ) => InternalPreactFormApi,
) {
  const preactFormId = usePreactId()
  const resolvedOptions =
    options.formId === undefined
      ? { ...options, formId: preactFormId }
      : options
  const formRef = useRef<InternalPreactFormApi>(null)

  if (!formRef.current) {
    formRef.current = initializeFn(resolvedOptions)
  }

  useEffect(() => formRef.current!._update(resolvedOptions))
  useEffect(() => {
    const unmount = formRef.current!.mount()
    return unmount
  }, [])

  return formRef.current
}
