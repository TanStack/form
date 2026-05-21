import { InternalFormApi } from '@tanstack/form-core-v2/internals'
import { attachReactAppFormComponents } from './Components.lib'
import type { FormOptions } from '@tanstack/form-core-v2'
import type { FunctionComponent } from 'react'
import type { InternalReactFormApi } from '../ReactForm/ReactFormApi.lib'
import type { AppFormHookCreateOptions } from './createFormHookTypes.public'

export function createAppFormInitializer<
  TFormComponents extends Record<string, FunctionComponent<any>>,
  TFieldComponents extends Record<string, FunctionComponent<any>>,
>(
  createOptions: AppFormHookCreateOptions<TFormComponents, TFieldComponents>,
): (options: FormOptions<any, any, any>) => InternalReactFormApi {
  return (options) => {
    const form = new InternalFormApi(options)
    const extendedForm = attachReactAppFormComponents(
      form,
      createOptions.formComponents,
      createOptions.fieldComponents,
    )

    return extendedForm as never
  }
}
