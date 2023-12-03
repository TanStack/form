import { expect } from 'vitest'

import { FormApi, FieldApi } from '@tanstack/form-core'
import { valibotValidator } from '../validator'
import { customAsync, minLength, string, stringAsync } from 'valibot'
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
      validator: valibotValidator,
      name: 'name',
      validators: {
        onChange: string([
          minLength(3, 'You must have a length of at least 3'),
        ]),
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
      validator: valibotValidator,
      name: 'name',
      validators: {
        onChange: (val) => (val === 'a' ? 'Test' : undefined),
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
    const form = new FormApi({
      defaultValues: {
        name: '',
      },
    })

    const field = new FieldApi({
      form,
      validator: valibotValidator,
      name: 'name',
      validators: {
        onChangeAsync: stringAsync([
          customAsync(async (val) => val.length > 3, 'Testing 123'),
        ]),
        onChangeAsyncDebounceMs: 0,
      },
    })

    field.mount()

    expect(field.getMeta().errors).toEqual([])
    field.setValue('a', { touch: true })
    await sleep(10)
    expect(field.getMeta().errors).toEqual(['Testing 123'])
    field.setValue('asdf', { touch: true })
    await sleep(10)
    expect(field.getMeta().errors).toEqual([])
  })

  it('should run an onChangeAsyc fn with valibot validation option enabled', async () => {
    const form = new FormApi({
      defaultValues: {
        name: '',
      },
    })

    const field = new FieldApi({
      form,
      validator: valibotValidator,
      name: 'name',
      validators: {
        onChangeAsync: async (val) => (val === 'a' ? 'Test' : undefined),
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
