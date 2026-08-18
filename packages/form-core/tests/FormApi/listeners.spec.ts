import { describe, expect, it, vi } from 'vitest'
import { InternalFormApi } from '../../src/FormApi/FormApi.lib'

describe('form - listeners', () => {
  it('should run change listeners when a field changes', () => {
    const listener = vi.fn()
    const form = new InternalFormApi({
      defaultValues: { name: '' },
      listeners: [{ triggers: ['change'], run: listener }],
    })
    const field = form._getOrCreateFieldApi({ name: 'name' })

    field.handleChange('Alice')

    expect(listener).toHaveBeenCalledOnce()
    expect(listener).toHaveBeenCalledWith({
      formApi: form,
      triggerFieldApi: field,
      value: { name: 'Alice' },
    })
  })

  it('should run change listeners when form.setFieldValue is called', () => {
    const listener = vi.fn()
    const form = new InternalFormApi({
      defaultValues: { name: '' },
      listeners: [{ triggers: ['change'], run: listener }],
    })

    form.setFieldValue('name', 'Alice')

    expect(listener).toHaveBeenCalledOnce()
    expect(listener).toHaveBeenCalledWith({
      formApi: form,
      triggerFieldApi: form._tryGetFieldApi('name') ?? undefined,
      value: { name: 'Alice' },
    })
  })

  it('should run field blur listeners when a field blurs', () => {
    const listener = vi.fn()
    const form = new InternalFormApi({
      defaultValues: { name: '' },
      listeners: [{ triggers: ['blur'], run: listener }],
    })
    const field = form._getOrCreateFieldApi({ name: 'name' })

    field.handleBlur()

    expect(listener).toHaveBeenCalledOnce()
    expect(listener).toHaveBeenCalledWith({
      formApi: form,
      triggerFieldApi: field,
      value: { name: '' },
    })
  })

  it('should run form submit listeners when a submission starts', async () => {
    const listener = vi.fn()
    const form = new InternalFormApi({
      defaultValues: { name: '' },
      listeners: [{ triggers: ['submit'], run: listener }],
    })

    await form.handleSubmit()

    expect(listener).toHaveBeenCalledOnce()
    expect(listener).toHaveBeenCalledWith({
      formApi: form,
      triggerFieldApi: undefined,
      value: { name: '' },
    })
  })

  it('should run form mount listeners when form.mount() is called', () => {
    const listener = vi.fn()
    const form = new InternalFormApi({
      defaultValues: { name: '' },
      listeners: [{ triggers: ['mount'], run: listener }],
    })

    form.mount()

    expect(listener).toHaveBeenCalledOnce()
    expect(listener).toHaveBeenCalledWith({
      formApi: form,
      triggerFieldApi: undefined,
      value: { name: '' },
    })
  })

  it('should run form reset listeners when the form resets', () => {
    const listener = vi.fn()
    const form = new InternalFormApi({
      defaultValues: { name: '' },
      listeners: [{ triggers: ['reset'], run: listener }],
    })
    const field = form._getOrCreateFieldApi({ name: 'name' })

    field.handleChange('Alice')
    form.reset()

    expect(listener).toHaveBeenCalledOnce()
    expect(listener).toHaveBeenCalledWith({
      formApi: form,
      triggerFieldApi: undefined,
      value: { name: '' },
    })
  })

  it('should only run listeners matching the form event', () => {
    const changeListener = vi.fn()
    const blurListener = vi.fn()
    const form = new InternalFormApi({
      defaultValues: { name: '' },
      listeners: [
        { triggers: ['change'], run: changeListener },
        { triggers: ['blur'], run: blurListener },
      ],
    })
    const field = form._getOrCreateFieldApi({ name: 'name' })

    field.handleChange('Alice')

    expect(changeListener).toHaveBeenCalledOnce()
    expect(blurListener).not.toHaveBeenCalled()
  })

  it('should not run object triggers when the form event does not match', () => {
    const listener = vi.fn()
    const when = vi.fn(() => true)
    const form = new InternalFormApi({
      defaultValues: { name: '' },
      listeners: [
        {
          triggers: [{ trigger: 'blur', when }],
          run: listener,
        },
      ],
    })
    const field = form._getOrCreateFieldApi({ name: 'name' })

    field.handleChange('Alice')

    expect(listener).not.toHaveBeenCalled()
    expect(when).not.toHaveBeenCalled()
  })

  it('supports listener predicates for form events', () => {
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
    field.handleChange('Alice')

    expect(listener).toHaveBeenCalledOnce()
  })

  it('supports dynamic debounce for form listeners', async () => {
    vi.useFakeTimers()
    const listener = vi.fn()
    const triggerDebounceMs = vi.fn(({ formApi, triggerFieldApi, value }) => {
      expect(formApi.state.values).toEqual({ name: 'Alice' })
      expect(triggerFieldApi?.name).toBe('name')
      expect(value).toEqual({ name: 'Alice' })
      return 100
    })
    const form = new InternalFormApi({
      defaultValues: { name: '' },
      listeners: [
        {
          triggers: ['change'],
          triggerDebounceMs,
          run: listener,
        },
      ],
    })
    const field = form._getOrCreateFieldApi({ name: 'name' })

    field.handleChange('Alice')

    expect(triggerDebounceMs).toHaveBeenCalledOnce()
    expect(listener).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(99)
    expect(listener).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(1)
    expect(listener).toHaveBeenCalledOnce()
    expect(listener).toHaveBeenCalledWith({
      formApi: form,
      triggerFieldApi: field,
      value: { name: 'Alice' },
    })

    vi.useRealTimers()
  })

  it('keeps a pending debounce on a retained listener slot', async () => {
    vi.useFakeTimers()
    const firstListener = vi.fn()
    const nextListener = vi.fn()
    const form = new InternalFormApi({
      defaultValues: { name: '' },
      listeners: [
        {
          triggers: ['change'],
          triggerDebounceMs: 100,
          run: firstListener,
        },
      ],
    })
    const field = form._getOrCreateFieldApi({ name: 'name' })
    const instance = form._listenerInstances![0]!

    field.handleChange('pending')
    form._update({
      defaultValues: { name: '' },
      listeners: [
        {
          triggers: ['change'],
          triggerDebounceMs: 100,
          run: nextListener,
        },
      ],
    })
    await vi.advanceTimersByTimeAsync(100)

    expect(form._listenerInstances![0]).toBe(instance)
    expect(firstListener).toHaveBeenCalledOnce()
    expect(nextListener).not.toHaveBeenCalled()
    vi.useRealTimers()
  })

  it('logs rejected async form listener errors', async () => {
    const error = new Error('listener failed')
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
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

    await vi.waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled()
    })

    consoleSpy.mockRestore()
  })
})
