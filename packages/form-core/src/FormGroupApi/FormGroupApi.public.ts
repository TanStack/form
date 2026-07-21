import type { ReadonlyAtom } from '@tanstack/store'
import type { FormApi } from '../FormApi/FormApi.public'
import type {
  ConfigurableValidationTrigger,
  FormErrorTypes,
  FormGroupValidateResult,
  FormGroupValidatorMetas,
  FormGroupValidators,
  ToFormGroupValidatorMetas,
} from '../validation.public'

export interface FormGroupSubmitContext<
  in out TFormData,
  in out TGroupName,
  in out TGroupValue,
  in out TGroupValidatorMetas extends FormGroupValidatorMetas,
  in out TFormErrorTypes extends FormErrorTypes,
> {
  value: TGroupValue
  formApi: FormApi<TFormData, TFormErrorTypes>
  groupApi: FormGroupApi<
    TFormData,
    TGroupName,
    TGroupValue,
    TGroupValidatorMetas,
    TFormErrorTypes
  >
  schemaOutputs: FormGroupStandardSchemaValidatorOutputs<TGroupValidatorMetas>
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
      ToFormGroupValidatorMetas<TGroupValidators>,
      TFormErrorTypes
    >,
  ) => void | Promise<void>
  onSubmitInvalid?: (
    context: FormGroupSubmitContext<
      TFormData,
      TGroupName,
      TGroupValue,
      ToFormGroupValidatorMetas<TGroupValidators>,
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
  in out TGroupValidatorMetas extends FormGroupValidatorMetas,
  in out TFormErrorTypes extends FormErrorTypes,
> {
  form: FormApi<TFormData, TFormErrorTypes>
  name: TGroupName
  validators?: FormGroupValidators<TGroupValue>
  onSubmit?: (
    context: FormGroupSubmitContext<
      TFormData,
      TGroupName,
      TGroupValue,
      TGroupValidatorMetas,
      TFormErrorTypes
    >,
  ) => void | Promise<void>
  onSubmitInvalid?: (
    context: FormGroupSubmitContext<
      TFormData,
      TGroupName,
      TGroupValue,
      TGroupValidatorMetas,
      TFormErrorTypes
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
  in out TFormErrorTypes extends FormErrorTypes,
> {
  readonly form: FormApi<TFormData, TFormErrorTypes>
  readonly name: TGroupName
  readonly options: FormGroupApiOptions<
    TFormData,
    TGroupName,
    TGroupValue,
    TGroupValidatorMetas,
    TFormErrorTypes
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
