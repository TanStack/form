import { useInternalForm } from '../VueForm/VueFormApi.lib'
import { defineFieldGroup } from '../FieldGroup/withFields.public'
import { createAppFormInitializer } from './initializeAppForm.lib'
import { useFormContext } from './contexts.lib'
import type { AppFormOptionsApi } from './appFormOptions.public'
import type {
  AppFormHookResult,
  CreateFormHookOptions,
  UseAppFormHook,
} from './createFormHookTypes.public'
import type { Component } from 'vue'
import type { FormOptions } from '@tanstack/form-core'

const appFormOptions = ((opts: unknown) => opts) as AppFormOptionsApi<any>
appFormOptions.strictSchema = (opts) => opts as never
appFormOptions.looseSchema = (opts) => opts as never

export function createFormHook<
  const TFormComponents extends Record<string, Component>,
  const TFieldComponents extends Record<string, Component>,
>(
  createOptions: CreateFormHookOptions<TFormComponents, TFieldComponents>,
): AppFormHookResult<{
  formComponents: TFormComponents
  fieldComponents: TFieldComponents
}> {
  const initializeAppForm = createAppFormInitializer(createOptions)

  function useExtendedForm(options: FormOptions<any, any, any>) {
    return useInternalForm(options, initializeAppForm)
  }

  return {
    useFormContext: useFormContext as never,
    appFormOptions,
    defineAppFieldGroup: defineFieldGroup as never,
    useAppForm: useExtendedForm as never as UseAppFormHook<{
      formComponents: TFormComponents
      fieldComponents: TFieldComponents
    }>,
  }
}
