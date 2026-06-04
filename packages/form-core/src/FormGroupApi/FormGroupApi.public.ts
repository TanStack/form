import type { ReadonlyAtom } from '@tanstack/store'
import type { DeepKeys, DeepValue } from '../deep-keys.public'
import type { FormApi } from '../FormApi/FormApi.public'
import type {
  ConfigurableValidationTrigger,
  FormGroupValidateResult,
  FormGroupValidator,
  FormGroupValidators,
  FormValidators,
  ValidationIssue,
} from '../validation.public'
import type { TryInferSchemaOutput } from '../standardSchema.lib'

export interface FormGroupSubmitContext<
  TFormData,
  TGroupName extends DeepKeys<TFormData>,
  TGroupValue extends DeepValue<TFormData, TGroupName>,
  TGroupValidators extends FormGroupValidators<TGroupValue>,
  TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
> {
  value: TGroupValue
  formApi: FormApi<TFormData, TFormValidators, TSubmitReturn>
  groupApi: FormGroupApi<
    TFormData,
    TGroupName,
    TGroupValue,
    TGroupValidators,
    TFormValidators,
    TSubmitReturn
  >
  schemaOutputs: FormGroupStandardSchemaValidatorOutputs<TGroupValidators>
}

export interface FormGroupOptions<
  TFormData,
  TGroupName extends DeepKeys<TFormData>,
  TGroupValue extends DeepValue<TFormData, TGroupName>,
  TGroupValidators extends FormGroupValidators<TGroupValue>,
  TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
> {
  form: FormApi<TFormData, TFormValidators, TSubmitReturn>
  name: TGroupName
  validators?: TGroupValidators
  onSubmit?: (
    context: FormGroupSubmitContext<
      TFormData,
      TGroupName,
      TGroupValue,
      TGroupValidators,
      TFormValidators,
      TSubmitReturn
    >,
  ) => void | Promise<void>
  onSubmitInvalid?: (
    context: FormGroupSubmitContext<
      TFormData,
      TGroupName,
      TGroupValue,
      TGroupValidators,
      TFormValidators,
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
  isValid: boolean
  isInvalid: boolean
  canSubmit: boolean
  isSubmitting: boolean
  isSubmitSuccessful: boolean
  isValidating: boolean
  submissionAttempts: number
}

export type FormGroupStandardSchemaValidatorOutputs<
  TGroupValidators extends ReadonlyArray<FormGroupValidator<any>>,
> = TGroupValidators extends readonly [infer TFirst, ...infer TRest]
  ? TFirst extends FormGroupValidator<any>
    ? TRest extends ReadonlyArray<FormGroupValidator<any>>
      ? [
          TryInferSchemaOutput<TFirst>,
          ...FormGroupStandardSchemaValidatorOutputs<TRest>,
        ]
      : []
    : []
  : []

export interface FormGroupApi<
  TFormData,
  TGroupName extends DeepKeys<TFormData>,
  TGroupValue extends DeepValue<TFormData, TGroupName>,
  TGroupValidators extends FormGroupValidators<TGroupValue>,
  TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
> {
  readonly form: FormApi<TFormData, TFormValidators, TSubmitReturn>
  readonly name: TGroupName
  readonly options: FormGroupOptions<
    TFormData,
    TGroupName,
    TGroupValue,
    TGroupValidators,
    TFormValidators,
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
