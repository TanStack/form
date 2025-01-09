import type { DeepKeys } from './util-types'

export type ValidationError = unknown

export type ValidationSource = 'form' | 'field'

/**
 * If/when TypeScript supports higher-kinded types, this should not be `unknown` anymore
 * @private
 */
export type Validator<Type, Fn = unknown> = () => {
  validate(
    options: { value: Type; validationSource: ValidationSource },
    fn: Fn,
  ): ValidationError | FormValidationError<unknown>
  validateAsync(
    options: { value: Type; validationSource: ValidationSource },
    fn: Fn,
  ): Promise<ValidationError | FormValidationError<unknown>>
}

/**
 * Parameters in common for all validator adapters, making it easier to swap adapter
 * @private
 */
export type ValidatorAdapterParams<TError = unknown> = {
  transformErrors?: (errors: TError[]) => ValidationError
}

/**
 * "server" is only intended for SSR/SSG validation and should not execute anything
 * @private
 */
export type ValidationCause = 'change' | 'blur' | 'submit' | 'mount' | 'server'

/**
 * @private
 */
export type ValidationErrorMapKeys = `on${Capitalize<ValidationCause>}`

/**
 * @private
 */
export type ValidationErrorMap<
  TOnMountReturn = unknown,
  TOnChangeReturn = unknown,
  TOnChangeAsyncReturn = unknown,
  TOnBlurReturn = unknown,
  TOnBlurAsyncReturn = unknown,
  TOnSubmitReturn = unknown,
  TOnSubmitAsyncReturn = unknown,
  TOnServerReturn = unknown,
> = {
  onMount?: TOnMountReturn
  onChange?: TOnChangeReturn | TOnChangeAsyncReturn
  onBlur?: TOnBlurReturn | TOnBlurAsyncReturn
  onSubmit?: TOnSubmitReturn | TOnSubmitAsyncReturn
  onServer?: TOnServerReturn
}

/**
 * @private
 */
export type FormValidationErrorMap<
  TOnMountReturn = unknown,
  TOnChangeReturn = unknown,
  TOnChangeAsyncReturn = unknown,
  TOnBlurReturn = unknown,
  TOnBlurAsyncReturn = unknown,
  TOnSubmitReturn = unknown,
  TOnSubmitAsyncReturn = unknown,
  TOnServerReturn = unknown,
> = {
  onMount?: TOnMountReturn
  onChange?: TOnChangeReturn | TOnChangeAsyncReturn
  onBlur?: TOnBlurReturn | TOnBlurAsyncReturn
  onSubmit?: TOnSubmitReturn | TOnSubmitAsyncReturn
  onServer?: TOnServerReturn
}

export type FormValidationError<TFormData> =
  | ValidationError
  | SpecialFormValidationError<TFormData>

/**
 * @private
 *
 * @example
 * ```tsx
 * {
 *   form: 'This form contains an error',
 *   fields: {
 *     age: "Must be 13 or older to register"
 *   }
 * }
 * ````
 */
export type SpecialFormValidationError<TFormData> = {
  form?: ValidationError
  fields: Partial<Record<DeepKeys<TFormData>, ValidationError>>
}

/**
 * @private
 */
export interface UpdateMetaOptions {
  /**
   * @default false
   */
  dontUpdateMeta?: boolean
}
