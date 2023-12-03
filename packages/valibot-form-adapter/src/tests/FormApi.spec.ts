import { expect } from 'vitest'

import { FieldApi, FormApi } from '@tanstack/form-core'
import { minLength, string } from 'valibot'
import { valibotValidator } from '../validator'

describe('valibot form api', () => {
  it('should run an onChange with string validation', () => {
    const form = new FormApi({
      defaultValues: {
        name: '',
      },
      validatorAdapter: valibotValidator,
    })

    const field = new FieldApi({
      form,
      name: 'name',
      validators: {
        onChange: string([
          minLength(3, 'You must have a length of at least 3'),
        ]),
      },
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

  it('should run an onChange fn with valibot validation option enabled', () => {
    const form = new FormApi({
      defaultValues: {
        name: '',
      },
      validatorAdapter: valibotValidator,
    })

    const field = new FieldApi({
      form,
      name: 'name',
      validators: {
        onChange: (val) => (val === 'a' ? 'Test' : undefined),
      },
    })

    field.mount()

    expect(field.getMeta().errors).toEqual([])
    field.setValue('a', { touch: true })
    expect(field.getMeta().errors).toEqual(['Test'])
    field.setValue('asdf', { touch: true })
    expect(field.getMeta().errors).toEqual([])
  })
})
