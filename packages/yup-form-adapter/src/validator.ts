import { setBy } from '@tanstack/form-core'
import type {
  ValidationError,
  Validator,
  ValidatorAdapterParams,
} from '@tanstack/form-core'
import type { AnySchema, ValidationError as YupError } from 'yup'

type Params = ValidatorAdapterParams<YupError>
type TransformFn = NonNullable<Params['transformErrors']>

export function prefixSchemaToErrors(
  yupErrors: YupError[],
  transformErrors: TransformFn,
) {
  const schema = new Map<string, YupError[]>()

  for (const yupError of yupErrors) {
    if (!yupError.path) continue

    const path = yupError.path
    schema.set(path, (schema.get(path) ?? []).concat(yupError))
  }

  const transformedSchema = {} as Record<string, ValidationError>

  schema.forEach((value, key) => {
    transformedSchema[key] = transformErrors(value)
  })

  return transformedSchema
}

export function defaultFormTransformer(transformErrors: TransformFn) {
  return (zodErrors: YupError[]) => ({
    form: transformErrors(zodErrors),
    fields: prefixSchemaToErrors(zodErrors, transformErrors),
  })
}

export const yupValidator =
  (params: Params = {}): Validator<unknown, AnySchema> =>
  () => {
    const transformFieldErrors =
      params.transformErrors ??
      ((errors: YupError[]) => errors.map((error) => error.message).join(', '))

    const getTransformStrategy = (validationSource: 'form' | 'field') =>
      validationSource === 'form'
        ? defaultFormTransformer(transformFieldErrors)
        : transformFieldErrors

    return {
      validate({ value, validationSource }, fn) {
        try {
          fn.validateSync(value, { abortEarly: false })
          return
        } catch (_e) {
          const e = _e as YupError

          const transformer = getTransformStrategy(validationSource)

          return transformer(e.inner)
        }
      },
      async validateAsync({ value, validationSource }, fn) {
        try {
          await fn.validate(value, { abortEarly: false })
          return
        } catch (_e) {
          const e = _e as YupError

          const transformer = getTransformStrategy(validationSource)

          return transformer(e.inner)
        }
      },
    }
  }
