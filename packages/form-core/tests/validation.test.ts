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
})
