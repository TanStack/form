import { isReadonlyArray } from '../utils.lib'
import type {
  CreateErrorMapFn,
  ValidationErrorMap,
  ValidationFailure,
  ValidationFailureItem,
} from './state.public'

// TODO migrate to a proper file sometime.

export const createErrorMap = ((
  initial: Partial<ValidationErrorMap<unknown, ValidationFailure>> = {},
) => {
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
}) as CreateErrorMapFn<unknown>
