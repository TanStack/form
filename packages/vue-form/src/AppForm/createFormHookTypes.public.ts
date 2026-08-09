import type { AppFormOptionsApi } from './appFormOptions.public'
import type { AnyVueFormComponentMap } from './componentMap.public'
import type { VueAppFormApi } from './VueAppFormApi.public'
import type { DefineFieldGroupFn } from '../FieldGroup/withFields.public'
import type {
  FormOptions,
  FormValidators,
  ToFormErrorTypes,
} from '@tanstack/form-core'

export type UseAppFormHook<TComponents extends AnyVueFormComponentMap> = <
  TFormData,
  const TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
>(
  options: FormOptions<TFormData, TFormValidators, TSubmitReturn>,
) => VueAppFormApi<
  TFormData,
  ToFormErrorTypes<TFormValidators, TSubmitReturn>,
  TComponents
>

export interface AppFormHookResult<TComponents extends AnyVueFormComponentMap> {
  appFormOptions: AppFormOptionsApi<TComponents>
  defineAppFieldGroup: DefineFieldGroupFn<TComponents['fieldComponents']>
  useAppForm: UseAppFormHook<TComponents>
  useFormContext: () => VueAppFormApi<any, any, TComponents>
}
