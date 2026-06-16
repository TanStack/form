import { useContext } from 'react'
import { useInternalForm } from '../ReactForm/ReactFormApi.lib'
import { getFieldGroupHelpers } from '../FieldGroup/withFields.public'
import { createAppFormInitializer } from './initializeAppForm.lib'
import { FormContext } from './contexts.lib'
import type { AppFormOptionsApi } from './appFormOptions.public'
import type { AnyReactFormComponentMap } from './componentMap.public'
import type {
  AppFormHookResult,
  UseAppFormHook,
} from './createFormHookTypes.public'
import type { FormOptions } from '@tanstack/form-core-v2'

function useFormContext() {
  const form = useContext(FormContext)
  if (form === null) {
    throw new Error(
      'TanStack Form: Form components must be used within a `form.AppForm` component.',
    )
  }

  return form
}

const appFormOptions = ((opts) => {
  return opts
}) as AppFormOptionsApi<any>

appFormOptions.strictSchema = (opts) => opts as never
appFormOptions.looseSchema = (opts) => opts as never

export function createFormHook<
  const TComponents extends AnyReactFormComponentMap,
>(createOptions: TComponents): AppFormHookResult<TComponents> {
  const initializeAppForm = createAppFormInitializer(createOptions)

  function useExtendedForm(hookOptions: FormOptions<any, any, any>) {
    const form = useInternalForm(hookOptions, initializeAppForm)
    return form
  }
  const useAppForm = useExtendedForm as never as UseAppFormHook<TComponents>

  return {
    useFormContext: useFormContext as never,
    appFormOptions,
    getAppFieldGroupHelpers: getFieldGroupHelpers,
    useAppForm,
  }
}
