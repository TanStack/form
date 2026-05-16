import { describe, expectTypeOf, it } from 'vitest'
import z from 'zod'
import type {
  FieldErrors,
  FieldValidators,
  FormErrors,
  FormValidators,
  OnSubmitError,
  StandardSchemaV1Issue,
  ValidationIssue,
} from '../src'

type TestFormData = {
  name: string
}

// InternalFormApi does some `any` shenanigans. Usually okay, but for type tests it sucks.
// Hopefully this identity function approach isn't too much of a headache in the future.

function defineFormValidators<
  const TValidators extends FormValidators<TestFormData>,
>(validators: TValidators): TValidators {
  return validators
}

function defineFieldValidators<
  const TValidators extends FieldValidators<TestFormData, 'name', string>,
>(validators: TValidators): TValidators {
  return validators
}

const emptyFormValidators = defineFormValidators([])
const emptyFieldValidators = defineFieldValidators([])

describe('FormErrors', () => {
  it('should infer the error type from the validator', () => {
    const validators = defineFormValidators([
      { run: () => ({ message: 'My error', additional: 0 }), triggers: [] },
    ])

    expectTypeOf<FormErrors<typeof validators, never>>().toEqualTypeOf<
      Array<{ message: string; additional: number }>
    >()

    const strictValidators = defineFormValidators([
      { run: () => ({ message: 'My error' as const }), triggers: [] },
    ])

    expectTypeOf<FormErrors<typeof strictValidators, never>>().toEqualTypeOf<
      Array<{ message: 'My error' }>
    >()
  })

  it('should normalize string errors', () => {
    const validators = defineFormValidators([
      { run: () => 'My error', triggers: [] },
    ])

    expectTypeOf<FormErrors<typeof validators, never>>().toEqualTypeOf<
      Array<ValidationIssue>
    >()
  })

  it('should normalize string array errors', () => {
    const validators = defineFormValidators([
      { run: () => ['First error', 'Second error'], triggers: [] },
    ])

    expectTypeOf<FormErrors<typeof validators, never>>().toEqualTypeOf<
      Array<ValidationIssue>
    >()
  })

  it('should normalize async errors', () => {
    const validators = defineFormValidators([
      // eslint-disable-next-line @typescript-eslint/require-await
      { run: async () => ['First error', 'Second error'], triggers: [] },
    ])

    expectTypeOf<FormErrors<typeof validators, never>>().toEqualTypeOf<
      Array<ValidationIssue>
    >()
  })

  it('should preserve custom error arrays', () => {
    const validators = defineFormValidators([
      { run: () => [{ message: 'My error', code: 123 }], triggers: [] },
    ])

    expectTypeOf<FormErrors<typeof validators, never>>().toEqualTypeOf<
      Array<{ message: string; code: number }>
    >()
  })

  it('should exclude valid validation results', () => {
    const validValidators = defineFormValidators([
      { run: () => null, triggers: [] },
      { run: () => undefined, triggers: [] },
      { run: () => false, triggers: [] },
    ])

    expectTypeOf<FormErrors<typeof validValidators, never>>().toEqualTypeOf<
      Array<never>
    >()

    const mixedValidators = defineFormValidators([
      { run: () => null, triggers: [] },
      {
        run: () => ({ message: 'My error', fromInvalid: true as const }),
        triggers: [],
      },
    ])

    expectTypeOf<FormErrors<typeof mixedValidators, never>>().toEqualTypeOf<
      Array<{ message: string; fromInvalid: true }>
    >()
  })

  it('should support standard schemas', () => {
    const validators = defineFormValidators([
      {
        run: z.object({
          name: z.string(),
        }),
        triggers: [],
      },
    ])

    expectTypeOf<FormErrors<typeof validators, never>>().toEqualTypeOf<
      Array<StandardSchemaV1Issue>
    >()
  })

  it('should combine errors from multiple validators', () => {
    const validators = defineFormValidators([
      { run: () => ({ message: '', fromA: true as const }), triggers: [] },
      { run: () => ({ message: '', fromB: true as const }), triggers: [] },
    ])

    expectTypeOf<FormErrors<typeof validators, never>>().toEqualTypeOf<
      Array<{ message: string; fromA: true } | { message: string; fromB: true }>
    >()
  })

  it('should combine schema and function validator errors', () => {
    const validators = defineFormValidators([
      { run: z.object({ name: z.string() }), triggers: [] },
      {
        run: () => ({ message: '', fromFunction: true as const }),
        triggers: [],
      },
    ])

    expectTypeOf<FormErrors<typeof validators, never>>().toEqualTypeOf<
      Array<StandardSchemaV1Issue | { message: string; fromFunction: true }>
    >()
  })

  it('should extract aggregate errors', () => {
    const stringValidators = defineFormValidators([
      {
        run: () => ({ form: 'Custom', fields: { name: 'Too short' } }),
        triggers: [],
      },
    ])

    expectTypeOf<FormErrors<typeof stringValidators, never>>().toEqualTypeOf<
      Array<ValidationIssue>
    >()

    const customValidators = defineFormValidators([
      {
        run: () => ({
          form: { message: 'Custom', errorCount: 5 },
          fields: { name: 'Too short' },
        }),
        triggers: [],
      },
    ])

    expectTypeOf<FormErrors<typeof customValidators, never>>().toEqualTypeOf<
      Array<{ message: string; errorCount: number }>
    >()
  })

  it('should extract aggregate errors with only field errors', () => {
    const validators = defineFormValidators([
      {
        run: () => ({
          fields: { name: { message: '', fieldOnly: true as const } },
        }),
        triggers: [],
      },
    ])

    expectTypeOf<FormErrors<typeof validators, never>>().toEqualTypeOf<
      Array<never>
    >()
  })

  it('should extract aggregate form errors with an empty field map', () => {
    const validators = defineFormValidators([
      { run: () => ({ form: 'Form error', fields: {} }), triggers: [] },
    ])

    expectTypeOf<FormErrors<typeof validators, never>>().toEqualTypeOf<
      Array<ValidationIssue>
    >()
  })

  it('should infer submit errors', () => {
    type SubmitReturn = OnSubmitError<{
      message: string
      fromSubmit: true
    }>

    expectTypeOf<FormErrors<[], SubmitReturn>>().toEqualTypeOf<
      Array<{ message: string; fromSubmit: true }>
    >()
  })

  it('should infer aggregate submit errors', () => {
    type SubmitReturn = OnSubmitError<{
      form: { message: string; formOnly: true }
      fields: { name: { message: string; fieldOnly: true } }
    }>

    expectTypeOf<FormErrors<[], SubmitReturn>>().toEqualTypeOf<
      Array<{ message: string; formOnly: true }>
    >()
  })

  it('should normalize submit string errors', () => {
    expectTypeOf<FormErrors<[], OnSubmitError<string>>>().toEqualTypeOf<
      Array<ValidationIssue>
    >()

    expectTypeOf<FormErrors<[], OnSubmitError<Array<string>>>>().toEqualTypeOf<
      Array<ValidationIssue>
    >()
  })

  it('should fall back to ValidationIssue if `any` was used', () => {
    expectTypeOf<FormErrors<any, never>>().toEqualTypeOf<
      Array<ValidationIssue>
    >()
  })
})

describe('FieldErrors', () => {
  it('should infer field-level validator errors', () => {
    const fieldValidators = defineFieldValidators([
      { run: () => ({ message: '', fieldOnly: true as const }), triggers: [] },
    ])

    expectTypeOf<
      FieldErrors<typeof emptyFormValidators, typeof fieldValidators, never>
    >().toEqualTypeOf<Array<{ message: string; fieldOnly: true }>>()
  })

  it('should infer field errors from aggregate form validators', () => {
    const formValidators = defineFormValidators([
      {
        run: () => ({
          form: { message: '', formOnly: true },
          fields: { name: { message: '', fieldOnly: true as const } },
        }),
        triggers: [],
      },
    ])

    expectTypeOf<
      FieldErrors<typeof formValidators, typeof emptyFieldValidators, never>
    >().toEqualTypeOf<Array<{ message: string; fieldOnly: true }>>()
  })

  it('should combine form aggregate and field validator errors', () => {
    const formValidators = defineFormValidators([
      {
        run: () => ({
          form: 'Form error',
          fields: { name: { message: '', fromForm: true as const } },
        }),
        triggers: [],
      },
    ])

    const fieldValidators = defineFieldValidators([
      { run: () => ({ message: '', fromField: true as const }), triggers: [] },
    ])

    expectTypeOf<
      FieldErrors<typeof formValidators, typeof fieldValidators, never>
    >().toEqualTypeOf<
      Array<
        | { message: string; fromForm: true }
        | { message: string; fromField: true }
      >
    >()
  })

  it('should normalize string field errors', () => {
    const formValidators = defineFormValidators([
      {
        run: () => ({ form: 'Form error', fields: { name: 'Field error' } }),
        triggers: [],
      },
    ])

    const fieldValidators = defineFieldValidators([
      { run: () => 'Field error', triggers: [] },
    ])

    expectTypeOf<
      FieldErrors<typeof formValidators, typeof fieldValidators, never>
    >().toEqualTypeOf<Array<ValidationIssue>>()
  })

  it('should preserve custom field error arrays', () => {
    const fieldValidators = defineFieldValidators([
      { run: () => [{ message: 'My error', code: 123 }], triggers: [] },
    ])

    expectTypeOf<
      FieldErrors<typeof emptyFormValidators, typeof fieldValidators, never>
    >().toEqualTypeOf<Array<{ message: string; code: number }>>()
  })

  it('should exclude valid validation results', () => {
    const fieldValidators = defineFieldValidators([
      { run: () => null, triggers: [] },
      { run: () => undefined, triggers: [] },
      { run: () => false, triggers: [] },
    ])

    expectTypeOf<
      FieldErrors<typeof emptyFormValidators, typeof fieldValidators, never>
    >().toEqualTypeOf<Array<never>>()

    const mixedFieldValidators = defineFieldValidators([
      { run: () => null, triggers: [] },
      {
        run: () => ({ message: 'My error', fromInvalid: true as const }),
        triggers: [],
      },
    ])

    expectTypeOf<
      FieldErrors<
        typeof emptyFormValidators,
        typeof mixedFieldValidators,
        never
      >
    >().toEqualTypeOf<Array<{ message: string; fromInvalid: true }>>()
  })

  it('should support standard schemas', () => {
    const formSchema = z.object({ name: z.string() })
    const fieldSchema = z.string()

    const formValidators = defineFormValidators([
      { run: formSchema, triggers: [] },
    ])

    const fieldValidators = defineFieldValidators([
      { run: fieldSchema, triggers: [] },
    ])

    expectTypeOf<
      FieldErrors<typeof formValidators, typeof fieldValidators, never>
    >().toEqualTypeOf<Array<StandardSchemaV1Issue>>()
  })

  it('should combine errors from multiple field validators', () => {
    const fieldValidators = defineFieldValidators([
      { run: () => ({ message: '', fromA: true as const }), triggers: [] },
      { run: () => ({ message: '', fromB: true as const }), triggers: [] },
    ])

    expectTypeOf<
      FieldErrors<typeof emptyFormValidators, typeof fieldValidators, never>
    >().toEqualTypeOf<
      Array<{ message: string; fromA: true } | { message: string; fromB: true }>
    >()
  })

  it('should combine schema and function validator errors', () => {
    const fieldValidators = defineFieldValidators([
      { run: z.string(), triggers: [] },
      {
        run: () => ({ message: '', fromFunction: true as const }),
        triggers: [],
      },
    ])

    expectTypeOf<
      FieldErrors<typeof emptyFormValidators, typeof fieldValidators, never>
    >().toEqualTypeOf<
      Array<StandardSchemaV1Issue | { message: string; fromFunction: true }>
    >()
  })

  it('should extract field errors from aggregate form validators with no form error', () => {
    const formValidators = defineFormValidators([
      {
        run: () => ({
          fields: { name: { message: '', fieldOnly: true as const } },
        }),
        triggers: [],
      },
    ])

    expectTypeOf<
      FieldErrors<typeof formValidators, typeof emptyFieldValidators, never>
    >().toEqualTypeOf<Array<{ message: string; fieldOnly: true }>>()
  })

  it('should ignore empty aggregate field maps', () => {
    const formValidators = defineFormValidators([
      { run: () => ({ form: 'Form error', fields: {} }), triggers: [] },
    ])

    expectTypeOf<
      FieldErrors<typeof formValidators, typeof emptyFieldValidators, never>
    >().toEqualTypeOf<Array<never>>()
  })

  it('should infer field errors from submit returns', () => {
    type SubmitReturn = OnSubmitError<{
      form: { message: string; formOnly: true }
      fields: { name: { message: string; fieldOnly: true } }
    }>

    expectTypeOf<
      FieldErrors<
        typeof emptyFormValidators,
        typeof emptyFieldValidators,
        SubmitReturn
      >
    >().toEqualTypeOf<Array<{ message: string; fieldOnly: true }>>()
  })

  it('should normalize submit string field errors', () => {
    expectTypeOf<
      FieldErrors<
        typeof emptyFormValidators,
        typeof emptyFieldValidators,
        OnSubmitError<string>
      >
    >().toEqualTypeOf<Array<ValidationIssue>>()

    expectTypeOf<
      FieldErrors<
        typeof emptyFormValidators,
        typeof emptyFieldValidators,
        OnSubmitError<Array<string>>
      >
    >().toEqualTypeOf<Array<ValidationIssue>>()
  })

  it('should fall back to ValidationIssue if `any` was used', () => {
    expectTypeOf<FieldErrors<any, any, never>>().toEqualTypeOf<
      Array<ValidationIssue>
    >()
  })
})
