import { parseIssuesToErrorMap } from '../standardSchema.lib'
import type { FieldErrorTarget, ParseIssuesFn } from './state.public'

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
