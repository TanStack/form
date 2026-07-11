import type { ReadonlyAtom } from '@tanstack/store'
import type { FormApi } from '../FormApi/FormApi.public'
import type {
  ConfigurableValidationTrigger,
  FormGroupValidateResult,
  FormGroupValidatorMetas,
  FormGroupValidators,
  FormValidatorMetas,
  ToFormGroupValidatorMetas,
} from '../validation.public'

export interface FormGroupSubmitContext<
  in out TFormData,
  in out TGroupName,
  in out TGroupValue,
  in out TGroupValidatorMetas extends FormGroupValidatorMetas,
  in out TFormValidatorMetas extends FormValidatorMetas,
  in out TSubmitReturn,
> {
  value: TGroupValue
  formApi: FormApi<TFormData, TFormValidatorMetas, TSubmitReturn>
  groupApi: FormGroupApi<
    TFormData,
    TGroupName,
    TGroupValue,
    TGroupValidatorMetas,
    TFormValidatorMetas,
    TSubmitReturn
  >
  schemaOutputs: FormGroupStandardSchemaValidatorOutputs<TGroupValidatorMetas>
}

export interface FormGroupOptions<
  in out TFormData,
  in out TGroupName,
  in out TGroupValue,
  in out TGroupValidators extends FormGroupValidators<TGroupValue>,
  in out TFormValidatorMetas extends FormValidatorMetas,
  in out TSubmitReturn,
> {
  form: FormApi<TFormData, TFormValidatorMetas, TSubmitReturn>
  name: TGroupName
  validators?: TGroupValidators
  onSubmit?: (
    context: FormGroupSubmitContext<
      TFormData,
      TGroupName,
      TGroupValue,
      ToFormGroupValidatorMetas<TGroupValidators>,
      TFormValidatorMetas,
      TSubmitReturn
    >,
  ) => void | Promise<void>
  onSubmitInvalid?: (
    context: FormGroupSubmitContext<
      TFormData,
      TGroupName,
      TGroupValue,
      ToFormGroupValidatorMetas<TGroupValidators>,
      TFormValidatorMetas,
      TSubmitReturn
    > & {
      errors: Array<FormGroupValidateResult<TGroupValue>>
    },
  ) => void | Promise<void>
}

export interface FormGroupApiOptions<
  in out TFormData,
  in out TGroupName,
  in out TGroupValue,
  in out TGroupValidatorMetas extends FormGroupValidatorMetas,
  in out TFormValidatorMetas extends FormValidatorMetas,
  in out TSubmitReturn,
> {
  form: FormApi<TFormData, TFormValidatorMetas, TSubmitReturn>
  name: TGroupName
  validators?: FormGroupValidators<TGroupValue>
  onSubmit?: (
    context: FormGroupSubmitContext<
      TFormData,
      TGroupName,
      TGroupValue,
      TGroupValidatorMetas,
      TFormValidatorMetas,
      TSubmitReturn
    >,
  ) => void | Promise<void>
  onSubmitInvalid?: (
    context: FormGroupSubmitContext<
      TFormData,
      TGroupName,
      TGroupValue,
      TGroupValidatorMetas,
      TFormValidatorMetas,
      TSubmitReturn
    > & {
      errors: Array<FormGroupValidateResult<TGroupValue>>
    },
  ) => void | Promise<void>
}

export interface FormGroupState<
  in out TGroupValue,
  in out TGroupValidationMetas extends FormGroupValidatorMetas,
> {
  values: TGroupValue
  meta: unknown
  errors: Array<TGroupValidationMetas[number]['groupError']>
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

type MappedFormGroupsSchemaOutputs<
  in out TGroupValidatorMetas extends FormGroupValidatorMetas,
> = {
  [K in keyof TGroupValidatorMetas]: TGroupValidatorMetas[K]['schemaSubmitOutput']
}

export type FormGroupStandardSchemaValidatorOutputs<
  TGroupValidatorMetas extends FormGroupValidatorMetas,
> = unknown extends TGroupValidatorMetas
  ? Array<unknown>
  : MappedFormGroupsSchemaOutputs<TGroupValidatorMetas>

export interface FormGroupApi<
  in out TFormData,
  in out TGroupName,
  in out TGroupValue,
  in out TGroupValidatorMetas extends FormGroupValidatorMetas,
  in out TFormValidatorMetas extends FormValidatorMetas,
  in out TSubmitReturn,
> {
  readonly form: FormApi<TFormData, TFormValidatorMetas, TSubmitReturn>
  readonly name: TGroupName
  readonly options: FormGroupApiOptions<
    TFormData,
    TGroupName,
    TGroupValue,
    TGroupValidatorMetas,
    TFormValidatorMetas,
    TSubmitReturn
  >

  atom: ReadonlyAtom<FormGroupState<TGroupValue, TGroupValidatorMetas>>
  readonly state: FormGroupState<TGroupValue, TGroupValidatorMetas>
  readonly value: TGroupValue
  validate: (
    signal?: ConfigurableValidationTrigger | 'submit',
  ) => Promise<Array<FormGroupValidateResult<TGroupValue>>>
  handleSubmit: () => Promise<Array<FormGroupValidateResult<TGroupValue>>>
  reset: () => void
}
