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

    field.pushValue('other')

    expect(field.getValue()).toStrictEqual(['one', 'other'])
  })

  it('should insert a value into an array value correctly', () => {
    const form = new FormApi({
      defaultValues: {
        names: ['one', 'two'],
      },
    })

    const field = new FieldApi({
      form,
      name: 'names',
    })

    field.insertValue(1, 'other')

    expect(field.getValue()).toStrictEqual(['one', 'other'])
  })

  it('should remove a value from an array value correctly', () => {
    const form = new FormApi({
      defaultValues: {
        names: ['one', 'two'],
      },
    })

    const field = new FieldApi({
      form,
      name: 'names',
    })

    field.removeValue(1)

    expect(field.getValue()).toStrictEqual(['one'])
  })

  it('should swap a value from an array value correctly', () => {
    const form = new FormApi({
      defaultValues: {
        names: ['one', 'two'],
      },
    })

    const field = new FieldApi({
      form,
      name: 'names',
    })

    field.swapValues(0, 1)

    expect(field.getValue()).toStrictEqual(['two', 'one'])
  })

  it('should get a subfield properly', () => {
    const form = new FormApi({
      defaultValues: {
        names: {
          first: 'one',
          second: 'two',
        },
      },
    })

    const field = new FieldApi({
      form,
      name: 'names',
    })

    const subfield = field.getSubField('first')

    expect(subfield.getValue()).toBe('one')
  })

  it('should run validation onChange', async () => {
    const form = new FormApi({
      defaultValues: {
        name: 'test',
      },
    })

    const field = new FieldApi({
      form,
      name: 'name',
      onChange: (value) => {
        if (value === 'other') {
          return 'Please enter a different value'
        }

        return
      },
    })

    field.mount()

    expect(field.getMeta().error).toBeUndefined()
    field.setValue('other', { touch: true })
    expect(field.getMeta().error).toBe('Please enter a different value')
  })
})
