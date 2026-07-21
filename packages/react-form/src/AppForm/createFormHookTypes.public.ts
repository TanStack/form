import type { AppFormOptionsApi } from './appFormOptions.public'
import type { AnyReactFormComponentMap } from './componentMap.public'
import type { ReactAppFormApi } from './ReactAppFormApi.public'
import type { FieldGroupHelpers } from '../FieldGroup/withFields.public'
import type {
  FormOptions,
  FormValidators,
  ToFormErrorTypes,
} from '@tanstack/form-core'

export type UseAppFormHook<
  in out TComponents extends AnyReactFormComponentMap,
> = <
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
>(
  options: FormOptions<TFormData, TFormValidators, TSubmitReturn>,
) => ReactAppFormApi<
  TFormData,
  ToFormErrorTypes<TFormValidators, TSubmitReturn>,
  TComponents
>

export interface AppFormHookResult<
  in out TComponents extends AnyReactFormComponentMap,
> {
  appFormOptions: AppFormOptionsApi<TComponents>
  getAppFieldGroupHelpers: () => FieldGroupHelpers<
    TComponents['fieldComponents']
  >
  useAppForm: UseAppFormHook<TComponents>
  useFormContext: () => ReactAppFormApi<any, any, TComponents>
}
