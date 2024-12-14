import { z } from 'zod'
import { FieldApi, FormApi } from '@tanstack/form-core'
import { assertType, it } from 'vitest'
import { zodValidator } from '../src/index'

it('should allow a Zod validator to be passed in', () => {
  const form = new FormApi({
    defaultValues: {
      name: 'test',
    },
    validatorAdapter: zodValidator(),
  } as const)
})

it('should allow a Zod validator to handle the correct Zod type', () => {
  const form = new FormApi({
    defaultValues: {
      name: 'test',
    },
    validatorAdapter: zodValidator(),
  } as const)

  const field = new FieldApi({
    form,
    name: 'name',
    validators: {
      onChange: z.string(),
    },
  })
})

it('should allow a Zod validator to handle the correct Zod type on async methods', () => {
  const form = new FormApi({
    defaultValues: {
      name: 'test',
    },
    validatorAdapter: zodValidator(),
  } as const)

  const field = new FieldApi({
    form,
    name: 'name',
    validators: {
      onChangeAsync: z.string(),
    },
  })
})

it('should allow functional validators to be passed when using a validator adapter', () => {
  const form = new FormApi({
    defaultValues: {
      name: 'test',
    },
    validatorAdapter: zodValidator(),
    validators: {
      onChange: z.object({
        name: z.string(),
      }),
      onChangeAsync: () => null,
      onBlur: () => null,
    },
  } as const)

  const field = new FieldApi({
    form,
    name: 'name',
    validators: {
      onChange: ({ value }) => {
        assertType<string>(value)
        return undefined
      },
    },
  })
})

it('should not allow a validator onChange to be passed when not using a validator', () => {
  const form = new FormApi({
    defaultValues: {
      name: 'test',
    },
  } as const)

  const field = new FieldApi({
    form,
    name: 'name',
    // @ts-expect-error Requires a validator
    onChange: z.string(),
  })
})

it('should allow not a Zod validator with the wrong Zod type', () => {
  const form = new FormApi({
    defaultValues: {
      name: 'test',
    },
  } as const)

  const field = new FieldApi({
    form,
    name: 'name',
    validatorAdapter: zodValidator(),
    validators: {
      onChange: z.object({}),
    },
  })
})
