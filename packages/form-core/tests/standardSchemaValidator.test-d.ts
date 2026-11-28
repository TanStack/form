import { describe, expectTypeOf, it } from 'vitest'
import { z } from 'zod'
import { type } from 'arktype'
import { FieldApi, FormApi, standardSchemaValidators } from '../src/index'
import type { StandardSchemaV1Issue } from '../src/index'

describe('standard schema validator', () => {
  it("Should add field's onChange errorMap from the form", () => {
    const form = new FormApi({
      defaultValues: {
        firstName: '',
      },
      validators: {
        onChange: z.object({
          firstName: z.string().min(1, 'Testing'),
        }),
      },
    })

    form.state.errorMap.onChange

    const field = new FieldApi({
      form,
      name: 'firstName',
    })

    expectTypeOf(field.getMeta().errorMap.onChange).toEqualTypeOf<
      undefined | StandardSchemaV1Issue[]
    >()
  })

  it("Should add sub-field's onChange errorMap from the form", () => {
    const schema = z.object({
      person: z.object({
        firstName: z.string().min(1, 'Testing'),
      }),
    })
    const form = new FormApi({
      defaultValues: {
        person: {
          firstName: '',
        },
      },
      validators: {
        onChange: schema,
      },
    })

    form.state.errorMap.onChange

    const field = new FieldApi({
      form,
      name: 'person.firstName',
    })

    expectTypeOf(field.getMeta().errorMap.onChange).toEqualTypeOf<
      undefined | StandardSchemaV1Issue[]
    >()
  })

  type FormLevelStandardSchemaIssue = {
    form: Record<string, StandardSchemaV1Issue[]>
    fields: Record<string, StandardSchemaV1Issue[]>
  }

  it('Should return different Standard Schema Issue types from validate based on scope', () => {
    const formSourceError = standardSchemaValidators.validate(
      { value: '', validationSource: 'form' },
      z.string(),
    )
    const fieldSourceError = standardSchemaValidators.validate(
      { value: '', validationSource: 'field' },
      z.string(),
    )

    expectTypeOf(formSourceError).toEqualTypeOf<
      FormLevelStandardSchemaIssue | undefined
    >()
    expectTypeOf(fieldSourceError).toEqualTypeOf<
      StandardSchemaV1Issue[] | undefined
    >()
  })

  it('Should infer StandardSchemaV1Issue[] for arktype field validators (issue #2221)', () => {
    const schema = type({ firstName: 'string>0' })
    const form = new FormApi({
      defaultValues: {
        firstName: '',
      },
    })

    const field = new FieldApi({
      form,
      name: 'firstName',
      validators: {
        onChange: type('string>0'),
      },
    })

    expectTypeOf(field.getMeta().errorMap.onChange).toEqualTypeOf<
      undefined | StandardSchemaV1Issue[]
    >()
  })

  it('Should return different Standard Schema Issue types from validateAsync based on scope', () => {
    const formSourceError = standardSchemaValidators.validateAsync(
      { value: '', validationSource: 'form' },
      z.string(),
    )
    const fieldSourceError = standardSchemaValidators.validateAsync(
      { value: '', validationSource: 'field' },
      z.string(),
    )

    expectTypeOf(formSourceError).toEqualTypeOf<
      Promise<FormLevelStandardSchemaIssue | undefined>
    >()
    expectTypeOf(fieldSourceError).toEqualTypeOf<
      Promise<StandardSchemaV1Issue[] | undefined>
    >()
  })

  it("Should not add `undefined` to the field's error array when only a form-level schema is present", () => {
    const form = new FormApi({
      defaultValues: {
        firstName: '',
      },
      validators: {
        onChange: z.object({
          firstName: z.string().min(1, 'Testing'),
        }),
      },
    })

    const field = new FieldApi({
      form,
      name: 'firstName',
    })

    // The unused validator slots must not leak `undefined` into the element
    // union; the errors array is filtered before it reaches field meta.
    expectTypeOf(field.getMeta().errors).toEqualTypeOf<
      Array<StandardSchemaV1Issue>
    >()

    // Consequently the issues are iterable without a guard or a cast.
    expectTypeOf(
      field.getMeta().errors.map((issue) => issue.message),
    ).toEqualTypeOf<Array<string>>()
  })

  it("Should keep `undefined` out of the error array while preserving a field validator's own return type", () => {
    const form = new FormApi({
      defaultValues: {
        firstName: '',
      },
      validators: {
        onDynamic: z.object({
          firstName: z.string().min(1, 'Testing'),
        }),
      },
    })

    const field = new FieldApi({
      form,
      name: 'firstName',
      validators: {
        onDynamic: ({ value }) => (value ? undefined : ('Required' as const)),
      },
    })

    expectTypeOf(field.getMeta().errors).toEqualTypeOf<
      Array<StandardSchemaV1Issue | 'Required'>
    >()
  })
})
