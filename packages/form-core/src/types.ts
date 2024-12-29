import type { DeepKeys } from './util-types'

export type ValidationError = string

export type ValidationResult =
  | undefined
  | false
  | null
  | ValidationError
  | ValidationError[]

export type ValidationSource = 'form' | 'field'

/**
 * If/when TypeScript supports higher-kinded types, this should not be `unknown` anymore
 * @private
 */
export type Validator<Type, Fn = unknown> = () => {
  validate(
    options: { value: Type; validationSource: ValidationSource },
    fn: Fn,
  ): ValidationResult | FormValidationResult<unknown>
  validateAsync(
    options: { value: Type; validationSource: ValidationSource },
    fn: Fn,
  ): Promise<ValidationResult | FormValidationResult<unknown>>
}

/**
 * Parameters in common for all validator adapters, making it easier to swap adapter
 * @private
 */
export type ValidatorAdapterParams<TError = unknown> = {
  transformErrors?: (errors: TError[]) => ValidationError[]
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
export type ValidationErrorMap = {
  [K in ValidationErrorMapKeys]?: ValidationError[]
}

/**
 * @private
 */
export type FormValidationErrorMap = {
  [K in ValidationErrorMapKeys]?: ValidationError[]
}

export type FormValidationError<TFormData> = {
  formError: ValidationError[] | undefined
  fieldErrors?: Partial<Record<DeepKeys<TFormData>, ValidationError[]>>
}

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
export type FormValidationResult<TFormData> = {
  form?: ValidationResult
  fields: Partial<Record<DeepKeys<TFormData>, ValidationResult>>
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
