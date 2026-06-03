import type { FormValidators } from '@tanstack/form-core-v2'
import type { ReactFormApi } from '../ReactForm/formApiTypes.public'
import type { FunctionComponent } from 'react'
import type { CrossVersionReactNode } from '../reactTypes.public'
import type { AnyReactFormComponentMap } from './componentMap.public'

export type AppFormComponent = FunctionComponent<{
  children: Exclude<CrossVersionReactNode, Promise<any>>
}>

export type ReactAppFormApi<
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
  TComponents extends AnyReactFormComponentMap,
> = ReactFormApi<TFormData, TFormValidators, TSubmitReturn, TComponents> & {
  AppForm: AppFormComponent
}
