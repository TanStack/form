import type { ReadonlyAtom } from '@tanstack/store'
import type { FormApi } from '../FormApi/FormApi.public'
import type {
  ConfigurableValidationTrigger,
  FormErrorTypes,
  FormErrors,
  FormGroupValidateResult,
  FormGroupValidators,
  ToFormGroupErrorTypes,
  ToFormGroupSchemaOutputs,
} from '../validation.public'

export interface FormGroupSubmitContext<
  in out TFormData,
  in out TGroupName,
  in out TGroupValue,
  out TSchemaOutputs,
  in out TGroupErrorTypes extends FormErrorTypes,
  in out TFormErrorTypes extends FormErrorTypes,
> {
  value: TGroupValue
  formApi: FormApi<TFormData, TFormErrorTypes>
  groupApi: FormGroupApi<
    TFormData,
    TGroupName,
    TGroupValue,
    TGroupErrorTypes,
    TFormErrorTypes
  >
  schemaOutputs: TSchemaOutputs
}

export interface FormGroupOptions<
  in out TFormData,
  in out TGroupName,
  in out TGroupValue,
  in out TGroupValidators extends FormGroupValidators<TGroupValue>,
  in out TFormErrorTypes extends FormErrorTypes,
> {
  form: FormApi<TFormData, TFormErrorTypes>
  name: TGroupName
  validators?: TGroupValidators
  onSubmit?: (
    context: FormGroupSubmitContext<
      TFormData,
      TGroupName,
      TGroupValue,
      ToFormGroupSchemaOutputs<TGroupValidators>,
      ToFormGroupErrorTypes<TGroupValidators>,
      TFormErrorTypes
    >,
  ) => void | Promise<void>
  onSubmitInvalid?: (
    context: FormGroupSubmitContext<
      TFormData,
      TGroupName,
      TGroupValue,
      ToFormGroupSchemaOutputs<TGroupValidators>,
      ToFormGroupErrorTypes<TGroupValidators>,
      TFormErrorTypes
    > & {
      errors: Array<FormGroupValidateResult<TGroupValue>>
    },
  ) => void | Promise<void>
}

export interface FormGroupApiOptions<
  in out TFormData,
  in out TGroupName,
  in out TGroupValue,
  in out TFormErrorTypes extends FormErrorTypes,
> {
  form: FormApi<TFormData, TFormErrorTypes>
  name: TGroupName
  validators?: FormGroupValidators<TGroupValue>
}

export interface FormGroupState<
  in out TGroupValue,
  in out TGroupErrorTypes extends FormErrorTypes,
> {
  values: TGroupValue
  meta: unknown
  errors: FormErrors<TGroupErrorTypes>
  isTouched: boolean
  isDirty: boolean
  isPristine: boolean
  isValid: boolean
  isInvalid: boolean
  canSubmit: boolean
  isSubmitting: boolean
  isSubmitSuccessful: boolean
  isValidating: boolean
  submissionAttempts: number
}

export interface FormGroupApi<
  in out TFormData,
  in out TGroupName,
  in out TGroupValue,
  in out TGroupErrorTypes extends FormErrorTypes,
  in out TFormErrorTypes extends FormErrorTypes,
> {
  readonly form: FormApi<TFormData, TFormErrorTypes>
  readonly name: TGroupName
  readonly options: FormGroupApiOptions<
    TFormData,
    TGroupName,
    TGroupValue,
    TFormErrorTypes
  >

  atom: ReadonlyAtom<FormGroupState<TGroupValue, TGroupErrorTypes>>
  readonly state: FormGroupState<TGroupValue, TGroupErrorTypes>
  readonly value: TGroupValue
  validate: (
    signal?: ConfigurableValidationTrigger | 'submit',
  ) => Promise<Array<FormGroupValidateResult<TGroupValue>>>
  handleSubmit: () => Promise<Array<FormGroupValidateResult<TGroupValue>>>
  reset: () => void
}
