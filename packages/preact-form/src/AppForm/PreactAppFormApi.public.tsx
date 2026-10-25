import type { PreactFormApi } from '../PreactForm/formApiTypes.public'
import type { FunctionComponent } from 'preact/compat'
import type { CrossVersionPreactNode } from '../preactTypes.public'
import type { AnyPreactFormComponentMap } from './componentMap.public'
import type { ScopedErrorTypes } from '@tanstack/form-core'

export type AppFormComponent = FunctionComponent<{
  children: Exclude<CrossVersionPreactNode, Promise<any>>
}>

export type PreactAppFormApi<
  TFormData,
  TFormError extends ScopedErrorTypes,
  TComponents extends AnyPreactFormComponentMap,
> = PreactFormApi<TFormData, TFormError, TComponents> & {
  AppForm: AppFormComponent
}
