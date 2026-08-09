import type { FormErrorTypes } from '@tanstack/form-core'
import type { ReactFormApi } from '../ReactForm/formApiTypes.public'
import type { FunctionComponent, ReactNode } from 'react'
import type { AnyReactFormComponentMap } from './componentMap.public'

export type AppFormComponent = FunctionComponent<{
  children: Exclude<ReactNode, Promise<any>>
}>

export type ReactAppFormApi<
  TFormData,
  TFormErrorTypes extends FormErrorTypes,
  TComponents extends AnyReactFormComponentMap,
> = ReactFormApi<TFormData, TFormErrorTypes, TComponents> & {
  AppForm: AppFormComponent
}
