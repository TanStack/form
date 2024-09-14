import { setBy } from '@tanstack/form-core'
import type {
  ValidationError,
  Validator,
  ValidatorAdapterParams,
} from '@tanstack/form-core'
import type { ZodIssue, ZodType } from 'zod'

type Params = ValidatorAdapterParams<ZodIssue>
type TransformFn = NonNullable<Params['transformErrors']>

export function prefixSchemaToErrors(
  zodErrors: ZodIssue[],
  transformErrors: TransformFn,
) {
  const schema = new Map<string, ZodIssue[]>()

  for (const zodError of zodErrors) {
    const path = zodError.path.join('.')
    schema.set(path, (schema.get(path) ?? []).concat(zodError))
  }

  const transformedSchema = {} as Record<string, ValidationError>

  schema.forEach((value, key) => {
    transformedSchema[key] = transformErrors(value)
  })

  return transformedSchema
}

export function defaultFormTransformer(transformErrors: TransformFn) {
  return (zodErrors: ZodIssue[]) => ({
    form: transformErrors(zodErrors),
    fields: prefixSchemaToErrors(zodErrors, transformErrors),
  })
}

export const zodValidator =
  (params: Params = {}): Validator<unknown, ZodType> =>
  () => {
    const transformFieldErrors =
      params.transformErrors ??
      ((issues: ZodIssue[]) => issues.map((issue) => issue.message).join(', '))

    const getTransformStrategy = (validationSource: 'form' | 'field') =>
      validationSource === 'form'
        ? defaultFormTransformer(transformFieldErrors)
        : transformFieldErrors

    return {
      validate({ value, validationSource }, fn) {
        const result = fn.safeParse(value)
        if (result.success) return

        const transformer = getTransformStrategy(validationSource)

        return transformer(result.error.issues)
      },
      async validateAsync({ value, validationSource }, fn) {
        const result = await fn.safeParseAsync(value)
        if (result.success) return

        const transformer = getTransformStrategy(validationSource)

        return transformer(result.error.issues)
      },
    }
  }
