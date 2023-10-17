import { expect } from 'vitest'

import { FormApi, FieldApi } from '@tanstack/form-core'
import { yupValidator } from '../validator'
import yup from 'yup'

describe('yup field api', () => {
  it('should run an onChange with yup.string validation', () => {
    const form = new FormApi({
      defaultValues: {
        name: '',
      },
    })

    const field = new FieldApi({
      form,
      validator: yupValidator,
      name: 'name',
      onChange: yup.string().min(3, 'You must have a length of at least 3'),
    })

    field.mount()

    expect(field.getMeta().errors).toEqual([])
    field.setValue('a', { touch: true })
    expect(field.getMeta().errors).toEqual([
      'You must have a length of at least 3',
    ])
    field.setValue('asdf', { touch: true })
    expect(field.getMeta().errors).toEqual([])
  })

  it('should run an onChange fn with yup validation option enabled', () => {
    const form = new FormApi({
      defaultValues: {
        name: '',
      },
    })

    const field = new FieldApi({
      form,
      validator: yupValidator,
      name: 'name',
      onChange: (val) => (val === 'a' ? 'Test' : undefined),
    })

    field.mount()

    expect(field.getMeta().errors).toEqual([])
    field.setValue('a', { touch: true })
    expect(field.getMeta().errors).toEqual(['Test'])
    field.setValue('asdf', { touch: true })
    expect(field.getMeta().errors).toEqual([])
  })
})
