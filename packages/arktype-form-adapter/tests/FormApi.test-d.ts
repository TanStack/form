import { FieldApi, FormApi } from '@tanstack/form-core'
import { assertType, it } from 'vitest'
import { type } from 'arktype'
import { arktypeValidator } from '../src/index'

it('should allow a Zod validator to be passed in', () => {
  const form = new FormApi({
    defaultValues: {
      name: 'test',
    },
    validatorAdapter: arktypeValidator(),
  } as const)
})

it('should allow a Zod validator to handle the correct Zod type', () => {
  const form = new FormApi({
    defaultValues: {
      name: 'test',
    },
    validatorAdapter: arktypeValidator(),
  } as const)

  const field = new FieldApi({
    form,
    name: 'name',
    validators: {
      onChange: type("string"),
    },
  })
})

it('should allow a Zod validator to handle the correct Zod type on async methods', () => {
  const form = new FormApi({
    defaultValues: {
      name: 'test',
    },
    validatorAdapter: arktypeValidator(),
  } as const)

  const field = new FieldApi({
    form,
    name: 'name',
    validators: {
      onChangeAsync: type("string"),
    },
  })
})

it('should allow a functional onChange to be passed when using a validator', () => {
  const form = new FormApi({
    defaultValues: {
      name: 'test',
    },
    validatorAdapter: arktypeValidator(),
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
    onChange: type("string"),
  })
})

// This is not possible without higher-kinded types AFAIK
it.skip('should allow not a Zod validator with the wrong Zod type', () => {
  const form = new FormApi({
    defaultValues: {
      name: 'test',
    },
  } as const)

  const field = new FieldApi({
    form,
    name: 'name',
    validatorAdapter: arktypeValidator(),
    validators: {
      onChange: type("object"),
    },
  })
})
