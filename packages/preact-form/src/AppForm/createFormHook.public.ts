import { useInternalForm } from '../PreactForm/PreactFormApi.lib'
import { defineFieldGroup } from '../FieldGroup/withFields.public'
import { createAppFormInitializer } from './initializeAppForm.lib'
import { useFormContext } from './contexts.lib'
import type {
  AppFormHookResult,
  CreateFormHookOptions,
  UseAppFormHook,
} from './createFormHookTypes.public'
import type { FunctionComponent } from 'preact/compat'
import type { FormOptions, FormOptionsApi } from '@tanstack/form-core'

const appFormOptions = ((opts) => {
  return opts
}) as FormOptionsApi<any>

appFormOptions.strictSchema = (opts) => opts as never
appFormOptions.looseSchema = (opts) => opts as never

export function createFormHook<
  const TFormComponents extends Record<string, FunctionComponent<any>>,
  const TFieldComponents extends Record<string, FunctionComponent<any>>,
>(
  createOptions: CreateFormHookOptions<TFormComponents, TFieldComponents>,
): AppFormHookResult<{
  formComponents: TFormComponents
  fieldComponents: TFieldComponents
}> {
  const initializeAppForm = createAppFormInitializer(createOptions)

  function useExtendedForm(hookOptions: FormOptions<any, any, any, unknown>) {
    const form = useInternalForm(hookOptions, initializeAppForm)
    return form
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
