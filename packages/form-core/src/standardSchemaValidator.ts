import type {
  ValidationError,
  Validator,
  ValidatorAdapterParams,
} from './types'
import type { StandardSchemaV1 } from '@standard-schema/spec'

type Params = ValidatorAdapterParams<StandardSchemaV1.Issue>
type TransformFn = NonNullable<Params['transformErrors']>

function prefixSchemaToErrors(
  issues: readonly StandardSchemaV1.Issue[],
  transformErrors: TransformFn,
) {
  const schema = new Map<string, StandardSchemaV1.Issue[]>()

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
  return (issues: readonly StandardSchemaV1.Issue[]) => ({
    form: transformErrors(issues as StandardSchemaV1.Issue[]),
    fields: prefixSchemaToErrors(issues, transformErrors),
  })
}

export const standardSchemaValidator =
  (params: Params = {}): Validator<unknown, StandardSchemaV1> =>
  () => {
    const transformFieldErrors =
      params.transformErrors ??
      ((issues: StandardSchemaV1.Issue[]) =>
        issues.map((issue) => issue.message).join(', '))

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

        return transformer(result.issues as StandardSchemaV1.Issue[])
      },
      async validateAsync({ value, validationSource }, fn) {
        const result = await fn['~standard'].validate(value)

        if (!result.issues) return

        const transformer = getTransformStrategy(validationSource)

        return transformer(result.issues as StandardSchemaV1.Issue[])
      },
    }
  }

export const isStandardSchemaValidator = (
  validator: unknown,
): validator is StandardSchemaV1 =>
  !!validator && '~standard' in (validator as object)
