import { assertType, describe, it } from 'vitest'
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

    assertType<undefined | StandardSchemaV1Issue[]>(
      field.getMeta().errorMap.onChange,
    )
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

    assertType<undefined | StandardSchemaV1Issue[]>(
      field.getMeta().errorMap.onChange,
    )
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

    assertType<FormLevelStandardSchemaIssue | undefined>(formSourceError)
    assertType<StandardSchemaV1Issue[] | undefined>(fieldSourceError)
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

    assertType<Promise<FormLevelStandardSchemaIssue | undefined>>(
      formSourceError,
    )
    assertType<Promise<StandardSchemaV1Issue[] | undefined>>(fieldSourceError)
  })
})
