import { describe, expect, it, vi } from 'vitest'
import { z } from 'zod'
import { InternalFormApi } from '../src/FormApi/FormApi.lib'
import { InternalValidatorInstance } from '../src/ValidatorInstance.lib'
import { installDevtoolsBridge } from '../src/devtoolsBridge.lib'
import { validateServerValues } from '../src/internals'
import { formOptions, initialServerFormState } from '../src'
import type {
  FormValidators,
  ServerValidateFailure,
  ServerValidateResult,
  ServerValidateSuccess,
} from '../src'

function expectServerValidateSuccess<
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
>(
  result: ServerValidateResult<TFormData, TFormValidators>,
): ServerValidateSuccess<TFormData, TFormValidators> {
  expect(result.success).toBe(true)

  if (!result.success) {
    throw new Error('Expected server validation to succeed')
  }

  return result
}

function expectServerValidateFailure<
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
>(
  result: ServerValidateResult<TFormData, TFormValidators>,
): ServerValidateFailure<TFormData, TFormValidators> {
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

  it('disposes every validator once when the server pipeline rejects', async () => {
    const error = new Error('Pipeline failed')
    const disposeSpy = vi.spyOn(InternalValidatorInstance.prototype, 'dispose')
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

    try {
      await expect(validateServerValues(options, { name: '' })).rejects.toBe(
        error,
      )
      expect(disposeSpy).toHaveBeenCalledTimes(2)
      expect(new Set(disposeSpy.mock.instances).size).toBe(2)
    } finally {
      disposeSpy.mockRestore()
    }
  })

  it('rethrows validator errors after disposing their instance once', async () => {
    const error = new Error('Validator failed')
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const disposeSpy = vi.spyOn(InternalValidatorInstance.prototype, 'dispose')
    const options = formOptions({
      defaultValues: { name: '' },
      validators: [
        {
          run: () => {
            throw error
          },
          triggers: ['server'],
        },
      ],
    })

    try {
      await expect(validateServerValues(options, { name: '' })).rejects.toBe(
        error,
      )
      expect(disposeSpy).toHaveBeenCalledOnce()
    } finally {
      disposeSpy.mockRestore()
      consoleSpy.mockRestore()
    }
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
    await expect(form.validate('submit')).resolves.toEqual(['Server error'])
    expect(serverValidator).toHaveBeenCalledOnce()
  })

  it('skips server-only validators during client submit when runOnSubmit is false', async () => {
    const validator = vi.fn(() => 'Submit error')
    const form = new InternalFormApi(
      formOptions({
        defaultValues: { name: '' },
        validators: [
          {
            run: validator,
            triggers: ['server'],
            runOnSubmit: false,
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
    await expect(form.validate('change')).resolves.toEqual(['change error'])

    expect(calls).toEqual([
      { event: 'server', hasFormApi: false },
      { event: 'change', hasFormApi: true },
    ])
  })

  it('returns values and schema outputs when server validation succeeds', async () => {
    const setSchemaOutput = vi.spyOn(
      InternalValidatorInstance.prototype,
      'setSchemaOutput',
    )
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

    try {
      const result = expectServerValidateSuccess(
        await validateServerValues(options, { name: 'Tony' }),
      )

      expect(result.values).toEqual({ name: 'Tony' })
      expect(result.schemaOutputs).toEqual([{ nameLength: 4 }])
      expect(setSchemaOutput).not.toHaveBeenCalled()
    } finally {
      setSchemaOutput.mockRestore()
    }
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

    expect(result.schemaOutputs).toEqual([
      undefined,
      undefined,
      { nameLength: 4 },
    ])
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
        form: 'Form error',
        fields: {
          name: 'Name is required',
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
    expect(form.state.errors).toEqual([{ message: 'Server form error' }])
    expect(form.state.isDirty).toBe(false)
    expect(form.state.isTouched).toBe(false)
    expect(form.state.submissionAttempts).toBe(1)
    expect(field.errors).toEqual([{ message: 'Server name error' }])
    expect(field.meta.isDirty).toBe(false)
    expect(field.meta.isTouched).toBe(false)
    expect(field.meta.isDefaultValue).toBe(true)
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

  it('clears server errors on field events like submit errors', async () => {
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

    expect(blurForm.state.errors).toEqual([])
    expect(blurNameField.errors).toEqual([])
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

  it('does not restore serialized schema output during hydration', () => {
    const options = formOptions({
      defaultValues: { name: '' },
      validators: [
        {
          run: z.object({ name: z.string() }).transform(() => undefined),
          triggers: ['server'],
        },
      ],
      serverState: {
        values: { name: 'Tony' },
        validationResults: [
          {
            validatorIndex: 0,
            result: null,
            schemaResult: undefined,
            hasSchemaResult: true,
          },
        ],
        submissionAttempts: 1,
      },
    })

    const form = new InternalFormApi(options)

    expect(form._validatorInstances?.[0]?.hasSchemaOutput).toBe(false)
    expect(form._validatorInstances?.[0]?.schemaOutput).toBeUndefined()
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
