import type { DeepKeys } from './deep-keys.public'
import type { FormApi, OnSubmitError } from './FormApi/FormApi.public'
import type { AnyFieldApi, FieldApi } from './FieldApi/FieldApi.public'
import type { FormGroupApi } from './FormGroupApi/FormGroupApi.public'
import type {
  StandardSchemaV1,
  StandardSchemaV1Issue,
} from './standardSchema.public'
import type { OneOrMany } from './types.public'

export interface BaseValidator<
  out TValidator extends StandardSchemaV1 | ValidatorFn<any, any>,
> {
  run: TValidator
  /**
   * If `true`, this validator and all subsequent validators will be skipped if any previous validator has failed.
   * If `false`, validators run regardless of earlier validation results.
   *
   * @default false
   */
  bailIfInvalid?: boolean
}

export interface Validator<
  in out TFormData,
  out TValidator extends StandardSchemaV1 | ValidatorFn<any, any>,
  in out TContextValue,
  in out TTrigger extends ValidatorTrigger = ValidatorTrigger,
  in out TScope extends ValidatorScope = ValidatorScope,
> extends BaseValidator<TValidator> {
  /**
   * TODO docs
   *
   * Whether this validator should be called during a submission attempt.
   *
   * @default true
   */
  runOnSubmit?:
    | boolean
    | ValidationPredicateFn<TFormData, TContextValue, TScope>
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
  triggerDebounceMs?:
    | number
    | ValidationDebounceFn<TFormData, TContextValue, TScope>
  triggers: Array<
    ValidationTriggerOption<TFormData, TContextValue, TTrigger, TScope>
  >
}

export type ValidatorOptions<
  TFormData,
  TContextValue,
  TTrigger extends ValidatorTrigger = ValidatorTrigger,
  TScope extends ValidatorScope = ValidatorScope,
> = Omit<
  Validator<
    TFormData,
    StandardSchemaV1<any, any> | ValidatorFn<any, any>,
    TContextValue,
    TTrigger,
    TScope
  >,
  'run' | 'triggers'
> & {
  triggers: Array<FormValidationTriggerOption<TFormData, TContextValue, TScope>>
}

type ValidatorRun = StandardSchemaV1<any, any> | ValidatorFn<any, any>

type ValidatorWithRun<
  TFormData,
  TContextValue,
  TOptions extends ValidatorOptions<TFormData, TContextValue, any>,
  TRun extends ValidatorRun,
> = TOptions & Pick<Validator<TFormData, TRun, TContextValue>, 'run'>

type InferFormDataFromValidator<TValidator extends ValidatorRun> =
  TValidator extends StandardSchemaV1<infer TFormData, any>
    ? TFormData
    : TValidator extends FormValidatorFn<infer TFormData>
      ? TFormData
      : TValidator extends ServerFormValidatorFn<infer TFormData>
        ? TFormData
        : TValidator extends FormGroupValidatorFn<infer TGroupValue>
          ? TGroupValue
          : any

type ValidatorRunsFromOptions<
  in out TOptions extends readonly [
    ValidatorOptions<any, any, any>,
    ...Array<ValidatorOptions<any, any, any>>,
  ],
> = {
  readonly [TIndex in keyof TOptions]: ValidatorRun
}

type ValidatorsFromOptionsAndRuns<
  in out TFormData,
  in out TContextValue,
  in out TOptions extends readonly [
    ValidatorOptions<TFormData, TContextValue, any>,
    ...Array<ValidatorOptions<TFormData, TContextValue, any>>,
  ],
  in out TRuns extends ValidatorRunsFromOptions<TOptions>,
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
export type ServerValidationTrigger = 'server'
export type ClientValidationTrigger = ValidationTrigger
export type ConfigurableValidationTrigger = Exclude<ValidationTrigger, 'submit'>
export type ValidatorTrigger = ConfigurableValidationTrigger
export type ValidatorScope = 'form' | 'group' | 'field'

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
  isDefaultValue: boolean
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
  in out TFormData,
  in out TFormErrorTypes extends FormErrorTypes,
> {
  state: FormApi<TFormData, TFormErrorTypes>['state']
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
  in out TFormData,
  in out TFormErrorTypes extends FormErrorTypes,
> = (context: ErrorVisibilityContext<TFormData, TFormErrorTypes>) => boolean

/**
 * The scoped state view available while declaring a reusable visibility policy.
 *
 * `values` remains unknown because a reusable policy is not associated with a
 * particular form shape until it is assigned to a form or field option.
 */
export type ReusableErrorVisibilityState = Omit<
  FormApi<any, any>['state'],
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
  TFormErrorTypes extends FormErrorTypes,
>(
  context: ErrorVisibilityContext<TFormData, TFormErrorTypes>,
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
  return visibility
}

interface BaseValidationPredicateContext<
  in out TFormData,
  out TValue,
  out TScope extends ValidatorScope,
> {
  scope: TScope
  formApi: FormApi<TFormData, any>
  /**
   * The field associated with this validation, if any.
   *
   * For form and group validators, this is the field that triggered the
   * validation. For field validators, this is the field being validated.
   */
  fieldApi?: AnyFieldApi
  value: TValue
}

export interface FormValidationPredicateContext<
  in out TFormData,
> extends BaseValidationPredicateContext<TFormData, TFormData, 'form'> {
  groupApi?: never
}

export interface FormGroupValidationPredicateContext<
  in out TGroupValue,
> extends BaseValidationPredicateContext<any, TGroupValue, 'group'> {
  groupApi: FormGroupApi<any, any, TGroupValue, any, any>
}

export interface FieldValidationPredicateContext<
  in out TFormData,
  out TFieldValue,
> extends BaseValidationPredicateContext<TFormData, TFieldValue, 'field'> {
  groupApi?: never
  /** The field being validated. */
  fieldApi: AnyFieldApi
}

export type ValidationPredicateContext<
  TFormData,
  TValue,
  TScope extends ValidatorScope = ValidatorScope,
> = TScope extends 'form'
  ? FormValidationPredicateContext<TFormData>
  : TScope extends 'group'
    ? FormGroupValidationPredicateContext<TValue>
    : TScope extends 'field'
      ? FieldValidationPredicateContext<TFormData, TValue>
      : never

export type ValidationPredicateFn<
  in out TFormData,
  in out TValue,
  in TScope extends ValidatorScope = ValidatorScope,
> = (context: ValidationPredicateContext<TFormData, TValue, TScope>) => boolean

export type ValidationDebounceFn<
  in out TFormData,
  in out TValue,
  in TScope extends ValidatorScope = ValidatorScope,
> = (context: ValidationPredicateContext<TFormData, TValue, TScope>) => number

export interface ValidationTriggerConfig<
  in out TFormData,
  in out TValue,
  in out TTrigger extends ValidatorTrigger = ValidatorTrigger,
  in TScope extends ValidatorScope = ValidatorScope,
> {
  trigger: TTrigger
  when?: boolean | ValidationPredicateFn<TFormData, TValue, TScope>
}

export type ValidationTriggerOption<
  TFormData,
  TValue,
  TTrigger extends ValidatorTrigger = ValidatorTrigger,
  TScope extends ValidatorScope = ValidatorScope,
> = TTrigger | ValidationTriggerConfig<TFormData, TValue, TTrigger, TScope>

export type ClientValidationTriggerOption<
  TFormData,
  TValue,
  TScope extends ValidatorScope = ValidatorScope,
> = ValidationTriggerOption<
  TFormData,
  TValue,
  ConfigurableValidationTrigger,
  TScope
>

export type FormValidationTriggerOption<
  TFormData,
  TValue,
  TScope extends ValidatorScope = ValidatorScope,
> =
  | ClientValidationTriggerOption<TFormData, TValue, TScope>
  | ServerValidationTrigger

/**
 * A single validation error with a unique identifier.
 */
export interface ValidationIssue {
  message: string
}
export type ValidationErrorValue = ValidationIssue | string
export type ValidationError = OneOrMany<ValidationIssue>
export type ValidationErrorInput = OneOrMany<ValidationErrorValue>

export interface ValidationErrorMap<in out TFormData> {
  form?: ValidationErrorInput
  fields: Partial<Record<DeepKeys<TFormData>, ValidationErrorInput>>
}

/**
 * Creates a mutable validation error map.
 *
 * If an initial error map is provided, the same object is returned.
 */
export function createErrorMap<TFormData>(
  initial?: Partial<ValidationErrorMap<TFormData>>,
): ValidationErrorMap<TFormData> {
  if (!initial) return { fields: {} }

  initial.fields ??= {}
  return initial as ValidationErrorMap<TFormData>
}

export type CreateErrorMapFn<in out TFormData> =
  typeof createErrorMap<TFormData>

export interface ParsedStandardSchemaIssues<in out TFormData> {
  form: Array<StandardSchemaV1Issue>
  fields: Partial<Record<DeepKeys<TFormData>, Array<StandardSchemaV1Issue>>>
}

export type ParseFieldIssuesFn = (
  issues: ReadonlyArray<StandardSchemaV1Issue>,
) => Array<StandardSchemaV1Issue>

export type ParseFormIssuesFn<TFormData> = (
  issues: ReadonlyArray<StandardSchemaV1Issue>,
) => ParsedStandardSchemaIssues<TFormData>

export interface FormValidatorContext<in out TFormData> {
  event: ValidationTrigger | ServerValidationTrigger
  signal: AbortSignal
  formApi: FormApi<TFormData, any> | undefined
  triggerFieldApi?: AnyFieldApi
  value: TFormData
  parseIssues: ParseFormIssuesFn<TFormData>
  createErrorMap: CreateErrorMapFn<TFormData>
}

export interface ServerFormValidatorContext<in out TFormData> {
  event: ValidationTrigger | ServerValidationTrigger
  signal: AbortSignal
  formApi: FormApi<TFormData, any> | undefined
  triggerFieldApi?: AnyFieldApi
  value: TFormData
  parseIssues: ParseFormIssuesFn<TFormData>
  createErrorMap: CreateErrorMapFn<TFormData>
}

export type ValidValidationResult = null | undefined | false

/**
 * Result of validation - can be null/undefined (valid), a single error, or multiple errors.
 */
export type ValidationResult = ValidValidationResult | ValidationErrorInput

export type FormValidationError<TFormData> =
  | ValidationErrorInput
  | ValidationErrorMap<TFormData>
export type FormValidateResult<TFormData> =
  | ValidationResult
  | ValidationErrorMap<TFormData>

export type ValidatorFn<in TParameter, out TReturn> = (
  ...args: Array<TParameter>
) => TReturn | Promise<TReturn>

export type FormValidatorFn<TFormData> = ValidatorFn<
  FormValidatorContext<TFormData>,
  FormValidateResult<TFormData>
>

export type ServerFormValidatorFn<TFormData> = ValidatorFn<
  ServerFormValidatorContext<TFormData>,
  FormValidateResult<TFormData>
>

export interface FormValidator<in out TFormData> extends BaseValidator<
  FormValidatorFn<TFormData> | StandardSchemaV1<TFormData, any>
> {
  runOnSubmit?: boolean | ValidationPredicateFn<TFormData, TFormData, 'form'>
  runOnMount?: boolean
  triggerDebounceMs?:
    | number
    | ValidationDebounceFn<TFormData, TFormData, 'form'>
  triggers: Array<FormValidationTriggerOption<TFormData, TFormData, 'form'>>
}

export type FormValidators<TFormData> = ReadonlyArray<FormValidator<TFormData>>

export interface FormGroupValidatorContext<in out TGroupValue> {
  event: ClientValidationTrigger
  signal: AbortSignal
  formApi: FormApi<any, any>
  groupApi: FormGroupApi<any, any, TGroupValue, any, any>
  triggerFieldApi?: AnyFieldApi
  value: TGroupValue
  parseIssues: ParseFormIssuesFn<TGroupValue>
  createErrorMap: CreateErrorMapFn<TGroupValue>
}

export type FormGroupValidationError<TGroupValue> =
  | ValidationErrorInput
  | ValidationErrorMap<TGroupValue>
export type FormGroupValidateResult<TGroupValue> =
  | ValidationResult
  | ValidationErrorMap<TGroupValue>

export type FormGroupValidatorFn<TGroupValue> = ValidatorFn<
  FormGroupValidatorContext<TGroupValue>,
  FormGroupValidateResult<TGroupValue>
>

export interface FormGroupValidator<in out TGroupValue> extends Validator<
  TGroupValue,
  FormGroupValidatorFn<TGroupValue> | StandardSchemaV1<TGroupValue, any>,
  TGroupValue,
  ConfigurableValidationTrigger,
  'group'
> {}

export type FormGroupValidators<TGroupValue> = ReadonlyArray<
  FormGroupValidator<TGroupValue>
>

export interface FieldValidatorContext<
  in out TFieldName,
  in out TFieldValue,
  in out TFormData,
> {
  event: ClientValidationTrigger
  signal: AbortSignal
  formApi: FormApi<TFormData, any>
  fieldApi: FieldApi<TFieldName, TFieldValue, any, TFormData, any>
  value: TFieldValue
  parseIssues: ParseFieldIssuesFn
}

export type FieldValidateResult = ValidationResult

export type FieldValidatorFn<TFormData, TFieldName, TFieldValue> = ValidatorFn<
  FieldValidatorContext<TFieldName, TFieldValue, TFormData>,
  FieldValidateResult
>

export interface FieldValidator<
  in out TFormData,
  in out TFieldName,
  in out TFieldValue,
> extends Validator<
  TFormData,
  | FieldValidatorFn<TFormData, TFieldName, TFieldValue>
  | StandardSchemaV1<TFieldValue, any>,
  TFieldValue,
  ConfigurableValidationTrigger,
  'field'
> {
  watchFields?: Array<DeepKeys<TFormData>>
}

export type FieldValidators<TFormData, TFieldName, TFieldValue> = ReadonlyArray<
  FieldValidator<TFormData, TFieldName, TFieldValue>
>

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

type ExtractErrorMap<
  TResult,
  TTarget extends ValidationErrorTarget,
> = TResult extends ValidationIssue
  ? NormalizeValidationResult<TResult>
  : TResult extends ValidationErrorMap<any>
    ? TTarget extends 'form'
      ? TResult extends { form?: infer TError }
        ? NormalizeValidationResult<TError>
        : never
      : TResult extends { fields: infer TFields }
        ? NormalizeValidationResult<TFields[keyof TFields]>
        : never
    : NormalizeValidationResult<TResult>

export interface FormErrorTypes<
  out TFormError = ValidationIssue,
  out TFieldError = ValidationIssue,
> {
  readonly formError: TFormError
  readonly fieldError: TFieldError
}

type ExtractSubmitValidationError<TSubmitReturn> =
  Awaited<TSubmitReturn> extends infer TResolved
    ? TResolved extends OnSubmitError<infer TError>
      ? TError
      : never
    : never

type ParseSubmitFormError<TSubmitReturn> = ExtractErrorMap<
  ExtractSubmitValidationError<TSubmitReturn>,
  'form'
>

type ParseSubmitFieldError<TSubmitReturn> = ExtractErrorMap<
  ExtractSubmitValidationError<TSubmitReturn>,
  'field'
>

type ExtractSubmitFormError<TSubmitReturn> = unknown extends TSubmitReturn
  ? ValidationIssue
  : ParseSubmitFormError<TSubmitReturn>

type ExtractSubmitFieldError<TSubmitReturn> = unknown extends TSubmitReturn
  ? ValidationIssue
  : ParseSubmitFieldError<TSubmitReturn>

type ExtractFormError<TFormErrorTypes extends FormErrorTypes> =
  unknown extends TFormErrorTypes['formError']
    ? ValidationIssue
    : TFormErrorTypes['formError']

type ExtractFormFieldError<TFormErrorTypes extends FormErrorTypes> =
  unknown extends TFormErrorTypes['fieldError']
    ? ValidationIssue
    : TFormErrorTypes['fieldError']

export type FormErrors<TFormErrorTypes extends FormErrorTypes> = Array<
  ExtractFormError<TFormErrorTypes>
>

export type FieldErrors<TFieldError> = Array<
  unknown extends TFieldError ? ValidationIssue : TFieldError
>

type ValidationErrorValueFromType<TError> = unknown extends TError
  ? ValidationErrorValue
  :
      | Extract<TError, ValidationIssue>
      | (ValidationIssue extends TError ? string : never)

type ValidationErrorInputFromType<TError> = [TError] extends [never]
  ? never
  : OneOrMany<ValidationErrorValueFromType<TError>>

export type FormValidateResultFromErrorTypes<
  TFormData,
  TFormErrorTypes extends FormErrorTypes,
> =
  | ValidValidationResult
  | ValidationErrorInputFromType<TFormErrorTypes['formError']>
  | {
      form?: ValidationErrorInputFromType<TFormErrorTypes['formError']>
      fields: Partial<
        Record<
          DeepKeys<TFormData>,
          ValidationErrorInputFromType<TFormErrorTypes['fieldError']>
        >
      >
    }

type TryGetSchemaOutput<TValidator> = TValidator extends {
  readonly run: StandardSchemaV1<any, infer TOutput>
}
  ? TOutput
  : undefined

type ValidatorTriggers<TValidator> = TValidator extends {
  readonly triggers: infer TTriggers
}
  ? TTriggers extends ReadonlyArray<unknown>
    ? TTriggers[number]
    : never
  : never

type HasServerTrigger<TValidator> =
  ServerValidationTrigger extends ValidatorTriggers<TValidator> ? true : false

type TryGetFormError<TValidator> = TValidator extends {
  readonly run: StandardSchemaV1<any, any>
}
  ? StandardSchemaV1Issue
  : TValidator extends { readonly run: (...args: any) => infer TReturn }
    ? ExtractErrorMap<Awaited<TReturn>, 'form'>
    : never

type TryGetFieldError<TValidator> = TValidator extends {
  readonly run: StandardSchemaV1<any, any>
}
  ? StandardSchemaV1Issue
  : TValidator extends { readonly run: (...args: any) => infer TReturn }
    ? ExtractErrorMap<Awaited<TReturn>, 'field'>
    : never

type MappedSchemaOutputs<in out TValidators extends ReadonlyArray<unknown>> = {
  [K in keyof TValidators]: TValidators[K] extends {
    readonly run: any
  }
    ? TValidators[K] extends { readonly runOnSubmit: false }
      ? undefined
      : TryGetSchemaOutput<TValidators[K]>
    : never
}

type ToSchemaOutputs<
  TValidators extends ReadonlyArray<unknown>,
  TBroadValidators extends ReadonlyArray<unknown>,
> = unknown extends TValidators
  ? Array<unknown>
  : TBroadValidators extends TValidators
    ? Array<unknown>
    : MappedSchemaOutputs<TValidators>

export type ToFormSchemaOutputs<TFormValidators extends FormValidators<any>> =
  ToSchemaOutputs<TFormValidators, FormValidators<any>>

export type ToFormGroupSchemaOutputs<
  TGroupValidators extends FormGroupValidators<any>,
> = ToSchemaOutputs<TGroupValidators, FormGroupValidators<any>>

type ExtractValidatorFormError<
  TValidators extends ReadonlyArray<unknown>,
  TBroadValidators extends ReadonlyArray<unknown>,
> = unknown extends TValidators
  ? ValidationIssue
  : TBroadValidators extends TValidators
    ? ValidationIssue
    : TryGetFormError<TValidators[number]>

type ExtractValidatorFieldError<
  TValidators extends ReadonlyArray<unknown>,
  TBroadValidators extends ReadonlyArray<unknown>,
> = unknown extends TValidators
  ? ValidationIssue
  : TBroadValidators extends TValidators
    ? ValidationIssue
    : TryGetFieldError<TValidators[number]>

type ToValidatorErrorTypes<
  TValidators extends ReadonlyArray<unknown>,
  TBroadValidators extends ReadonlyArray<unknown>,
  TSubmitReturn,
> = FormErrorTypes<
  | ExtractValidatorFormError<TValidators, TBroadValidators>
  | ExtractSubmitFormError<TSubmitReturn>,
  | ExtractValidatorFieldError<TValidators, TBroadValidators>
  | ExtractSubmitFieldError<TSubmitReturn>
>

export type ToFormErrorTypes<
  TFormValidators extends FormValidators<any>,
  TSubmitReturn,
> = ToValidatorErrorTypes<TFormValidators, FormValidators<any>, TSubmitReturn>

export type ToFormGroupErrorTypes<
  TGroupValidators extends FormGroupValidators<any>,
> = ToValidatorErrorTypes<TGroupValidators, FormGroupValidators<any>, never>

export type ToFieldError<
  TFieldValidators extends FieldValidators<any, any, any>,
  TGroupFieldError,
  TFormErrorTypes extends FormErrorTypes,
> =
  | ExtractValidatorFieldError<TFieldValidators, FieldValidators<any, any, any>>
  | (unknown extends TGroupFieldError ? ValidationIssue : TGroupFieldError)
  | ExtractFormFieldError<TFormErrorTypes>

type MappedServerFormValidators<
  in out TFormValidators extends FormValidators<any>,
> = {
  [K in keyof TFormValidators]: HasServerTrigger<
    TFormValidators[K]
  > extends true
    ? TFormValidators[K]
    : never
}

export type ToServerFormErrorTypes<
  TFormValidators extends FormValidators<any>,
> = unknown extends TFormValidators
  ? FormErrorTypes
  : FormValidators<any> extends TFormValidators
    ? FormErrorTypes
    : ToFormErrorTypes<MappedServerFormValidators<TFormValidators>, never>

type MappedServerSchemaOutputs<
  in out TFormValidators extends FormValidators<any>,
> = {
  [K in keyof TFormValidators]: HasServerTrigger<
    TFormValidators[K]
  > extends true
    ? TryGetSchemaOutput<TFormValidators[K]>
    : undefined
}

export type ServerFormStandardSchemaValidatorOutputs<
  TFormValidators extends FormValidators<any>,
> = unknown extends TFormValidators
  ? Array<unknown>
  : FormValidators<any> extends TFormValidators
    ? Array<unknown>
    : MappedServerSchemaOutputs<TFormValidators>
