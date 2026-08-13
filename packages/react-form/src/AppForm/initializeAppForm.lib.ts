import { InternalFormApi } from '@tanstack/form-core/internals'
import { attachReactAppFormComponents } from './Components.lib'
import type { FormOptions } from '@tanstack/form-core'
import type { InternalReactFormApi } from '../ReactForm/ReactFormApi.lib'
import type { FunctionComponent } from 'react'
import type {
  CreateFormHookDefaultFieldOptions,
  CreateFormHookDefaultFormGroupOptions,
  CreateFormHookDefaultFormOptions,
} from './createFormHookTypes.public'

interface AnyCreateFormHookOptions {
  formComponents: Record<string, FunctionComponent<any>>
  fieldComponents: Record<string, FunctionComponent<any>>
  defaultFormOptions?: CreateFormHookDefaultFormOptions
  defaultFieldOptions?: CreateFormHookDefaultFieldOptions
  defaultFormGroupOptions?: CreateFormHookDefaultFormGroupOptions
}

export function createAppFormInitializer(
  createOptions: AnyCreateFormHookOptions,
): (options: FormOptions<any, any, any>) => InternalReactFormApi {
  return (options) => {
    const form = new InternalFormApi(options)
    const extendedForm = attachReactAppFormComponents(
      form,
      createOptions.formComponents,
      createOptions.fieldComponents,
      createOptions.defaultFieldOptions,
      createOptions.defaultFormGroupOptions,
    )

    return extendedForm as never
  }
}
