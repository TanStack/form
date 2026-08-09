import type { Accessor } from 'solid-js'
import type { AppFormOptionsApi } from './appFormOptions.public'
import type { AnySolidFormComponentMap } from './componentMap.public'
import type { SolidAppFormApi } from './SolidAppFormApi.public'
import type { DefineFieldGroupFn } from '../FieldGroup/withFields.public'
import type {
  FormOptions,
  FormValidators,
  ToFormErrorTypes,
} from '@tanstack/form-core'

export type UseAppFormHook<TComponents extends AnySolidFormComponentMap> = <
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
>(
  options: Accessor<FormOptions<TFormData, TFormValidators, TSubmitReturn>>,
) => SolidAppFormApi<
  TFormData,
  ToFormErrorTypes<TFormValidators, TSubmitReturn>,
  TComponents
>

export interface AppFormHookResult<
  TComponents extends AnySolidFormComponentMap,
> {
  appFormOptions: AppFormOptionsApi<TComponents>
  defineAppFieldGroup: DefineFieldGroupFn<TComponents['fieldComponents']>
  useAppForm: UseAppFormHook<TComponents>
  useFormContext: () => SolidAppFormApi<any, any, TComponents>
}
