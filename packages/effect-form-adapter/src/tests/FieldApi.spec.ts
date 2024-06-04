import { describe, expect, it } from 'vitest'

import { FieldApi, FormApi } from '@tanstack/form-core'
import { createValidatorLayer, effectValidator } from '../validator'
import {
  asyncSchema,
  ctxLayer,
  schema,
  schemaWithContext,
  sleep,
} from './utils'

describe('field api', () => {
  it('should run an onChange with Schema.minLength validation', () => {
    const form = new FormApi({
      defaultValues: {
        name: '',
      },
    })

    const field = new FieldApi({
      form,
      validatorAdapter: effectValidator,
      name: 'name',
      validators: {
        onChange: schema,
      },
    })

    field.mount()

    expect(field.getMeta().errors).toEqual([])
    field.setValue('a', { touch: true })
    expect(field.getMeta().errors).toEqual([
      'You must have a length of at least 3',
    ])
    field.setValue('asdf', { touch: true })
    expect(field.getMeta().errors).toEqual([])
  })

  it('should run an onChange fn with validation option enabled', () => {
    const form = new FormApi({
      defaultValues: {
        name: '',
      },
    })

    const field = new FieldApi({
      form,
      validatorAdapter: effectValidator,
      name: 'name',
      validators: {
        onChange: ({ value }) => (value === 'a' ? 'Test' : undefined),
      },
    })

    field.mount()

    expect(field.getMeta().errors).toEqual([])
    field.setValue('a', { touch: true })
    expect(field.getMeta().errors).toEqual(['Test'])
    field.setValue('asdf', { touch: true })
    expect(field.getMeta().errors).toEqual([])
  })

  it('should run an onChangeAsync with validation', async () => {
    const form = new FormApi({
      defaultValues: {
        name: '',
      },
    })

    const field = new FieldApi({
      form,
      validatorAdapter: effectValidator,
      name: 'name',
      validators: {
        onChangeAsync: asyncSchema,
        onChangeAsyncDebounceMs: 0,
      },
    })

    field.mount()

    expect(field.getMeta().errors).toEqual([])
    field.setValue('a', { touch: true })
    await sleep(30)
    expect(field.getMeta().errors).toEqual(['async schema error'])
    field.setValue('asdf', { touch: true })
    await sleep(30)
    expect(field.getMeta().errors).toEqual([])
  })

  it('Effect error message w/ context', async () => {
    const customValidator = createValidatorLayer(ctxLayer)

    const form = new FormApi({
      defaultValues: {
        name: '',
      },
    })

    const field = new FieldApi({
      form,
      validatorAdapter: customValidator,
      name: 'name',
      validators: {
        onChange: schemaWithContext,
      },
    })

    field.mount()

    expect(field.getMeta().errors).toEqual([])
    field.setValue('a', { touch: true })
    await sleep(30)
    expect(field.getMeta().errors).toEqual(['ctx-123'])
  })

  it('should run an onChangeAsyc fn with validation option enabled', async () => {
    const form = new FormApi({
      defaultValues: {
        name: '',
      },
    })

    const field = new FieldApi({
      form,
      validatorAdapter: effectValidator,
      name: 'name',
      validators: {
        onChangeAsync: async ({ value }) =>
          value === 'a' ? 'Test' : undefined,
        onChangeAsyncDebounceMs: 0,
      },
    })

    field.mount()

    expect(field.getMeta().errors).toEqual([])
    field.setValue('a', { touch: true })
    await sleep(10)
    expect(field.getMeta().errors).toEqual(['Test'])
    field.setValue('asdf', { touch: true })
    await sleep(10)
    expect(field.getMeta().errors).toEqual([])
  })
})
