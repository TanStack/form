import { InternalFormApi } from '@tanstack/form-core-v2/internals'
import { useInternalForm } from '../ReactForm/ReactFormApi.lib'
import { attachReactAppFormComponents } from './Components.lib'
import type { InternalReactFormApi } from '../ReactForm/ReactFormApi.lib'
import type { FunctionComponent } from 'react'
import type { AppFormOptionsApi } from './appFormOptions.public'
import type {
  UseFormHook,
  UseNullableSchemaFormHook,
  UseSchemaFormHook,
} from '../ReactForm/useForm.public'
import type { FormOptions } from '@tanstack/form-core-v2'

const appFormOptions = ((opts) => {
  return opts
}) as AppFormOptionsApi<any, any>

appFormOptions.schema = (opts) => opts as never
appFormOptions.nullableSchema = (opts) => opts as never

export interface AppFormHookResult<
  TFormComponents extends Record<string, FunctionComponent<any>>,
  TFieldComponents extends Record<string, FunctionComponent<any>>,
> {
  appFormOptions: AppFormOptionsApi<TFormComponents, TFieldComponents>
  useSchemaAppForm: UseSchemaFormHook<TFormComponents, TFieldComponents>
  useAppForm: UseFormHook<TFormComponents, TFieldComponents>
  useNullableSchemaAppForm: UseNullableSchemaFormHook<
    TFormComponents,
    TFieldComponents
  >
}

export interface AppFormHookCreateOptions<
  TFormComponents extends Record<string, FunctionComponent<any>>,
  TFieldComponents extends Record<string, FunctionComponent<any>>,
> {
  fieldComponents: TFieldComponents
  formComponents: TFormComponents
}

export function createFormHook<
  const TFormComponents extends Record<string, FunctionComponent<any>>,
  const TFieldComponents extends Record<string, FunctionComponent<any>>,
>(
  createOptions: AppFormHookCreateOptions<TFormComponents, TFieldComponents>,
): AppFormHookResult<TFormComponents, TFieldComponents> {
  function initializeAppForm(
    options: FormOptions<any, any, any>,
  ): InternalReactFormApi {
    const form = new InternalFormApi(options)
    const extendedForm = attachReactAppFormComponents(
      form,
      createOptions.formComponents,
      createOptions.fieldComponents,
    )

    return extendedForm as never
  }

  function useExtendedForm(hookOptions: FormOptions<any, any, any>) {
    const form = useInternalForm(hookOptions, initializeAppForm)
    return form
  }
  // TODO you need to attach the actual form components at runtime
  const useSchemaAppForm = useExtendedForm as unknown as UseSchemaFormHook<
    TFormComponents,
    TFieldComponents
  >

  const useAppForm = useExtendedForm as never as UseFormHook<
    TFormComponents,
    TFieldComponents
  >

  // TODO add unit tests, chances are the InferUnion type is incomplete
  const useNullableSchemaAppForm =
    useExtendedForm as never as UseNullableSchemaFormHook<
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
