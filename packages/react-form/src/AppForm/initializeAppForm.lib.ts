import { createInternalReactAppFormApiClass } from './ReactAppFormApi.lib'
import type { InternalReactFormApi } from '../ReactForm/ReactFormApi.lib'
import type {
  DefaultFieldOptions,
  DefaultFormGroupOptions,
  DefaultFormOptions,
  DefaultOptions,
  FormOptions,
} from '@tanstack/form-core'
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
): (options: FormOptions<any, any, any, unknown>) => InternalReactFormApi {
  const InternalReactAppFormApi = createInternalReactAppFormApiClass(
    createOptions.formComponents,
    createOptions.fieldComponents,
  )
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
    return new InternalReactAppFormApi(options, defaultOptions)
  }
}
