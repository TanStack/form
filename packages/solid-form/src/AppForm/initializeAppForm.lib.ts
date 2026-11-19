import { InternalFormApi } from '@tanstack/form-core/internals'
import { attachSolidAppFormComponents } from './Components.lib'
import type {
  DefaultFieldOptions,
  DefaultFormGroupOptions,
  DefaultFormOptions,
  DefaultOptions,
  FormOptions,
} from '@tanstack/form-core'
import type { AnyInternalFormApi } from '@tanstack/form-core/internals'
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
): {
  create: (options: FormOptions<any, any, any, unknown>) => AnyInternalFormApi
  attach: (form: AnyInternalFormApi, target: object) => void
} {
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

  return {
    create: (options) => new InternalFormApi(options, defaultOptions),
    attach: (form, target) => {
      attachSolidAppFormComponents(
        form,
        createOptions.formComponents,
        createOptions.fieldComponents,
        target,
      )
    },
  }
}
