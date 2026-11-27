import type { ParentComponent } from 'solid-js'
import type { SolidFormApi } from '../formApiTypes.public'
import type { AnySolidFormComponentMap } from './componentMap.public'
import type { ScopedErrorTypes } from '@tanstack/form-core'

export type AppFormComponent = ParentComponent

export type SolidAppFormApi<
  TFormData,
  TFormError extends ScopedErrorTypes,
  TComponents extends AnySolidFormComponentMap,
> = SolidFormApi<TFormData, TFormError, TComponents> & {
  AppForm: AppFormComponent
}
