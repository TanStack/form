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
    expect(form._getOrCreateFieldApi({ name: 'users[1]' })).toBe(fieldAt0Before)

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
})
