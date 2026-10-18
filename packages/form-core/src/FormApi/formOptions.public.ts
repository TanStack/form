import type {
  GetFormErrorTypes,
  ToFormErrorTypes,
} from '../validation/state.public'
import type { ErrorVisibility } from './errorVisibility.public'
import type { FormListeners } from './formListeners.public'
import type { ServerFormState } from './formServerState.public'
import type {
  FormOptionsOnSubmitFn,
  GetValidatorOutputs,
} from './formSubmit.public'
import type { FormOptionsValidators } from '../validation/formValidators.public'

type TryGetValidatorOutputs<TValidators> =
  TValidators extends ReadonlyArray<unknown>
    ? GetValidatorOutputs<TValidators>
    : []

export interface FormOptions<
  TFormData,
  TValidatorConfig extends unknown[],
  TValidators,
> {
  defaultValues: TFormData
  formId?: string
  errorVisibility?: ErrorVisibility<NoInfer<TFormData>>
  validators?: TValidators &
    FormOptionsValidators<NoInfer<TFormData>, TValidatorConfig>
  listeners?: FormListeners<
    NoInfer<TFormData>,
    NoInfer<GetFormErrorTypes<TValidators>>
  >
  serverState?: NoInfer<ServerFormState<TFormData, TValidators>> | null
  // TODO FormErrorTypes
  onSubmit?: FormOptionsOnSubmitFn<
    NoInfer<TFormData>,
    NoInfer<TryGetValidatorOutputs<TValidators>>,
    NoInfer<GetFormErrorTypes<TValidators>>
  >
}

export type FormOptionsFn = <
  TFormData,
  const TValidatorConfig extends unknown[],
  TValidators,
>(
  options: FormOptions<TFormData, TValidatorConfig, TValidators>,
) => FormOptions<TFormData, TValidatorConfig, TValidators>

export const formOptions: FormOptionsFn = (opts) => opts
