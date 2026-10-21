import { createInternalReactAppFormApiClass } from './ReactAppFormApi.lib'
import type { InternalReactFormApi } from '../ReactForm/ReactFormApi.lib'
import type { ReactComponentTree } from './componentMap.public'
import type {
  AnyFormOptions,
  DefaultFieldOptions,
  DefaultFormGroupOptions,
  DefaultFormOptions,
  DefaultOptions,
} from '@tanstack/form-core'

interface AnyCreateFormHookOptions {
  formComponents: ReactComponentTree
  fieldComponents: ReactComponentTree
  defaultFormOptions?: DefaultFormOptions
  defaultFieldOptions?: DefaultFieldOptions
  defaultFormGroupOptions?: DefaultFormGroupOptions
}

export function createAppFormInitializer(
  createOptions: AnyCreateFormHookOptions,
): (options: AnyFormOptions) => InternalReactFormApi {
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
