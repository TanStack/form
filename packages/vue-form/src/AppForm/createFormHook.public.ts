import { useInternalForm } from '../VueForm/VueFormApi.lib'
import { defineFieldGroup } from '../FieldGroup/withFields.public'
import { createAppFormInitializer } from './initializeAppForm.lib'
import { useFormContext } from './contexts.lib'
import type { AppFormOptionsApi } from './appFormOptions.public'
import type { AnyVueFormComponentMap } from './componentMap.public'
import type {
  AppFormHookResult,
  UseAppFormHook,
} from './createFormHookTypes.public'
import type { FormOptions } from '@tanstack/form-core'

const appFormOptions = ((opts: unknown) => opts) as AppFormOptionsApi<any>
appFormOptions.strictSchema = (opts) => opts as never
appFormOptions.looseSchema = (opts) => opts as never

export function createFormHook<
  const TComponents extends AnyVueFormComponentMap,
>(createOptions: TComponents): AppFormHookResult<TComponents> {
  const initializeAppForm = createAppFormInitializer(createOptions)

  function useExtendedForm(options: FormOptions<any, any, any>) {
    return useInternalForm(options, initializeAppForm)
  }

  return {
    useFormContext: useFormContext as never,
    appFormOptions,
    defineAppFieldGroup: defineFieldGroup,
    useAppForm: useExtendedForm as never as UseAppFormHook<TComponents>,
  }
}
