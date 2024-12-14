import type {
  ValidationError,
  Validator,
  ValidatorAdapterParams,
} from './types'

type Params = ValidatorAdapterParams<Issue>
type TransformFn = NonNullable<Params['transformErrors']>

function prefixSchemaToErrors(
  issues: readonly Issue[],
  transformErrors: TransformFn,
) {
  const schema = new Map<string, Issue[]>()

  for (const issue of issues) {
    const path = [...(issue.path ?? [])]
      .map((segment) => {
        const normalizedSegment =
          typeof segment === 'object' ? segment.key : segment
        return typeof normalizedSegment === 'number'
          ? `[${normalizedSegment}]`
          : normalizedSegment
      })
      .join('.')
      .replace(/\.\[/g, '[')

    schema.set(path, (schema.get(path) ?? []).concat(issue))
  }

  const transformedSchema = {} as Record<string, ValidationError>

  schema.forEach((value, key) => {
    transformedSchema[key] = transformErrors(value)
  })

  return transformedSchema
}

function defaultFormTransformer(transformErrors: TransformFn) {
  return (issues: readonly Issue[]) => ({
    form: transformErrors(issues as Issue[]),
    fields: prefixSchemaToErrors(issues, transformErrors),
  })
}

export const standardSchemaValidator =
  (params: Params = {}): Validator<unknown, StandardSchemaV1<any>> =>
  () => {
    const transformFieldErrors =
      params.transformErrors ??
      ((issues: Issue[]) => issues.map((issue) => issue.message).join(', '))

    const getTransformStrategy = (validationSource: 'form' | 'field') =>
      validationSource === 'form'
        ? defaultFormTransformer(transformFieldErrors)
        : transformFieldErrors

    return {
      validate({ value, validationSource }, fn) {
        const result = fn['~standard'].validate(value)

        if (result instanceof Promise) {
          throw new Error('async function passed to sync validator')
        }

        if (!result.issues) return

        const transformer = getTransformStrategy(validationSource)

        return transformer(result.issues as Issue[])
      },
      async validateAsync({ value, validationSource }, fn) {
        const result = await fn['~standard'].validate(value)

        if (!result.issues) return

        const transformer = getTransformStrategy(validationSource)

        return transformer(result.issues as Issue[])
      },
    }
  }

export const isStandardSchemaValidator = (
  validator: unknown,
): validator is StandardSchemaV1 =>
  !!validator && '~standard' in (validator as object)

/**
 * The Standard Schema interface.
 */
type StandardSchemaV1<Input = unknown, Output = Input> = {
  /**
   * The Standard Schema properties.
   */
  readonly '~standard': Props<Input, Output>
}

/**
 * The Standard Schema properties interface.
 */
export interface Props<Input = unknown, Output = Input> {
  /**
   * The version number of the standard.
   */
  readonly version: 1
  /**
   * The vendor name of the schema library.
   */
  readonly vendor: string
  /**
   * Validates unknown input values.
   */
  readonly validate: (
    value: unknown,
  ) => Result<Output> | Promise<Result<Output>>
  /**
   * Inferred types associated with the schema.
   */
  readonly types?: Types<Input, Output> | undefined
}
/**
 * The result interface of the validate function.
 */
export type Result<Output> = SuccessResult<Output> | FailureResult
/**
 * The result interface if validation succeeds.
 */
export interface SuccessResult<Output> {
  /**
   * The typed output value.
   */
  readonly value: Output
  /**
   * The non-existent issues.
   */
  readonly issues?: undefined
}
/**
 * The result interface if validation fails.
 */
export interface FailureResult {
  /**
   * The issues of failed validation.
   */
  readonly issues: ReadonlyArray<Issue>
}
/**
 * The issue interface of the failure output.
 */
export interface Issue {
  /**
   * The error message of the issue.
   */
  readonly message: string
  /**
   * The path of the issue, if any.
   */
  readonly path?: ReadonlyArray<PropertyKey | PathSegment> | undefined
}
/**
 * The path segment interface of the issue.
 */
export interface PathSegment {
  /**
   * The key representing a path segment.
   */
  readonly key: PropertyKey
}
/**
 * The Standard Schema types interface.
 */
export interface Types<Input = unknown, Output = Input> {
  /**
   * The input type of the schema.
   */
  readonly input: Input
  /**
   * The output type of the schema.
   */
  readonly output: Output
}
/**
 * Infers the input type of a Standard Schema.
 */
export type InferInput<Schema extends StandardSchemaV1> = NonNullable<
  Schema['~standard']['types']
>['input']
/**
 * Infers the output type of a Standard Schema.
 */
export type InferOutput<Schema extends StandardSchemaV1> = NonNullable<
  Schema['~standard']['types']
>['output']
export {}
