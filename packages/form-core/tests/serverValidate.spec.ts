import { describe, expect, it, onTestFinished, vi } from 'vitest'
import { z } from 'zod'
import { InternalFormApi } from '../src/FormApi/FormApi.lib'
import { installDevtoolsBridge } from '../src/devtoolsBridge.lib'
import { validateServerValues } from '../src/internals'
import { formOptions, initialServerFormState } from '../src'
import { promiseWithResolvers } from './test-utils'
import type {
  ServerValidateFailure,
  ServerValidateResult,
  ServerValidateSuccess,
} from '../src'

function expectServerValidateSuccess<TFormData, TValidators>(
  result: ServerValidateResult<TFormData, TValidators>,
): ServerValidateSuccess<TFormData, TValidators> {
  expect(result.success).toBe(true)

  if (!result.success) {
    throw new Error('Expected server validation to succeed')
  }

  return result
}

function expectServerValidateFailure<TFormData, TValidators>(
  result: ServerValidateResult<TFormData, TValidators>,
): ServerValidateFailure<TFormData> {
  expect(result.success).toBe(false)

  if (result.success) {
    throw new Error('Expected server validation to fail')
  }

  return result
}

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
          triggers: ['server'],
        },
      ],
    })

    expectServerValidateFailure(
      await validateServerValues(options, { name: '' }),
    )

    expect(changeValidator).not.toHaveBeenCalled()
    expect(serverValidator).toHaveBeenCalledOnce()
  })

  it('propagates server-trigger selection failures', async () => {
    const error = new Error('Pipeline failed')
    const options = formOptions({
      defaultValues: { name: '' },
      validators: [
        {
          run: () => null,
          get triggers(): ['server'] {
            throw error
          },
        },
        {
          run: () => null,
          triggers: ['server'],
        },
      ],
    })

    await expect(validateServerValues(options, { name: '' })).rejects.toBe(
      error,
    )
  })

  it('waits for earlier pending validation before aggregating a thrown failure', async () => {
    const error = new Error('Validator failed')
    const pending = promiseWithResolvers<null>()
    onTestFinished(() => pending.resolve(null))
    const options = formOptions({
      defaultValues: { name: '' },
      validators: [
        {
          run: () => pending.promise,
          triggers: ['server'],
        },
        {
          run: () => {
            throw error
          },
          triggers: ['server'],
        },
      ],
    })

    const validation = validateServerValues(options, { name: '' })
    const rejection = expect(validation).rejects.toMatchObject({
      errors: [error],
    })
    pending.resolve(null)
    await rejection
  })

  it('propagates deferred validator failures before running a waiting bail validator', async () => {
    const error = new Error('Deferred validation failed')
    const pending = promiseWithResolvers<null>()
    const afterFailure = vi.fn(() => null)
    const options = formOptions({
      defaultValues: { name: '' },
      validators: [
        { run: () => pending.promise, triggers: ['server'] },
        { run: afterFailure, triggers: ['server'], bailIfInvalid: true },
      ],
    })
    const validation = validateServerValues(options, { name: '' })
    const rejection = expect(validation).rejects.toMatchObject({
      errors: [error],
    })

    pending.reject(error)
    await rejection

    expect(afterFailure).not.toHaveBeenCalled()
  })

  it('runs server-only validators during client submit by default', async () => {
    const serverValidator = vi.fn(() => 'Server error')
    const form = new InternalFormApi(
      formOptions({
        defaultValues: { name: '' },
        validators: [
          {
            run: serverValidator,
            triggers: ['server'],
          },
        ],
      }),
    )
    const field = form._getOrCreateFieldApi({ name: 'name' })

    form.setFieldValue('name', 'Tony')
    field.handleBlur()
    await expect(form.validate('change')).resolves.toEqual([])
    await expect(form.validate('blur')).resolves.toEqual([])
    expect(serverValidator).not.toHaveBeenCalled()
    await expect(form.validate('submit')).resolves.toEqual([
      { message: 'Server error' },
    ])
    expect(serverValidator).toHaveBeenCalledOnce()
  })

  it('skips server-only validators during client submit when skipOnSubmit is true', async () => {
    const validator = vi.fn(() => 'Submit error')
    const form = new InternalFormApi(
      formOptions({
        defaultValues: { name: '' },
        validators: [
          {
            run: validator,
            triggers: ['server'],
            skipOnSubmit: true,
          },
        ],
      }),
    )

    await expect(form.validate('submit')).resolves.toEqual([])
    expect(validator).not.toHaveBeenCalled()
  })

  it('runs mixed server and client trigger validators in both contexts', async () => {
    const calls: Array<{ event: string; hasFormApi: boolean }> = []
    const validator = vi.fn(({ event, formApi }) => {
      calls.push({ event, hasFormApi: formApi !== undefined })
      return `${event} error`
    })
    const options = formOptions({
      defaultValues: { name: '' },
      validators: [
        {
          run: validator,
          triggers: ['server', 'change'],
        },
      ],
    })

    expectServerValidateFailure(
      await validateServerValues(options, { name: '' }),
    )

    const form = new InternalFormApi(options)
    await expect(form.validate('change')).resolves.toEqual([
      { message: 'change error' },
    ])

    expect(calls).toEqual([
      { event: 'server', hasFormApi: false },
      { event: 'change', hasFormApi: true },
    ])
  })

  it('returns the supplied values and no outputs when no validators are configured', async () => {
    const options = formOptions({ defaultValues: { name: '' } })
    const values = { name: 'Tony' }

    const validation = await validateServerValues(options, values)
    const result = expectServerValidateSuccess(validation)

    expect(result.values).toBe(values)
    expect(result.validatorOutputs).toEqual([])
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
          triggers: ['server'],
        },
      ],
    })

    const validation = await validateServerValues(options, { name: 'Tony' })
    const result = expectServerValidateSuccess(validation)

    expect(result.values).toEqual({ name: 'Tony' })
    expect(result.validatorOutputs).toEqual([{ nameLength: 4 }])
  })

  it('aligns server schema outputs with all validator slots', async () => {
    const options = formOptions({
      defaultValues: { name: '' },
      validators: [
        {
          run: z.object({ name: z.string() }),
          triggers: ['change'],
        },
        {
          run: () => null,
          triggers: ['server'],
        },
        {
          run: z
            .object({ name: z.string() })
            .transform(({ name }) => ({ nameLength: name.length })),
          triggers: ['server'],
        },
      ],
    })

    const result = expectServerValidateSuccess(
      await validateServerValues(options, { name: 'Tony' }),
    )

    expect(result.validatorOutputs).toEqual([
      undefined,
      undefined,
      { nameLength: 4 },
    ])
  })

  it('aligns outputs with the complete validator list when asynchronous validators finish out of order', async () => {
    const first = promiseWithResolvers<string>()
    const last = promiseWithResolvers<string>()
    const options = formOptions({
      defaultValues: { name: '' },
      validators: [
        { run: () => null, triggers: ['change'] },
        {
          run: async ({ createOutput }) => createOutput(await first.promise),
          triggers: ['server'],
        },
        { run: () => null, triggers: ['server'] },
        {
          run: async ({ createOutput }) => createOutput(await last.promise),
          triggers: ['server'],
        },
        { run: () => null, triggers: ['blur'] },
      ],
    })
    const validation = validateServerValues(options, { name: 'Tony' })

    last.resolve('Last validator output')
    await last.promise
    first.resolve('First validator output')
    const result = expectServerValidateSuccess(await validation)

    expect(result.validatorOutputs).toEqual([
      undefined,
      'First validator output',
      undefined,
      'Last validator output',
      undefined,
    ])
  })

  it('orders synchronous and deferred server results by their original indexes', async () => {
    const first = promiseWithResolvers<string>()
    const last = promiseWithResolvers<string>()
    const options = formOptions({
      defaultValues: { name: '' },
      validators: [
        { run: () => null, triggers: ['change'] },
        { run: () => first.promise, triggers: ['server'] },
        {
          run: ({ createOutput }) => createOutput(undefined),
          triggers: ['server'],
        },
        { run: () => last.promise, triggers: ['server'] },
      ],
    })
    const validation = validateServerValues(options, { name: '' })

    last.resolve('Last validator error')
    await last.promise
    first.resolve('First validator error')
    const { serverState } = expectServerValidateFailure(await validation)

    expect(serverState.validationResults).toEqual([
      {
        validatorIndex: 1,
        result: [{ message: 'First validator error' }],
        output: null,
        hasOutput: false,
      },
      { validatorIndex: 2, result: null, output: undefined, hasOutput: true },
      {
        validatorIndex: 3,
        result: [{ message: 'Last validator error' }],
        output: null,
        hasOutput: false,
      },
    ])
  })

  it('omits a bail-skipped result, collects later results, and hydrates field errors at the original index', async () => {
    const pending = promiseWithResolvers<{ fields: { name: string } }>()
    const skipped = vi.fn(() => null)
    const options = formOptions({
      defaultValues: { name: '' },
      validators: [
        { run: () => null, triggers: ['change'] },
        { run: () => pending.promise, triggers: ['server'] },
        { run: skipped, triggers: ['server'], bailIfInvalid: true },
        {
          run: ({ createOutput }) => createOutput('After bail'),
          triggers: ['server'],
        },
      ],
    })
    const validation = validateServerValues(options, { name: '' })

    pending.resolve({ fields: { name: 'Required' } })
    const { serverState } = expectServerValidateFailure(await validation)

    expect(skipped).not.toHaveBeenCalled()
    expect(serverState.validationResults).toEqual([
      {
        validatorIndex: 1,
        result: { form: [], fields: { name: [{ message: 'Required' }] } },
        output: null,
        hasOutput: false,
      },
      {
        validatorIndex: 3,
        result: null,
        output: 'After bail',
        hasOutput: true,
      },
    ])

    const form = new InternalFormApi({ ...options, serverState })
    const field = form._getOrCreateFieldApi({ name: 'name' })

    expect(field.errors).toEqual([{ message: 'Required' }])
    expect(form.state.canSubmit).toBe(false)
  })

  it('collects a synchronous output after a successful asynchronous bail wait', async () => {
    const pending = promiseWithResolvers<null>()
    const options = formOptions({
      defaultValues: { name: '' },
      validators: [
        { run: () => pending.promise, triggers: ['server'] },
        {
          run: ({ createOutput }) => createOutput('Validated'),
          triggers: ['server'],
          bailIfInvalid: true,
        },
      ],
    })
    const validation = validateServerValues(options, { name: 'Tony' })

    pending.resolve(null)
    const result = expectServerValidateSuccess(await validation)

    expect(result.validatorOutputs).toEqual([undefined, 'Validated'])
  })

  it('returns a serializable server state when validation fails', async () => {
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
          triggers: ['server'],
        },
      ],
    })

    const result = expectServerValidateFailure(
      await validateServerValues(options, { name: '' }),
    )

    expect(result.serverState).toMatchObject({
      values: { name: '' },
      submissionAttempts: 1,
    })
    expect(result.serverState.validationResults).toHaveLength(1)
    expect(result.serverState.validationResults[0]).toMatchObject({
      validatorIndex: 0,
      result: {
        form: [{ message: 'Form error' }],
        fields: {
          name: [{ message: 'Name is required' }],
        },
      },
    })
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
          triggers: ['server'],
        },
      ],
    })

    const { serverState } = expectServerValidateFailure(
      await validateServerValues(options, { name: '', age: 42 }),
    )

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

  it('treats server state as an authoritative form snapshot', async () => {
    const options = formOptions({
      defaultValues: { name: '' },
      validators: [
        {
          run: () => 'Client error',
          triggers: ['change'],
        },
        {
          run: () => ({
            form: 'Server form error',
            fields: {
              name: 'Server name error',
            },
          }),
          triggers: ['server'],
        },
      ],
    })
    const form = new InternalFormApi(options)
    const field = form._getOrCreateFieldApi({ name: 'name' })

    form.setFieldValue('name', 'Client value', {
      fieldApiOverride: field,
      causeValidation: false,
    })
    await form.validate('change')

    expect(form.state.values).toEqual({ name: 'Client value' })
    expect(form.state.isDirty).toBe(true)
    expect(form.state.isTouched).toBe(true)
    expect(form.state.errors).toEqual([{ message: 'Client error' }])

    const { serverState } = expectServerValidateFailure(
      await validateServerValues(options, { name: 'Server value' }),
    )

    form._update({
      ...options,
      serverState,
    } as never)

    expect(form.state.values).toEqual({ name: 'Server value' })
    expect(form.defaultValues).toBe(options.defaultValues)
    expect(form.state.errors).toEqual([{ message: 'Server form error' }])
    expect(form.state.isDirty).toBe(false)
    expect(form.state.isTouched).toBe(false)
    expect(form.state.isDefaultValue).toBe(false)
    expect(form.state.submissionAttempts).toBe(1)
    expect(field.errors).toEqual([{ message: 'Server name error' }])
    expect(field.meta.isDirty).toBe(false)
    expect(field.meta.isTouched).toBe(false)
    expect(field.meta.isDefaultValue).toBe(false)
  })

  it('treats empty server state as an authoritative reset', async () => {
    const options = formOptions({
      defaultValues: { name: '' },
      validators: [
        {
          run: () => ({
            fields: {
              name: 'Server name error',
            },
          }),
          triggers: ['server'],
        },
      ],
    })

    const { serverState } = expectServerValidateFailure(
      await validateServerValues(options, { name: 'Server value' }),
    )

    const form = new InternalFormApi({
      ...options,
      serverState,
    } as never)
    const field = form._getOrCreateFieldApi({ name: 'name' })

    expect(form.state.values).toEqual({ name: 'Server value' })
    expect(field.errors).toEqual([{ message: 'Server name error' }])

    field.handleChange('Client edit', { causeValidation: false })

    expect(form.state.values).toEqual({ name: 'Client edit' })
    expect(form.state.isDirty).toBe(true)

    form._update({
      ...options,
      serverState: {
        ...initialServerFormState,
      },
    } as never)

    expect(form.state.values).toEqual({ name: '' })
    expect(form.state.errors).toEqual([])
    expect(form.state.isDirty).toBe(false)
    expect(form.state.isTouched).toBe(false)
    expect(form.state.submissionAttempts).toBe(0)
    expect(field.errors).toEqual([])
    expect(field.meta.isDefaultValue).toBe(true)
  })

  it('clears server errors on change and preserves them on blur', async () => {
    const options = formOptions({
      defaultValues: { name: '', email: '' },
      validators: [
        {
          run: () => ({
            form: 'Server form error',
            fields: {
              name: 'Server name error',
              email: 'Server email error',
            },
          }),
          triggers: ['server'],
        },
      ],
    })

    const { serverState } = expectServerValidateFailure(
      await validateServerValues(options, { name: '', email: '' }),
    )

    const changeForm = new InternalFormApi({
      ...options,
      serverState,
    } as never)
    const changeNameField = changeForm._getOrCreateFieldApi({ name: 'name' })
    const changeEmailField = changeForm._getOrCreateFieldApi({ name: 'email' })

    expect(changeForm.state.errors).toEqual([{ message: 'Server form error' }])
    expect(changeNameField.errors).toEqual([{ message: 'Server name error' }])
    expect(changeEmailField.errors).toEqual([{ message: 'Server email error' }])

    changeNameField.handleChange('Alice')

    expect(changeForm.state.errors).toEqual([])
    expect(changeNameField.errors).toEqual([])
    expect(changeEmailField.errors).toEqual([{ message: 'Server email error' }])

    const blurForm = new InternalFormApi({
      ...options,
      serverState,
    } as never)
    const blurNameField = blurForm._getOrCreateFieldApi({ name: 'name' })
    const blurEmailField = blurForm._getOrCreateFieldApi({ name: 'email' })

    blurNameField.handleBlur()

    expect(blurForm.state.errors).toEqual([{ message: 'Server form error' }])
    expect(blurNameField.errors).toEqual([{ message: 'Server name error' }])
    expect(blurEmailField.errors).toEqual([{ message: 'Server email error' }])
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
          triggers: ['server'],
        },
      ],
    })

    const { serverState } = expectServerValidateFailure(
      await validateServerValues(options, { name: '' }),
    )

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
          triggers: ['server'],
        },
      ],
      serverState: {
        values: { name: '' },
        validationResults: [
          {
            validatorIndex: 0,
            result: [{ message: 'Server name error' }],
            output: null,
          },
        ],
        submissionAttempts: 1,
      },
    })

    const form = new InternalFormApi(options)

    expect(serverValidator).not.toHaveBeenCalled()
    expect(form.state.errors).toEqual([{ message: 'Server name error' }])
  })

  it('notifies Devtools when server state directly resets field meta', () => {
    const options = formOptions({ defaultValues: { name: '' } })
    const form = new InternalFormApi(options)
    const field = form._getOrCreateFieldApi({ name: 'name' })
    field.handleChange('client value')
    const updateField = vi.fn()
    const uninstallBridge = installDevtoolsBridge({ updateField })

    try {
      form._update({
        ...options,
        serverState: {
          ...initialServerFormState,
          values: { name: 'server value' },
        },
      } as never)

      expect(field.meta.isDirty).toBe(false)
      expect(updateField).toHaveBeenCalledWith(field)
    } finally {
      uninstallBridge()
    }
  })
})
