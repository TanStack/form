import { describe, expect, it, vi } from 'vitest'
import { InternalFormApi } from '../src/FormApi/FormApi.lib'

describe('runFormListenerPipeline', () => {
  it('runs a blur listener only when the field blurs', () => {
    const listener = vi.fn()
    const form = new InternalFormApi({
      defaultValues: { name: '' },
      listeners: [
        {
          triggers: [{ trigger: 'blur', when: () => true }],
          run: listener,
        },
      ],
    })
    const field = form._getOrCreateFieldApi({ name: 'name' })

    field.handleChange('Alice')

    expect(listener).not.toHaveBeenCalled()

    field.handleBlur()

    expect(listener).toHaveBeenCalledOnce()
    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({
        formApi: form,
        triggerFieldApi: field,
        value: { name: 'Alice' },
      }),
    )
  })

  it('runs a form listener only when its predicate allows the current values', () => {
    const listener = vi.fn()
    const form = new InternalFormApi({
      defaultValues: { name: '' },
      listeners: [
        {
          triggers: [
            {
              trigger: 'change',
              when: ({ value }) => value.name === 'Alice',
            },
          ],
          run: listener,
        },
      ],
    })
    const field = form._getOrCreateFieldApi({ name: 'name' })

    field.handleChange('Bob')
    expect(listener).not.toHaveBeenCalled()

    field.handleChange('Alice')

    expect(listener).toHaveBeenCalledOnce()
    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({
        formApi: form,
        triggerFieldApi: field,
        value: { name: 'Alice' },
      }),
    )
  })

  it('delays a listener according to the current form values', async () => {
    vi.useFakeTimers()
    const listener = vi.fn()
    const form = new InternalFormApi({
      defaultValues: { name: '' },
      listeners: [
        {
          triggers: ['change'],
          triggerDebounceMs: ({ value }) => value.name.length * 20,
          run: listener,
        },
      ],
    })
    const field = form._getOrCreateFieldApi({ name: 'name' })

    field.handleChange('Alice')

    expect(listener).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(99)
    expect(listener).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(1)

    expect(listener).toHaveBeenCalledOnce()
    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({
        formApi: form,
        triggerFieldApi: field,
        value: { name: 'Alice' },
      }),
    )
  })

  it('reports the error rejected by an async form listener', async ({
    onTestFinished,
  }) => {
    const error = new Error('listener failed')
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    onTestFinished(() => consoleError.mockRestore())
    const form = new InternalFormApi({
      defaultValues: { name: '' },
      listeners: [
        {
          triggers: ['change'],
          run: () => Promise.reject(error),
        },
      ],
    })
    const field = form._getOrCreateFieldApi({ name: 'name' })

    field.handleChange('Alice')

    await expect
      .poll(() => consoleError.mock.calls)
      .toContainEqual(expect.arrayContaining([error]))
  })
})

describe('runFieldListenerPipeline', () => {
  it('skips disabled listeners and listeners with no triggers', () => {
    const disabledListener = vi.fn()
    const inactiveListener = vi.fn()
    const form = new InternalFormApi({ defaultValues: { name: '' } })
    const field = form._getOrCreateFieldApi({
      name: 'name',
      listeners: [
        {
          triggers: [{ trigger: 'change', when: false }],
          run: disabledListener,
        },
        { triggers: [], run: inactiveListener },
      ],
    })

    field.handleChange('Alice')

    expect(field.value).toBe('Alice')
    expect(disabledListener).not.toHaveBeenCalled()
    expect(inactiveListener).not.toHaveBeenCalled()
  })

  it('runs a listener only when its predicate allows the current field context', () => {
    const listener = vi.fn()
    const form = new InternalFormApi({ defaultValues: { name: '' } })
    const field = form._getOrCreateFieldApi({
      name: 'name',
      listeners: [
        {
          triggers: [
            {
              trigger: 'change',
              when: ({ triggerFieldApi, value }) =>
                triggerFieldApi?.name === 'name' && value === 'Alice',
            },
          ],
          run: listener,
        },
      ],
    })

    field.handleChange('Bob')
    expect(listener).not.toHaveBeenCalled()

    field.handleChange('Alice')

    expect(listener).toHaveBeenCalledOnce()
    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({
        value: 'Alice',
        fieldApi: field,
        formApi: form,
      }),
    )
  })

  it('delays a listener according to the current field context', async () => {
    vi.useFakeTimers()
    const listener = vi.fn()
    const form = new InternalFormApi({ defaultValues: { name: '' } })
    const field = form._getOrCreateFieldApi({
      name: 'name',
      listeners: [
        {
          triggers: ['change'],
          triggerDebounceMs: ({ formApi, triggerFieldApi, value }) => {
            if (triggerFieldApi?.name !== 'name') return 0
            if (formApi.state.values.name === value) return 0
            return value.length * 20
          },
          run: listener,
        },
      ],
    })

    field.handleChange('Alice')

    expect(listener).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(99)
    expect(listener).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(1)

    expect(listener).toHaveBeenCalledOnce()
    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({
        value: 'Alice',
        fieldApi: field,
        formApi: form,
      }),
    )
  })
})
