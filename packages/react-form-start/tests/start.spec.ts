import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createServerValidateHelper, formOptions } from '@tanstack/form-core'
import { start } from '../src'

const startMocks = vi.hoisted(() => ({
  cookies: new Map<string, string>(),
}))

vi.mock('@tanstack/react-start/server', () => ({
  deleteCookie: (name: string) => {
    startMocks.cookies.delete(name)
  },
  getCookie: (name: string) => startMocks.cookies.get(name),
  setCookie: (name: string, value: string) => {
    startMocks.cookies.set(name, value)
  },
}))

vi.mock('@tanstack/react-start', () => ({
  createServerFn: () => ({
    validator: <TInput, TOutput>(validator: (input: TInput) => TOutput) => ({
      handler:
        <TResult>(handler: (context: { data: TOutput }) => TResult) =>
        ({ data }: { data: TInput }) =>
          handler({ data: validator(data) }),
    }),
  }),
}))

const formOpts = formOptions({
  defaultValues: { name: '' },
  validators: [
    {
      triggers: ['server'],
      run: ({ value, createErrorMap }) => {
        const errors = createErrorMap()

        if (!value.name.trim()) {
          errors.fields.name = ['Name is required']
        }

        return errors
      },
    },
  ],
})

describe('Start plugin persistence', () => {
  beforeEach(() => {
    startMocks.cookies.clear()
  })

  it('isolates persisted server state by form ID', async () => {
    const persistence = start().transportMiddleware!
    const profileState = {
      values: { name: 'Ada' },
      validationResults: [],
      submissionAttempts: 1,
    }
    const billingState = {
      values: { postalCode: '8000' },
      validationResults: [],
      submissionAttempts: 2,
    }

    await persistence.setState('profile', profileState)
    await persistence.setState('billing', billingState)

    await expect(persistence.readState('profile')).resolves.toEqual(
      profileState,
    )
    await expect(persistence.readState('profile')).resolves.toBeUndefined()
    await expect(persistence.readState('billing')).resolves.toEqual(
      billingState,
    )
  })

  it('restores failed validation state through the validator and consumes its cookie', async () => {
    const createServerValidate = createServerValidateHelper({
      framework: start(),
    })
    const serverValidate = createServerValidate(
      { ...formOpts, formId: 'profile' },
      {
        transportId: 'A',
        decode: (formData) => ({ name: String(formData.get('name') ?? '') }),
      },
    )
    const submission = new FormData()
    submission.set('name', '')

    const result = await serverValidate({ formData: submission })

    expect(result.success).toBe(false)
    if (result.success) throw new Error('Expected server validation to fail')

    const { getServerState } = serverValidate

    await expect(getServerState()).resolves.toEqual(result.serverState)
    await expect(getServerState()).resolves.toBeUndefined()
  })

  it('preserves another form state when the requested form has no cookie', async () => {
    const persistence = start().transportMiddleware!
    const state = {
      values: { name: 'Ada' },
      validationResults: [],
      submissionAttempts: 1,
    }

    await persistence.setState('profile', state)

    await expect(persistence.readState('billing')).resolves.toBeUndefined()
    await expect(persistence.readState('profile')).resolves.toEqual(state)
  })

  it('keeps form IDs distinct when cookie names need encoding', async () => {
    const persistence = start().transportMiddleware!
    const profileState = {
      values: { name: 'Ada' },
      validationResults: [],
      submissionAttempts: 1,
    }
    const otherState = {
      values: { name: 'Grace' },
      validationResults: [],
      submissionAttempts: 1,
    }

    await persistence.setState('profile/contact details', profileState)
    await persistence.setState('profile%2Fcontact%20details', otherState)

    await expect(
      persistence.readState('profile/contact details'),
    ).resolves.toEqual(profileState)
    await expect(
      persistence.readState('profile%2Fcontact%20details'),
    ).resolves.toEqual(otherState)
  })
})
