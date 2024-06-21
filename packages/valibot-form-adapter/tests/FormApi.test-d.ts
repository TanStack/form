import { assertType, it } from 'vitest'
import * as v from 'valibot'
import { FieldApi, FormApi } from '@tanstack/form-core'
import { valibotValidator } from '../src/index'

it('should allow a Valibot validator to be passed in', () => {
  const form = new FormApi({
    defaultValues: {
      name: 'test',
    },
    validatorAdapter: valibotValidator(),
  } as const)
})

it('should allow a Valibot validator to handle the correct Valibot type', () => {
  const form = new FormApi({
    defaultValues: {
      name: 'test',
    },
    validatorAdapter: valibotValidator(),
  } as const)

  const field = new FieldApi({
    form,
    name: 'name',
    validators: {
      onChange: v.string(),
    },
  })
})

it('should allow a Valibot validator to handle the correct Valibot type on async methods', () => {
  const form = new FormApi({
    defaultValues: {
      name: 'test',
    },
    validatorAdapter: valibotValidator(),
  } as const)

  const field = new FieldApi({
    form,
    name: 'name',
    validators: {
      onChangeAsync: v.string(),
    },
  })
})

it('should allow a functional onChange to be passed when using a validator', () => {
  const form = new FormApi({
    defaultValues: {
      name: 'test',
    },
    validatorAdapter: valibotValidator(),
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
    onChange: string(),
  })
})

// This is not possible without higher-kinded types AFAIK
it.skip('should allow not a Valibot validator with the wrong Valibot type', () => {
  const form = new FormApi({
    defaultValues: {
      name: 'test',
    },
  } as const)

  const field = new FieldApi({
    form,
    name: 'name',
    validatorAdapter: valibotValidator(),
    validators: {
      onChange: v.object({}),
    },
  })
})
