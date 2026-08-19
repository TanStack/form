import { InternalFormApi } from '@tanstack/form-core/internals'
import { attachVueAppFormComponents } from './Components.lib'
import type {
  DefaultFieldOptions,
  DefaultFormGroupOptions,
  DefaultFormOptions,
  DefaultOptions,
  FormOptions,
} from '@tanstack/form-core'
import type { InternalVueFormApi } from '../VueForm/VueFormApi.lib'
import type { Component } from 'vue'

interface AnyCreateFormHookOptions {
  formComponents: Record<string, Component>
  fieldComponents: Record<string, Component>
  defaultFormOptions?: DefaultFormOptions
  defaultFieldOptions?: DefaultFieldOptions
  defaultFormGroupOptions?: DefaultFormGroupOptions
}

export function createAppFormInitializer(
  createOptions: AnyCreateFormHookOptions,
): (options: FormOptions<any, any, any, unknown>) => InternalVueFormApi {
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

  return (options) =>
    attachVueAppFormComponents(
      new InternalFormApi(options, defaultOptions),
      createOptions.formComponents,
      createOptions.fieldComponents,
    ) as never
}
