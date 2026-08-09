import type { AppFormOptionsApi } from './appFormOptions.public'
import type { AnySvelteFormComponentMap } from './componentMap.public'
import type { SvelteAppFormApi } from './SvelteAppFormApi.public'
import type { DefineFieldGroupFn } from '../FieldGroup/withFields.public'
import type {
  FormOptions,
  FormValidators,
  ToFormErrorTypes,
} from '@tanstack/form-core'

export type UseAppFormHook<TComponents extends AnySvelteFormComponentMap> = <
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
>(
  options: () => FormOptions<TFormData, TFormValidators, TSubmitReturn>,
) => SvelteAppFormApi<
  TFormData,
  ToFormErrorTypes<TFormValidators, TSubmitReturn>,
  TComponents
>

export interface AppFormHookResult<
  TComponents extends AnySvelteFormComponentMap,
> {
  appFormOptions: AppFormOptionsApi<TComponents>
  defineAppFieldGroup: DefineFieldGroupFn<TComponents['fieldComponents']>
  useAppForm: UseAppFormHook<TComponents>
  useFormContext: () => SvelteAppFormApi<any, any, TComponents>
}
