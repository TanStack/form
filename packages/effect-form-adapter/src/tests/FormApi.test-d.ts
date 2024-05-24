import * as Schema from '@effect/schema/Schema'
import { FieldApi, FormApi } from '@tanstack/form-core'
import { assertType, it } from 'vitest'
import { effectValidator } from '../validator'

it('should allow a Effect validator to be passed in', () => {
  const form = new FormApi({
    defaultValues: {
      name: 'test',
    },
    validatorAdapter: effectValidator,
  } as const)
})

it('should allow a Effect validator to handle the correct Schema type', () => {
  const form = new FormApi({
    defaultValues: {
      name: 'test',
    },
    validatorAdapter: effectValidator,
  } as const)

  const field = new FieldApi({
    form,
    name: 'name',
    validators: {
      onChange: Schema.String,
    },
  })
})

it('should allow a Effect validator to handle the correct Schema type on async methods', () => {
  const form = new FormApi({
    defaultValues: {
      name: 'test',
    },
    validatorAdapter: effectValidator,
  } as const)

  const field = new FieldApi({
    form,
    name: 'name',
    validators: {
      onChangeAsync: Schema.String,
    },
  })
})

it('should allow a functional onChange to be passed when using a validator', () => {
  const form = new FormApi({
    defaultValues: {
      name: 'test',
    },
    validatorAdapter: effectValidator,
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
    onChange: Schema.String,
  })
})
