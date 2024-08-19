import { type DeepKeys } from './util-types'

export type ValidationError = undefined | false | null | string

/**
 * If/when TypeScript supports higher-kinded types, this should not be `unknown` anymore
 * @private
 */
export type Validator<Type, Fn = unknown> = () => {
  validate(options: { value: Type }, fn: Fn): ValidationError
  validateAsync(options: { value: Type }, fn: Fn): Promise<ValidationError>
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
export type ValidationErrorMap = {
  [K in ValidationErrorMapKeys]?: ValidationError
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
export type FormValidationError<TFormData> =
  | ValidationError
  | {
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
