import type { FunctionComponent } from 'react'
import type { AppFormOptionsApi } from './appFormOptions.public'
import type {
  UseFormHook,
  UseNullableSchemaFormHook,
  UseSchemaFormHook,
} from '../ReactForm/useFormTypes.public'

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
