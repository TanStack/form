import { z } from 'zod'
import { zodValidator } from '../validator'
import { FieldApi, FormApi } from '@tanstack/form-core'
import { assertType } from 'vitest'

it('should allow a Zod validator to be passed in', () => {
  const form = new FormApi({
    defaultValues: {
      name: 'test',
    },
    validatorAdapter: zodValidator,
  } as const)
})

it('should allow a Zod validator to handle the correct Zod type', () => {
  const form = new FormApi({
    defaultValues: {
      name: 'test',
    },
    validatorAdapter: zodValidator,
  })

  const field = new FieldApi({
    form,
    name: 'name',
    validators: {
      onChange: z.string(),
    },
  } as const)
})

it('should allow a Zod validator to handle the correct Zod type on async methods', () => {
  const form = new FormApi({
    defaultValues: {
      name: 'test',
    },
    validatorAdapter: zodValidator,
  })

  const field = new FieldApi({
    form,
    name: 'name',
    validators: {
      onChangeAsync: z.string(),
    },
  } as const)
})

it('should allow a functional onChange to be passed when using a validator', () => {
  const form = new FormApi({
    defaultValues: {
      name: 'test',
    },
    validatorAdapter: zodValidator,
  })

  const field = new FieldApi({
    form,
    name: 'name',
    validators: {
      onChange: (val) => {
        assertType<'test'>(val)
        return undefined
      },
    },
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
    validatorAdapter: zodValidator,
    validators: {
      onChange: z.object({}),
    },
  } as const)
})
