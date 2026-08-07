import type { FormErrorTypes } from '@tanstack/form-core'
import type { PreactFormApi } from '../PreactForm/formApiTypes.public'
import type { FunctionComponent } from 'preact/compat'
import type { CrossVersionPreactNode } from '../preactTypes.public'
import type { AnyPreactFormComponentMap } from './componentMap.public'

export type AppFormComponent = FunctionComponent<{
  children: Exclude<CrossVersionPreactNode, Promise<any>>
}>

export type PreactAppFormApi<
  TFormData,
  TFormErrorTypes extends FormErrorTypes,
  TComponents extends AnyPreactFormComponentMap,
> = PreactFormApi<TFormData, TFormErrorTypes, TComponents> & {
  AppForm: AppFormComponent
}
