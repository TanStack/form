import { describe, expect, it, vi } from 'vitest'
import { runFormValidatorPipeline } from '../src/validation.lib'
import { InternalFormApi } from '../src/FormApi.lib'
import type { PipelineResult } from '../src/validation.lib'
import type { FormValidator, FormValidatorContext } from '../src'
import type { InternalFieldApi } from '../src/FieldApi.lib'

describe('runFormValidatorPipeline', () => {
  type Event = FormValidatorContext<any>['event']

  function getForm<T>(defaultValues: T) {
    return new InternalFormApi({ defaultValues })
  }

  function getPipeline<T>(
    form: InternalFormApi<T, Array<any>>,
    pipeline: Array<FormValidator<T>>,
  ) {
    return {
      pipeline,
      runWithContext: (args: {
        event: Event
        field?: InternalFieldApi<any, Array<any>>
      }) => {
        return runFormValidatorPipeline(pipeline, {
          formApi: form,
          fieldApi: args.field ?? null,
          event: args.event,
        })
      },
    }
  }

  it('should run the pipeline with appropriate defaults', async () => {
    const formApi = getForm({ name: '' })
    const { runWithContext } = getPipeline(formApi, [
      {
        validate: () => ({ message: 'foo' }),
      },
    ])
    const results = await runWithContext({ event: 'submit' })
    expect(results).toHaveLength(1)
    expect(results).toContainEqual({
      errorScope: 'all',
      result: { message: 'foo' },
      validatorIndex: 0,
    } satisfies PipelineResult)
  })

  it('should only run validators with matching signal', async () => {
    const formApi = getForm({ name: '' })

    const change = vi.fn()
    const blur = vi.fn()
    const blurOrChange = vi.fn()

    const { runWithContext } = getPipeline(formApi, [
      {
        validate: change,
        signals: ['change'],
      },
      {
        validate: blur,
        signals: ['blur'],
      },
      {
        validate: blurOrChange,
        signals: ['blur', 'change'],
      },
    ])

    await runWithContext({ event: 'change' })
    expect(change).toHaveBeenCalledOnce()
    expect(blurOrChange).toHaveBeenCalledOnce()

    expect(blur).not.toHaveBeenCalled()

    await runWithContext({ event: 'blur' })
    expect(blur).toHaveBeenCalledOnce()

    expect(change).toHaveBeenCalledOnce()
    expect(blurOrChange).toHaveBeenCalledTimes(2)
  })

  it('should only run validators on submit if enabled', async () => {
    const formApi = getForm({ name: '' })

    const trueByDefault = vi.fn()
    const trueCallback = vi.fn()
    const trueBoolean = vi.fn()

    const falseBoolean = vi.fn()
    const falseCallback = vi.fn()

    const { runWithContext } = getPipeline(formApi, [
      {
        validate: trueByDefault,
      },
      {
        validate: trueCallback,
        runOnSubmit: () => true,
      },
      {
        validate: trueBoolean,
        runOnSubmit: true,
      },
      {
        validate: falseBoolean,
        runOnSubmit: false,
      },
      {
        validate: falseCallback,
        runOnSubmit: () => false,
      },
    ])

    await runWithContext({ event: 'change' })
    await runWithContext({ event: 'blur' })
    expect(trueByDefault).not.toHaveBeenCalled()
    expect(trueCallback).not.toHaveBeenCalled()
    expect(trueBoolean).not.toHaveBeenCalled()

    expect(falseBoolean).not.toHaveBeenCalled()
    expect(falseCallback).not.toHaveBeenCalled()

    await runWithContext({ event: 'submit' })
    expect(trueByDefault).toHaveBeenCalledOnce()
    expect(trueCallback).toHaveBeenCalledOnce()
    expect(trueBoolean).toHaveBeenCalledOnce()

    expect(falseBoolean).not.toHaveBeenCalled()
    expect(falseCallback).not.toHaveBeenCalled()
  })

  it('should debounce non-submit validation', async () => {
    vi.useFakeTimers()

    const formApi = getForm({ name: '' })
    const validate = vi.fn(() => ({ message: 'foo' }))

    const { runWithContext } = getPipeline(formApi, [
      {
        validate,
        signals: ['change'],
        signalDebounceMs: 100,
      },
    ])

    const promise = runWithContext({ event: 'change' })

    expect(validate).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(99)
    expect(validate).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(1)

    await expect(promise).resolves.toHaveLength(1)

    expect(validate).toHaveBeenCalledOnce()

    vi.useRealTimers()
  })

  it('should cancel an existing debounced validation when the same validator runs immediately', async () => {
    vi.useFakeTimers()

    const formApi = getForm({ name: '' })
    const validate = vi.fn(() => ({ message: 'foo' }))

    const { runWithContext } = getPipeline(formApi, [
      {
        validate,
        signals: ['change'],
        signalDebounceMs: 100,
      },
    ])

    runWithContext({ event: 'change' })

    await vi.advanceTimersByTimeAsync(50)

    const submitResults = await runWithContext({ event: 'submit' })

    expect(validate).toHaveBeenCalledOnce()
    expect(submitResults).toHaveLength(1)

    await vi.advanceTimersByTimeAsync(100)

    expect(validate).toHaveBeenCalledOnce()

    vi.useRealTimers()
  })

  it('should debounce separate validators independently', async () => {
    vi.useFakeTimers()

    const formApi = getForm({ name: '' })

    const first = vi.fn(() => ({ message: 'first' }))
    const second = vi.fn(() => ({ message: 'second' }))

    const { runWithContext } = getPipeline(formApi, [
      {
        validate: first,
        signals: ['change'],
        signalDebounceMs: 100,
      },
      {
        validate: second,
        signals: ['change'],
        signalDebounceMs: 200,
      },
    ])

    const promise = runWithContext({ event: 'change' })

    await vi.advanceTimersByTimeAsync(100)

    expect(first).toHaveBeenCalledOnce()
    expect(second).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(100)

    await expect(promise).resolves.toHaveLength(2)

    expect(second).toHaveBeenCalledOnce()

    vi.useRealTimers()
  })

  it('should not debounce submit validation', async () => {
    vi.useFakeTimers()

    const formApi = getForm({ name: '' })
    const validate = vi.fn(() => ({ message: 'foo' }))

    const { runWithContext } = getPipeline(formApi, [
      {
        validate,
        signals: ['change'],
        signalDebounceMs: 100,
      },
    ])

    const results = await runWithContext({ event: 'submit' })

    expect(validate).toHaveBeenCalledOnce()
    expect(results).toHaveLength(1)

    vi.useRealTimers()
  })

  it('should check for enabled signals', async () => {
    const formApi = getForm({ name: '' })
    const validate = vi.fn(() => ({ message: 'foo' }))

    let doThing = false

    const { runWithContext } = getPipeline(formApi, [
      {
        validate,
        signals: [
          { signal: 'change', enabled: () => doThing },
          { signal: 'blur', enabled: doThing },
        ],
      },
    ])

    await runWithContext({ event: 'change' })
    await runWithContext({ event: 'blur' })

    expect(validate).not.toHaveBeenCalled()

    doThing = true

    // Since it's a function for enable, it should be the most up to date value
    await runWithContext({ event: 'change' })
    expect(validate).toHaveBeenCalledOnce()
    // but blur should have the value stored on its own, not being updated
    await runWithContext({ event: 'blur' })
    expect(validate).toHaveBeenCalledOnce()
  })

  it('should abort existing debounced validation when same event runs again', async () => {
    vi.useFakeTimers()

    const formApi = getForm({ name: '' })
    const validationResult = { message: 'foo' }
    const validate = vi.fn(() => validationResult)

    const { runWithContext } = getPipeline(formApi, [
      {
        validate,
        signals: ['change'],
        signalDebounceMs: 100,
      },
    ])

    const firstPromise = runWithContext({ event: 'change' })

    await vi.advanceTimersByTimeAsync(50)
    const secondPromise = runWithContext({ event: 'change' })

    await vi.advanceTimersByTimeAsync(100)

    expect(validate).toHaveBeenCalledOnce()

    await expect(firstPromise).resolves.toHaveLength(1)
    await expect(firstPromise).resolves.toContainEqual(
      expect.objectContaining({ result: null }),
    )

    await expect(secondPromise).resolves.toHaveLength(1)
    await expect(secondPromise).resolves.toContainEqual(
      expect.objectContaining({ result: validationResult }),
    )

    vi.useRealTimers()
  })

  it('should abort existing async validation when same event runs again', async () => {
    const formApi = getForm({ name: '' })

    let resolveFirstValidation!: () => void
    const waitForFirstValidation = new Promise<void>((resolve) => {
      resolveFirstValidation = resolve
    })

    const validate = vi
      .fn()
      .mockResolvedValueOnce(
        waitForFirstValidation.then(() => ({ message: 'first' })),
      )
      .mockResolvedValueOnce({ message: 'second' })

    const { runWithContext } = getPipeline(formApi, [
      {
        validate,
        signals: ['change'],
      },
    ])

    const firstPromise = runWithContext({ event: 'change' })
    expect(validate).toHaveBeenCalledOnce()

    const secondPromise = runWithContext({ event: 'change' })
    expect(validate).toHaveBeenCalledTimes(2)

    resolveFirstValidation()

    await expect(firstPromise).resolves.toHaveLength(1)
    await expect(firstPromise).resolves.toContainEqual(
      expect.objectContaining({ result: null }),
    )

    await expect(secondPromise).resolves.toHaveLength(1)
    await expect(secondPromise).resolves.toContainEqual(
      expect.objectContaining({ result: { message: 'second' } }),
    )
  })
})
