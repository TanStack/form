import { describe, expectTypeOf, it } from 'vitest'
import { z } from 'zod'
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

  it('Should return different Standard Schema Issue types from validateAsync based on scope', () => {
    const formSourceError = standardSchemaValidators.validateAsync(
      { value: '', validationSource: 'form' },
      z.string(),
    )
    const fieldSourceError = standardSchemaValidators.validateAsync(
      { value: '', validationSource: 'field' },
      z.string(),
    )

    expectTypeOf<Promise<FormLevelStandardSchemaIssue | undefined>>(
      formSourceError,
    )
    expectTypeOf(fieldSourceError).toEqualTypeOf<
      Promise<StandardSchemaV1Issue[] | undefined>
    >()
  })
})
