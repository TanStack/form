import { describe, expect, it, vi } from 'vitest'
import { z } from 'zod'
import { runFormValidatorPipeline } from '../src/validation.lib'
import { InternalFormApi } from '../src/FormApi.lib'
import type { PipelineResult } from '../src/validation.lib'
import type {
  FormValidateResult,
  FormValidator,
  FormValidatorContext,
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
            fieldApi: args.field ?? null,
          },
          onResult: args.onResult,
          pipeline: pipeline,
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
  })

  it('should cancel an existing debounced validation when the same validator runs immediately', async () => {
    vi.useFakeTimers()

    const formApi = getForm({ name: '' })
    const validate = vi.fn(() => ({ message: 'foo' }))
    const onResult = vi.fn()

    const { runWithContext } = getPipeline(formApi, [
      {
        validate,
        signals: ['change'],
        signalDebounceMs: 100,
      },
    ])

    runWithContext({ event: 'change', onResult })

    await vi.advanceTimersByTimeAsync(50)

    const submitResults = await runWithContext({ event: 'submit', onResult })

    expect(validate).toHaveBeenCalledOnce()
    expect(submitResults).toHaveLength(1)

    expect(onResult).toHaveBeenCalledOnce()
    expect(onResult).toHaveBeenCalledWith(
      expect.objectContaining({
        result: { message: 'foo' },
      }),
    )

    await vi.advanceTimersByTimeAsync(100)

    expect(validate).toHaveBeenCalledOnce()
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
    const onResult = vi.fn()

    const { runWithContext } = getPipeline(formApi, [
      {
        validate,
        signals: ['change'],
        signalDebounceMs: 100,
      },
    ])

    const firstPromise = runWithContext({ event: 'change', onResult })

    await vi.advanceTimersByTimeAsync(50)
    const secondPromise = runWithContext({ event: 'change', onResult })

    await vi.advanceTimersByTimeAsync(100)

    expect(validate).toHaveBeenCalledOnce()

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

    const validate = vi
      .fn()
      .mockResolvedValueOnce(
        waitForFirstValidation.then(() => ({ message: 'first' })),
      )
      .mockResolvedValueOnce({ message: 'second' })
    const onResult = vi.fn()

    const { runWithContext } = getPipeline(formApi, [
      {
        validate,
        signals: ['change'],
      },
    ])

    const firstPromise = runWithContext({ event: 'change', onResult })
    expect(validate).toHaveBeenCalledOnce()

    const secondPromise = runWithContext({ event: 'change', onResult })
    expect(validate).toHaveBeenCalledTimes(2)

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
    const validate = vi.fn(() => validationResult)
    const onResult = vi.fn()

    const { runWithContext } = getPipeline(formApi, [
      {
        validate,
        signals: ['change'],
        signalDebounceMs: 100,
      },
    ])

    const firstPromise = runWithContext({ event: 'change', onResult })

    await vi.advanceTimersByTimeAsync(50)
    const secondPromise = runWithContext({ event: 'change', onResult })

    await vi.advanceTimersByTimeAsync(100)

    expect(validate).toHaveBeenCalledOnce()

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
        validate: ({ fieldApi }) => {
          if (fieldApi) {
            receivedFieldApiNames.push(fieldApi.name)
          }
          return null
        },
        signals: ['change'],
        signalDebounceMs: 100,
      },
    ])

    // Get or create field APIs for users[1] and users[2]
    const field1 = formApi._getOrCreateFieldApi('users[1]', undefined)
    const field2 = formApi._getOrCreateFieldApi('users[2]', undefined)

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
          validate: schema,
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
          validate: schema,
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
          validate: schema,
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
          validate: schema,
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
          validate: schema,
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
          validate: schema,
          signals: ['change'],
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
          validate: failingSchema,
        },
        {
          validate: passingSchema,
          runOnlyIfValid: true,
        },
        {
          validate: validateSpy,
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
          validate: schema,
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
          validate: schema,
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
