import type { FormErrorTypes } from '@tanstack/form-core'
import type { ReactFormApi } from '../ReactForm/formApiTypes.public'
import type { FunctionComponent } from 'react'
import type { CrossVersionReactNode } from '../reactTypes.public'
import type { AnyReactFormComponentMap } from './componentMap.public'

export type AppFormComponent = FunctionComponent<{
  children: Exclude<CrossVersionReactNode, Promise<any>>
}>

export type ReactAppFormApi<
  TFormData,
  TFormErrorTypes extends FormErrorTypes,
  TComponents extends AnyReactFormComponentMap,
> = ReactFormApi<TFormData, TFormErrorTypes, TComponents> & {
  AppForm: AppFormComponent
}
