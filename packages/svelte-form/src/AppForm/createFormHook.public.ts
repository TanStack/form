import { createInternalForm } from '../createForm.svelte'
import { defineFieldGroup } from '../FieldGroup/withFields.public'
import { createAppFormInitializer } from './initializeAppForm.lib'
import { useFormContext } from './contexts.lib'
import type { AppFormOptionsApi } from './appFormOptions.public'
import type {
  AppFormHookResult,
  CreateFormHookOptions,
  UseAppFormHook,
} from './createFormHookTypes.public'
import type { Component } from 'svelte'
import type { FormOptions } from '@tanstack/form-core'

const appFormOptions = ((opts: unknown) => opts) as AppFormOptionsApi<any>
appFormOptions.strictSchema = (opts) => opts as never
appFormOptions.looseSchema = (opts) => opts as never

export function createFormHook<
  const TFormComponents extends Record<string, Component<any>>,
  const TFieldComponents extends Record<string, Component<any>>,
>(
  createOptions: CreateFormHookOptions<TFormComponents, TFieldComponents>,
): AppFormHookResult<{
  formComponents: TFormComponents
  fieldComponents: TFieldComponents
}> {
  const initializeAppForm = createAppFormInitializer(createOptions)

  function useExtendedForm(options: () => FormOptions<any, any, any>) {
    return createInternalForm(options, initializeAppForm)
  }
  const useAppForm = useExtendedForm as never as UseAppFormHook<{
    formComponents: TFormComponents
    fieldComponents: TFieldComponents
  }>

  return {
    useFormContext: useFormContext as never,
    appFormOptions,
    defineAppFieldGroup: defineFieldGroup as never,
    useAppForm,
  }
}
