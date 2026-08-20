import { formOptions } from '@tanstack/form-core'
import { useInternalForm } from '../VueForm/VueFormApi.lib'
import { defineFieldGroup } from '../FieldGroup/withFields.public'
import { createAppFormInitializer } from './initializeAppForm.lib'
import { useFormContext } from './contexts.lib'
import type {
  AppFormHookResult,
  CreateFormHookOptions,
  UseAppFormHook,
} from './createFormHookTypes.public'
import type { Component } from 'vue'
import type { FormOptions } from '@tanstack/form-core'

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

  function useExtendedForm(options: FormOptions<any, any, any, unknown>) {
    return useInternalForm(options, initializeAppForm)
  }

  return {
    useFormContext: useFormContext as never,
    appFormOptions: formOptions as never,
    defineAppFieldGroup: defineFieldGroup as never,
    useAppForm: useExtendedForm as never as UseAppFormHook<{
      formComponents: TFormComponents
      fieldComponents: TFieldComponents
    }>,
  }
}
