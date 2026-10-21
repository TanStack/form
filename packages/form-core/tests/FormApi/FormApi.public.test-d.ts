import { describe, expectTypeOf, it } from 'vitest'
import { formOptions } from '../../src'
import type {
  CreateSubmitErrorMapFn,
  CreatedErrorMap,
  GetFormErrorTypes,
  OnSubmitError,
  ParseSubmitIssuesFn,
  StandardSchemaV1Issue,
  ValidationFailureItem,
  ValidationIssue,
} from '../../src'

type FormData = { name: string; user: { age: number } }

describe('FormSubmitContext', () => {
  it('infers mutable submission error maps and restricts their field paths', () => {
    const options = formOptions({
      defaultValues: { name: '', user: { age: 0 } },
      onSubmit: ({ createErrorMap, parseIssues }) => {
        expectTypeOf(createErrorMap).toEqualTypeOf<
          CreateSubmitErrorMapFn<FormData>
        >()
        expectTypeOf(parseIssues).toEqualTypeOf<ParseSubmitIssuesFn<FormData>>()

        const errors = createErrorMap({ form: 'Submission failed' })
        expectTypeOf(errors).toEqualTypeOf<
          CreatedErrorMap<FormData, ValidationFailureItem> &
            OnSubmitError<CreatedErrorMap<FormData, ValidationFailureItem>>
        >()

        errors.fields.name = 'Name is required'
        errors.fields['user.age'] = { message: 'Age is required' }
        // @ts-expect-error Submission error maps require valid form field paths.
        errors.fields.missing = 'Missing'
        // @ts-expect-error Initial error maps require valid form field paths.
        createErrorMap({ fields: { missing: 'Missing' } })
        // @ts-expect-error Standard Schema issues are handled by parseIssues.
        createErrorMap([{ message: 'Name is required', path: ['name'] }])

        return errors
      },
    })

    type SubmitReturn = ReturnType<NonNullable<typeof options.onSubmit>>
    expectTypeOf<
      GetFormErrorTypes<[], SubmitReturn>['selfError']
    >().toEqualTypeOf<ValidationIssue>()
    expectTypeOf<
      GetFormErrorTypes<[], SubmitReturn>['subfieldError']
    >().toEqualTypeOf<ValidationIssue>()
  })

  it('keeps parsed Standard Schema submission errors separately typed', () => {
    const options = formOptions({
      defaultValues: { name: '', user: { age: 0 } },
      onSubmit: ({ parseIssues }) =>
        parseIssues([{ message: 'Name is required', path: ['name'] }]),
    })

    type SubmitReturn = ReturnType<NonNullable<typeof options.onSubmit>>
    expectTypeOf<
      GetFormErrorTypes<[], SubmitReturn>['selfError']
    >().toEqualTypeOf<StandardSchemaV1Issue>()
    expectTypeOf<
      GetFormErrorTypes<[], SubmitReturn>['subfieldError']
    >().toEqualTypeOf<StandardSchemaV1Issue>()
  })
})
