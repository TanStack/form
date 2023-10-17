import { expect } from 'vitest'

import { FormApi, FieldApi } from '@tanstack/form-core'
import { zodValidator } from '../validator'
import { z } from 'zod'

describe('zod field api', () => {
  it('should run an onChange with z.string validation', () => {
    const form = new FormApi({
      defaultValues: {
        name: '',
      },
    })

    const field = new FieldApi({
      form,
      validator: zodValidator,
      name: 'name',
      onChange: z.string().min(3, 'You must have a length of at least 3'),
    })

    field.mount();

    expect(field.getMeta().errors).toEqual([])
    debugger
    field.setValue('a', { touch: true })
    expect(field.getMeta().errors).toEqual(['You must have a length of at least 3'])
    field.setValue('asdf', { touch: true })
    expect(field.getMeta().errors).toEqual([])
  })
})
