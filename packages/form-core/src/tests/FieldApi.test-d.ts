import { assertType } from 'vitest'
import { FormApi } from '../FormApi'
import { FieldApi } from '../FieldApi'
import { zodValidator } from '../zod-validator'
import z from 'zod'

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

it('should allow a Zod validator to be passed in', () => {
  const form = new FormApi({
    defaultValues: {
      name: 'test',
    },
  } as const)

  const field = new FieldApi({
    form,
    name: 'name',
    validator: zodValidator,
  } as const)
})

it('should allow a Zod validator to handle the correct Zod type', () => {
  const form = new FormApi({
    defaultValues: {
      name: 'test',
    },
  })

  const field = new FieldApi({
    form,
    name: 'name',
    validator: zodValidator,
    onChange: z.string(),
  } as const)
})

it('should not allow a functional onChange to be passed when using a validator', () => {
  const form = new FormApi({
    defaultValues: {
      name: 'test',
    },
  })

  const field = new FieldApi({
    form,
    name: 'name',
    validator: zodValidator,
    onChange: (val) => null,
  } as const)
})

it('should not allow a validator onChange to be passed when not using a validator', () => {
  const form = new FormApi({
    defaultValues: {
      name: 'test',
    },
  })

  const field = new FieldApi({
    form,
    name: 'name',
    onChange: z.string(),
  } as const)
})

// This is not possible without higher-kinded types AFAIK
it.skip('should allow not a Zod validator with the wrong Zod type', () => {
  const form = new FormApi({
    defaultValues: {
      name: 'test',
    },
  })

  const field = new FieldApi({
    form,
    name: 'name',
    validator: zodValidator,
    onChange: z.object({}),
  } as const)
})
