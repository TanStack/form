import { prefixSchemaToErrors } from '../standardSchema.lib'
import type { ParseIssuesFn, ParsedStandardSchemaIssues } from './state.public'

export const PARSED_ISSUES = Symbol('PARSED_ISSUES')

// TODO: Add per-call fieldErrorTarget configuration when wiring up validation,
// defaulting path-based issues to fields and always keeping root issues in form.
export function parseIssuesFactory<TFormData>(
  value: TFormData,
): ParseIssuesFn<TFormData> {
  return (issues) => ({
    [PARSED_ISSUES]: true,
    form: issues.slice(),
    fields: prefixSchemaToErrors(
      issues,
      value,
    ) as ParsedStandardSchemaIssues<TFormData>['fields'],
  })
}
