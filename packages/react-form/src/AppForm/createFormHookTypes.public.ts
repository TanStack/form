import type { AppFormOptionsApi } from './appFormOptions.public'
import type { AnyReactFormComponentMap } from './componentMap.public'
import type { ReactAppFormApi } from './ReactAppFormApi.public'
import type {
  FormOptions,
  FormValidators,
  ToFormValidatorMetas,
} from '@tanstack/form-core-v2'

export type UseAppFormHook<in out TComponents extends AnyReactFormComponentMap> = <
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
>(
  options: FormOptions<TFormData, TFormValidators, TSubmitReturn>,
) => ReactAppFormApi<
  TFormData,
  ToFormValidatorMetas<TFormValidators>,
  TSubmitReturn,
  TComponents
>

export interface AppFormHookResult<
  in out TComponents extends AnyReactFormComponentMap,
> {
  appFormOptions: AppFormOptionsApi<TComponents>
  useAppForm: UseAppFormHook<TComponents>
  useFormContext: () => ReactAppFormApi<any, any, any, TComponents>
}
