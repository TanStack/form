import { InternalFormApi } from '@tanstack/form-core/internals'
import * as React from 'react'
import { useEffect, useRef } from 'react'
import {
  createArrayFieldComponent,
  createFieldComponent,
  createFormGroupComponent,
  createSubscribeComponent,
} from './Components.lib'
import type { DefaultOptions, FormOptions } from '@tanstack/form-core'
import type { FunctionComponent } from 'react'
import type { ReactTanStackFormComponents } from './Components.public'

const useReactId =
  (React as typeof React & { useId?: () => string }).useId ?? (() => undefined)

export class InternalReactFormApi
  extends InternalFormApi<any, any, any>
  implements ReactTanStackFormComponents<any, any, any>
{
  Field: ReactTanStackFormComponents<any, any, any>['Field']
  ArrayField: ReactTanStackFormComponents<any, any, any>['ArrayField']
  Subscribe: ReactTanStackFormComponents<any, any, any>['Subscribe']
  FormGroup: ReactTanStackFormComponents<any, any, any>['FormGroup']

  constructor(
    options: FormOptions<any, any, any, unknown>,
    defaultOptions?: DefaultOptions,
    fieldComponents: Record<string, FunctionComponent<any>> | null = null,
  ) {
    super(options, defaultOptions)
    this.Field = createFieldComponent(
      this,
      fieldComponents,
      'field',
    ) as InternalReactFormApi['Field']
    this.ArrayField = createArrayFieldComponent(this, fieldComponents, 'field')
    this.Subscribe = createSubscribeComponent(this)
    this.FormGroup = createFormGroupComponent(
      this,
      fieldComponents,
    ) as InternalReactFormApi['FormGroup']
  }
}

export function initializeForm(
  options: FormOptions<any, any, any, unknown>,
): InternalReactFormApi {
  return new InternalReactFormApi(options)
}

export function useInternalForm(
  options: FormOptions<any, any, any, unknown>,
  initializeFn: (
    options: FormOptions<any, any, any, unknown>,
  ) => InternalReactFormApi,
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
