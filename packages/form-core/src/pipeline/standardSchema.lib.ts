import { createOutput } from '../validationOutput.lib'
import { parseIssuesFactory } from '../validation/parseIssues.lib'
import { mapResult } from './utils.lib'
import type {
  StandardSchemaV1,
  StandardSchemaV1Issue,
} from '../standardSchema.public'
import type { Awaitable } from '../types.public'
import type { ValidatorScope } from '../validation.public'
import type {
  FieldErrorTarget,
  ParsedStandardSchemaIssues,
  ValidationOutput,
} from '../validation/state.public'

export function isStandardSchema(
  value: unknown,
): value is StandardSchemaV1<any, any> {
  return (
    ((typeof value === 'object' && value !== null) ||
      typeof value === 'function') &&
    '~standard' in value
  )
}

export function parseStandardSchema(
  schema: StandardSchemaV1,
  value: unknown,
  {
    scope,
    fieldErrorTarget = 'field',
  }: { scope: ValidatorScope; fieldErrorTarget?: FieldErrorTarget },
): Awaitable<
  | ValidationOutput<unknown>
  | ParsedStandardSchemaIssues<any>
  | ReadonlyArray<StandardSchemaV1Issue>
> {
  return mapResult(schema['~standard'].validate(value), (result) => {
    if (!result.issues) {
      return createOutput(result.value)
    }

    if (scope === 'field') {
      return result.issues
    }

    // This could sit outside mapResult, but it's a cheap function. Outside it'd
    // create the closure on every result, even if successful.
    return parseIssuesFactory(value, fieldErrorTarget)(result.issues)
  })
}
