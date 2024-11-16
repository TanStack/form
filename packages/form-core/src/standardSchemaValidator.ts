import type {
  ValidationError,
  Validator,
  ValidatorAdapterParams,
} from './types'
import type { v1 } from '@standard-schema/spec'

type Params = ValidatorAdapterParams<v1.StandardIssue>
type TransformFn = NonNullable<Params['transformErrors']>

function prefixSchemaToErrors(
  issues: readonly v1.StandardIssue[],
  transformErrors: TransformFn,
) {
  const schema = new Map<string, v1.StandardIssue[]>()

  for (const issue of issues) {
    const path = [...(issue.path ?? [])]
      .map((segment) =>
        typeof segment === 'number' ? `[${segment}]` : segment,
      )
      .join('.')
      .replace(/\.\[/g, '[')

    if (path === '') {
      continue
    }

    schema.set(path, (schema.get(path) ?? []).concat(issue))
  }

  const transformedSchema = {} as Record<string, ValidationError>

  schema.forEach((value, key) => {
    transformedSchema[key] = transformErrors(value)
  })

  return transformedSchema
}

function defaultFormTransformer(transformErrors: TransformFn) {
  return (issues: readonly v1.StandardIssue[]) => ({
    form: transformErrors(issues as v1.StandardIssue[]),
    fields: prefixSchemaToErrors(issues, transformErrors),
  })
}

export const standardSchemaValidator =
  (params: Params = {}): Validator<unknown, v1.StandardSchema<any, any>> =>
  () => {
    const transformFieldErrors =
      params.transformErrors ??
      ((issues: v1.StandardIssue[]) =>
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

        return transformer(result.issues as v1.StandardIssue[])
      },
      async validateAsync({ value, validationSource }, fn) {
        const result = await fn['~standard'].validate(value)

        if (!result.issues) return

        const transformer = getTransformStrategy(validationSource)

        return transformer(result.issues as v1.StandardIssue[])
      },
    }
  }

export const isStandardSchemaValidator = (
  validator: unknown,
): validator is v1.StandardSchema =>
  !!validator && typeof validator === 'object' && '~standard' in validator
