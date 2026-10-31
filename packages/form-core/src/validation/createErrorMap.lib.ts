import { isReadonlyArray } from '../utils.lib'
import type {
  CreateErrorMapFn,
  ValidationErrorMap,
  ValidationFailure,
  ValidationFailureItem,
} from './state.public'

function toArray(item: ValidationFailure | undefined): ValidationFailureItem[] {
  if (isReadonlyArray(item)) return item.slice()
  if (!item) return []
  return [item]
}

function mergeError(
  before: ValidationFailureItem[] | undefined,
  newError: ValidationFailure,
): ValidationFailureItem[] {
  if (!before) {
    return toArray(newError)
  } else if (!newError) {
    return before
  } else {
    before.push(...toArray(newError))
    return before
  }
}

export const createErrorMap = (<TFormData>(
  initial: Partial<
    ValidationErrorMap<TFormData, ValidationFailure, ValidationFailure>
  > = {},
) => {
  const form = toArray(initial.form)
  const fields = Object.fromEntries(
    Object.entries<ValidationFailure>((initial.fields ?? {}) as never).map(
      ([name, error]) => [name, toArray(error)],
    ),
  )

  return {
    form,
    fields,
    addFormError: (error) => {
      mergeError(form, error)
    },
    addFieldError: (fieldName, error) => {
      fields[fieldName] = mergeError(fields[fieldName], error)
    },
  }
}) satisfies CreateErrorMapFn<unknown> as CreateErrorMapFn<unknown>
