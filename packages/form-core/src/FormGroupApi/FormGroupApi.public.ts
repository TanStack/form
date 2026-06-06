import type { ReadonlyAtom } from '@tanstack/store'
import type { DeepKeys, DeepValue } from '../deep-keys.public'
import type { FormApi } from '../FormApi/FormApi.public'
import type {
  ConfigurableValidationTrigger,
  FormGroupValidateResult,
  FormGroupValidatorMetas,
  FormGroupValidators,
  FormValidatorMetas,
  ToFormGroupValidatorMetas,
  ValidationIssue,
} from '../validation.public'

export interface FormGroupSubmitContext<
  TFormData,
  TGroupName extends DeepKeys<TFormData>,
  TGroupValue extends DeepValue<TFormData, TGroupName>,
  TGroupValidatorMetas extends FormGroupValidatorMetas,
  TFormValidatorMetas extends FormValidatorMetas,
  TSubmitReturn,
> {
  value: TGroupValue
  formApi: FormApi<TFormData, TFormValidatorMetas, TSubmitReturn>
  groupApi: FormGroupApi<
    TFormData,
    TGroupName,
    TGroupValue,
    TFormValidatorMetas,
    TSubmitReturn
  >
  schemaOutputs: FormGroupStandardSchemaValidatorOutputs<TGroupValidatorMetas>
}

export interface FormGroupOptions<
  TFormData,
  TGroupName extends DeepKeys<TFormData>,
  TGroupValue extends DeepValue<TFormData, TGroupName>,
  TGroupValidators extends FormGroupValidators<TGroupValue>,
  TFormValidatorMetas extends FormValidatorMetas,
  TSubmitReturn,
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

export interface FormGroupState<
  TFormData,
  TGroupName extends DeepKeys<TFormData>,
  TGroupValue extends DeepValue<TFormData, TGroupName>,
> {
  values: TGroupValue
  meta: unknown
  errors: Array<ValidationIssue>
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
  TGroupValidatorMetas extends FormGroupValidatorMetas,
> = {
  [K in keyof TGroupValidatorMetas]: TGroupValidatorMetas[K]['schemaSubmitOutput']
}

export type FormGroupStandardSchemaValidatorOutputs<
  TGroupValidatorMetas extends FormGroupValidatorMetas,
> = unknown extends TGroupValidatorMetas
  ? Array<unknown>
  : MappedFormGroupsSchemaOutputs<TGroupValidatorMetas>

export interface FormGroupApi<
  TFormData,
  TGroupName extends DeepKeys<TFormData>,
  TGroupValue extends DeepValue<TFormData, TGroupName>,
  TFormValidatorMetas extends FormValidatorMetas,
  TSubmitReturn,
> {
  readonly form: FormApi<TFormData, TFormValidatorMetas, TSubmitReturn>
  readonly name: TGroupName
  readonly options: FormGroupOptions<
    TFormData,
    TGroupName,
    TGroupValue,
    FormGroupValidators<TGroupValue>,
    TFormValidatorMetas,
    TSubmitReturn
  >

  store: ReadonlyAtom<FormGroupState<TFormData, TGroupName, TGroupValue>>
  readonly state: FormGroupState<TFormData, TGroupName, TGroupValue>
  readonly value: TGroupValue
  validate: (
    signal?: ConfigurableValidationTrigger | 'submit',
  ) => Promise<Array<FormGroupValidateResult<TGroupValue>>>
  handleSubmit: () => Promise<Array<FormGroupValidateResult<TGroupValue>>>
  reset: () => void
}
