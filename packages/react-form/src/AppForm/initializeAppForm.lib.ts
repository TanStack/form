import { InternalFormApi } from '@tanstack/form-core/internals'
import { attachReactAppFormComponents } from './Components.lib'
import type {
  DefaultFieldOptions,
  DefaultFormGroupOptions,
  DefaultFormOptions,
  DefaultOptions,
  FormOptions,
} from '@tanstack/form-core'
import type { InternalReactFormApi } from '../ReactForm/ReactFormApi.lib'
import type { FunctionComponent } from 'react'

interface AnyCreateFormHookOptions {
  formComponents: Record<string, FunctionComponent<any>>
  fieldComponents: Record<string, FunctionComponent<any>>
  defaultFormOptions?: DefaultFormOptions
  defaultFieldOptions?: DefaultFieldOptions
  defaultFormGroupOptions?: DefaultFormGroupOptions
}

export function createAppFormInitializer(
  createOptions: AnyCreateFormHookOptions,
): (options: FormOptions<any, any, any>) => InternalReactFormApi {
  const hasDefaultOptions =
    createOptions.defaultFormOptions ||
    createOptions.defaultFieldOptions ||
    createOptions.defaultFormGroupOptions

  const defaultOptions: DefaultOptions | undefined = hasDefaultOptions
    ? {
        form: createOptions.defaultFormOptions,
        field: createOptions.defaultFieldOptions,
        formGroup: createOptions.defaultFormGroupOptions,
      }
    : undefined

  return (options) => {
    const form = new InternalFormApi(options, defaultOptions)
    const extendedForm = attachReactAppFormComponents(
      form,
      createOptions.formComponents,
      createOptions.fieldComponents,
    )

    return extendedForm as never
  }
}
