import { useInternalForm } from '../ReactForm/ReactFormApi.lib'
import { createAppFormInitializer } from './initializeAppForm.lib'
import type {
  UseAppFormHook,
  UseNullableSchemaAppFormHook,
  UseSchemaAppFormHook,
} from './useAppFormTypes.public'
import type { FunctionComponent } from 'react'
import type { AppFormOptionsApi } from './appFormOptions.public'
import type {
  AppFormHookCreateOptions,
  AppFormHookResult,
} from './createFormHookTypes.public'
import type { FormOptions } from '@tanstack/form-core-v2'

const appFormOptions = ((opts) => {
  return opts
}) as AppFormOptionsApi<any, any>

appFormOptions.schema = (opts) => opts as never
appFormOptions.nullableSchema = (opts) => opts as never

export function createFormHook<
  const TFormComponents extends Record<string, FunctionComponent<any>>,
  const TFieldComponents extends Record<string, FunctionComponent<any>>,
>(
  createOptions: AppFormHookCreateOptions<TFormComponents, TFieldComponents>,
): AppFormHookResult<TFormComponents, TFieldComponents> {
  const initializeAppForm = createAppFormInitializer(createOptions)

  function useExtendedForm(hookOptions: FormOptions<any, any, any>) {
    const form = useInternalForm(hookOptions, initializeAppForm)
    return form
  }
  // TODO you need to attach the actual form components at runtime
  const useSchemaAppForm = useExtendedForm as unknown as UseSchemaAppFormHook<
    TFormComponents,
    TFieldComponents
  >

  const useAppForm = useExtendedForm as never as UseAppFormHook<
    TFormComponents,
    TFieldComponents
  >

  // TODO add unit tests, chances are the InferUnion type is incomplete
  const useNullableSchemaAppForm =
    useExtendedForm as never as UseNullableSchemaAppFormHook<
      TFormComponents,
      TFieldComponents
    >

  return {
    appFormOptions,
    useSchemaAppForm,
    useAppForm,
    useNullableSchemaAppForm,
  }
}
