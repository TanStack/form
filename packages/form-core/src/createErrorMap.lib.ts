import { parseStandardSchemaIssues } from './standardSchema.lib'
import { isReadonlyArray } from './utils.lib'
import type { CreateErrorMapFn } from './validation.public'

type TupleNarrower = (arg: any) => arg is ReadonlyArray<any>

/**
 * Standard schema needs path parsing, so the error map function needs context of form values.
 */
export function createErrorMapFactory<TFormData>(
  value: TFormData,
): CreateErrorMapFn<TFormData> {
  const createErrorMap = ((initial) => {
    if (isReadonlyArray(initial)) {
      return parseStandardSchemaIssues(initial, value, 'form')
    }
    const map = initial ?? {}
    map.fields ??= {}
    return map
  }) as CreateErrorMapFn<TFormData>

  return createErrorMap
}
