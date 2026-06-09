import type { DeepKeys, DeepValue } from './deep-keys.public'
import type { FormApi, OnSubmitError } from './FormApi/FormApi.public'
import type { AnyFieldApi, FieldApi } from './FieldApi/FieldApi.public'
import type { FormGroupApi } from './FormGroupApi/FormGroupApi.public'
import type {
  StandardSchemaV1,
  StandardSchemaV1Issue,
} from './standardSchema.public'
import type { OneOrMany } from './types.public'

export interface Validator<
  TFormData,
  TValidator extends StandardSchemaV1 | ValidatorFn<any, any>,
  TContextValue,
> {
  run: TValidator
  /**
   * If `true`, this validator and all subsequent validators will be skipped if any previous validator has failed.
   * If `false`, validators run regardless of earlier validation results.
   *
   * @default false
   */
  bailIfInvalid?: boolean
  /**
   * TODO docs
   *
   * Whether this validator should be called during a submission attempt.
   *
   * @default true
   */
  runOnSubmit?: boolean | ValidationPredicateFn<TFormData, TContextValue>
  /**
   * Whether this validator should be called once when the form is constructed.
   *
   * @default false
   */
  runOnMount?: boolean
  /**
   * The debounce time in milliseconds for validation triggers (change, blur).
   * Does not affect submit events, which always execute immediately.
   *
   * @default 0
   */
  triggerDebounceMs?: number | ValidationDebounceFn<TFormData, TContextValue>
  triggers: Array<ValidationTriggerOption<TFormData, TContextValue>>
}

export type ValidatorOptions<TFormData, TContextValue> = Omit<
  Validator<
    TFormData,
    StandardSchemaV1<any, any> | ValidatorFn<any, any>,
    TContextValue
  >,
  'run'
>

type ValidatorRun = StandardSchemaV1<any, any> | ValidatorFn<any, any>

type ValidatorWithRun<
  TFormData,
  TContextValue,
  TOptions extends ValidatorOptions<TFormData, TContextValue>,
  TRun extends ValidatorRun,
> = TOptions & Pick<Validator<TFormData, TRun, TContextValue>, 'run'>

type InferFormDataFromValidator<TValidator extends ValidatorRun> =
  TValidator extends StandardSchemaV1<infer TFormData, any>
    ? TFormData
    : TValidator extends FormValidatorFn<infer TFormData>
      ? TFormData
      : TValidator extends FormGroupValidatorFn<infer TGroupValue>
        ? TGroupValue
        : any

type ValidatorRunsFromOptions<
  TOptions extends readonly [
    ValidatorOptions<any, any>,
    ...Array<ValidatorOptions<any, any>>,
  ],
> = {
  readonly [TIndex in keyof TOptions]: ValidatorRun
}

type ValidatorsFromOptionsAndRuns<
  TFormData,
  TContextValue,
  TOptions extends readonly [
    ValidatorOptions<TFormData, TContextValue>,
    ...Array<ValidatorOptions<TFormData, TContextValue>>,
  ],
  TRuns extends ValidatorRunsFromOptions<TOptions>,
> = {
  readonly [TIndex in keyof TOptions]: ValidatorWithRun<
    TFormData,
    TContextValue,
    TOptions[TIndex],
    TRuns[TIndex]
  >
}

export function createValidator<
  const TOptions extends ValidatorOptions<any, any>,
>(
  options: TOptions,
): <const TValidator extends ValidatorRun>(
  run: TValidator,
) => ValidatorWithRun<
  InferFormDataFromValidator<TValidator>,
  InferFormDataFromValidator<TValidator>,
  TOptions,
  TValidator
> {
  return (run: ValidatorRun) => ({ ...options, run }) as never
}

export function createValidators<
  TFormData = any,
  TContextValue = TFormData,
  const TOptions extends readonly [
    ValidatorOptions<TFormData, TContextValue>,
    ...Array<ValidatorOptions<TFormData, TContextValue>>,
  ] = readonly [
    ValidatorOptions<TFormData, TContextValue>,
    ...Array<ValidatorOptions<TFormData, TContextValue>>,
  ],
>(
  options: TOptions,
): <const TRuns extends ValidatorRunsFromOptions<TOptions>>(
  ...runs: TRuns
) => ValidatorsFromOptionsAndRuns<TFormData, TContextValue, TOptions, TRuns> {
  return (...runs) =>
    runs.map((run, index) => ({
      ...options[index],
      run,
    })) as ValidatorsFromOptionsAndRuns<
      TFormData,
      TContextValue,
      TOptions,
      typeof runs
    >
}

export type ValidationTrigger = 'change' | 'blur' | 'submit'
export type ConfigurableValidationTrigger = Exclude<ValidationTrigger, 'submit'>

export interface ErrorVisibilitySubfieldsMeta {
  isEveryPristine: boolean
  isSomeDirty: boolean
  isSomeTouched: boolean
  isSomeValidating: boolean
}

export interface ErrorVisibilityFieldMeta {
  isTouched: boolean
  isSelfTouched: boolean
  isDirty: boolean
  isSelfDirty: boolean
  isPristine: boolean
  isBlurred: boolean
  isValidating: boolean
  isSelfValidating: boolean
  subfields: ErrorVisibilitySubfieldsMeta
}

export interface ErrorVisibilityFieldState {
  value: any
  meta: ErrorVisibilityFieldMeta
}

export interface ErrorVisibilityContext<
  TFormData,
  TFormValidatorMetas extends ValidatorMetas,
  TSubmitReturn,
> {
  state: FormApi<TFormData, TFormValidatorMetas, TSubmitReturn>['state']
  fieldState: ErrorVisibilityFieldState
}

/**
 * Decides whether a field exposes its validation errors publicly.
 *
 * For fields inside a registered form group, scalar meta properties read from
 * `state` are scoped to the nearest group. `values` and `errors` remain
 * form-wide.
 */
export type ErrorVisibility<
  TFormData,
  TFormValidatorMetas extends ValidatorMetas,
  TSubmitReturn,
> = (
  context: ErrorVisibilityContext<
    TFormData,
    TFormValidatorMetas,
    TSubmitReturn
  >,
) => boolean

/**
 * The scoped state view available while declaring a reusable visibility policy.
 *
 * `values` remains unknown because a reusable policy is not associated with a
 * particular form shape until it is assigned to a form or field option.
 */
export type ReusableErrorVisibilityState = Omit<
  FormApi<any, any, any>['state'],
  'values'
> & {
  values: unknown
}

export interface ReusableErrorVisibilityContext {
  state: ReusableErrorVisibilityState
  fieldState: ErrorVisibilityFieldState
}

export type ReusableErrorVisibility = <
  TFormData,
  TFormValidatorMetas extends ValidatorMetas,
  TSubmitReturn,
>(
  context: ErrorVisibilityContext<
    TFormData,
    TFormValidatorMetas,
    TSubmitReturn
  >,
) => boolean

/**
 * Creates a reusable, form-agnostic error visibility policy.
 *
 * Use an inline `errorVisibility` callback instead when the policy needs
 * strongly typed access to the consuming form's `values`.
 */
export function createErrorVisibility(
  visibility: (context: ReusableErrorVisibilityContext) => boolean,
): ReusableErrorVisibility {
  return visibility as ReusableErrorVisibility
}

export interface ValidationPredicateContext<TFormData, TValue> {
  formApi: FormApi<TFormData, any, any>
  triggerFieldApi?: AnyFieldApi
  value: TValue
}

export type ValidationPredicateFn<TFormData, TValue> = (
  context: ValidationPredicateContext<TFormData, TValue>,
) => boolean

export type ValidationDebounceFn<TFormData, TValue> = (
  context: ValidationPredicateContext<TFormData, TValue>,
) => number

export interface ValidationTriggerConfig<TFormData, TValue> {
  trigger: ConfigurableValidationTrigger
  when?: boolean | ValidationPredicateFn<TFormData, TValue>
}

export type ValidationTriggerOption<TFormData, TValue> =
  | ConfigurableValidationTrigger
  | ValidationTriggerConfig<TFormData, TValue>

/**
 * A single validation error with a unique identifier.
 */
export interface ValidationIssue {
  message: string
}
export type ValidationErrorValue = ValidationIssue | string
export type ValidationError = OneOrMany<ValidationIssue>
export type ValidationErrorInput = OneOrMany<ValidationErrorValue>

export interface ValidationAggregateError<TFormData> {
  form?: ValidationErrorInput
  fields: Partial<Record<DeepKeys<TFormData>, ValidationErrorInput>>
}

interface BaseValidatorContext<TFormData> {
  event: ValidationTrigger
  signal: AbortSignal
  formApi: FormApi<TFormData, any, any>
}

export interface FormValidatorContext<
  TFormData,
> extends BaseValidatorContext<TFormData> {
  triggerFieldApi?: AnyFieldApi
  value: TFormData
}

export type ValidValidationResult = null | undefined | false

/**
 * Result of validation - can be null/undefined (valid), a single error, or multiple errors.
 */
export type ValidationResult = ValidValidationResult | ValidationErrorInput

export type FormValidationError<TFormData> =
  | ValidationErrorInput
  | ValidationAggregateError<TFormData>
export type FormValidateResult<TFormData> =
  | ValidationResult
  | ValidationAggregateError<TFormData>

export type ValidatorFn<TParameter, TReturn> = (
  ...args: Array<TParameter>
) => TReturn | Promise<TReturn>

export type FormValidatorFn<TFormData> = ValidatorFn<
  FormValidatorContext<TFormData>,
  FormValidateResult<TFormData>
>

export interface FormValidator<TFormData> extends Validator<
  TFormData,
  FormValidatorFn<TFormData> | StandardSchemaV1<TFormData, any>,
  TFormData
> {}

export type FormValidators<TFormData> = ReadonlyArray<FormValidator<TFormData>>

export interface FormGroupValidatorContext<TGroupValue> {
  event: ValidationTrigger
  signal: AbortSignal
  formApi: FormApi<any, any, any>
  groupApi: FormGroupApi<any, any, TGroupValue, any, any, any>
  triggerFieldApi?: AnyFieldApi
  value: TGroupValue
}

export type FormGroupValidationError<TGroupValue> =
  | ValidationErrorInput
  | ValidationAggregateError<TGroupValue>
export type FormGroupValidateResult<TGroupValue> =
  | ValidationResult
  | ValidationAggregateError<TGroupValue>

export type FormGroupValidatorFn<TGroupValue> = ValidatorFn<
  FormGroupValidatorContext<TGroupValue>,
  FormGroupValidateResult<TGroupValue>
>

export interface FormGroupValidator<TGroupValue> extends Validator<
  TGroupValue,
  FormGroupValidatorFn<TGroupValue> | StandardSchemaV1<TGroupValue, any>,
  TGroupValue
> {}

export type FormGroupValidators<TGroupValue> = ReadonlyArray<
  FormGroupValidator<TGroupValue>
>

type MappedSchemaOutputs<TFormValidatorMetas extends FormValidatorMetas> = {
  [K in keyof TFormValidatorMetas]: TFormValidatorMetas[K]['schemaSubmitOutput']
}

export type FormStandardSchemaValidatorOutputs<
  TFormValidatorMetas extends FormValidatorMetas,
> = unknown extends TFormValidatorMetas
  ? Array<unknown>
  : MappedSchemaOutputs<TFormValidatorMetas>

export interface FieldValidatorContext<
  TFieldData,
  TFieldName extends DeepKeys<TFieldData>,
  TFieldValue extends DeepValue<TFieldData, TFieldName>,
  TFormData,
> {
  event: ValidationTrigger
  signal: AbortSignal
  formApi: FormApi<TFormData, any, any>
  fieldApi: FieldApi<
    TFieldData,
    TFieldName,
    TFieldValue,
    any,
    any,
    TFormData,
    any,
    any
  >
  value: TFieldValue
}

export type FieldValidateResult = ValidationResult

export type FieldValidatorFn<
  TFormData,
  TFieldName extends DeepKeys<TFormData>,
  TFieldValue extends DeepValue<TFormData, TFieldName>,
> = ValidatorFn<
  FieldValidatorContext<TFormData, TFieldName, TFieldValue, TFormData>,
  FieldValidateResult
>

export interface FieldValidator<
  TFormData,
  TFieldName extends DeepKeys<TFormData>,
  TFieldValue extends DeepValue<TFormData, TFieldName>,
> extends Validator<
  TFormData,
  | FieldValidatorFn<TFormData, TFieldName, TFieldValue>
  | StandardSchemaV1<TFieldValue, any>,
  TFieldValue
> {
  watchFields?: Array<string>
}

export type FieldValidators<
  TFormData,
  TFieldName extends DeepKeys<TFormData>,
  TFieldValue extends DeepValue<TFormData, TFieldName>,
> = ReadonlyArray<FieldValidator<TFormData, TFieldName, TFieldValue>>

type NormalizeValidationResult<TResult> = NormalizeValidationError<
  Exclude<TResult, ValidValidationResult>
>

type NormalizeValidationError<TError> =
  TError extends ReadonlyArray<infer TItem>
    ? NormalizeValidationError<TItem>
    : TError extends string
      ? ValidationIssue
      : TError extends ValidationIssue
        ? TError
        : ValidationIssue

type ValidationErrorTarget = 'form' | 'field'

type ExtractAggregateError<TResult, TTarget extends ValidationErrorTarget> =
  TResult extends ValidationAggregateError<any>
    ? TTarget extends 'form'
      ? TResult extends { form?: infer TError }
        ? NormalizeValidationResult<TError>
        : never
      : TResult extends { fields: infer TFields }
        ? NormalizeValidationResult<TFields[keyof TFields]>
        : never
    : NormalizeValidationResult<TResult>

type ExtractSubmitFormError<TSubmitReturn> = unknown extends TSubmitReturn
  ? ValidationIssue
  : TSubmitReturn extends OnSubmitError<infer TResult>
    ? ExtractAggregateError<Awaited<TResult>, 'form'>
    : never

type ExtractSubmitFieldError<TSubmitReturn> = unknown extends TSubmitReturn
  ? ValidationIssue
  : TSubmitReturn extends OnSubmitError<infer TResult>
    ? ExtractAggregateError<Awaited<TResult>, 'field'>
    : never

type IfBroad<
  TBase,
  TValue extends TBase,
  TBroad,
  TNarrow,
> = TBase extends TValue ? TBroad : TNarrow

export type FormErrors<
  TFormValidatorMetas extends FormValidatorMetas,
  TSubmitReturn,
> = Array<
  | IfBroad<
      FormValidatorMetas,
      TFormValidatorMetas,
      ValidationIssue,
      TFormValidatorMetas[number]['formError']
    >
  | ExtractSubmitFormError<TSubmitReturn>
>

export type FieldErrors<
  TFieldValidatorMetas extends FieldValidatorMetas,
  TGroupValidatorMetas extends FormGroupValidatorMetas,
  TFormValidatorMetas extends FormValidatorMetas,
  TSubmitReturn,
> = Array<
  | IfBroad<
      FieldValidatorMetas,
      TFieldValidatorMetas,
      ValidationIssue,
      TFieldValidatorMetas[number]['fieldError']
    >
  | IfBroad<
      FormGroupValidatorMetas,
      TGroupValidatorMetas,
      ValidationIssue,
      TGroupValidatorMetas[number]['fieldError']
    >
  | IfBroad<
      FormValidatorMetas,
      TFormValidatorMetas,
      ValidationIssue,
      TFormValidatorMetas[number]['fieldError']
    >
  | ExtractSubmitFieldError<TSubmitReturn>
>

export interface FormValidatorMeta<
  TSchemaSubmitOutput = unknown,
  TFormError = unknown,
  TFieldError = unknown,
> {
  readonly schemaSubmitOutput: TSchemaSubmitOutput
  readonly formError: TFormError
  readonly fieldError: TFieldError
}

export type FormValidatorMetas = ReadonlyArray<FormValidatorMeta>

export interface FieldValidatorMeta<TFieldError = unknown> {
  readonly fieldError: TFieldError
}

export type FieldValidatorMetas = ReadonlyArray<FieldValidatorMeta>

export interface FormGroupValidatorMeta<
  TSchemaSubmitOutput = unknown,
  TGroupError = unknown,
  TFieldError = unknown,
> {
  readonly schemaSubmitOutput: TSchemaSubmitOutput
  readonly groupError: TGroupError
  readonly fieldError: TFieldError
}

export type FormGroupValidatorMetas = ReadonlyArray<FormGroupValidatorMeta>

export type ValidatorMeta<
  TSchemaSubmitOutput = unknown,
  TFormError = unknown,
  TFieldError = unknown,
> = FormValidatorMeta<TSchemaSubmitOutput, TFormError, TFieldError>

export type ValidatorMetas = FormValidatorMetas

type TryGetSchemaOutput<TValidator> = TValidator extends {
  readonly run: StandardSchemaV1<any, infer TOutput>
}
  ? TOutput
  : undefined

type TryGetFormError<TValidator> = TValidator extends {
  readonly run: StandardSchemaV1<any, any>
}
  ? StandardSchemaV1Issue
  : TValidator extends { readonly run: (...args: any) => infer TReturn }
    ? ExtractAggregateError<Awaited<TReturn>, 'form'>
    : never

type TryGetFieldError<TValidator> = TValidator extends {
  readonly run: StandardSchemaV1<any, any>
}
  ? StandardSchemaV1Issue
  : TValidator extends { readonly run: (...args: any) => infer TReturn }
    ? ExtractAggregateError<Awaited<TReturn>, 'field'>
    : never

export type ParsedFormValidator<TFormValidator extends FormValidator<any>> =
  TFormValidator extends {
    readonly run: any
  }
    ? TFormValidator extends { readonly runOnSubmit: false }
      ? FormValidatorMeta<
          undefined,
          TryGetFormError<TFormValidator>,
          TryGetFieldError<TFormValidator>
        >
      : FormValidatorMeta<
          TryGetSchemaOutput<TFormValidator>,
          TryGetFormError<TFormValidator>,
          TryGetFieldError<TFormValidator>
        >
    : never

export type ParsedFieldValidator<
  TFieldValidator extends FieldValidator<any, any, any>,
> = TFieldValidator extends {
  readonly run: any
}
  ? FieldValidatorMeta<TryGetFieldError<TFieldValidator>>
  : never

export type ParsedFormGroupValidator<
  TGroupValidator extends FormGroupValidator<any>,
> = TGroupValidator extends {
  readonly run: any
}
  ? TGroupValidator extends { readonly runOnSubmit: false }
    ? FormGroupValidatorMeta<
        undefined,
        TryGetFormError<TGroupValidator>,
        TryGetFieldError<TGroupValidator>
      >
    : FormGroupValidatorMeta<
        TryGetSchemaOutput<TGroupValidator>,
        TryGetFormError<TGroupValidator>,
        TryGetFieldError<TGroupValidator>
      >
  : never

type MappedFormValidatorMetas<TFormValidators extends FormValidators<any>> = {
  [K in keyof TFormValidators]: ParsedFormValidator<TFormValidators[K]>
}

export type ToFormValidatorMetas<TFormValidators extends FormValidators<any>> =
  unknown extends TFormValidators
    ? FormValidatorMetas
    : MappedFormValidatorMetas<TFormValidators>

type MappedFieldValidatorMetas<
  TFieldValidators extends FieldValidators<any, any, any>,
> = {
  [K in keyof TFieldValidators]: ParsedFieldValidator<TFieldValidators[K]>
}

export type ToFieldValidatorMetas<
  TFieldValidators extends FieldValidators<any, any, any>,
> = unknown extends TFieldValidators
  ? FieldValidatorMetas
  : MappedFieldValidatorMetas<TFieldValidators>

type MappedFormGroupValidatorMetas<
  TGroupValidators extends FormGroupValidators<any>,
> = {
  [K in keyof TGroupValidators]: ParsedFormGroupValidator<TGroupValidators[K]>
}

export type ToFormGroupValidatorMetas<
  TGroupValidators extends FormGroupValidators<any>,
> = unknown extends TGroupValidators
  ? FormGroupValidatorMetas
  : MappedFormGroupValidatorMetas<TGroupValidators>

export type ToValidatorMetas<TFormValidators extends FormValidators<any>> =
  ToFormValidatorMetas<TFormValidators>

export type ToValidatorData<TFormValidators extends FormValidators<any>> =
  ToFormValidatorMetas<TFormValidators>
