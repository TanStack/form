import { InternalFormApi } from '@tanstack/form-core/internals'
import { attachSvelteAppFormComponents } from './Components.lib'
import type {
  DefaultFieldOptions,
  DefaultFormGroupOptions,
  DefaultFormOptions,
  DefaultOptions,
  FormOptions,
} from '@tanstack/form-core'
import type { InternalSvelteFormApi } from '../createForm.svelte.js'
import type { Component } from 'svelte'

interface AnyCreateFormHookOptions {
  formComponents: Record<string, Component<any>>
  fieldComponents: Record<string, Component<any>>
  defaultFormOptions?: DefaultFormOptions
  defaultFieldOptions?: DefaultFieldOptions
  defaultFormGroupOptions?: DefaultFormGroupOptions
}

export function createAppFormInitializer(
  createOptions: AnyCreateFormHookOptions,
): (options: FormOptions<any, any, any, unknown>) => InternalSvelteFormApi {
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
    attachSvelteAppFormComponents(
      new InternalFormApi(options, defaultOptions),
      createOptions.formComponents,
      createOptions.fieldComponents,
    ) as never
}
