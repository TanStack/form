import { describe, expect, it, vi } from 'vitest'
import { FieldApi, FormApi } from '@tanstack/form-core'
import * as v from 'valibot'
import { valibotValidator } from '../src/index'
import { sleep } from './utils'

describe('valibot field api', () => {
  it('should run an onChange with string validation', () => {
    const form = new FormApi({
      defaultValues: {
        name: '',
      },
    })

    const field = new FieldApi({
      form,
      validatorAdapter: valibotValidator(),
      name: 'name',
      validators: {
        onChange: v.pipe(
          v.string(),
          v.minLength(3, 'You must have a length of at least 3'),
        ),
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

  it('should run an onChange fn with valibot validation option enabled', () => {
    const form = new FormApi({
      defaultValues: {
        name: '',
      },
    })

    const field = new FieldApi({
      form,
      validatorAdapter: valibotValidator(),
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

  it('should run an onChangeAsync with string validation', async () => {
    vi.useFakeTimers()
    const form = new FormApi({
      defaultValues: {
        name: '',
      },
    })

    const field = new FieldApi({
      form,
      validatorAdapter: valibotValidator(),
      name: 'name',
      validators: {
        onChangeAsync: v.pipeAsync(
          v.string(),
          v.checkAsync(async (val) => {
            await sleep(1)
            return val.length > 3
          }, 'Testing 123'),
        ),
        onChangeAsyncDebounceMs: 0,
      },
    })

    field.mount()

    expect(field.getMeta().errors).toEqual([])
    field.setValue('a', { touch: true })
    await vi.advanceTimersByTimeAsync(10)
    expect(field.getMeta().errors).toEqual(['Testing 123'])
    field.setValue('asdf', { touch: true })
    await vi.advanceTimersByTimeAsync(10)
    expect(field.getMeta().errors).toEqual([])
  })

  it('should run an onChangeAsyc fn with valibot validation option enabled', async () => {
    vi.useFakeTimers()
    const form = new FormApi({
      defaultValues: {
        name: '',
      },
    })

    const field = new FieldApi({
      form,
      validatorAdapter: valibotValidator(),
      name: 'name',
      validators: {
        onChangeAsync: async ({ value }) => {
          await sleep(1)
          return value === 'a' ? 'Test' : undefined
        },
        onChangeAsyncDebounceMs: 0,
      },
    })

    field.mount()

    expect(field.getMeta().errors).toEqual([])
    field.setValue('a', { touch: true })
    await vi.advanceTimersByTimeAsync(10)
    expect(field.getMeta().errors).toEqual(['Test'])
    field.setValue('asdf', { touch: true })
    await vi.advanceTimersByTimeAsync(10)
    expect(field.getMeta().errors).toEqual([])
  })

  it('should transform errors to display only the first error message', () => {
    const form = new FormApi({
      defaultValues: {
        name: '',
      },
    })

    const field = new FieldApi({
      form,
      validatorAdapter: valibotValidator({
        transformErrors: (errors) => errors[0]?.message,
      }),
      name: 'name',
      validators: {
        onChange: v.pipe(
          v.string(),
          v.minLength(3, 'You must have a length of at least 3'),
          v.uuid('UUID'),
        ),
      },
    })

    field.mount()

    expect(field.getMeta().errors).toEqual([])
    field.setValue('aa', { touch: true })
    expect(field.getMeta().errors).toEqual([
      'You must have a length of at least 3',
    ])
    field.setValue('aaa', { touch: true })
    expect(field.getMeta().errors).toEqual(['UUID'])
  })
})
