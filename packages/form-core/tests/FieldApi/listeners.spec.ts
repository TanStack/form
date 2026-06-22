import { describe, expect, it, vi } from 'vitest'
import { InternalFormApi } from '../../src/FormApi/FormApi.lib'

describe('field - listeners', () => {
  it('change listeners', () => {
    const listener = vi.fn()

    const form = new InternalFormApi({ defaultValues: { x: '' } })
    const field = form._getOrCreateFieldApi({
      name: 'x',
      listeners: [{ triggers: ['change'], run: listener }],
    })

    field.handleChange('x')
    expect(listener).toHaveBeenCalledOnce()
  })

  it('blur listeners', () => {
    const listener = vi.fn()

    const form = new InternalFormApi({ defaultValues: { x: '' } })
    const field = form._getOrCreateFieldApi({
      name: 'x',
      listeners: [{ triggers: ['blur'], run: listener }],
    })

    field.handleBlur()
    expect(listener).toHaveBeenCalledOnce()
  })

  it('skips a field listener when a boolean predicate disables the trigger', () => {
    const listener = vi.fn()

    const form = new InternalFormApi({ defaultValues: { x: '' } })
    const field = form._getOrCreateFieldApi({
      name: 'x',
      listeners: [
        {
          triggers: [{ trigger: 'change', when: false }],
          run: listener,
        },
      ],
    })

    field.handleChange('x')

    expect(listener).not.toHaveBeenCalled()
  })

  it('passes field context to listener predicates', () => {
    const listener = vi.fn()
    const when = vi.fn(({ triggerFieldApi, value }) => {
      expect(triggerFieldApi.name).toBe('x')
      return value === 'run'
    })

    const form = new InternalFormApi({ defaultValues: { x: '' } })
    const field = form._getOrCreateFieldApi({
      name: 'x',
      listeners: [
        {
          triggers: [{ trigger: 'change', when }],
          run: listener,
        },
      ],
    })

    field.handleChange('skip')
    field.handleChange('run')

    expect(when).toHaveBeenCalledTimes(2)
    expect(listener).toHaveBeenCalledOnce()
  })

  it('does not run field listeners without triggers', () => {
    const listener = vi.fn()

    const form = new InternalFormApi({ defaultValues: { x: '' } })
    const field = form._getOrCreateFieldApi({
      name: 'x',
      listeners: [{ run: listener }],
    })

    field.handleChange('x')

    expect(listener).not.toHaveBeenCalled()
  })

  it('reset listeners', () => {
    const listener = vi.fn()

    const form = new InternalFormApi({ defaultValues: { x: '' } })
    const field = form._getOrCreateFieldApi({
      name: 'x',
      listeners: [{ triggers: ['reset'], run: listener }],
    })

    field.reset()
    expect(listener).toHaveBeenCalledOnce()
  })

  it('notifies reset listeners when a form reset happens', () => {
    const parentListener = vi.fn()
    const childListener = vi.fn()

    const form = new InternalFormApi({ defaultValues: { a: { b: '' } } })
    form._getOrCreateFieldApi({
      name: 'a',
      listeners: [{ triggers: ['reset'], run: parentListener }],
    })
    form._getOrCreateFieldApi({
      name: 'a.b',
      listeners: [{ triggers: ['reset'], run: childListener }],
    })

    form.reset()
    expect(parentListener).toHaveBeenCalledOnce()
    expect(childListener).toHaveBeenCalledOnce()
  })

  it('mount listeners', () => {
    const listener = vi.fn()

    const form = new InternalFormApi({ defaultValues: { x: '' } })
    const field = form._getOrCreateFieldApi({
      name: 'x',
      listeners: [{ triggers: ['mount'], run: listener }],
    })

    field._register()
    expect(listener).toHaveBeenCalledOnce()
  })

  it('unmount listeners', () => {
    const listener = vi.fn()

    const form = new InternalFormApi({ defaultValues: { x: '' } })
    const field = form._getOrCreateFieldApi({
      name: 'x',
      listeners: [{ triggers: ['unmount'], run: listener }],
    })

    field._register()
    field._unregister()
    expect(listener).toHaveBeenCalledOnce()
  })

  it('supports dynamic debounce for field listeners', async () => {
    vi.useFakeTimers()
    const listener = vi.fn()
    const triggerDebounceMs = vi.fn(({ formApi, triggerFieldApi, value }) => {
      expect(formApi.state.values).toEqual({ name: 'Alice' })
      expect(triggerFieldApi?.name).toBe('name')
      expect(value).toBe('Alice')
      return 100
    })

    const form = new InternalFormApi({ defaultValues: { name: '' } })
    const field = form._getOrCreateFieldApi({
      name: 'name',
      listeners: [
        {
          triggers: ['change'],
          triggerDebounceMs,
          run: listener,
        },
      ],
    })

    field.handleChange('Alice')

    expect(triggerDebounceMs).toHaveBeenCalledOnce()
    expect(listener).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(99)
    expect(listener).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(1)
    expect(listener).toHaveBeenCalledOnce()
    expect(listener).toHaveBeenCalledWith({
      value: 'Alice',
      fieldApi: field,
      formApi: form,
    })

    vi.useRealTimers()
  })

  describe('field - linked listeners ', () => {
    it('change listeners', () => {
      const watchedFieldListener = vi.fn()
      const unrelatedListener = vi.fn()

      const form = new InternalFormApi({
        defaultValues: { source: '', other: '', target: '' },
      })
      const targetField = form._getOrCreateFieldApi({
        name: 'target',
        listeners: [
          {
            triggers: ['change'],
            watchFields: ['source'],
            run: watchedFieldListener,
          },
          {
            triggers: ['change'],
            watchFields: ['other'],
            run: unrelatedListener,
          },
        ],
      })
      const sourceField = form._getOrCreateFieldApi({ name: 'source' })

      sourceField.handleChange('source')
      expect(watchedFieldListener).toHaveBeenCalledOnce()
      expect(watchedFieldListener).toHaveBeenCalledWith({
        value: '',
        fieldApi: targetField,
        formApi: form,
      })
      expect(unrelatedListener).not.toHaveBeenCalled()
    })

    it('blur listeners', () => {
      const watchedFieldListener = vi.fn()
      const unrelatedListener = vi.fn()

      const form = new InternalFormApi({
        defaultValues: { source: '', other: '', target: '' },
      })
      const targetField = form._getOrCreateFieldApi({
        name: 'target',
        listeners: [
          {
            triggers: ['blur'],
            watchFields: ['source'],
            run: watchedFieldListener,
          },
          {
            triggers: ['blur'],
            watchFields: ['other'],
            run: unrelatedListener,
          },
        ],
      })
      const sourceField = form._getOrCreateFieldApi({ name: 'source' })

      sourceField.handleBlur()
      expect(watchedFieldListener).toHaveBeenCalledOnce()
      expect(watchedFieldListener).toHaveBeenCalledWith({
        value: '',
        fieldApi: targetField,
        formApi: form,
      })
      expect(unrelatedListener).not.toHaveBeenCalled()
    })

    it('reset listeners', () => {
      const watchedFieldListener = vi.fn()
      const unrelatedListener = vi.fn()

      const form = new InternalFormApi({
        defaultValues: { source: '', other: '', target: '' },
      })
      const targetField = form._getOrCreateFieldApi({
        name: 'target',
        listeners: [
          {
            triggers: ['reset'],
            watchFields: ['source'],
            run: watchedFieldListener,
          },
          {
            triggers: ['reset'],
            watchFields: ['other'],
            run: unrelatedListener,
          },
        ],
      })
      const sourceField = form._getOrCreateFieldApi({ name: 'source' })

      sourceField.reset()
      expect(watchedFieldListener).toHaveBeenCalledOnce()
      expect(watchedFieldListener).toHaveBeenCalledWith({
        value: '',
        fieldApi: targetField,
        formApi: form,
      })
      expect(unrelatedListener).not.toHaveBeenCalled()
    })

    it('mount listeners', () => {
      const watchedFieldListener = vi.fn()
      const unrelatedListener = vi.fn()

      const form = new InternalFormApi({
        defaultValues: { source: '', other: '', target: '' },
      })
      const targetField = form._getOrCreateFieldApi({
        name: 'target',
        listeners: [
          {
            triggers: ['mount'],
            watchFields: ['source'],
            run: watchedFieldListener,
          },
          {
            triggers: ['mount'],
            watchFields: ['other'],
            run: unrelatedListener,
          },
        ],
      })
      const sourceField = form._getOrCreateFieldApi({ name: 'source' })

      sourceField._register()
      expect(watchedFieldListener).toHaveBeenCalledOnce()
      expect(watchedFieldListener).toHaveBeenCalledWith({
        value: '',
        fieldApi: targetField,
        formApi: form,
      })
      expect(unrelatedListener).not.toHaveBeenCalled()
    })

    it('unmount listeners', () => {
      const watchedFieldListener = vi.fn()
      const unrelatedListener = vi.fn()

      const form = new InternalFormApi({
        defaultValues: { source: '', other: '', target: '' },
      })
      const targetField = form._getOrCreateFieldApi({
        name: 'target',
        listeners: [
          {
            triggers: ['unmount'],
            watchFields: ['source'],
            run: watchedFieldListener,
          },
          {
            triggers: ['unmount'],
            watchFields: ['other'],
            run: unrelatedListener,
          },
        ],
      })
      const sourceField = form._getOrCreateFieldApi({ name: 'source' })

      sourceField._register()
      sourceField._unregister()
      expect(watchedFieldListener).toHaveBeenCalledOnce()
      expect(watchedFieldListener).toHaveBeenCalledWith({
        value: '',
        fieldApi: targetField,
        formApi: form,
      })
      expect(unrelatedListener).not.toHaveBeenCalled()
    })

    it('updates a dynamic watched field name after its field moves', () => {
      const listener = vi.fn()

      const form = new InternalFormApi({
        defaultValues: { users: ['first', 'second'], target: '' },
      })
      const targetField = form._getOrCreateFieldApi({
        name: 'target',
        listeners: [
          {
            triggers: ['change'],
            watchFields: ['users[0]'],
            run: listener,
          },
        ],
      })
      const fieldAt0Before = form._getOrCreateFieldApi({ name: 'users[0]' })
      const fieldAt1Before = form._getOrCreateFieldApi({ name: 'users[1]' })

      form.swapFieldValues('users', 0, 1)
      expect(form._getOrCreateFieldApi({ name: 'users[1]' })).toBe(
        fieldAt0Before,
      )

      targetField._update({
        listeners: [
          {
            triggers: ['change'],
            watchFields: ['users[1]'],
            run: listener,
          },
        ],
      })

      fieldAt1Before.handleChange('first index changed')
      expect(listener).not.toHaveBeenCalled()

      fieldAt0Before.handleChange('second index changed')
      expect(listener).toHaveBeenCalledOnce()
      expect(listener).toHaveBeenCalledWith({
        value: '',
        fieldApi: targetField,
        formApi: form,
      })
    })

    it('updates watched fields when the watched name changes without moving a field', () => {
      const listener = vi.fn()

      const form = new InternalFormApi({
        defaultValues: { source: '', other: '', target: '' },
      })
      const targetField = form._getOrCreateFieldApi({
        name: 'target',
        listeners: [
          {
            triggers: ['change'],
            watchFields: ['source'],
            run: listener,
          },
        ],
      })
      const sourceField = form._getOrCreateFieldApi({ name: 'source' })
      const otherField = form._getOrCreateFieldApi({ name: 'other' })

      targetField._update({
        listeners: [
          {
            triggers: ['change'],
            watchFields: ['other'],
            run: listener,
          },
        ],
      })

      sourceField.handleChange('source changed')
      expect(listener).not.toHaveBeenCalled()

      otherField.handleChange('other changed')
      expect(listener).toHaveBeenCalledOnce()
      expect(listener).toHaveBeenCalledWith({
        value: '',
        fieldApi: targetField,
        formApi: form,
      })
    })

    it('keeps remaining listener watches when one watched listener is removed', () => {
      const firstListener = vi.fn()
      const secondListener = vi.fn()

      const form = new InternalFormApi({
        defaultValues: { source: '', target: '' },
      })
      const targetField = form._getOrCreateFieldApi({
        name: 'target',
        listeners: [
          {
            triggers: ['change'],
            watchFields: ['source'],
            run: firstListener,
          },
          {
            triggers: ['change'],
            watchFields: ['source'],
            run: secondListener,
          },
        ],
      })
      const sourceField = form._getOrCreateFieldApi({ name: 'source' })

      targetField._update({
        listeners: [
          {
            triggers: ['change'],
            watchFields: ['source'],
            run: firstListener,
          },
        ],
      })
      sourceField.handleChange('source')

      expect(firstListener).toHaveBeenCalledOnce()
      expect(secondListener).not.toHaveBeenCalled()
    })

    it('keeps other watching fields attached when one field stops listening', () => {
      const firstListener = vi.fn()
      const secondListener = vi.fn()

      const form = new InternalFormApi({
        defaultValues: { source: '', first: '', second: '' },
      })
      const firstField = form._getOrCreateFieldApi({
        name: 'first',
        listeners: [
          {
            triggers: ['change'],
            watchFields: ['source'],
            run: firstListener,
          },
        ],
      })
      form._getOrCreateFieldApi({
        name: 'second',
        listeners: [
          {
            triggers: ['change'],
            watchFields: ['source'],
            run: secondListener,
          },
        ],
      })
      const sourceField = form._getOrCreateFieldApi({ name: 'source' })

      firstField._update({ listeners: [] })
      sourceField.handleChange('source')

      expect(firstListener).not.toHaveBeenCalled()
      expect(secondListener).toHaveBeenCalledOnce()
    })

    it("does not run a watched field's listener when the trigger does not match", () => {
      const listener = vi.fn()

      const form = new InternalFormApi({
        defaultValues: { source: '', target: '' },
      })
      form._getOrCreateFieldApi({
        name: 'target',
        listeners: [
          {
            triggers: ['blur'],
            watchFields: ['source'],
            run: listener,
          },
        ],
      })
      const sourceField = form._getOrCreateFieldApi({ name: 'source' })

      sourceField.handleChange('source')

      expect(listener).not.toHaveBeenCalled()
    })

    it('runs a linked listener when any of multiple watched fields changes', () => {
      const listener = vi.fn()

      const form = new InternalFormApi({
        defaultValues: { source: '', other: '', target: '' },
      })
      const targetField = form._getOrCreateFieldApi({
        name: 'target',
        listeners: [
          {
            triggers: ['change'],
            watchFields: ['source', 'other'],
            run: listener,
          },
        ],
      })
      const sourceField = form._getOrCreateFieldApi({ name: 'source' })
      const otherField = form._getOrCreateFieldApi({ name: 'other' })

      sourceField.handleChange('source')
      otherField.handleChange('other')

      expect(listener).toHaveBeenCalledTimes(2)
      expect(listener).toHaveBeenNthCalledWith(1, {
        value: '',
        fieldApi: targetField,
        formApi: form,
      })
      expect(listener).toHaveBeenNthCalledWith(2, {
        value: '',
        fieldApi: targetField,
        formApi: form,
      })
    })

    it('follows fields across dynamic names', () => {
      const listener = vi.fn()
      const form = new InternalFormApi({
        defaultValues: { users: [{ name: 'First' }, { name: 'Second' }] },
      })

      const firstField = form._getOrCreateFieldApi({ name: 'users[0]' })
      const secondField = form._getOrCreateFieldApi({
        name: 'users[1]',
        listeners: [
          { run: listener, watchFields: ['users[0]'], triggers: ['change'] },
        ],
      })

      // Confirm that SecondField is listening to firstField -> firstField change
      firstField.handleChange('New name')
      expect(listener).toHaveBeenCalledOnce()

      // swapFieldValues
      form.swapFieldValues('users', 0, 1)

      secondField._update({
        listeners: [
          { run: listener, watchFields: ['users[1]'], triggers: ['change'] },
        ],
      })
      firstField.handleChange('New new name')
      expect(listener).toHaveBeenCalledTimes(2)
    })

    it('handles mismatched field references when field name resolves to different instance', () => {
      const listener = vi.fn()
      const form = new InternalFormApi({
        defaultValues: {
          users: [{ name: 'First' }, { name: 'Second' }, { name: 'Third' }],
        },
      })

      const oldField = form._getOrCreateFieldApi({ name: 'users[0]' })
      const watchingField = form._getOrCreateFieldApi({
        name: 'users[1]',
        listeners: [
          { run: listener, watchFields: ['users[0]'], triggers: ['change'] },
        ],
      })

      oldField.handleChange('First change')
      expect(listener).toHaveBeenCalledOnce()
      listener.mockClear()

      // Swap the field values - now users[0] resolves to what was users[2]
      form.swapFieldValues('users', 0, 2)

      // Update listener to still watch 'users[0]', but now that name resolves to thirdField
      watchingField._update({
        listeners: [
          { run: listener, watchFields: ['users[0]'], triggers: ['change'] },
        ],
      })

      oldField.handleChange('Second change')
      // old firstField change should NOT trigger listener
      // because we're no longer watching it
      expect(listener).not.toHaveBeenCalled()

      const newField = form._getOrCreateFieldApi({ name: 'users[0]' })
      newField.handleChange('Third change')
      expect(listener).toHaveBeenCalledOnce()
    })

    it('should warn if a field watches itself', async () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const listener = vi.fn()
      const form = new InternalFormApi({
        defaultValues: { name: '' },
      })

      const firstField = form._getOrCreateFieldApi({
        name: 'name',
        listeners: [
          { run: listener, watchFields: ['name'], triggers: ['change'] },
        ],
      })

      firstField.handleChange('Change')
      await vi.waitFor(() => {
        expect(consoleSpy).toHaveBeenCalled()
        expect(listener).toHaveBeenCalledOnce()
      })

      consoleSpy.mockRestore()
    })

    it('should skip listeners that do not watch the linked field', () => {
      const listener1 = vi.fn()
      const listener2 = vi.fn()
      const listener3 = vi.fn()

      const form = new InternalFormApi({
        defaultValues: { source: '', target: '' },
      })

      form._getOrCreateFieldApi({
        name: 'target',
        listeners: [
          { run: listener1, triggers: ['change'], watchFields: ['source'] },
          { run: listener2, triggers: ['change'] },
          { run: listener3, triggers: ['change'], watchFields: ['source'] },
        ],
      })

      const sourceField = form._getOrCreateFieldApi({ name: 'source' })

      sourceField.handleChange('new value')

      expect(listener1).toHaveBeenCalledOnce()
      expect(listener2).not.toHaveBeenCalled()
      expect(listener3).toHaveBeenCalledOnce()
    })

    it('clears watched listener links when reset kills fields', () => {
      const form = new InternalFormApi({
        defaultValues: { source: '', target: '' },
      })
      const targetField = form._getOrCreateFieldApi({
        name: 'target',
        listeners: [
          { run: vi.fn(), watchFields: ['source'], triggers: ['change'] },
        ],
      })
      const sourceField = form._getOrCreateFieldApi({ name: 'source' })

      expect(sourceField._watchingFields?.has(targetField)).toBe(true)
      expect(targetField._listenToFields?.[0]?.[0]?.field).toBe(sourceField)

      form.reset()

      expect(sourceField._watchingFields).toBeNull()
      expect(targetField._listenToFields).toBeNull()
      expect(sourceField._isKilled).toBe(true)
      expect(targetField._isKilled).toBe(true)
      expect(form._tryGetFieldApi('source')).toBeNull()
      expect(form._tryGetFieldApi('target')).toBeNull()
    })
  })
})
