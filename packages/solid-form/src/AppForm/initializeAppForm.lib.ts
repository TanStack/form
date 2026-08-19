import { InternalFormApi } from '@tanstack/form-core/internals'
import { attachSolidAppFormComponents } from './Components.lib'
import type {
  DefaultFieldOptions,
  DefaultFormGroupOptions,
  DefaultFormOptions,
  DefaultOptions,
  FormOptions,
} from '@tanstack/form-core'
import type { InternalSolidFormApi } from '../SolidFormApi.lib'
import type { Component } from 'solid-js'

interface AnyCreateFormHookOptions {
  formComponents: Record<string, Component<any>>
  fieldComponents: Record<string, Component<any>>
  defaultFormOptions?: DefaultFormOptions
  defaultFieldOptions?: DefaultFieldOptions
  defaultFormGroupOptions?: DefaultFormGroupOptions
}

export function createAppFormInitializer(
  createOptions: AnyCreateFormHookOptions,
): (options: FormOptions<any, any, any, unknown>) => InternalSolidFormApi {
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
    return attachSolidAppFormComponents(
      form,
      createOptions.formComponents,
      createOptions.fieldComponents,
    ) as never
  }
}
