import { InternalFormApi } from '@tanstack/form-core-v2/internals'
import { useEffect, useRef } from 'react'
import { attachReactFormComponents } from './Components.lib'
import type { AnyInternalFormApi } from '@tanstack/form-core-v2/internals'
import type { FormOptions } from '@tanstack/form-core-v2'
import type { ReactTanStackFormComponents } from './Components.public'

export interface InternalReactFormApi
  extends AnyInternalFormApi, ReactTanStackFormComponents<any, any, any, any> {}

export function initializeForm(
  options: FormOptions<any, any, any>,
): InternalReactFormApi {
  const form = new InternalFormApi(options)

  const reactFormApi = attachReactFormComponents(form, null)

  return reactFormApi
}

export function useInternalForm(
  options: FormOptions<any, any, any>,
  initializeFn: (options: FormOptions<any, any, any>) => InternalReactFormApi,
) {
  const formRef = useRef<InternalReactFormApi>(null)

  if (!formRef.current) {
    formRef.current = initializeFn(options)
  }

  useEffect(() => formRef.current!._update(options))
  useEffect(() => {
    const unmount = formRef.current!.mount()
    return unmount
  }, [])

  return formRef.current
}
