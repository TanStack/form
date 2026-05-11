import { describe, expect, it, vi } from 'vitest'
import { z } from 'zod'
import {
  runFieldValidatorPipeline,
  runFormValidatorPipeline,
} from '../src/validation.lib'
import { InternalFormApi } from '../src/FormApi.lib'
import type { PipelineResult } from '../src/validation.lib'
import type {
  FieldValidateResult,
  FieldValidator,
  FormValidateResult,
  FormValidator,
  FormValidatorContext,
  ValidationDebounceFn,
  ValidationPredicateFn,
} from '../src'
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
        onResult?: (result: PipelineResult<FormValidateResult>) => void
      }) => {
        return runFormValidatorPipeline({
          context: {
            event: args.event,
            formApi: form,
            triggerFieldApi: args.field,
          },
          onResult: args.onResult,
          pipeline: pipeline,
        })
      },
    }
  }

  function getFieldPipeline<T, TValue>(
    form: InternalFormApi<T, Array<any>>,
    field: InternalFieldApi<T, Array<any>>,
    pipeline: Array<FieldValidator<T, TValue>>,
  ) {
    return {
      pipeline,
      runWithContext: (args: {
        event: Event
        onResult?: (result: PipelineResult<FieldValidateResult>) => void
      }) => {
        return runFieldValidatorPipeline({
          context: {
            event: args.event,
            formApi: form,
            fieldApi: field,
          },
          onResult: args.onResult,
          pipeline,
        })
      },
    }
  }

  it('should run the pipeline with appropriate defaults', async () => {
    const formApi = getForm({ name: '' })
    const { runWithContext } = getPipeline(formApi, [
      {
        run: () => ({ message: 'foo' }),
      },
    ])
    const results = await runWithContext({ event: 'submit' })
    expect(results).toHaveLength(1)
    expect(results).toContainEqual(
      expect.objectContaining({ result: { message: 'foo' } }),
    )
  })

  it('should only run validators with matching signal', async () => {
    const formApi = getForm({ name: '' })

    const change = vi.fn()
    const blur = vi.fn()
    const blurOrChange = vi.fn()

    const { runWithContext } = getPipeline(formApi, [
      {
        run: change,
        triggers: ['change'],
      },
      {
        run: blur,
        triggers: ['blur'],
      },
      {
        run: blurOrChange,
        triggers: ['blur', 'change'],
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
        run: trueByDefault,
      },
      {
        run: trueCallback,
        runOnSubmit: () => true,
      },
      {
        run: trueBoolean,
        runOnSubmit: true,
      },
      {
        run: falseBoolean,
        runOnSubmit: false,
      },
      {
        run: falseCallback,
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
    const run = vi.fn(() => ({ message: 'foo' }))

    const { runWithContext } = getPipeline(formApi, [
      {
        run,
        triggers: ['change'],
        triggerDebounceMs: 100,
      },
    ])

    const promise = runWithContext({ event: 'change' })

    expect(run).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(99)
    expect(run).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(1)

    await expect(promise).resolves.toHaveLength(1)

    expect(run).toHaveBeenCalledOnce()
  })

  it('should debounce validation with a function', async () => {
    vi.useFakeTimers()

    const formApi = getForm({ name: 'test' })
    const field = formApi._getOrCreateFieldApi({ name: 'name' })
    const run = vi.fn(() => ({ message: 'foo' }))
    const triggerDebounceMs = vi.fn(({ formApi, triggerFieldApi, value }) => {
      expect(formApi.state.values).toEqual({ name: 'test' })
      expect(triggerFieldApi).toBe(field)
      expect(value).toEqual({ name: 'test' })

      return 100
    })

    const { runWithContext } = getPipeline(formApi, [
      {
        run,
        triggers: ['change'],
        triggerDebounceMs,
      },
    ])

    const promise = runWithContext({ event: 'change', field })

    expect(triggerDebounceMs).toHaveBeenCalledOnce()
    expect(run).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(99)
    expect(run).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(1)

    await expect(promise).resolves.toHaveLength(1)

    expect(run).toHaveBeenCalledOnce()
  })

  it('should use field value for field-level debounce functions', async () => {
    vi.useFakeTimers()

    const formApi = getForm({ name: 'test' })
    const field = formApi._getOrCreateFieldApi({ name: 'name' })
    const run = vi.fn(() => ({ message: 'foo' }))
    const triggerDebounceMs: ValidationDebounceFn<{ name: string }, string> =
      vi.fn(({ value }) => {
        expect(value).toBe('test')

        return value.length * 20
      })
    const pipeline: Array<FieldValidator<{ name: string }, string>> = [
      {
        run,
        triggers: ['change'],
        triggerDebounceMs,
      },
    ]

    const { runWithContext } = getFieldPipeline(formApi, field, pipeline)

    const promise = runWithContext({ event: 'change' })

    expect(triggerDebounceMs).toHaveBeenCalledOnce()
    expect(run).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(79)
    expect(run).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(21)

    await expect(promise).resolves.toHaveLength(1)

    expect(run).toHaveBeenCalledOnce()
  })

  it('should cancel an existing debounced validation when the same validator runs immediately', async () => {
    vi.useFakeTimers()

    const formApi = getForm({ name: '' })
    const run = vi.fn(() => ({ message: 'foo' }))
    const onResult = vi.fn()

    const { runWithContext } = getPipeline(formApi, [
      {
        run,
        triggers: ['change'],
        triggerDebounceMs: 100,
      },
    ])

    runWithContext({ event: 'change', onResult })

    await vi.advanceTimersByTimeAsync(50)

    const submitResults = await runWithContext({ event: 'submit', onResult })

    expect(run).toHaveBeenCalledOnce()
    expect(submitResults).toHaveLength(1)

    expect(onResult).toHaveBeenCalledOnce()
    expect(onResult).toHaveBeenCalledWith(
      expect.objectContaining({
        result: { message: 'foo' },
      }),
    )

    await vi.advanceTimersByTimeAsync(100)

    expect(run).toHaveBeenCalledOnce()
  })

  it('should debounce separate validators independently', async () => {
    vi.useFakeTimers()

    const formApi = getForm({ name: '' })

    const first = vi.fn(() => ({ message: 'first' }))
    const second = vi.fn(() => ({ message: 'second' }))

    const { runWithContext } = getPipeline(formApi, [
      {
        run: first,
        triggers: ['change'],
        triggerDebounceMs: 100,
      },
      {
        run: second,
        triggers: ['change'],
        triggerDebounceMs: 200,
      },
    ])

    const promise = runWithContext({ event: 'change' })

    await vi.advanceTimersByTimeAsync(100)

    expect(first).toHaveBeenCalledOnce()
    expect(second).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(100)

    await expect(promise).resolves.toHaveLength(2)

    expect(second).toHaveBeenCalledOnce()
  })

  it('should not debounce submit validation', async () => {
    vi.useFakeTimers()

    const formApi = getForm({ name: '' })
    const run = vi.fn(() => ({ message: 'foo' }))

    const { runWithContext } = getPipeline(formApi, [
      {
        run,
        triggers: ['change'],
        triggerDebounceMs: 100,
      },
    ])

    const results = await runWithContext({ event: 'submit' })

    expect(run).toHaveBeenCalledOnce()
    expect(results).toHaveLength(1)
  })

  it('should check for enabled triggers', async () => {
    const formApi = getForm({ name: '' })
    const run = vi.fn(() => ({ message: 'foo' }))

    let doThing = false

    const { runWithContext } = getPipeline(formApi, [
      {
        run,
        triggers: [
          { trigger: 'change', when: () => doThing },
          { trigger: 'blur', when: doThing },
        ],
      },
    ])

    await runWithContext({ event: 'change' })
    await runWithContext({ event: 'blur' })

    expect(run).not.toHaveBeenCalled()

    doThing = true

    // Since it's a function for enable, it should be the most up to date value
    await runWithContext({ event: 'change' })
    expect(run).toHaveBeenCalledOnce()
    // but blur should have the value stored on its own, not being updated
    await runWithContext({ event: 'blur' })
    expect(run).toHaveBeenCalledOnce()
  })

  it('should use field value for field-level trigger predicates', async () => {
    const formApi = getForm({ name: 'test' })
    const field = formApi._getOrCreateFieldApi({ name: 'name' })
    const run = vi.fn(() => ({ message: 'foo' }))
    const when: ValidationPredicateFn<{ name: string }, string> = vi.fn(
      ({ value }) => value === 'test',
    )

    const { runWithContext } = getFieldPipeline(formApi, field, [
      {
        run,
        triggers: [{ trigger: 'change', when }],
      },
    ])

    await runWithContext({ event: 'change' })

    expect(when).toHaveBeenCalledOnce()
    expect(when).toHaveBeenCalledWith(
      expect.objectContaining({
        value: 'test',
        triggerFieldApi: field,
      }),
    )
    expect(run).toHaveBeenCalledOnce()
  })

  it('should abort existing debounced validation when same event runs again', async () => {
    vi.useFakeTimers()

    const formApi = getForm({ name: '' })
    const validationResult = { message: 'foo' }
    const run = vi.fn(() => validationResult)
    const onResult = vi.fn()

    const { runWithContext } = getPipeline(formApi, [
      {
        run,
        triggers: ['change'],
        triggerDebounceMs: 100,
      },
    ])

    const firstPromise = runWithContext({ event: 'change', onResult })

    await vi.advanceTimersByTimeAsync(50)
    const secondPromise = runWithContext({ event: 'change', onResult })

    await vi.advanceTimersByTimeAsync(100)

    expect(run).toHaveBeenCalledOnce()

    await firstPromise
    await secondPromise

    expect(onResult).toHaveBeenCalledOnce()
    expect(onResult).toHaveBeenCalledWith(
      expect.objectContaining({ result: validationResult }),
    )
  })

  it('should abort existing async validation when same event runs again', async () => {
    const formApi = getForm({ name: '' })

    let resolveFirstValidation!: () => void
    const waitForFirstValidation = new Promise<void>((resolve) => {
      resolveFirstValidation = resolve
    })

    const run = vi
      .fn()
      .mockResolvedValueOnce(
        waitForFirstValidation.then(() => ({ message: 'first' })),
      )
      .mockResolvedValueOnce({ message: 'second' })
    const onResult = vi.fn()

    const { runWithContext } = getPipeline(formApi, [
      {
        run,
        triggers: ['change'],
      },
    ])

    const firstPromise = runWithContext({ event: 'change', onResult })
    expect(run).toHaveBeenCalledOnce()

    const secondPromise = runWithContext({ event: 'change', onResult })
    expect(run).toHaveBeenCalledTimes(2)

    resolveFirstValidation()

    await firstPromise
    await secondPromise

    expect(onResult).toHaveBeenCalledOnce()
    expect(onResult).toHaveBeenCalledWith(
      expect.objectContaining({ result: { message: 'second' } }),
    )
  })

  it('should not call onResult for aborted debounced calls', async () => {
    vi.useFakeTimers()

    const formApi = getForm({ name: '' })
    const validationResult = { message: 'foo' }
    const run = vi.fn(() => validationResult)
    const onResult = vi.fn()

    const { runWithContext } = getPipeline(formApi, [
      {
        run,
        triggers: ['change'],
        triggerDebounceMs: 100,
      },
    ])

    const firstPromise = runWithContext({ event: 'change', onResult })

    await vi.advanceTimersByTimeAsync(50)
    const secondPromise = runWithContext({ event: 'change', onResult })

    await vi.advanceTimersByTimeAsync(100)

    expect(run).toHaveBeenCalledOnce()

    await firstPromise
    await secondPromise

    expect(onResult).toHaveBeenCalledOnce()
    expect(onResult).toHaveBeenCalledWith(
      expect.objectContaining({
        validatorIndex: 0,
        result: validationResult,
      }),
    )
  })

  it('should use the correct fieldApi when debounced validation is triggered by different fields', async () => {
    vi.useFakeTimers()

    const formApi = getForm({ users: ['a', 'b', 'c'] })
    const receivedFieldApiNames: Array<string> = []

    const { runWithContext } = getPipeline(formApi, [
      {
        run: ({ triggerFieldApi }) => {
          if (triggerFieldApi) {
            receivedFieldApiNames.push(triggerFieldApi.name)
          }
          return null
        },
        triggers: ['change'],
        triggerDebounceMs: 100,
      },
    ])

    // Get or create field APIs for users[1] and users[2]
    const field1 = formApi._getOrCreateFieldApi({ name: 'users[1]' })
    const field2 = formApi._getOrCreateFieldApi({ name: 'users[2]' })

    // Trigger validation for users[1]
    const firstPromise = runWithContext({ event: 'change', field: field1 })

    // Advance time partially (before debounce completes)
    await vi.advanceTimersByTimeAsync(50)

    // Trigger validation for users[2] (this should abort the first debounced call)
    const secondPromise = runWithContext({ event: 'change', field: field2 })

    // Advance time to complete the debounce
    await vi.advanceTimersByTimeAsync(100)

    await firstPromise
    await secondPromise

    // The validator should have been called once with users[2], not users[1]
    expect(receivedFieldApiNames).toHaveLength(1)
    expect(receivedFieldApiNames[0]).toBe('users[2]')
  })

  describe('Standard Schema validation', () => {
    /**
     * Assert that the result consists of certain fields with certain errors.
     *
     * {
     *   // ...any
     *   result: {
     *     // ...any
     *     fields: {
     *       fieldName: []
     *     }
     *   }
     * }
     */
    function getFieldErrorMatcher(fields: Record<string, Array<string>>) {
      const fieldMatchers = Object.fromEntries(
        Object.entries(fields).map(([fieldName, messages]) => [
          fieldName,
          expect.arrayContaining(
            messages.map((message) =>
              expect.objectContaining({
                message,
              }),
            ),
          ),
        ]),
      )

      return expect.objectContaining({
        result: expect.objectContaining({
          fields: fieldMatchers,
        }),
      })
    }

    it('should validate form with a successful zod schema', async () => {
      const formApi = getForm({ name: 'test', age: 25 })

      const schema = z.object({
        name: z.string().min(1),
        age: z.number().min(0),
      })

      const { runWithContext } = getPipeline(formApi, [
        {
          run: schema,
        },
      ])

      const results = await runWithContext({ event: 'submit' })

      expect(results).toHaveLength(1)
      expect(results[0]?.result).toBeNull()
    })

    it('should validate form with a failing zod schema', async () => {
      const formApi = getForm({ name: '', age: 25 })

      const schema = z.object({
        name: z.string().min(1, 'Name is required'),
        age: z.number().min(0),
      })

      const { runWithContext } = getPipeline(formApi, [
        {
          run: schema,
        },
      ])

      const results = await runWithContext({ event: 'submit' })

      expect(results).toEqual([
        getFieldErrorMatcher({ name: ['Name is required'] }),
      ])
    })

    it('should validate form with multiple errors from zod schema', async () => {
      const formApi = getForm({ name: '', age: -5 })

      const schema = z.object({
        name: z.string().min(1, 'Name is required'),
        age: z.number().min(0, 'Age must be positive'),
      })

      const { runWithContext } = getPipeline(formApi, [
        {
          run: schema,
        },
      ])

      const results = await runWithContext({ event: 'submit' })

      expect(results).toEqual([
        getFieldErrorMatcher({
          name: ['Name is required'],
          age: ['Age must be positive'],
        }),
      ])
    })

    it('should validate form with nested path errors from zod schema', async () => {
      const formApi = getForm({ user: { name: '', email: '' } })

      const schema = z.object({
        user: z.object({
          name: z.string().min(1, 'Name is required'),
          email: z.email('Email is invalid'),
        }),
      })

      const { runWithContext } = getPipeline(formApi, [
        {
          run: schema,
        },
      ])

      const results = await runWithContext({ event: 'submit' })

      expect(results).toHaveLength(1)
      expect(results).toEqual([
        getFieldErrorMatcher({
          'user.name': ['Name is required'],
          'user.email': ['Email is invalid'],
        }),
      ])
    })

    it('should validate form with array path errors from zod schema', async () => {
      const formApi = getForm({ users: [{ name: '' }, { name: '' }] })

      const schema = z.object({
        users: z.array(
          z.object({
            name: z.string().min(1, 'Name is required'),
          }),
        ),
      })

      const { runWithContext } = getPipeline(formApi, [
        {
          run: schema,
        },
      ])

      const results = await runWithContext({ event: 'submit' })

      expect(results).toEqual([
        getFieldErrorMatcher({
          'users[0].name': ['Name is required'],
          'users[1].name': ['Name is required'],
        }),
      ])
    })

    it('should run zod schema validators with matching signal', async () => {
      const formApi = getForm({ name: '' })

      const schema = z.object({
        name: z.string().min(1, 'Name is required'),
      })

      const { runWithContext } = getPipeline(formApi, [
        {
          run: schema,
          triggers: ['change'],
        },
      ])

      const blurResults = await runWithContext({ event: 'blur' })
      expect(blurResults).toHaveLength(0)

      const changeResults = await runWithContext({ event: 'change' })
      expect(changeResults).toEqual([
        getFieldErrorMatcher({ name: ['Name is required'] }),
      ])

      const submitResults = await runWithContext({ event: 'change' })
      expect(submitResults).toEqual([
        getFieldErrorMatcher({ name: ['Name is required'] }),
      ])
    })

    it('should respect runOnlyIfValid with zod schema validators', async () => {
      const formApi = getForm({ name: '' })

      const failingSchema = z.object({
        name: z.string().min(1, 'Name is required'),
      })

      const passingSchema = z.object({
        name: z.string(),
      })

      const validateSpy = vi.fn(() => null)

      const { runWithContext } = getPipeline(formApi, [
        {
          run: failingSchema,
        },
        {
          run: passingSchema,
          runOnlyIfValid: true,
        },
        {
          run: validateSpy,
          runOnlyIfValid: true,
        },
      ])

      const results = await runWithContext({ event: 'submit' })

      expect(results[0]).toEqual(
        getFieldErrorMatcher({ name: ['Name is required'] }),
      )
      expect(validateSpy).not.toHaveBeenCalled()
    })

    it('should work with async zod schema validation', async () => {
      const formApi = getForm({ name: '' })

      // Zod schemas can be async with refinements
      const schema = z.object({
        name: z
          .string()
          // eslint-disable-next-line @typescript-eslint/require-await
          .refine(async (val) => val.length > 0, 'Name is required'),
      })

      const { runWithContext } = getPipeline(formApi, [
        {
          run: schema,
        },
      ])

      const results = await runWithContext({ event: 'submit' })

      expect(results).toEqual([
        getFieldErrorMatcher({ name: ['Name is required'] }),
      ])
    })

    it('should not run zod schema validators with runOnSubmit disabled', async () => {
      const formApi = getForm({ name: '' })

      const schema = z.object({
        name: z.string().min(1, 'Name is required'),
      })

      const { runWithContext } = getPipeline(formApi, [
        {
          run: schema,
          runOnSubmit: false,
        },
      ])

      const submitResults = await runWithContext({ event: 'submit' })
      expect(submitResults).toHaveLength(0)

      const changeResults = await runWithContext({ event: 'change' })
      expect(changeResults).toHaveLength(0)
    })
  })
})
