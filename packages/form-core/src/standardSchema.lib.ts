import type {
  StandardSchemaV1,
  StandardSchemaV1Issue,
} from './standardSchema.public'
import type {
  ErrorWithMessage,
  FieldValidatorFn,
  FormValidateResult,
  FormValidatorFn,
} from './validation.public'

export function prefixSchemaToErrors(
  issues: ReadonlyArray<StandardSchemaV1Issue>,
  formValue: unknown,
) {
  const schema = new Map<string, Array<StandardSchemaV1Issue>>()

  for (const issue of issues) {
    const issuePath = issue.path ?? []

    let currentFormValue = formValue
    let path = ''

    for (let i = 0; i < issuePath.length; i++) {
      const pathSegment = issuePath[i]
      if (pathSegment === undefined) continue

      const segment =
        typeof pathSegment === 'object' ? pathSegment.key : pathSegment

      // Standard Schema doesn't specify if paths should use numbers or stringified numbers for array access.
      // However, if we follow the path it provides and encounter an array, then we can assume it's intended for array access.
      const segmentAsNumber = Number(segment)
      if (Array.isArray(currentFormValue) && !Number.isNaN(segmentAsNumber)) {
        path += `[${segmentAsNumber}]`
      } else {
        path += (i > 0 ? '.' : '') + String(segment)
      }

      if (typeof currentFormValue === 'object' && currentFormValue !== null) {
        currentFormValue = currentFormValue[segment as never]
      } else {
        currentFormValue = undefined
      }
    }
    schema.set(path, (schema.get(path) ?? []).concat(issue))
  }

  return Object.fromEntries(schema)
}

export function isStandardSchema(
  object: FormValidatorFn<any> | FieldValidatorFn<any, any> | StandardSchemaV1,
): object is StandardSchemaV1<any, any> {
  return typeof object === 'object' && '~standard' in object
}

export function parseStandardSchema<TOutput>(
  schema: StandardSchemaV1<any, TOutput>,
  value: any,
  scope: 'form' | 'field',
): Promise<{
  result: FormValidateResult
  schemaResult: TOutput | null
}> {
  return Promise.resolve(schema['~standard'].validate(value)).then((result) => {
    if (!result.issues) {
      return {
        result: null,
        schemaResult: result.value,
      }
    }

    const validationResult =
      scope === 'field'
        ? (result.issues as Array<ErrorWithMessage>)
        : {
            // TODO the form probably wants a copy?
            fields: prefixSchemaToErrors(result.issues, value),
          }

    return {
      result: validationResult,
      schemaResult: null,
    }
  })
}
