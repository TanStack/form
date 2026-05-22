import type {
  UseAppFormHook,
  UseNullableSchemaAppFormHook,
  UseSchemaAppFormHook,
} from './useAppFormTypes.public'
import type { FunctionComponent } from 'react'
import type { AppFormOptionsApi } from './appFormOptions.public'

export interface AppFormHookResult<
  TFormComponents extends Record<string, FunctionComponent<any>>,
  TFieldComponents extends Record<string, FunctionComponent<any>>,
> {
  appFormOptions: AppFormOptionsApi<TFormComponents, TFieldComponents>
  useSchemaAppForm: UseSchemaAppFormHook<TFormComponents, TFieldComponents>
  useAppForm: UseAppFormHook<TFormComponents, TFieldComponents>
  useNullableSchemaAppForm: UseNullableSchemaAppFormHook<
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
