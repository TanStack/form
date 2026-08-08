import { createInternalForm } from '../SolidFormApi.lib'
import { getFieldGroupHelpers } from '../FieldGroup/withFields.public'
import { createAppFormInitializer } from './initializeAppForm.lib'
import { useFormContext } from './contexts.lib'
import type { AppFormOptionsApi } from './appFormOptions.public'
import type { AnySolidFormComponentMap } from './componentMap.public'
import type {
  AppFormHookResult,
  UseAppFormHook,
} from './createFormHookTypes.public'
import type { Accessor } from 'solid-js'
import type { FormOptions } from '@tanstack/form-core'

const appFormOptions = ((opts: unknown) => opts) as AppFormOptionsApi<any>
appFormOptions.strictSchema = (opts) => opts as never
appFormOptions.looseSchema = (opts) => opts as never

export function createFormHook<
  const TComponents extends AnySolidFormComponentMap,
>(createOptions: TComponents): AppFormHookResult<TComponents> {
  const initializeAppForm = createAppFormInitializer(createOptions)

  function useExtendedForm(options: Accessor<FormOptions<any, any, any>>) {
    return createInternalForm(options, initializeAppForm)
  }
  const useAppForm = useExtendedForm as never as UseAppFormHook<TComponents>

  return {
    useFormContext: useFormContext as never,
    appFormOptions,
    getAppFieldGroupHelpers: getFieldGroupHelpers,
    useAppForm,
  }
}
