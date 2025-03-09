import { assertType, describe, it } from 'vitest'
import { z } from 'zod'
import { FieldApi, FormApi } from '../src/index'
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
})
