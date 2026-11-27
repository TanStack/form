import { isNil } from '../../utils.lib'
import type { StandardSchemaV1Issue } from './standardSchema.public'
import type {
  FieldErrorTarget,
  ParseIssuesFn,
  ValidationFieldMap,
} from './results.public'

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

export const PARSED_ISSUES = Symbol('PARSED_ISSUES')

export function parseIssuesFactory<TFormData>(
  value: TFormData,
  routeFieldErrorsTo: FieldErrorTarget,
): ParseIssuesFn<TFormData> {
  return (issues) => {
    const map = parseIssuesToErrorMap<TFormData>(issues, value)

    // `map.form` is only issues that have no destination.
    const form = routeFieldErrorsTo === 'field' ? map.form : issues.slice()

    const fields = routeFieldErrorsTo === 'self' ? {} : map.fields

    return {
      [PARSED_ISSUES]: true,
      form,
      fields,
    }
  }
}
