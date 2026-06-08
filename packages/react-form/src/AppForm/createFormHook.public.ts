import { useContext } from 'react'
import { useInternalForm } from '../ReactForm/ReactFormApi.lib'
import { createAppFormInitializer } from './initializeAppForm.lib'
import { FormContext } from './contexts.lib'
import type {
  UseAppFormHook,
  UseNullableSchemaAppFormHook,
  UseSchemaAppFormHook,
} from './useAppFormTypes.public'
import type { AppFormOptionsApi } from './appFormOptions.public'
import type { AnyReactFormComponentMap } from './componentMap.public'
import type { AppFormHookResult } from './createFormHookTypes.public'
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

appFormOptions.schema = (opts) => opts as never
appFormOptions.nullableSchema = (opts) => opts as never

export function createFormHook<
  const TComponents extends AnyReactFormComponentMap,
>(createOptions: TComponents): AppFormHookResult<TComponents> {
  const initializeAppForm = createAppFormInitializer(createOptions)

  function useExtendedForm(hookOptions: FormOptions<any, any, any>) {
    const form = useInternalForm(hookOptions, initializeAppForm)
    return form
  }
  // TODO you need to attach the actual form components at runtime
  const useSchemaAppForm =
    useExtendedForm as unknown as UseSchemaAppFormHook<TComponents>

  const useAppForm = useExtendedForm as never as UseAppFormHook<TComponents>

  // TODO add unit tests, chances are the InferUnion type is incomplete
  const useNullableSchemaAppForm =
    useExtendedForm as never as UseNullableSchemaAppFormHook<TComponents>

  return {
    useFormContext: useFormContext as never,
    appFormOptions,
    useSchemaAppForm,
    useAppForm,
    useNullableSchemaAppForm,
  }
}
