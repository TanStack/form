import { formOptions } from '@tanstack/form-core'
import { useInternalForm } from '../ReactForm/ReactFormApi.lib'
import { defineFieldGroup } from '../FieldGroup/withFields.public'
import { createAppFormInitializer } from './initializeAppForm.lib'
import { useFormContext } from './contexts.lib'
import type {
  AppFormHookResult,
  CreateFormHookOptions,
  UseAppFormHook,
} from './createFormHookTypes.public'
import type { ReactComponentTree } from './componentMap.public'
import type { FormOptions } from '@tanstack/form-core'

export function createFormHook<
  const TFormComponents extends ReactComponentTree,
  const TFieldComponents extends ReactComponentTree,
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
    appFormOptions: formOptions as never,
    defineAppFieldGroup: defineFieldGroup as never,
    useAppForm,
  }
}
