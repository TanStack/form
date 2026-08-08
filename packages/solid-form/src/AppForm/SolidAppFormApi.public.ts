import type { FormErrorTypes } from '@tanstack/form-core'
import type { ParentComponent } from 'solid-js'
import type { SolidFormApi } from '../formApiTypes.public'
import type { AnySolidFormComponentMap } from './componentMap.public'

export type AppFormComponent = ParentComponent

export type SolidAppFormApi<
  TFormData,
  TFormErrorTypes extends FormErrorTypes,
  TComponents extends AnySolidFormComponentMap,
> = SolidFormApi<TFormData, TFormErrorTypes, TComponents> & {
  AppForm: AppFormComponent
}
