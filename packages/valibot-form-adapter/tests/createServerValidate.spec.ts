import { describe, expect, it } from 'vitest'

import { createServerValidate } from '@tanstack/react-form/nextjs'
import * as v from 'valibot'
import { valibotValidator } from '../src/index'
import { sleep } from './utils'

describe('valibot createServerValidate api', () => {
  it('should run v.string validation', async () => {
    const serverValidate = createServerValidate({
      validatorAdapter: valibotValidator(),
      onServerValidate: v.object({
        name: v.pipe(
          v.string(),
          v.minLength(3, 'You must have a length of at least 3'),
        ),
      }),
    })

    const formData1 = new FormData()
    formData1.append('name', 'a')
    expect(
      await serverValidate(formData1).catch((e) => e.formState.errors),
    ).toEqual(['You must have a length of at least 3'])

    const formData2 = new FormData()
    formData2.append('name', 'asdf')
    expect(await serverValidate(formData2)).toBeUndefined()
  })

  it('should run fn with valibot validation option enabled', async () => {
    const serverValidate = createServerValidate({
      validatorAdapter: valibotValidator(),
      onServerValidate: ({ value }: { value: { name: string } }) =>
        value.name === 'a' ? 'Test' : undefined,
    })

    const formData1 = new FormData()
    formData1.append('name', 'a')
    expect(
      await serverValidate(formData1).catch((e) => e.formState.errors),
    ).toEqual(['Test'])

    const formData2 = new FormData()
    formData2.append('name', 'asdf')
    expect(await serverValidate(formData2)).toBeUndefined()
  })

  it('should run v.string async validation', async () => {
    const serverValidate = createServerValidate({
      validatorAdapter: valibotValidator(),
      onServerValidate: v.objectAsync({
        name: v.pipeAsync(
          v.string(),
          v.checkAsync(async (name) => {
            await sleep(1)
            return name.length > 3
          }, 'Testing 123'),
        ),
      }),
    })

    const formData1 = new FormData()
    formData1.append('name', 'a')
    expect(
      await serverValidate(formData1).catch((e) => e.formState.errors),
    ).toEqual(['Testing 123'])

    const formData2 = new FormData()
    formData2.append('name', 'asdf')
    expect(await serverValidate(formData2)).toBeUndefined()
  })

  it('should run async fn with valibot validation option enabled', async () => {
    const serverValidate = createServerValidate({
      validatorAdapter: valibotValidator(),
      onServerValidate: async ({ value }: { value: { name: string } }) => {
        await sleep(1)
        return value.name === 'a' ? 'Test' : undefined
      },
    })

    const formData1 = new FormData()
    formData1.append('name', 'a')
    expect(
      await serverValidate(formData1).catch((e) => e.formState.errors),
    ).toEqual(['Test'])

    const formData2 = new FormData()
    formData2.append('name', 'asdf')
    expect(await serverValidate(formData2)).toBeUndefined()
  })

  it('should transform errors to display all error message', async () => {
    const serverValidate = createServerValidate({
      validatorAdapter: valibotValidator(),
      onServerValidate: v.object({
        name: v.pipe(
          v.string(),
          v.minLength(3, 'You must have a length of at least 3'),
          v.uuid('UUID'),
        ),
      }),
    })

    const formData1 = new FormData()
    formData1.append('name', 'aa')
    expect(
      await serverValidate(formData1).catch((e) => e.formState.errors),
    ).toEqual(['You must have a length of at least 3, UUID'])

    const formData2 = new FormData()
    formData2.append('name', 'aaa')
    expect(
      await serverValidate(formData2).catch((e) => e.formState.errors),
    ).toEqual(['UUID'])
  })
})
