export type ValidationError = undefined | false | null | string

// If/when TypeScript supports higher-kinded types, this should not be `unknown` anymore
export type Validator<Type, Fn = unknown> = () => {
  validate(value: Type, fn: Fn): ValidationError
  validateAsync(value: Type, fn: Fn): Promise<ValidationError>
}
