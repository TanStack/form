import { assertType } from 'vitest'
import { FormApi } from '../FormApi'
import { FieldApi } from '../FieldApi'

it('should type a subfield properly', () => {
  const form = new FormApi({
    defaultValues: {
      names: {
        first: 'one',
        second: 'two',
      },
    } as const,
  })

  const field = new FieldApi({
    form,
    name: 'names',
  })

  const subfield = field.getSubField('first')

  assertType<'one'>(subfield.getValue())
})

it('should type onChange properly', () => {
  const form = new FormApi({
    defaultValues: {
      name: 'test',
    },
  } as const)

  const field = new FieldApi({
    form,
    name: 'name',
    onChange: (value) => {
      assertType<'test'>(value)

      return undefined
    },
  })
})
