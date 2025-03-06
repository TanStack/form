import type { ValidationSource } from './types'

export type TStandardSchemaValidatorValue<TData> = {
  value: TData
  validationSource: ValidationSource
}

function prefixSchemaToErrors(issues: readonly StandardSchemaV1Issue[]) {
  const schema = new Map<string, StandardSchemaV1Issue[]>()

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

  return Object.fromEntries(schema)
}

const defaultFieldTransformer = (issues: readonly StandardSchemaV1Issue[]) =>
  issues

const defaultFormTransformer = (issues: readonly StandardSchemaV1Issue[]) => {
  const schemaErrors = prefixSchemaToErrors(issues)
  return {
    form: schemaErrors,
    fields: schemaErrors,
  }
}

const transformIssues = (
  validationSource: 'form' | 'field',
  issues: readonly StandardSchemaV1Issue[],
) =>
  validationSource === 'form'
    ? defaultFormTransformer(issues)
    : defaultFieldTransformer(issues)

export const standardSchemaValidators = {
  validate(
    { value, validationSource }: TStandardSchemaValidatorValue<unknown>,
    schema: StandardSchemaV1,
  ) {
    const result = schema['~standard'].validate(value)

    if (result instanceof Promise) {
      throw new Error('async function passed to sync validator')
    }

    if (!result.issues) return

    return transformIssues(validationSource, result.issues)
  },
  async validateAsync(
    { value, validationSource }: TStandardSchemaValidatorValue<unknown>,
    schema: StandardSchemaV1,
  ) {
    const result = await schema['~standard'].validate(value)

    if (!result.issues) return

    return transformIssues(validationSource, result.issues)
  },
}

export const isStandardSchemaValidator = (
  validator: unknown,
): validator is StandardSchemaV1 =>
  !!validator && '~standard' in (validator as object)

/**
 * The Standard Schema interface.
 */
export type StandardSchemaV1<Input = unknown, Output = Input> = {
  /**
   * The Standard Schema properties.
   */
  readonly '~standard': StandardSchemaV1Props<Input, Output>
}

/**
 * The Standard Schema properties interface.
 */
interface StandardSchemaV1Props<Input = unknown, Output = Input> {
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
  ) => StandardSchemaV1Result<Output> | Promise<StandardSchemaV1Result<Output>>
  /**
   * Inferred types associated with the schema.
   */
  readonly types?: StandardSchemaV1Types<Input, Output> | undefined
}
/**
 * The result interface of the validate function.
 */
type StandardSchemaV1Result<Output> =
  | StandardSchemaV1SuccessResult<Output>
  | StandardSchemaV1FailureResult
/**
 * The result interface if validation succeeds.
 */
interface StandardSchemaV1SuccessResult<Output> {
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
interface StandardSchemaV1FailureResult {
  /**
   * The issues of failed validation.
   */
  readonly issues: ReadonlyArray<StandardSchemaV1Issue>
}
/**
 * The issue interface of the failure output.
 */
export interface StandardSchemaV1Issue {
  /**
   * The error message of the issue.
   */
  readonly message: string
  /**
   * The path of the issue, if any.
   */
  readonly path?:
    | ReadonlyArray<PropertyKey | StandardSchemaV1PathSegment>
    | undefined
}
/**
 * The path segment interface of the issue.
 */
interface StandardSchemaV1PathSegment {
  /**
   * The key representing a path segment.
   */
  readonly key: PropertyKey
}
/**
 * The Standard Schema types interface.
 */
interface StandardSchemaV1Types<Input = unknown, Output = Input> {
  /**
   * The input type of the schema.
   */
  readonly input: Input
  /**
   * The output type of the schema.
   */
  readonly output: Output
}
