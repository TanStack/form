import { safeParse, safeParseAsync } from 'valibot'
import type {
  ValidationError,
  Validator,
  ValidatorAdapterParams,
} from '@tanstack/form-core'
import type { GenericIssue, GenericSchema, GenericSchemaAsync } from 'valibot'

type Params = ValidatorAdapterParams<GenericIssue>
type TransformFn = NonNullable<Params['transformErrors']>

export function prefixSchemaToErrors(
  valiErrors: GenericIssue[],
  transformErrors: TransformFn,
) {
  const schema = new Map<string, GenericIssue[]>()

  for (const valiError of valiErrors) {
    if (!valiError.path) continue

    const path = valiError.path
      .map(({ key: segment }) =>
        typeof segment === 'number' ? `[${segment}]` : segment,
      )
      .join('.')
      .replace(/\.\[/g, '[')
    schema.set(path, (schema.get(path) ?? []).concat(valiError))
  }

  const transformedSchema = {} as Record<string, ValidationError>

  schema.forEach((value, key) => {
    transformedSchema[key] = transformErrors(value)
  })

  return transformedSchema
}

export function defaultFormTransformer(transformErrors: TransformFn) {
  return (zodErrors: GenericIssue[]) => ({
    form: transformErrors(zodErrors),
    fields: prefixSchemaToErrors(zodErrors, transformErrors),
  })
}

/**
 * @deprecated With valibot 1.0.0 the adapter is no longer needed and will be soon removed.
 * If you were passing some parameters you can use the `standardSchemaValidator` instead.
 */
export const valibotValidator =
  (
    params: Params = {},
  ): Validator<unknown, GenericSchema | GenericSchemaAsync> =>
  () => {
    const transformFieldErrors =
      params.transformErrors ??
      ((issues: GenericIssue[]) =>
        issues.map((issue) => issue.message).join(', '))

    const getTransformStrategy = (validationSource: 'form' | 'field') =>
      validationSource === 'form'
        ? defaultFormTransformer(transformFieldErrors)
        : transformFieldErrors

    return {
      validate({ value, validationSource }, fn) {
        if (fn.async) return
        const result = safeParse(fn, value)
        if (result.success) return

        const transformer = getTransformStrategy(validationSource)

        return transformer(result.issues)
      },
      async validateAsync({ value, validationSource }, fn) {
        const result = await safeParseAsync(fn, value)
        if (result.success) return

        const transformer = getTransformStrategy(validationSource)

        return transformer(result.issues)
      },
    }
  }
