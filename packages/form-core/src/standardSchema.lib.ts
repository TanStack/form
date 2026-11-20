import { isNil } from './utils.lib'
import { createOutput } from './validationOutput.lib'
import { PARSED_ISSUES, parseIssuesFactory } from './validation/parseIssues.lib'
import { validationSourceScopes } from './ValidationSourceInstance.lib'
import type {
  StandardSchemaV1,
  StandardSchemaV1Issue,
} from './standardSchema.public'
import type {
  FieldValidatorFn,
  FormGroupValidatorFn,
} from './validation.public'
import type { FormValidatorFn } from './validation/formValidators.public'
import type {
  ParsedStandardSchemaIssues,
  ValidationFieldMap,
  ValidationOutput,
} from './validation/state.public'
import type { AnyInternalValidatorInstance } from './ValidatorInstance.lib'

export function parseIssuesToErrorMap<TFormData>(
  issues: ReadonlyArray<StandardSchemaV1Issue>,
  formValue: unknown,
) {
  const schema = new Map<string, Array<StandardSchemaV1Issue>>()
  const formLevel = [] as Array<StandardSchemaV1Issue>

  for (const issue of issues) {
    const path = getPathFromIssue(issue, formValue)
    if (path === '') {
      formLevel.push(issue)
    } else {
      schema.set(path, (schema.get(path) ?? []).concat(issue))
    }
  }

  return {
    form: formLevel,
    fields: Object.fromEntries(schema) as ValidationFieldMap<
      TFormData,
      Array<StandardSchemaV1Issue>
    >,
  }
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
    | FormValidatorFn<any, any>
    | FormGroupValidatorFn<any>
    | FieldValidatorFn<any, any, any>
    | StandardSchemaV1,
): object is StandardSchemaV1<any, any> {
  // Arktype typeof is function, not object. This is the only constraint that's safe so far.
  return '~standard' in object
}

export function parseStandardSchema<TOutput>(
  schema: StandardSchemaV1<any, TOutput>,
  value: any,
  instance: AnyInternalValidatorInstance,
): Promise<
  | ValidationOutput<TOutput>
  | ParsedStandardSchemaIssues<any>
  | ReadonlyArray<StandardSchemaV1Issue>
> {
  const parseIssues = parseIssuesFactory(value, instance.fieldErrorTarget)

  return Promise.resolve(schema['~standard'].validate(value)).then((result) => {
    if (!result.issues) {
      return createOutput(result.value)
    }

    if (instance.scope === validationSourceScopes.field) {
      return result.issues
    }
    return parseIssues(result.issues)
  })
}
