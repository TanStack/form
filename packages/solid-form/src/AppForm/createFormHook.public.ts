import { createInternalForm } from '../SolidFormApi.lib'
import { defineFieldGroup } from '../FieldGroup/withFields.public'
import { createAppFormInitializer } from './initializeAppForm.lib'
import { useFormContext } from './contexts.lib'
import type {
  AppFormHookResult,
  CreateFormHookOptions,
  UseAppFormHook,
} from './createFormHookTypes.public'
import type { Accessor, Component } from 'solid-js'
import type { FormOptions, FormOptionsApi } from '@tanstack/form-core'

const appFormOptions = ((opts: unknown) => opts) as FormOptionsApi<any>
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

  function useExtendedForm(
    options: Accessor<FormOptions<any, any, any, unknown>>,
  ) {
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
