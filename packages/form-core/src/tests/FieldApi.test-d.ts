import { assertType } from 'vitest'
import { FormApi } from '../FormApi'
import { FieldApi } from '../FieldApi'

it('should type value properly', () => {
  const form = new FormApi({
    defaultValues: {
      name: 'test',
    },
  } as const)

  const field = new FieldApi({
    form,
    name: 'name',
  })

  assertType<'test'>(field.state.value)
  assertType<'name'>(field.options.name)
  assertType<'test'>(field.getValue())
})

it('should type nested value properly', () => {
  const form = new FormApi({
    defaultValues: {
      name: {
        nested: 'test',
      },
    },
  } as const)

  const field = new FieldApi({
    form,
    name: 'name.nested',
  })

  assertType<'test'>(field.state.value)
  assertType<'name.nested'>(field.options.name)
  assertType<'test'>(field.getValue())
})

it('should type properties with dot properly', () => {
  const form = new FormApi({
    defaultValues: {
      'name.withdot': 'test',
    },
  } as const)

  const field = new FieldApi({
    form,
    name: 'name.withdot',
  })

  assertType<'test'>(field.state.value)
  assertType<'name.withdot'>(field.options.name)
  assertType<'test'>(field.getValue())
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
    validators: {
      onChange: ({ value }) => {
        assertType<'test'>(value)

        return undefined
      },
    },
  })
})

it('should type onChangeAsync properly', () => {
  const form = new FormApi({
    defaultValues: {
      'name': 'test',
    },
  } as const)

  const field = new FieldApi({
    form,
    name: 'name',
    validators: {
      onChangeAsync: async ({ value }) => {
        assertType<'test'>(value)

        return undefined
      },
    },
  })
})
