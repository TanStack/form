import type { ReadonlyAtom } from '@tanstack/store'
import type { DeepKeys, DeepValue } from '../deep-keys.public'
import type { AnyFieldApi, FieldMeta } from '../FieldApi/FieldApi.public'
import type { FormApi } from '../FormApi/FormApi.public'
import type {
  FieldValidators,
  FormValidators,
  ValidationAggregateError,
  ValidationErrorInput,
  ValidationIssue,
  ValidationTrigger,
  Validator,
} from '../validation.public'
import type { StandardSchemaV1 } from '../standardSchema.public'

export interface FormGroupValidatorContext<
  TFormData,
  TGroupName extends DeepKeys<TFormData>,
  TGroupValue extends DeepValue<TFormData, TGroupName>,
> {
  event: ValidationTrigger
  signal: AbortSignal
  formApi: FormApi<TFormData, any, any>
  groupApi: FormGroupApi<TFormData, TGroupName, TGroupValue, any, any, any>
  triggerFieldApi?: AnyFieldApi
  value: TGroupValue
}

export type FormGroupValidateResult<TGroupValue> =
  | null
  | undefined
  | false
  | ValidationErrorInput
  | ValidationAggregateError<TGroupValue>

export type FormGroupValidatorFn<
  TFormData,
  TGroupName extends DeepKeys<TFormData>,
  TGroupValue extends DeepValue<TFormData, TGroupName>,
> = (
  context: FormGroupValidatorContext<TFormData, TGroupName, TGroupValue>,
) =>
  | FormGroupValidateResult<TGroupValue>
  | Promise<FormGroupValidateResult<TGroupValue>>

export interface FormGroupValidator<
  TFormData,
  TGroupName extends DeepKeys<TFormData>,
  TGroupValue extends DeepValue<TFormData, TGroupName>,
> extends Validator<
  TFormData,
  FormGroupValidatorFn<TFormData, TGroupName, TGroupValue> | StandardSchemaV1<TGroupValue, any>,
  TFormData
> {}

export type FormGroupValidators<
  TFormData,
  TGroupName extends DeepKeys<TFormData>,
  TGroupValue extends DeepValue<TFormData, TGroupName>,
> = ReadonlyArray<FormGroupValidator<TFormData, TGroupName, TGroupValue>>

/**
 * Group errors are intentionally exposed at the normalized safe base type.
 * Group errors represent errors attached to the group node itself. Errors
 * routed only to descendant fields still contribute to group meta validity.
 */
export type FormGroupErrors = Array<ValidationIssue>
export type FormGroupValidationError<TGroupValue> =
  | ValidationErrorInput
  | ValidationAggregateError<TGroupValue>

export interface FormGroupSubmitContext<
  TFormData,
  TGroupName extends DeepKeys<TFormData>,
  TGroupValue extends DeepValue<TFormData, TGroupName>,
  TGroupValidators extends FormGroupValidators<TFormData, TGroupName, TGroupValue>,
  TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
> {
  value: TGroupValue
  groupApi: FormGroupApi<
    TFormData,
    TGroupName,
    TGroupValue,
    TGroupValidators,
    TFormValidators,
    TSubmitReturn
  >
  formApi: FormApi<TFormData, TFormValidators, TSubmitReturn>
  schemaOutputs: Array<unknown>
}

export interface FormGroupSubmitInvalidContext<
  TFormData,
  TGroupName extends DeepKeys<TFormData>,
  TGroupValue extends DeepValue<TFormData, TGroupName>,
  TGroupValidators extends FormGroupValidators<TFormData, TGroupName, TGroupValue>,
  TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
> extends FormGroupSubmitContext<
    TFormData,
    TGroupName,
    TGroupValue,
    TGroupValidators,
    TFormValidators,
    TSubmitReturn
  > {
  errors: Array<FormGroupValidationError<TGroupValue>>
}

export interface FormGroupOptions<
  TFormData,
  TGroupName extends DeepKeys<TFormData>,
  TGroupValue extends DeepValue<TFormData, TGroupName>,
  TGroupValidators extends FormGroupValidators<TFormData, TGroupName, TGroupValue>,
  TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
> {
  name: TGroupName
  validators?: TGroupValidators
  onGroupSubmit?: (
    context: FormGroupSubmitContext<
      TFormData,
      TGroupName,
      TGroupValue,
      TGroupValidators,
      TFormValidators,
      TSubmitReturn
    >,
  ) => void | Promise<void>
  onGroupSubmitInvalid?: (
    context: FormGroupSubmitInvalidContext<
      TFormData,
      TGroupName,
      TGroupValue,
      TGroupValidators,
      TFormValidators,
      TSubmitReturn
    >,
  ) => void | Promise<void>
}

export type FormGroupMeta<
  TFormData,
  TGroupName extends DeepKeys<TFormData>,
  TGroupValue extends DeepValue<TFormData, TGroupName>,
  TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
> = FieldMeta<
  TFormValidators,
  FieldValidators<TFormData, TGroupName, TGroupValue>,
  TSubmitReturn
>

export interface FormGroupState<
  TFormData,
  TGroupName extends DeepKeys<TFormData>,
  TGroupValue extends DeepValue<TFormData, TGroupName>,
  TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
> {
  value: TGroupValue
  meta: FormGroupMeta<
    TFormData,
    TGroupName,
    TGroupValue,
    TFormValidators,
    TSubmitReturn
  >
  errors: FormGroupErrors
  canSubmit: boolean
  isSubmitting: boolean
  isSubmitSuccessful: boolean
  submissionAttempts: number
}

export interface FormGroupApi<
  TFormData,
  TGroupName extends DeepKeys<TFormData>,
  TGroupValue extends DeepValue<TFormData, TGroupName>,
  TGroupValidators extends FormGroupValidators<TFormData, TGroupName, TGroupValue>,
  TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
> {
  form: FormApi<TFormData, TFormValidators, TSubmitReturn>
  readonly options: FormGroupOptions<
    TFormData,
    TGroupName,
    TGroupValue,
    TGroupValidators,
    TFormValidators,
    TSubmitReturn
  >
  readonly name: TGroupName
  readonly value: TGroupValue
  readonly state: FormGroupState<
    TFormData,
    TGroupName,
    TGroupValue,
    TFormValidators,
    TSubmitReturn
  >
  readonly meta: FormGroupMeta<
    TFormData,
    TGroupName,
    TGroupValue,
    TFormValidators,
    TSubmitReturn
  >
  readonly errors: FormGroupErrors
  store: ReadonlyAtom<
    FormGroupState<
      TFormData,
      TGroupName,
      TGroupValue,
      TFormValidators,
      TSubmitReturn
    >
  >
  handleSubmit: () => Promise<Array<FormGroupValidationError<TGroupValue>>>
}
