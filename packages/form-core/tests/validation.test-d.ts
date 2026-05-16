import { describe, expectTypeOf, it } from 'vitest'
import z from 'zod'
import { InternalFormApi } from '../src/FormApi.lib'
import type {
  AnyFormApi,
  FieldErrors,
  StandardSchemaV1Issue,
  ValidationIssue,
} from '../src'

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

  it('should fall back to ValidationIssue if `any` was used', () => {
    expectTypeOf<AnyFormApi['state']['formErrors']>().toEqualTypeOf<
      Array<ValidationIssue>
    >()
  })
})

describe('FieldErrors', () => {
  it('should infer field-level validator errors', () => {
    type Errors = FieldErrors<
      [],
      [{ run: () => { message: string; fieldOnly: true }; triggers: [] }]
    >

    expectTypeOf<Errors>().toEqualTypeOf<
      Array<{ message: string; fieldOnly: true }>
    >()
  })

  it('should infer field errors from aggregate form validators', () => {
    type Errors = FieldErrors<
      [
        {
          run: () => {
            form: { message: string; formOnly: true }
            fields: { name: { message: string; fieldOnly: true } }
          }
          triggers: []
        },
      ],
      []
    >

    expectTypeOf<Errors>().toEqualTypeOf<
      Array<{ message: string; fieldOnly: true }>
    >()
  })

  it('should combine form aggregate and field validator errors', () => {
    type Errors = FieldErrors<
      [
        {
          run: () => {
            form: string
            fields: { name: { message: string; fromForm: true } }
          }
          triggers: []
        },
      ],
      [{ run: () => { message: string; fromField: true }; triggers: [] }]
    >

    expectTypeOf<Errors>().toEqualTypeOf<
      Array<
        | { message: string; fromForm: true }
        | { message: string; fromField: true }
      >
    >()
  })

  it('should normalize string field errors', () => {
    type Errors = FieldErrors<
      [{ run: () => { form: string; fields: { name: string } }; triggers: [] }],
      [{ run: () => string; triggers: [] }]
    >

    expectTypeOf<Errors>().toEqualTypeOf<Array<ValidationIssue>>()
  })

  it('should support standard schemas', () => {
    const schema = z.object({ name: z.string() })

    type Errors = FieldErrors<
      [{ run: typeof schema; triggers: [] }],
      [{ run: typeof schema; triggers: [] }]
    >

    expectTypeOf<Errors>().toEqualTypeOf<Array<StandardSchemaV1Issue>>()
  })
})
