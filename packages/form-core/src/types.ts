import type { DeepKeys } from './util-types'

export type ValidationError = unknown

export type ValidationSource = 'form' | 'field'

/**
 * "server" is only intended for SSR/SSG validation and should not execute anything
 * @private
 */
export type ValidationCause = 'change' | 'blur' | 'submit' | 'mount' | 'server'

/**
 * @private
 */
export type ListenerCause = 'change' | 'blur' | 'submit' | 'mount'

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
 * @private allows tracking the source of the errors in the error map
 */
export type ValidationErrorMapSource = {
  onMount?: ValidationSource
  onChange?: ValidationSource
  onBlur?: ValidationSource
  onSubmit?: ValidationSource
  onServer?: ValidationSource
}

/**
 * @private
 */
export type FormValidationErrorMap<
  TFormData,
  TOnMountReturn = unknown,
  TOnChangeReturn = unknown,
  TOnChangeAsyncReturn = unknown,
  TOnBlurReturn = unknown,
  TOnBlurAsyncReturn = unknown,
  TOnSubmitReturn = unknown,
  TOnSubmitAsyncReturn = unknown,
  TOnServerReturn = unknown,
> = {
  onMount?: TOnMountReturn | GlobalFormValidationError<TFormData>
  onChange?:
    | TOnChangeReturn
    | TOnChangeAsyncReturn
    | GlobalFormValidationError<TFormData>
  onBlur?:
    | TOnBlurReturn
    | TOnBlurAsyncReturn
    | GlobalFormValidationError<TFormData>
  onSubmit?:
    | TOnSubmitReturn
    | TOnSubmitAsyncReturn
    | GlobalFormValidationError<TFormData>
  onServer?: TOnServerReturn
}

export type FormValidationError<TFormData> =
  | ValidationError
  | GlobalFormValidationError<TFormData>

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
export type GlobalFormValidationError<TFormData> = {
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
