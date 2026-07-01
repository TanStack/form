import { beforeEach, describe, expect, it, vi } from 'vitest'
import { parse } from 'devalue'
import { formOptions, initialServerFormState } from '@tanstack/form-core'
import { getFormData, start } from '../src'

const startMocks = vi.hoisted(() => ({
  calls: [] as Array<string>,
  cookies: new Map<string, string>(),
}))

vi.mock('@tanstack/react-start/server', () => ({
  deleteCookie: (name: string) => {
    startMocks.calls.push(`delete:${name}`)
    startMocks.cookies.delete(name)
  },
  getCookie: (name: string) => startMocks.cookies.get(name),
  setCookie: (name: string, value: string) => {
    startMocks.calls.push(`set:${name}`)
    startMocks.cookies.set(name, value)
  },
}))

vi.mock('@tanstack/react-start', () => ({
  createServerFn: () => ({
    handler: <THandler extends (...args: Array<any>) => any>(
      handler: THandler,
    ) => handler,
  }),
}))

const internalsCookieName = '_tanstack_form_internals'

function createFormData(values: Record<string, string>): FormData {
  const formData = new FormData()
  for (const [key, value] of Object.entries(values)) {
    formData.set(key, value)
  }
  return formData
}

const formOpts = formOptions({
  defaultValues: { name: '' },
  validators: [
    {
      triggers: ['server'],
      run: ({ value, createErrorMap }) => {
        const errors = createErrorMap()

        if (!value.name.trim()) {
          errors.fields.name = 'Name is required'
        }

        return errors.toResult()
      },
    },
  ],
})

describe('start server validation persistence', () => {
  beforeEach(() => {
    startMocks.calls.length = 0
    startMocks.cookies.clear()
  })

  it('writes invalid server state to the internal cookie', async () => {
    const validate = start().createServerValidate(formOpts)

    const result = await validate({
      formData: createFormData({ name: '' }),
    })

    expect(result.success).toBe(false)
    const cookie = startMocks.cookies.get(internalsCookieName)
    expect(cookie).toBeDefined()
    expect(parse(cookie!)).toMatchObject({
      values: { name: '' },
      submissionAttempts: 1,
      validationResults: [
        {
          validatorIndex: 0,
          result: {
            fields: {
              name: 'Name is required',
            },
          },
        },
      ],
    })
  })

  it('reads and deletes the internal cookie from getFormData', async () => {
    const validate = start().createServerValidate(formOpts)
    await validate({
      formData: createFormData({ name: '' }),
    })

    const serverState = await getFormData()

    expect(serverState).toMatchObject({
      values: { name: '' },
      submissionAttempts: 1,
    })
    expect(startMocks.cookies.has(internalsCookieName)).toBe(false)
    expect(startMocks.calls).toContain(`delete:${internalsCookieName}`)
  })

  it('returns initial server state when no internal cookie exists', async () => {
    await expect(getFormData()).resolves.toEqual(initialServerFormState)
  })

  it('infers number form data info from default values', async () => {
    const validate = start().createServerValidate(
      formOptions({
        defaultValues: { age: 0 },
      }),
    )

    const result = await validate({
      formData: createFormData({ age: '42' }),
    })

    expect(result).toMatchObject({
      success: true,
      values: { age: 42 },
    })
  })

  it('uses explicit form-level info when inference is disabled', async () => {
    const validate = start().createServerValidate(
      formOptions({
        defaultValues: { age: 0 },
      }),
      {
        inferFormDataInfo: false,
        info: {
          numbers: ['age'],
        },
      },
    )

    const result = await validate({
      formData: createFormData({ age: '42' }),
    })

    expect(result).toMatchObject({
      success: true,
      values: { age: 42 },
    })
  })

  it('merges invocation info after form-level info', async () => {
    const validate = start().createServerValidate(
      formOptions({
        defaultValues: { age: 0, score: 0 },
      }),
      {
        inferFormDataInfo: false,
        info: {
          numbers: ['age'],
        },
      },
    )

    const result = await validate({
      formData: createFormData({ age: '42', score: '7' }),
      info: {
        numbers: ['score'],
      },
    })

    expect(result).toMatchObject({
      success: true,
      values: { age: 42, score: 7 },
    })
  })

  it('can opt out of default value form data inference', async () => {
    const validate = start().createServerValidate(
      formOptions({
        defaultValues: { age: 0 },
      }),
      {
        inferFormDataInfo: false,
      },
    )

    const result = await validate({
      formData: createFormData({ age: '42' }),
    })

    expect(result).toMatchObject({
      success: true,
      values: { age: '42' },
    })
  })

  it('runs onInvalid after persisting invalid server state', async () => {
    const validate = start({
      onInvalid: ({ serverState }) => {
        expect(startMocks.cookies.has(internalsCookieName)).toBe(true)
        startMocks.calls.push('onInvalid')
        return {
          handled: true,
          values: serverState.values,
        } as const
      },
    }).createServerValidate(formOpts)

    const result = await validate({
      formData: createFormData({ name: '' }),
    })

    expect(result).toEqual({
      handled: true,
      values: { name: '' },
    })
    expect(startMocks.calls).toEqual([
      `set:${internalsCookieName}`,
      'onInvalid',
    ])
  })
})
