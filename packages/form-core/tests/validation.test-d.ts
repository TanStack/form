import { describe, expectTypeOf, it } from 'vitest'
import z from 'zod'
import { InternalFormApi } from '../src/FormApi.lib'
import type { StandardSchemaV1Issue, ValidationIssue } from '../src'

describe('FormErrors', () => {
  it('should infer the error type from the validator', () => {
    const {
      state: { formErrors },
    } = new InternalFormApi({
      defaultValues: { name: '' },
      validators: [
        { run: () => ({ message: 'My error', additional: 0 }), triggers: [] },
      ],
    })

    expectTypeOf<typeof formErrors>().toEqualTypeOf<
      Array<{ message: string; additional: number }>
    >()

    const {
      state: { formErrors: strictFormErrors },
    } = new InternalFormApi({
      defaultValues: { name: '' },
      validators: [
        { run: () => ({ message: 'My error' as const }), triggers: [] },
      ],
    })

    expectTypeOf<typeof strictFormErrors>().toEqualTypeOf<
      Array<{ message: 'My error' }>
    >()
  })

  it('should normalize string errors', () => {
    const {
      state: { formErrors },
    } = new InternalFormApi({
      defaultValues: { name: '' },
      validators: [{ run: () => 'My error', triggers: [] }],
    })

    expectTypeOf<typeof formErrors>().toEqualTypeOf<Array<ValidationIssue>>()
  })

  it('should normalize string array errors', () => {
    const {
      state: { formErrors },
    } = new InternalFormApi({
      defaultValues: { name: '' },
      validators: [
        { run: () => ['First error', 'Second error'], triggers: [] },
      ],
    })

    expectTypeOf<typeof formErrors>().toEqualTypeOf<Array<ValidationIssue>>()
  })

  it('should normalize async errors', () => {
    const {
      state: { formErrors },
    } = new InternalFormApi({
      defaultValues: { name: '' },
      validators: [
        // eslint-disable-next-line @typescript-eslint/require-await
        { run: async () => ['First error', 'Second error'], triggers: [] },
      ],
    })

    expectTypeOf<typeof formErrors>().toEqualTypeOf<Array<ValidationIssue>>()
  })

  it('should support standard schemas', () => {
    const {
      state: { formErrors },
    } = new InternalFormApi({
      defaultValues: { name: '' },
      validators: [
        {
          run: z.object({
            name: z.string(),
          }),
          triggers: [],
        },
      ],
    })

    expectTypeOf<typeof formErrors>().toEqualTypeOf<
      Array<StandardSchemaV1Issue>
    >()
  })

  it('should extract aggregate errros', () => {
    const {
      state: { formErrors: formErrorsString },
    } = new InternalFormApi({
      defaultValues: { name: '' },
      validators: [
        {
          run: () => ({ form: 'Custom', fields: { name: 'Too short' } }),
          triggers: [],
        },
      ],
    })

    expectTypeOf<typeof formErrorsString>().toEqualTypeOf<
      Array<ValidationIssue>
    >()

    const {
      state: { formErrors: formErrorsCustom },
    } = new InternalFormApi({
      defaultValues: { name: '' },
      validators: [
        {
          run: () => ({
            form: { message: 'Custom', errorCount: 5 },
            fields: { name: 'Too short' },
          }),
          triggers: [],
        },
      ],
    })

    expectTypeOf<typeof formErrorsCustom>().toEqualTypeOf<
      Array<{ message: string; errorCount: number }>
    >()
  })
})
