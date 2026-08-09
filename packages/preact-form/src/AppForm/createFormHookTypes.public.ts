import type { AppFormOptionsApi } from './appFormOptions.public'
import type { AnyPreactFormComponentMap } from './componentMap.public'
import type { PreactAppFormApi } from './PreactAppFormApi.public'
import type { FieldGroupHelpers } from '../FieldGroup/withFields.public'
import type {
  FormOptions,
  FormValidators,
  ToFormErrorTypes,
} from '@tanstack/form-core'

export type UseAppFormHook<
  in out TComponents extends AnyPreactFormComponentMap,
> = <
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
>(
  options: FormOptions<TFormData, TFormValidators, TSubmitReturn>,
) => PreactAppFormApi<
  TFormData,
  ToFormErrorTypes<TFormValidators, TSubmitReturn>,
  TComponents
>

export interface AppFormHookResult<
  in out TComponents extends AnyPreactFormComponentMap,
> {
  appFormOptions: AppFormOptionsApi<TComponents>
  getAppFieldGroupHelpers: () => FieldGroupHelpers<
    TComponents['fieldComponents']
  >
  useAppForm: UseAppFormHook<TComponents>
  useFormContext: () => PreactAppFormApi<any, any, TComponents>
}
