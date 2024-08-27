import { describe, expect, it } from 'vitest'

import { createServerValidate } from '@tanstack/react-form/nextjs'
import yup from 'yup'
import { yupValidator } from '../src/index'
import { sleep } from './utils'

describe('yup createServerValidate api', () => {
  it('should run yup.string validation', async () => {
    const serverValidate = createServerValidate({
      validatorAdapter: yupValidator(),
      onServerValidate: yup.object({
        name: yup.string().min(3, 'You must have a length of at least 3'),
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

  it('should run fn with yup validation option enabled', async () => {
    const serverValidate = createServerValidate({
      validatorAdapter: yupValidator(),
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

  it('should run yup.string async validation', async () => {
    const serverValidate = createServerValidate({
      validatorAdapter: yupValidator(),
      onServerValidate: yup.object({
        name: yup.string().test('Testing 123', 'Testing 123', async (val) => {
          await sleep(1)
          return typeof val === 'string' ? val.length > 3 : false
        }),
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

  it('should run async fn with yup validation option enabled', async () => {
    const serverValidate = createServerValidate({
      validatorAdapter: yupValidator(),
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
      validatorAdapter: yupValidator(),
      onServerValidate: yup.object({
        name: yup
          .string()
          .min(3, 'You must have a length of at least 3')
          .uuid('UUID'),
      }),
    })

    const formData1 = new FormData()
    formData1.append('name', 'aa')
    expect(
      await serverValidate(formData1).catch((e) => e.formState.errors),
    ).toEqual(['You must have a length of at least 3'])

    const formData2 = new FormData()
    formData2.append('name', 'aaa')
    expect(
      await serverValidate(formData2).catch((e) => e.formState.errors),
    ).toEqual(['UUID'])
  })
})
