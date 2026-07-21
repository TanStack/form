import { InternalFormApi } from '@tanstack/form-core/internals'
import * as React from 'react'
import { useEffect, useRef } from 'react'
import { attachReactFormComponents } from './Components.lib'
import type { AnyInternalFormApi } from '@tanstack/form-core/internals'
import type { FormOptions } from '@tanstack/form-core'
import type { ReactTanStackFormComponents } from './Components.public'

const useReactId =
  (React as typeof React & { useId?: () => string }).useId ?? (() => undefined)

export interface InternalReactFormApi
  extends AnyInternalFormApi, ReactTanStackFormComponents<any, any, any> {}

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
  const reactFormId = useReactId()
  const resolvedOptions =
    options.formId === undefined ? { ...options, formId: reactFormId } : options
  const formRef = useRef<InternalReactFormApi>(null)

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
