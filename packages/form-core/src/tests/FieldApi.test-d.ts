import { assertType } from 'vitest'
import { FormApi } from '../FormApi'
import { FieldApi } from '../FieldApi'
import { zodValidator } from '../zod-validator'
import z from 'zod'

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
    // @ts-expect-error Is not of type validator
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
    // @ts-expect-error Requires a validator
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
