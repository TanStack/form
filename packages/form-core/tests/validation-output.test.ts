import { describe, expect, it, onTestFinished, vi } from 'vitest'
import { z } from 'zod'
import { formOptions } from '../src'
import { InternalFormApi } from '../src/FormApi/FormApi.lib'
import { InternalFormGroupApi } from '../src/FormGroupApi/FormGroupApi.lib'
import { validateServerValues } from '../src/internals'
import type { FormValidatorContext } from '../src'

describe('validator outputs', () => {
  it('forwards arbitrary payloads without mutation or loss of identity', async () => {
    const payloads = [
      undefined,
      null,
      false,
      0,
      '',
      1n,
      Symbol('payload'),
      Object.freeze({ message: 'This is data', fields: { name: 'Also data' } }),
      Object.freeze(['data']),
      () => 'data',
    ]
    const onSubmit = vi.fn()
    const form = new InternalFormApi(
      formOptions({
        defaultValues: { name: 'Tony' },
        validators: payloads.map((payload) => ({
          run: ({ createOutput }: FormValidatorContext<{ name: string }>) =>
            createOutput(payload),
          triggers: [],
        })),
        onSubmit,
      }),
    )

    await form.handleSubmit()

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        value: { name: 'Tony' },
        validatorOutputs: payloads,
      }),
    )
    const { validatorOutputs } = onSubmit.mock.lastCall![0]
    for (const [index, payload] of payloads.entries()) {
      expect(validatorOutputs[index]).toBe(payload)
    }
    expect(form.state.errors).toEqual([])
    expect(form.state.isSubmitSuccessful).toBe(true)
  })

  it('aligns schema, sync, async, absent, and skipped outputs by validator index', async () => {
    const skipped = vi.fn()
    const onSubmit = vi.fn()
    const form = new InternalFormApi(
      formOptions({
        defaultValues: { name: ' Tony ' },
        validators: [
          { run: z.object({ name: z.string().trim() }), triggers: [] },
          {
            run: ({ value, createOutput }) => createOutput(value.name.length),
            triggers: [],
          },
          {
            run: async ({ value, createOutput }) =>
              createOutput(value.name.trim().toUpperCase()),
            triggers: [],
          },
          { run: () => undefined, triggers: [] },
          { run: skipped, triggers: [], runOnSubmit: false },
        ],
        onSubmit,
      }),
    )

    await form.handleSubmit()

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        value: { name: ' Tony ' },
        validatorOutputs: [{ name: 'Tony' }, 6, 'TONY', undefined, undefined],
      }),
    )
    expect(skipped).not.toHaveBeenCalled()
  })

  it('keeps error branches as errors and accepts a later output branch', async () => {
    const onSubmit = vi.fn()
    const form = new InternalFormApi(
      formOptions({
        defaultValues: { name: '' },
        validators: [
          {
            run: ({ value, createOutput }) => {
              if (!value.name) return { message: 'Required', code: 'required' }
              return createOutput({ name: value.name.trim() })
            },
            triggers: [],
          },
        ],
        onSubmit,
      }),
    )

    await form.handleSubmit()

    expect(onSubmit).not.toHaveBeenCalled()
    expect(form.state.errors).toEqual([
      { message: 'Required', code: 'required' },
    ])

    form.setFieldValue('name', ' Tony ')
    await form.handleSubmit()

    expect(form.state.errors).toEqual([])
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ validatorOutputs: [{ name: 'Tony' }] }),
    )
  })

  it('clears earlier outputs when a later submission skips or succeeds without output', async () => {
    let shouldRun = true
    let produceOutput = true
    const onSubmit = vi.fn()
    const form = new InternalFormApi(
      formOptions({
        defaultValues: { name: 'Tony' },
        validators: [
          {
            run: ({ value, createOutput }) =>
              produceOutput ? createOutput(value.name) : [],
            runOnSubmit: () => shouldRun,
            triggers: [],
          },
        ],
        onSubmit,
      }),
    )

    await form.handleSubmit()
    expect(onSubmit).toHaveBeenLastCalledWith(
      expect.objectContaining({ validatorOutputs: ['Tony'] }),
    )

    shouldRun = false
    await form.handleSubmit()
    expect(onSubmit).toHaveBeenLastCalledWith(
      expect.objectContaining({ validatorOutputs: [undefined] }),
    )

    shouldRun = true
    await form.handleSubmit()
    expect(onSubmit).toHaveBeenLastCalledWith(
      expect.objectContaining({ validatorOutputs: ['Tony'] }),
    )

    produceOutput = false
    await form.handleSubmit()
    expect(onSubmit).toHaveBeenLastCalledWith(
      expect.objectContaining({ validatorOutputs: [undefined] }),
    )
  })

  it('treats change and blur outputs as success without retaining them for submission', async () => {
    const onSubmit = vi.fn()
    const nextValidator = vi.fn(() => undefined)
    const form = new InternalFormApi(
      formOptions({
        defaultValues: { name: 'Tony' },
        validators: [
          {
            run: ({ createOutput }) => createOutput('event output'),
            triggers: ['change', 'blur'],
            runOnSubmit: false,
          },
          {
            run: nextValidator,
            triggers: ['change', 'blur'],
            bailIfInvalid: true,
          },
        ],
        onSubmit,
      }),
    )

    const changeErrors = await form.validate('change')
    const blurErrors = await form.validate('blur')

    expect(changeErrors).toEqual([])
    expect(blurErrors).toEqual([])
    expect(nextValidator).toHaveBeenCalledWith(
      expect.objectContaining({ event: 'blur' }),
    )

    await form.handleSubmit()
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ validatorOutputs: [undefined, undefined] }),
    )
  })

  it('treats sync and async mount outputs as success and preserves synchronous mount work', async () => {
    for (const asyncOutput of [false, true]) {
      const nextValidator = vi.fn(() => undefined)
      const onSubmit = vi.fn()
      const form = new InternalFormApi(
        formOptions({
          defaultValues: { name: 'Tony' },
          validators: [
            {
              run: ({ createOutput }) =>
                asyncOutput
                  ? Promise.resolve(createOutput('mount output'))
                  : createOutput('mount output'),
              runOnMount: true,
              runOnSubmit: false,
              triggers: [],
            },
            {
              run: nextValidator,
              runOnMount: true,
              triggers: [],
              bailIfInvalid: true,
            },
          ],
          onSubmit,
        }),
      )

      const cleanup = form.mount()
      onTestFinished(cleanup)
      if (!asyncOutput) expect(nextValidator).toHaveBeenCalled()
      await expect.poll(() => form.state.isValidating).toBe(false)

      expect(nextValidator).toHaveBeenCalledWith(
        expect.objectContaining({ event: 'mount' }),
      )
      expect(form.state.errors).toEqual([])

      await form.handleSubmit()
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ validatorOutputs: [undefined, undefined] }),
      )
    }
  })

  it('provides group outputs from fresh validation and clears skipped slots', async () => {
    let shouldRun = true
    const onSubmit = vi.fn()
    const form = new InternalFormApi({
      defaultValues: { guest: { name: ' Tony ' } },
    })
    const group = new InternalFormGroupApi({
      form,
      name: 'guest',
      validators: [
        {
          run: async ({ value, createOutput }) =>
            createOutput({ name: value.name.trim() }),
          runOnMount: true,
          runOnSubmit: () => shouldRun,
          triggers: ['change'],
        },
      ],
      onSubmit,
    })

    group.mount()
    onTestFinished(() => group._cleanup())
    await expect.poll(() => group.state.isValidating).toBe(false)
    const errors = await group.validate('change')
    expect(errors).toEqual([])
    expect(group.state.errors).toEqual([])

    await group.handleSubmit()
    expect(onSubmit).toHaveBeenLastCalledWith(
      expect.objectContaining({ validatorOutputs: [{ name: 'Tony' }] }),
    )

    shouldRun = false
    await group.handleSubmit()
    expect(onSubmit).toHaveBeenLastCalledWith(
      expect.objectContaining({ validatorOutputs: [undefined] }),
    )
  })

  it('returns separate server outputs only for server-triggered validators', async () => {
    const options = formOptions({
      defaultValues: { name: '' },
      validators: [
        {
          run: ({ createOutput }) => createOutput('client'),
          triggers: ['change'],
        },
        { run: z.object({ name: z.string().trim() }), triggers: ['server'] },
        {
          run: async ({ value, createOutput }) =>
            createOutput(value.name.length),
          triggers: ['server'],
          runOnSubmit: false,
        },
      ],
    })

    const result = await validateServerValues(options, { name: ' Tony ' })

    expect(result).toEqual({
      success: true,
      values: { name: ' Tony ' },
      validatorOutputs: [undefined, { name: 'Tony' }, 6],
    })
  })

  it('consumes output wrappers before serializing failed server validation', async () => {
    const options = formOptions({
      defaultValues: { name: '' },
      validators: [
        {
          run: ({ createOutput }) => createOutput({ name: 'Tony' }),
          triggers: ['server'],
        },
        { run: () => 'Rejected', triggers: ['server'] },
      ],
    })

    const result = await validateServerValues(options, { name: 'Tony' })

    expect(result.success).toBe(false)
    if (result.success) throw new Error('Expected failure')
    const serialized = JSON.parse(JSON.stringify(result.serverState))
    expect(serialized.validationResults).toEqual([
      {
        validatorIndex: 0,
        result: null,
        output: { name: 'Tony' },
        hasOutput: true,
      },
      { validatorIndex: 1, result: 'Rejected', output: null, hasOutput: false },
    ])
  })
})
