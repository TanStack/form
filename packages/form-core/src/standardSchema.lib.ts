import { isNil } from './utils.lib'
import type {
  StandardSchemaV1,
  StandardSchemaV1Issue,
} from './standardSchema.public'
import type {
  FieldValidatorFn,
  FormGroupValidatorFn,
  FormValidateResult,
  FormValidatorFn,
  ValidationIssue,
} from './validation.public'

export function prefixSchemaToErrors(
  issues: ReadonlyArray<StandardSchemaV1Issue>,
  formValue: unknown,
) {
  const schema = new Map<string, Array<StandardSchemaV1Issue>>()

  for (const issue of issues) {
    const path = getPathFromIssue(issue, formValue)
    if (path === '') continue

    schema.set(path, (schema.get(path) ?? []).concat(issue))
  }

  return Object.fromEntries(schema)
}

function getPathFromIssue(
  issue: StandardSchemaV1Issue,
  formValue: unknown,
): string {
  const issuePath = issue.path ?? []

  let currentFormValue = formValue
  let path = ''

  for (const pathSegment of issuePath) {
    if (isNil(pathSegment)) continue

    const segment =
      typeof pathSegment === 'object' ? pathSegment.key : pathSegment
    if (segment === '') continue

    // Standard Schema doesn't specify if paths should use numbers or stringified numbers for array access.
    // However, if we follow the path it provides and encounter an array, then we can assume it's intended for array access.
    const segmentAsNumber = Number(segment)
    if (Array.isArray(currentFormValue) && !Number.isNaN(segmentAsNumber)) {
      path += `[${segmentAsNumber}]`
    } else {
      path += (path === '' ? '' : '.') + String(segment)
    }

    if (typeof currentFormValue === 'object' && currentFormValue !== null) {
      currentFormValue = currentFormValue[segment as never]
    } else {
      currentFormValue = undefined
    }
  }

  return path
}

export function isStandardSchema(
  object:
    | FormValidatorFn<any>
    | FormGroupValidatorFn<any>
    | FieldValidatorFn<any, any, any>
    | StandardSchemaV1,
): object is StandardSchemaV1<any, any> {
  return typeof object === 'object' && '~standard' in object
}

export function parseStandardSchema<TOutput>(
  schema: StandardSchemaV1<any, TOutput>,
  value: any,
  scope: 'form' | 'field',
): Promise<{
  result: FormValidateResult<any>
  schemaResult: TOutput | null
  hasSchemaResult: boolean
}> {
  return Promise.resolve(schema['~standard'].validate(value)).then((result) => {
    if (!result.issues) {
      return {
        result: null,
        schemaResult: result.value,
        hasSchemaResult: true,
      }
    }

    const validationResult =
      scope === 'field'
        ? (result.issues as Array<ValidationIssue>)
        : {
            form: result.issues.slice(),
            // TODO the form probably wants a copy?
            fields: prefixSchemaToErrors(result.issues, value),
          }

    return {
      result: validationResult,
      schemaResult: null,
      hasSchemaResult: false,
    }
  })
}
