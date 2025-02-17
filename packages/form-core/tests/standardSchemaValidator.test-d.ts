import { assertType, describe, it } from 'vitest'
import { z } from 'zod'
import { FieldApi, FormApi } from '../src/index'
import type { StandardSchemaV1Issue } from '../src/index'

describe('standard schema validator', () => {
  it("Should add field's onChange erorrMap from the form", () => {
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
})
