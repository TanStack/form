import { describe, expect, it, vi } from 'vitest'

import { FieldApi, FormApi } from '@tanstack/form-core'
import { type } from 'arktype'
import { arktypeValidator } from '../src/index'
import { sleep } from './utils'

describe('arktype field api', () => {
  it('should run an onChange with z.string validation', () => {
    const form = new FormApi({
      defaultValues: {
        name: '',
      },
    })

    const field = new FieldApi({
      form,
      validatorAdapter: arktypeValidator(),
      name: 'name',
      validators: {
        onChange: type("string > 3"),
      },
    })

    field.mount()

    expect(field.getMeta().errors).toEqual([])
    field.setValue('a')
    expect(field.getMeta().errors).toEqual([
      'You must have a length of at least 3',
    ])
    field.setValue('asdf')
    expect(field.getMeta().errors).toEqual([])
  })

  it('should run an onChange fn with zod validation option enabled', () => {
    const form = new FormApi({
      defaultValues: {
        name: '',
      },
    })

    const field = new FieldApi({
      form,
      validatorAdapter: arktypeValidator(),
      name: 'name',
      validators: {
        onChange: ({ value }) => (value === 'a' ? 'Test' : undefined),
      },
    })

    field.mount()

    expect(field.getMeta().errors).toEqual([])
    field.setValue('a')
    expect(field.getMeta().errors).toEqual(['Test'])
    field.setValue('asdf')
    expect(field.getMeta().errors).toEqual([])
  })

  it('should run an onChangeAsync with z.string validation', async () => {
    vi.useFakeTimers()
    const form = new FormApi({
      defaultValues: {
        name: '',
      },
    })

    const field = new FieldApi({
      form,
      validatorAdapter: arktypeValidator(),
      name: 'name',
      validators: {
        onChangeAsync: z.string().refine(
          async (val) => {
            await sleep(1)
            return val.length > 3
          },
          {
            message: 'Testing 123',
          },
        ),
        onChangeAsyncDebounceMs: 0,
      },
    })

    field.mount()

    expect(field.getMeta().errors).toEqual([])
    field.setValue('a')
    await vi.advanceTimersByTimeAsync(10)
    expect(field.getMeta().errors).toEqual(['Testing 123'])
    field.setValue('asdf')
    await vi.advanceTimersByTimeAsync(10)
    expect(field.getMeta().errors).toEqual([])
  })

  it('should run an onChangeAsyc fn with zod validation option enabled', async () => {
    vi.useFakeTimers()
    const form = new FormApi({
      defaultValues: {
        name: '',
      },
    })

    const field = new FieldApi({
      form,
      validatorAdapter: arktypeValidator(),
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
    field.setValue('a')
    await vi.advanceTimersByTimeAsync(10)
    expect(field.getMeta().errors).toEqual(['Test'])
    field.setValue('asdf')
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
      validatorAdapter: arktypeValidator({
        transformErrors: (errors) => errors[0]?.message,
      }),
      name: 'name',
      validators: {
        onChange: z
          .string()
          .min(3, 'You must have a length of at least 3')
          .uuid('UUID'),
      },
    })

    field.mount()

    expect(field.getMeta().errors).toEqual([])
    field.setValue('aa')
    expect(field.getMeta().errors).toEqual([
      'You must have a length of at least 3',
    ])
    field.setValue('aaa')
    expect(field.getMeta().errors).toEqual(['UUID'])
  })
})
