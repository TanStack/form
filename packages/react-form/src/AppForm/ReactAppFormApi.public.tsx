import type { FormValidators } from '@tanstack/form-core-v2'
import type { ReactFormApi } from '../ReactForm/useForm.public'
import type { FunctionComponent } from 'react'
import type { CrossVersionReactNode } from '../types.public'

export type AppFormComponent = FunctionComponent<{
  children: Exclude<CrossVersionReactNode, Promise<any>>
}>

export type ReactAppFormApi<
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
  TFormComponents extends Record<string, FunctionComponent<any>>,
  TFieldComponents extends Record<string, FunctionComponent<any>>,
> = ReactFormApi<
  TFormData,
  TFormValidators,
  TSubmitReturn,
  TFormComponents,
  TFieldComponents
> & {
  AppForm: AppFormComponent
}
