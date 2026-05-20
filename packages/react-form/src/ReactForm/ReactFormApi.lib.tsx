import { InternalFormApi } from '@tanstack/form-core-v2/internals'
import { useEffect, useRef } from 'react'
import { attachReactFormComponents } from './Components.lib'
import type { AnyInternalFormApi } from '@tanstack/form-core-v2/internals'
import type { FormOptions } from '@tanstack/form-core-v2'
import type { ReactTanStackFormComponents } from './Components.public'

export interface InternalReactFormApi
  extends AnyInternalFormApi, ReactTanStackFormComponents<any, any, any> {}

export function initializeForm(
  options: FormOptions<any, any, any>,
): InternalReactFormApi {
  const form = new InternalFormApi(options)

  const reactFormApi = attachReactFormComponents(form)

  return reactFormApi
}

export function useFormHook(options: FormOptions<any, any, any>) {
  const formRef = useRef<InternalReactFormApi>(null)

  if (!formRef.current) {
    formRef.current = initializeForm(options)
  }

  useEffect(() => formRef.current!._update(options))

  return formRef.current
}
