import { assertType, describe, it } from 'vitest'
import { z } from 'zod'
import { FieldApi, FormApi } from '../src/index'

describe('standard schema validator', () => {
  it('', () => {
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

    assertType<'Testing'>(field.getMeta().errorMap.onChange)
  })
})
