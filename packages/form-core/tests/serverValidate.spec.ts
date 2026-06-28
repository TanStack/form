import { describe, expect, it, vi } from 'vitest'
import { z } from 'zod'
import { InternalFormApi } from '../src/FormApi/FormApi.lib'
import {
  ServerValidateError,
  formOptions,
  initialServerFormState,
  validateServerValues,
} from '../src'

describe('server validation', () => {
  it('runs validators explicitly configured for server validation only', async () => {
    const changeValidator = vi.fn(() => 'Change error')
    const serverValidator = vi.fn(() => 'Server error')
    const options = formOptions({
      defaultValues: { name: '' },
      validators: [
        {
          run: changeValidator,
          triggers: ['change'],
        },
        {
          run: serverValidator,
          runOnServer: true,
        },
      ],
    })

    await expect(
      validateServerValues(options, { name: '' }),
    ).rejects.toBeInstanceOf(ServerValidateError)

    expect(changeValidator).not.toHaveBeenCalled()
    expect(serverValidator).toHaveBeenCalledOnce()
  })

  it('skips triggerless server validators during client validation', async () => {
    const serverValidator = vi.fn(() => 'Server error')
    const form = new InternalFormApi(
      formOptions({
        defaultValues: { name: '' },
        validators: [
          {
            run: serverValidator,
            runOnServer: true,
          },
        ],
      }),
    )
    const field = form._getOrCreateFieldApi({ name: 'name' })

    form.setFieldValue('name', 'Tony')
    field.handleBlur()
    await expect(form.validate('change')).resolves.toEqual([])
    await expect(form.validate('blur')).resolves.toEqual([])
    await expect(form.validate('submit')).resolves.toEqual([])
    expect(serverValidator).not.toHaveBeenCalled()
  })

  it('returns values and schema outputs when server validation succeeds', async () => {
    const options = formOptions({
      defaultValues: { name: '' },
      validators: [
        {
          run: z
            .object({
              name: z.string(),
            })
            .transform(({ name }) => ({ nameLength: name.length })),
          runOnServer: true,
        },
      ],
    })

    const result = await validateServerValues(options, { name: 'Tony' })

    expect(result.values).toEqual({ name: 'Tony' })
    expect(result.schemaOutputs).toEqual([{ nameLength: 4 }])
  })

  it('throws a serializable server state when validation fails', async () => {
    const options = formOptions({
      defaultValues: { name: '' },
      validators: [
        {
          run: () => ({
            form: 'Form error',
            fields: {
              name: 'Name is required',
            },
          }),
          runOnServer: true,
        },
      ],
    })

    try {
      await validateServerValues(options, { name: '' })
      throw new Error('Expected server validation to fail')
    } catch (error) {
      expect(error).toBeInstanceOf(ServerValidateError)

      const serverError = error as ServerValidateError<any, any>

      expect(serverError.serverState).toMatchObject({
        values: { name: '' },
        submissionAttempts: 1,
      })
      expect(serverError.serverState.validationResults).toHaveLength(1)
      expect(serverError.serverState.validationResults[0]).toMatchObject({
        validatorIndex: 0,
        result: {
          form: 'Form error',
          fields: {
            name: 'Name is required',
          },
        },
      })
    }
  })

  it('hydrates posted values and server errors into form state', async () => {
    const options = formOptions({
      defaultValues: { name: '', age: 0 },
      validators: [
        {
          run: () => ({
            form: 'Server form error',
            fields: {
              name: 'Server name error',
            },
          }),
          runOnServer: true,
        },
      ],
    })

    let serverState
    try {
      await validateServerValues(options, { name: '', age: 42 })
    } catch (error) {
      serverState = (error as ServerValidateError<any, any>).serverState
    }

    const form = new InternalFormApi({
      ...options,
      serverState,
    } as never)
    const field = form._getOrCreateFieldApi({ name: 'name' })

    expect(form.state.values).toEqual({ name: '', age: 42 })
    expect(form.state.errors).toEqual([{ message: 'Server form error' }])
    expect(field.errors).toEqual([{ message: 'Server name error' }])
    expect(form.state.submissionAttempts).toBe(1)
    expect(form.state.canSubmit).toBe(false)
  })

  it('clears stale server errors when a new server state arrives', async () => {
    const options = formOptions({
      defaultValues: { name: '' },
      validators: [
        {
          run: () => ({
            fields: {
              name: 'Server name error',
            },
          }),
          runOnServer: true,
        },
      ],
    })

    let serverState
    try {
      await validateServerValues(options, { name: '' })
    } catch (error) {
      serverState = (error as ServerValidateError<any, any>).serverState
    }

    const form = new InternalFormApi({
      ...options,
      serverState,
    } as never)
    const field = form._getOrCreateFieldApi({ name: 'name' })

    expect(field.errors).toEqual([{ message: 'Server name error' }])

    form._update({
      ...options,
      serverState: {
        ...initialServerFormState,
        values: { name: 'Tony' },
      },
    } as never)

    expect(form.state.values).toEqual({ name: 'Tony' })
    expect(field.errors).toEqual([])
    expect(form.state.errors).toEqual([])
    expect(form.state.canSubmit).toBe(true)
  })

  it('does not rerun server validators during client form hydration', () => {
    const serverValidator = vi.fn(() => 'Server name error')
    const options = formOptions({
      defaultValues: { name: '' },
      validators: [
        {
          run: serverValidator,
          runOnServer: true,
        },
      ],
      serverState: {
        values: { name: '' },
        validationResults: [
          {
            validatorIndex: 0,
            result: 'Server name error',
            schemaResult: null,
          },
        ],
        submissionAttempts: 1,
      },
    })

    const form = new InternalFormApi(options)

    expect(serverValidator).not.toHaveBeenCalled()
    expect(form.state.errors).toEqual([{ message: 'Server name error' }])
  })
})
