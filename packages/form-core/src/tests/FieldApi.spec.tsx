import { expect } from 'vitest'

import { FormApi } from '../FormApi'
import { FieldApi } from '../FieldApi'

describe('field api', () => {
  it('should have an initial value', () => {
    const form = new FormApi({
      defaultValues: {
        name: 'test',
      },
    })

    const field = new FieldApi({
      form,
      name: 'name',
    })

    expect(field.getValue()).toBe('test')
  })

  it('should set a value correctly', () => {
    const form = new FormApi({
      defaultValues: {
        name: 'test',
      },
    })

    const field = new FieldApi({
      form,
      name: 'name',
    })

    field.setValue('other')

    expect(field.getValue()).toBe('other')
  })

  it('should set a value correctly', () => {
    const form = new FormApi({
      defaultValues: {
        name: 'test',
      },
    })

    const field = new FieldApi({
      form,
      name: 'name',
    })

    field.setValue('other')

    expect(field.getValue()).toBe('other')
  })

  it('should push an array value correctly', () => {
    const form = new FormApi({
      defaultValues: {
        names: ['one'],
      },
    })

    const field = new FieldApi({
      form,
      name: 'names',
    })

    field.pushValue('two')

    expect(field.getValue()).toBe('other')
  })
})
