import { useFormHook } from '../ReactForm/ReactFormApi.lib'
import type { FunctionComponent } from 'react'
import type { AppFormOptionsApi } from './appFormOptions.public'
import type {
  UseFormHook,
  UseNullableSchemaFormHook,
  UseSchemaFormHook,
} from '../ReactForm/useForm.public'

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
  options: AppFormHookCreateOptions<TFormComponents, TFieldComponents>,
): AppFormHookResult<TFormComponents, TFieldComponents> {
  // TODO you need to attach the actual form components at runtime
  const useSchemaAppForm = useFormHook as unknown as UseSchemaFormHook<
    TFormComponents,
    TFieldComponents
  >

  const useAppForm = useFormHook as never as UseFormHook<
    TFormComponents,
    TFieldComponents
  >

  // TODO add unit tests, chances are the InferUnion type is incomplete
  const useNullableSchemaAppForm =
    useFormHook as never as UseNullableSchemaFormHook<
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
