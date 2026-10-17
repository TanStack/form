import { prefixSchemaToErrors } from '../standardSchema.lib'
import { isReadonlyArray } from '../utils.lib'
import type { StandardSchemaV1Issue } from '../standardSchema.public'
import type {
  CreateErrorMapFn,
  ValidationErrorMap,
  ValidationFailure,
  ValidationFailureItem,
} from '../validation/state.public'

// TODO migrate to a proper file sometime.

export function createErrorMapFactory<TFormData>(
  value: TFormData,
): CreateErrorMapFn<TFormData> {
  return ((
    initial:
      | Partial<ValidationErrorMap<TFormData, ValidationFailure>>
      | ReadonlyArray<StandardSchemaV1Issue> = {},
  ) => {
    if (isReadonlyArray(initial)) {
      return {
        form: initial.slice(),
        fields: prefixSchemaToErrors(initial, value),
      }
    }

    let form: ValidationFailureItem[] = []
    if (isReadonlyArray(initial.form)) {
      form = initial.form.slice()
    } else if (initial.form) {
      form = [initial.form]
    }

    return {
      form,
      fields: Object.fromEntries(
        Object.entries(initial.fields ?? {}).map(([name, error]) => [
          name,
          isReadonlyArray(error) ? error.slice() : error,
        ]),
      ),
    }
  }) as CreateErrorMapFn<TFormData>
}
