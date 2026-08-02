export type TStandardSchemaValidatorValue<out TData> = {
  value: TData
}

export type TStandardSchemaValidatorIssue = Array<StandardSchemaV1Issue>

/**
 * The Standard Schema interface.
 */
export type StandardSchemaV1<out TInput = unknown, out TOutput = TInput> = {
  /**
   * The Standard Schema properties.
   */
  readonly '~standard': StandardSchemaV1Props<TInput, TOutput>
}

/**
 * The Standard Schema properties interface.
 */
interface StandardSchemaV1Props<out TInput = unknown, out TOutput = TInput> {
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
  ) =>
    StandardSchemaV1Result<TOutput> | Promise<StandardSchemaV1Result<TOutput>>
  /**
   * Inferred types associated with the schema.
   */
  readonly types?: StandardSchemaV1Types<TInput, TOutput> | undefined
}
/**
 * The result interface of the validate function.
 */
type StandardSchemaV1Result<TOutput> =
  StandardSchemaV1SuccessResult<TOutput> | StandardSchemaV1FailureResult
/**
 * The result interface if validation succeeds.
 */
interface StandardSchemaV1SuccessResult<out TOutput> {
  /**
   * The typed output value.
   */
  readonly value: TOutput
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
    ReadonlyArray<PropertyKey | StandardSchemaV1PathSegment> | undefined
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
interface StandardSchemaV1Types<out TInput = unknown, out TOutput = TInput> {
  /**
   * The input type of the schema.
   */
  readonly input: TInput
  /**
   * The output type of the schema.
   */
  readonly output: TOutput
}
