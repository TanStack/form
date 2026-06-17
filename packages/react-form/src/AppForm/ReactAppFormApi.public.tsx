import type { FormValidatorMetas } from '@tanstack/form-core'
import type { ReactFormApi } from '../ReactForm/formApiTypes.public'
import type { FunctionComponent } from 'react'
import type { CrossVersionReactNode } from '../reactTypes.public'
import type { AnyReactFormComponentMap } from './componentMap.public'

export type AppFormComponent = FunctionComponent<{
  children: Exclude<CrossVersionReactNode, Promise<any>>
}>

export type ReactAppFormApi<
  TFormData,
  TFormValidatorMetas extends FormValidatorMetas,
  TSubmitReturn,
  TComponents extends AnyReactFormComponentMap,
> = ReactFormApi<TFormData, TFormValidatorMetas, TSubmitReturn, TComponents> & {
  AppForm: AppFormComponent
}
