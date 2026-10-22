import { describe, expect, it, vi } from 'vitest'
import { InternalFormApi } from '../../src/FormApi/FormApi.lib'

describe('getOrCreateFieldApi', () => {
  it('applies validators to a field whose value was set before registration', async () => {
    const form = new InternalFormApi({ defaultValues: { name: '' } })

    form.setFieldValue('name', 'before render')
    expect(form.getFieldMeta('name')).toMatchObject({
      isTouched: true,
      isDirty: true,
    })
    expect(form.state.isValid).toBe(true)

    const field = form._getOrCreateFieldApi({
      name: 'name',
      validators: [{ run: () => 'Name is invalid', triggers: [] }],
    })
    field._register()

    expect(form.state.isValid).toBe(true)
    expect(field.value).toBe('before render')
    expect(field.meta).toMatchObject({
      isTouched: true,
      isDirty: true,
    })

    await form.handleSubmit()

    expect(field.errors).toEqual([{ message: 'Name is invalid' }])
    expect(form.state.isValid).toBe(false)
  })
})

describe('InternalFieldApi - name', () => {
  it('reports names for nested object fields', () => {
    const form = new InternalFormApi({
      defaultValues: { user: { profile: { name: 'Alice' } } },
    })
    const user = form._getOrCreateFieldApi({ name: 'user' })
    const profile = form._getOrCreateFieldApi({ name: 'user.profile' })
    const name = form._getOrCreateFieldApi({ name: 'user.profile.name' })

    expect(user.name).toBe('user')
    expect(profile.name).toBe('user.profile')
    expect(name.name).toBe('user.profile.name')
  })

  it('reports names for array items and nested properties', () => {
    const form = new InternalFormApi({
      defaultValues: {
        items: [{ name: 'Alice' }],
        user: { items: [{ name: 'Bob' }] },
      },
    })
    const item = form._getOrCreateFieldApi({ name: 'items[0]' })
    const name = form._getOrCreateFieldApi({ name: 'items[0].name' })
    const nestedName = form._getOrCreateFieldApi({ name: 'user.items[0].name' })

    expect(item.name).toBe('items[0]')
    expect(name.name).toBe('items[0].name')
    expect(nestedName.name).toBe('user.items[0].name')
  })

  it('reports names with consecutive array indices', () => {
    const form = new InternalFormApi({
      defaultValues: { items: [[['Alice'], ['Bob', 'Carol', 'Dan']]] },
    })
    const nestedArray = form._getOrCreateFieldApi({ name: 'items[0][1]' })
    const item = form._getOrCreateFieldApi({ name: 'items[0][1][2]' })

    expect(nestedArray.name).toBe('items[0][1]')
    expect(item.name).toBe('items[0][1][2]')
    expect(item.value).toBe('Dan')
  })

  it('reports names inside a top-level array', () => {
    const form = new InternalFormApi({
      defaultValues: [{ name: 'Alice' }],
    })
    const item = form._getOrCreateFieldApi({ name: '[0]' })
    const name = form._getOrCreateFieldApi({ name: '[0].name' })

    expect(item.name).toBe('[0]')
    expect(name.name).toBe('[0].name')
    expect(name.value).toBe('Alice')
  })
})

describe('InternalFieldApi - _update', () => {
  it('switches watched fields when the configured name changes', () => {
    const listener = vi.fn()
    const form = new InternalFormApi({
      defaultValues: { source: 'source', other: 'other', target: 'target' },
    })
    const target = form._getOrCreateFieldApi({
      name: 'target',
      listeners: [
        { triggers: ['change'], watchFields: ['source'], run: listener },
      ],
    })
    const source = form._getOrCreateFieldApi({ name: 'source' })
    const other = form._getOrCreateFieldApi({ name: 'other' })
    source._register()
    other._register()
    target._register()

    source.handleChange('before update')
    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({ value: 'target' }),
    )
    listener.mockClear()

    target._update({
      listeners: [
        { triggers: ['change'], watchFields: ['other'], run: listener },
      ],
    })
    source.handleChange('after update')
    expect(listener).not.toHaveBeenCalled()

    other.handleChange('new source')

    expect(listener).toHaveBeenCalledOnce()
    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({
        value: 'target',
        fieldApi: target,
        formApi: form,
      }),
    )
  })

  it('keeps a listener watching its source when another listener drops that watch', () => {
    const retainedListener = vi.fn()
    const detachedListener = vi.fn()
    const form = new InternalFormApi({
      defaultValues: { source: 'source', target: 'target' },
    })
    const target = form._getOrCreateFieldApi({
      name: 'target',
      listeners: [
        {
          triggers: ['change'],
          watchFields: ['source'],
          run: retainedListener,
        },
        {
          triggers: ['change'],
          watchFields: ['source'],
          run: detachedListener,
        },
      ],
    })
    const source = form._getOrCreateFieldApi({ name: 'source' })
    source._register()
    target._register()

    source.handleChange('before detaching')
    expect(retainedListener).toHaveBeenCalledOnce()
    expect(detachedListener).toHaveBeenCalledOnce()
    retainedListener.mockClear()
    detachedListener.mockClear()

    target._update({
      listeners: [
        {
          triggers: ['change'],
          watchFields: ['source'],
          run: retainedListener,
        },
        { triggers: ['change'], watchFields: [], run: detachedListener },
      ],
    })
    source.handleChange('after detaching')

    expect(retainedListener).toHaveBeenCalledOnce()
    expect(retainedListener).toHaveBeenCalledWith(
      expect.objectContaining({
        value: 'target',
        fieldApi: target,
        formApi: form,
      }),
    )
    expect(detachedListener).not.toHaveBeenCalled()

    target.handleChange('direct edit')

    expect(detachedListener).toHaveBeenCalledOnce()
    expect(detachedListener).toHaveBeenCalledWith(
      expect.objectContaining({
        value: 'direct edit',
        fieldApi: target,
        formApi: form,
      }),
    )
  })

  it('keeps other fields watching a source when one field stops watching', () => {
    const detachedListener = vi.fn()
    const retainedListener = vi.fn()
    const form = new InternalFormApi({
      defaultValues: { source: 'source', first: 'first', second: 'second' },
    })
    const first = form._getOrCreateFieldApi({
      name: 'first',
      listeners: [
        {
          triggers: ['change'],
          watchFields: ['source'],
          run: detachedListener,
        },
      ],
    })
    const second = form._getOrCreateFieldApi({
      name: 'second',
      listeners: [
        {
          triggers: ['change'],
          watchFields: ['source'],
          run: retainedListener,
        },
      ],
    })
    const source = form._getOrCreateFieldApi({ name: 'source' })
    source._register()
    first._register()
    second._register()

    source.handleChange('before detaching')
    expect(detachedListener).toHaveBeenCalledOnce()
    expect(retainedListener).toHaveBeenCalledOnce()
    detachedListener.mockClear()
    retainedListener.mockClear()

    first._update({
      listeners: [
        { triggers: ['change'], watchFields: [], run: detachedListener },
      ],
    })
    source.handleChange('after detaching')

    expect(detachedListener).not.toHaveBeenCalled()
    expect(retainedListener).toHaveBeenCalledOnce()
    expect(retainedListener).toHaveBeenCalledWith(
      expect.objectContaining({
        value: 'second',
        fieldApi: second,
        formApi: form,
      }),
    )

    first.handleChange('direct edit')

    expect(detachedListener).toHaveBeenCalledOnce()
    expect(detachedListener).toHaveBeenCalledWith(
      expect.objectContaining({
        value: 'direct edit',
        fieldApi: first,
        formApi: form,
      }),
    )
  })

  it('preserves a watch when both the source and the watching field move', () => {
    const listener = vi.fn()
    const form = new InternalFormApi({
      defaultValues: { users: [{ name: 'First' }, { name: 'Second' }] },
    })
    const name0 = form._getOrCreateFieldApi({ name: 'users[0].name' })
    const name1 = form._getOrCreateFieldApi({
      name: 'users[1].name',
      listeners: [
        { triggers: ['change'], watchFields: ['users[0].name'], run: listener },
      ],
    })

    name0.handleChange('before move')
    expect(listener).toHaveBeenCalledOnce()
    listener.mockClear()

    // Before:    0      1
    // After:     1      0
    // Fields:    name1  name0
    form.swapFieldValues('users', 0, 1)
    name0.handleChange('before confirmation')

    expect(listener).toHaveBeenCalledOnce()
    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({
        value: 'Second',
        fieldApi: name1,
        formApi: form,
      }),
    )
    listener.mockClear()

    name1._update({
      listeners: [
        { triggers: ['change'], watchFields: ['users[1].name'], run: listener },
      ],
    })
    name0.handleChange('after confirmation')

    expect(listener).toHaveBeenCalledOnce()
    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({
        value: 'Second',
        fieldApi: name1,
        formApi: form,
      }),
    )
    expect(form.state.values.users).toEqual([
      { name: 'Second' },
      { name: 'after confirmation' },
    ])
  })

  it('retargets a watch when an update rejects following the moved field', () => {
    const listener = vi.fn()
    const form = new InternalFormApi({
      defaultValues: { users: ['first', 'second'], target: 'target' },
    })
    const target = form._getOrCreateFieldApi({
      name: 'target',
      listeners: [
        { triggers: ['change'], watchFields: ['users[0]'], run: listener },
      ],
    })
    const user0 = form._getOrCreateFieldApi({ name: 'users[0]' })
    const user1 = form._getOrCreateFieldApi({ name: 'users[1]' })
    user0._register()
    user1._register()
    target._register()

    // Before:    0      1
    // After:     1      0
    // Fields:    user1  user0
    form.swapFieldValues('users', 0, 1)

    user1.handleChange('first index before update')
    expect(listener).not.toHaveBeenCalled()

    user0.handleChange('second index before update')
    expect(listener).toHaveBeenCalledOnce()
    listener.mockClear()

    // Keeping users[0] rejects following user0 to users[1].
    target._update({
      listeners: [
        { triggers: ['change'], watchFields: ['users[0]'], run: listener },
      ],
    })
    user0.handleChange('second index after update')
    expect(listener).not.toHaveBeenCalled()

    user1.handleChange('first index after update')

    expect(listener).toHaveBeenCalledOnce()
    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({
        value: 'target',
        fieldApi: target,
        formApi: form,
      }),
    )
    expect(form.state.values.users).toEqual([
      'first index after update',
      'second index after update',
    ])
  })

  it('keeps following a moved field when an update confirms its new name', () => {
    const listener = vi.fn()
    const form = new InternalFormApi({
      defaultValues: { users: ['first', 'second'], target: 'target' },
    })
    const target = form._getOrCreateFieldApi({
      name: 'target',
      listeners: [
        { triggers: ['change'], watchFields: ['users[0]'], run: listener },
      ],
    })
    const user0 = form._getOrCreateFieldApi({ name: 'users[0]' })
    const user1 = form._getOrCreateFieldApi({ name: 'users[1]' })

    user0.handleChange('first changed')
    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({ value: 'target' }),
    )
    listener.mockClear()

    // Before:    0      1
    // After:     1      0
    // Fields:    user1  user0
    form.swapFieldValues('users', 0, 1)

    // Follow the moved field before the next update confirms the watched name.
    user1.handleChange('first index before update')
    expect(listener).not.toHaveBeenCalled()

    user0.handleChange('second index before update')
    expect(listener).toHaveBeenCalledOnce()
    listener.mockClear()

    target._update({
      listeners: [
        { triggers: ['change'], watchFields: ['users[1]'], run: listener },
      ],
    })

    user1.handleChange('first index changed')
    expect(listener).not.toHaveBeenCalled()

    user0.handleChange('second index changed')

    expect(listener).toHaveBeenCalledOnce()
    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({
        value: 'target',
        fieldApi: target,
        formApi: form,
      }),
    )
    expect(form.state.values).toEqual({
      users: ['first index changed', 'second index changed'],
      target: 'target',
    })
  })

  it('retains default listeners before incoming listeners during construction and updates', () => {
    const defaultListener = vi.fn()
    const incomingListener = vi.fn()
    const updatedListener = vi.fn()
    const form = new InternalFormApi(
      { defaultValues: { name: '' } },
      {
        field: {
          listenersMerge: 'append',
          listeners: [{ triggers: ['change'], run: defaultListener }],
        },
      },
    )
    const field = form._getOrCreateFieldApi({
      name: 'name',
      listeners: [{ triggers: ['change'], run: incomingListener }],
    })

    field.handleChange('initial')

    expect(defaultListener).toHaveBeenCalledOnce()
    expect(incomingListener).toHaveBeenCalledOnce()
    expect(defaultListener).toHaveBeenCalledBefore(incomingListener)
    expect(incomingListener).toHaveBeenCalledWith(
      expect.objectContaining({ value: 'initial' }),
    )

    defaultListener.mockClear()
    incomingListener.mockClear()
    field._update({
      listeners: [{ triggers: ['change'], run: updatedListener }],
    })
    field.handleChange('updated')

    expect(defaultListener).toHaveBeenCalledOnce()
    expect(updatedListener).toHaveBeenCalledOnce()
    expect(defaultListener).toHaveBeenCalledBefore(updatedListener)
    expect(updatedListener).toHaveBeenCalledWith(
      expect.objectContaining({ value: 'updated' }),
    )
    expect(incomingListener).not.toHaveBeenCalled()
  })

  it('applies the default error boundary only after configuration and respects an explicit override', async () => {
    // This kinda masks a problem where an immediate mount validation on the form can 100% NOT respect
    // a field component with `errorBoundary`. Too bad, I assume this won't happen much.
    const form = new InternalFormApi(
      {
        defaultValues: { user: { name: '' } },
        validators: [
          {
            triggers: ['change'],
            run: ({ createErrorMap }) =>
              createErrorMap({ fields: { 'user.name': 'Name is required' } }),
          },
        ],
      },
      { field: { errorBoundary: true } },
    )
    const parent = form._getOrCreateFieldApi({ name: 'user' }, 'internal')
    const child = form._getOrCreateFieldApi({ name: 'user.name' }, 'internal')
    parent._register()
    child._register()

    await form.validate('change')
    expect(child.errors).toEqual([{ message: 'Name is required' }])
    expect(parent.errors).toEqual([])

    form._getOrCreateFieldApi({ name: 'user' })

    await form.validate('change')
    expect(parent.errors).toEqual([{ message: 'Name is required' }])
    expect(child.errors).toEqual([])

    parent._update({ errorBoundary: false })

    await form.validate('change')
    expect(child.errors).toEqual([{ message: 'Name is required' }])
    expect(parent.errors).toEqual([])
  })

  it('uses updated validators, retains omitted validators, and removes validators with an empty array', async ({
    onTestFinished,
  }) => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    onTestFinished(() => warn.mockRestore())
    const form = new InternalFormApi({ defaultValues: { name: '' } })
    const field = form._getOrCreateFieldApi({
      name: 'name',
      validators: [{ run: () => 'Initial error', triggers: [] }],
    })
    field._register()

    await form.handleSubmit()
    expect(field.errors).toEqual([{ message: 'Initial error' }])

    field._update({
      validators: [{ run: () => 'Updated error', triggers: [] }],
    })

    await form.handleSubmit()
    expect(field.errors).toEqual([{ message: 'Updated error' }])

    field._update({})

    await form.handleSubmit()
    expect(field.errors).toEqual([{ message: 'Updated error' }])

    field._update({ validators: [] })

    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining(
        'length of the validator array should not change',
      ),
    )
    await expect(form.handleSubmit()).resolves.toEqual([])
    expect(field.errors).toEqual([])
    expect(form.state.canSubmit).toBe(true)
  })

  it('uses updated listener callbacks and triggers, retains omitted listeners, and disables listeners with empty triggers', () => {
    const initialListener = vi.fn()
    const updatedListener = vi.fn()
    const form = new InternalFormApi({ defaultValues: { name: '' } })
    const field = form._getOrCreateFieldApi({
      name: 'name',
      listeners: [{ triggers: ['change'], run: initialListener }],
    })

    field.handleChange('initial')
    expect(initialListener).toHaveBeenCalledWith(
      expect.objectContaining({ value: 'initial' }),
    )
    initialListener.mockClear()

    field._update({
      listeners: [{ triggers: ['blur'], run: updatedListener }],
    })
    field.handleChange('updated')

    expect(initialListener).not.toHaveBeenCalled()
    expect(updatedListener).not.toHaveBeenCalled()

    field.handleBlur()
    expect(updatedListener).toHaveBeenCalledWith(
      expect.objectContaining({ value: 'updated' }),
    )
    updatedListener.mockClear()

    field._update({})
    field.handleBlur()
    expect(updatedListener).toHaveBeenCalledOnce()
    updatedListener.mockClear()

    field._update({
      listeners: [{ triggers: [], run: updatedListener }],
    })
    field.handleChange('disabled')
    field.handleBlur()

    expect(updatedListener).not.toHaveBeenCalled()
  })
})

describe('InternalFieldApi - atom', () => {
  it('exposes the default value with untouched, valid state', () => {
    const form = new InternalFormApi({ defaultValues: { name: 'Alice' } })
    const field = form._getOrCreateFieldApi({ name: 'name' })

    const state = field.atom.get()

    expect(state).toMatchObject({
      value: 'Alice',
      meta: {
        errors: [],
        isTouched: false,
        isDirty: false,
        isValid: true,
        isValidating: false,
      },
    })
  })
})

describe('InternalFieldApi - _getIsDefaultValue', () => {
  it('returns to the default value while remaining dirty after an edit is undone', () => {
    const form = new InternalFormApi({ defaultValues: { name: '' } })
    const field = form._getOrCreateFieldApi({ name: 'name' })

    expect(field.meta.isDefaultValue).toBe(true)

    field.handleChange('Alice')

    expect(field.value).toBe('Alice')
    expect(field.meta.isDefaultValue).toBe(false)

    field.handleChange('')

    expect(field.value).toBe('')
    expect(field.meta).toMatchObject({
      isDefaultValue: true,
      isDirty: true,
      isPristine: false,
    })
  })

  it('reports default-value state across nested fields', () => {
    const form = new InternalFormApi({
      defaultValues: { user: { firstName: 'Tony', lastName: 'Hawk' } },
    })
    const user = form._getOrCreateFieldApi({ name: 'user' })

    expect(user.meta.isDefaultValue).toBe(true)

    const firstName = form._getOrCreateFieldApi({ name: 'user.firstName' })
    const lastName = form._getOrCreateFieldApi({ name: 'user.lastName' })

    expect(firstName.meta.isDefaultValue).toBe(true)
    expect(lastName.meta.isDefaultValue).toBe(true)

    firstName.handleChange('Anthony')

    expect(user.value).toEqual({ firstName: 'Anthony', lastName: 'Hawk' })
    expect(user.meta.isDefaultValue).toBe(false)
    expect(firstName.meta.isDefaultValue).toBe(false)
    expect(lastName.meta.isDefaultValue).toBe(true)

    firstName.handleChange('Tony')

    expect(user.value).toEqual({ firstName: 'Tony', lastName: 'Hawk' })
    expect(user.meta.isDefaultValue).toBe(true)
    expect(firstName.meta.isDefaultValue).toBe(true)
    expect(lastName.meta.isDefaultValue).toBe(true)
  })

  it('keeps partially restored objects non-default', () => {
    const form = new InternalFormApi({
      defaultValues: { user: { firstName: 'Tony', lastName: 'Hawk' } },
    })
    const user = form._getOrCreateFieldApi({ name: 'user' })
    const firstName = form._getOrCreateFieldApi({ name: 'user.firstName' })
    const lastName = form._getOrCreateFieldApi({ name: 'user.lastName' })

    expect(form.state.isDefaultValue).toBe(true)
    expect(user.meta.isDefaultValue).toBe(true)
    expect(firstName.meta.isDefaultValue).toBe(true)
    expect(lastName.meta.isDefaultValue).toBe(true)

    firstName.handleChange('Max')
    lastName.handleChange('Mustermann')

    expect(form.state.isDefaultValue).toBe(false)
    expect(user.meta.isDefaultValue).toBe(false)
    expect(firstName.meta.isDefaultValue).toBe(false)
    expect(lastName.meta.isDefaultValue).toBe(false)

    firstName.handleChange('Tony')

    expect(user.value).toEqual({ firstName: 'Tony', lastName: 'Mustermann' })
    expect(form.state.isDefaultValue).toBe(false)
    expect(user.meta.isDefaultValue).toBe(false)
    expect(firstName.meta.isDefaultValue).toBe(true)
    expect(lastName.meta.isDefaultValue).toBe(false)

    lastName.handleChange('Hawk')

    expect(user.value).toEqual({ firstName: 'Tony', lastName: 'Hawk' })
    expect(form.state.isDefaultValue).toBe(true)
    expect(user.meta.isDefaultValue).toBe(true)
    expect(firstName.meta.isDefaultValue).toBe(true)
    expect(lastName.meta.isDefaultValue).toBe(true)
  })

  it('reports nested defaults after object replacement', () => {
    const form = new InternalFormApi({
      defaultValues: { user: { firstName: 'Tony', lastName: 'Hawk' } },
    })
    const user = form._getOrCreateFieldApi({ name: 'user' })
    const firstName = form._getOrCreateFieldApi({ name: 'user.firstName' })
    const lastName = form._getOrCreateFieldApi({ name: 'user.lastName' })

    expect(form.state.isDefaultValue).toBe(true)
    expect(user.meta.isDefaultValue).toBe(true)
    expect(firstName.meta.isDefaultValue).toBe(true)
    expect(lastName.meta.isDefaultValue).toBe(true)

    user.handleChange({ firstName: 'Max', lastName: 'Hawk' })

    expect(firstName.value).toBe('Max')
    expect(lastName.value).toBe('Hawk')
    expect(form.state.isDefaultValue).toBe(false)
    expect(user.meta.isDefaultValue).toBe(false)
    expect(firstName.meta.isDefaultValue).toBe(false)
    expect(lastName.meta.isDefaultValue).toBe(true)

    user.handleChange({ firstName: 'Tony', lastName: 'Hawk' })

    expect(user.value).toEqual({ firstName: 'Tony', lastName: 'Hawk' })
    expect(form.state.isDefaultValue).toBe(true)
    expect(user.meta.isDefaultValue).toBe(true)
    expect(firstName.meta.isDefaultValue).toBe(true)
    expect(lastName.meta.isDefaultValue).toBe(true)
  })

  it('reports nested state against updated defaults', () => {
    const form = new InternalFormApi({
      defaultValues: { user: { firstName: 'Tony', lastName: 'Hawk' } },
    })
    const user = form._getOrCreateFieldApi({ name: 'user' })
    const firstName = form._getOrCreateFieldApi({ name: 'user.firstName' })
    const lastName = form._getOrCreateFieldApi({ name: 'user.lastName' })

    firstName.handleChange('Max')

    expect(form.state.isDefaultValue).toBe(false)
    expect(user.meta.isDefaultValue).toBe(false)
    expect(firstName.meta.isDefaultValue).toBe(false)
    expect(lastName.meta.isDefaultValue).toBe(true)

    form._update({
      defaultValues: { user: { firstName: 'Max', lastName: 'Hawk' } },
    })

    expect(form.state.values).toEqual({
      user: { firstName: 'Max', lastName: 'Hawk' },
    })
    expect(form.state.isDefaultValue).toBe(true)
    expect(user.meta.isDefaultValue).toBe(true)
    expect(firstName.meta.isDefaultValue).toBe(true)
    expect(lastName.meta.isDefaultValue).toBe(true)

    form._update({
      defaultValues: { user: { firstName: 'Antonio', lastName: 'Hawk' } },
    })

    expect(form.state.values).toEqual({
      user: { firstName: 'Max', lastName: 'Hawk' },
    })
    expect(form.state.isDefaultValue).toBe(false)
    expect(user.meta.isDefaultValue).toBe(false)
    expect(firstName.meta.isDefaultValue).toBe(false)
    expect(lastName.meta.isDefaultValue).toBe(true)
  })

  it('reports new defaults after a form reset', () => {
    const form = new InternalFormApi({
      defaultValues: { user: { firstName: 'Tony', lastName: 'Hawk' } },
    })
    const previousUser = form._getOrCreateFieldApi({ name: 'user' })
    const previousFirstName = form._getOrCreateFieldApi({
      name: 'user.firstName',
    })
    const previousLastName = form._getOrCreateFieldApi({
      name: 'user.lastName',
    })

    previousFirstName.handleChange('Max')

    expect(form.state.isDefaultValue).toBe(false)
    expect(previousUser.meta.isDefaultValue).toBe(false)
    expect(previousFirstName.meta.isDefaultValue).toBe(false)
    expect(previousLastName.meta.isDefaultValue).toBe(true)

    form.reset({ user: { firstName: 'Rodney', lastName: 'Mullen' } })

    const user = form._getOrCreateFieldApi({ name: 'user' })
    const firstName = form._getOrCreateFieldApi({ name: 'user.firstName' })
    const lastName = form._getOrCreateFieldApi({ name: 'user.lastName' })

    previousFirstName.handleChange('stale edit')

    expect(form.state.values).toEqual({
      user: { firstName: 'Rodney', lastName: 'Mullen' },
    })
    expect(form.defaultValues).toEqual({
      user: { firstName: 'Rodney', lastName: 'Mullen' },
    })
    expect(form.state.isDefaultValue).toBe(true)
    expect(user.meta.isDefaultValue).toBe(true)
    expect(firstName.meta.isDefaultValue).toBe(true)
    expect(lastName.meta.isDefaultValue).toBe(true)

    firstName.handleChange('Tony')

    expect(user.value).toEqual({ firstName: 'Tony', lastName: 'Mullen' })
    expect(form.state.isDefaultValue).toBe(false)
    expect(user.meta.isDefaultValue).toBe(false)
    expect(firstName.meta.isDefaultValue).toBe(false)
    expect(lastName.meta.isDefaultValue).toBe(true)

    firstName.handleChange('Rodney')

    expect(user.value).toEqual({ firstName: 'Rodney', lastName: 'Mullen' })
    expect(form.state.isDefaultValue).toBe(true)
    expect(user.meta.isDefaultValue).toBe(true)
    expect(firstName.meta.isDefaultValue).toBe(true)
    expect(lastName.meta.isDefaultValue).toBe(true)
  })

  it('reports preserved defaults after a form reset', () => {
    const form = new InternalFormApi({
      defaultValues: { user: { firstName: 'Tony', lastName: 'Hawk' } },
    })
    const previousUser = form._getOrCreateFieldApi({ name: 'user' })
    const previousFirstName = form._getOrCreateFieldApi({
      name: 'user.firstName',
    })
    const previousLastName = form._getOrCreateFieldApi({
      name: 'user.lastName',
    })

    previousFirstName.handleChange('edited')

    expect(form.state.isDefaultValue).toBe(false)
    expect(previousUser.meta.isDefaultValue).toBe(false)
    expect(previousFirstName.meta.isDefaultValue).toBe(false)
    expect(previousLastName.meta.isDefaultValue).toBe(true)

    form.reset(
      { user: { firstName: 'Max', lastName: 'Hawk' } },
      { updateDefaultValues: false },
    )

    const user = form._getOrCreateFieldApi({ name: 'user' })
    const firstName = form._getOrCreateFieldApi({ name: 'user.firstName' })
    const lastName = form._getOrCreateFieldApi({ name: 'user.lastName' })

    previousFirstName.handleChange('stale edit')

    expect(form.state.values).toEqual({
      user: { firstName: 'Max', lastName: 'Hawk' },
    })
    expect(form.defaultValues).toEqual({
      user: { firstName: 'Tony', lastName: 'Hawk' },
    })
    expect(form.state.isDirty).toBe(false)
    expect(form.state.isDefaultValue).toBe(false)
    expect(user.meta.isDefaultValue).toBe(false)
    expect(firstName.meta.isDefaultValue).toBe(false)
    expect(lastName.meta.isDefaultValue).toBe(true)

    firstName.handleChange('Tony')

    expect(user.value).toEqual({ firstName: 'Tony', lastName: 'Hawk' })
    expect(form.state.isDefaultValue).toBe(true)
    expect(user.meta.isDefaultValue).toBe(true)
    expect(firstName.meta.isDefaultValue).toBe(true)
    expect(lastName.meta.isDefaultValue).toBe(true)
  })

  it('reports moved fields as non-default and returns them to default when moved back', () => {
    const form = new InternalFormApi({
      defaultValues: { items: [{ name: 'a' }, { name: 'b' }] },
    })
    const items = form._getOrCreateFieldApi({ name: 'items' })
    const item0 = form._getOrCreateFieldApi({ name: 'items[0]' })
    const name0 = form._getOrCreateFieldApi({ name: 'items[0].name' })

    expect(items.meta.isDefaultValue).toBe(true)
    expect(item0.meta.isDefaultValue).toBe(true)
    expect(name0.meta.isDefaultValue).toBe(true)

    // Before:    0      1
    // After:     1      0
    // Fields:    -      item0
    items.swapValues(0, 1)

    expect(items.value).toEqual([{ name: 'b' }, { name: 'a' }])
    expect(item0.name).toBe('items[1]')
    expect(item0.value).toEqual({ name: 'a' })
    expect(name0.name).toBe('items[1].name')
    expect(name0.value).toBe('a')
    expect(items.meta.isDefaultValue).toBe(false)
    expect(item0.meta.isDefaultValue).toBe(false)
    expect(name0.meta.isDefaultValue).toBe(false)

    items.swapValues(0, 1)

    expect(items.value).toEqual([{ name: 'a' }, { name: 'b' }])
    expect(item0.name).toBe('items[0]')
    expect(name0.name).toBe('items[0].name')
    expect(items.meta.isDefaultValue).toBe(true)
    expect(item0.meta.isDefaultValue).toBe(true)
    expect(name0.meta.isDefaultValue).toBe(true)

    name0.handleChange('updated')

    expect(items.value).toEqual([{ name: 'updated' }, { name: 'b' }])
    expect(item0.value).toEqual({ name: 'updated' })
    expect(items.meta.isDefaultValue).toBe(false)
    expect(item0.meta.isDefaultValue).toBe(false)
    expect(name0.meta.isDefaultValue).toBe(false)
  })

  it('returns an array to default after reversing an item move', () => {
    const form = new InternalFormApi({
      defaultValues: { items: ['a', 'b', 'c'] },
    })
    const items = form._getOrCreateFieldApi({ name: 'items' })

    expect(items.meta.isDefaultValue).toBe(true)

    items.moveValue(0, 2)

    expect(items.value).toEqual(['b', 'c', 'a'])
    expect(items.meta.isDefaultValue).toBe(false)

    items.moveValue(2, 0)

    expect(items.value).toEqual(['a', 'b', 'c'])
    expect(items.meta.isDefaultValue).toBe(true)
  })

  it('returns an array to default after removing an inserted item', () => {
    const form = new InternalFormApi({
      defaultValues: { items: ['a', 'b', 'c'] },
    })
    const items = form._getOrCreateFieldApi({ name: 'items' })

    expect(items.meta.isDefaultValue).toBe(true)

    items.insertValue(1, 'x')

    expect(items.value).toEqual(['a', 'x', 'b', 'c'])
    expect(items.meta.isDefaultValue).toBe(false)

    items.removeValue(1)

    expect(items.value).toEqual(['a', 'b', 'c'])
    expect(items.meta.isDefaultValue).toBe(true)
  })

  it('returns an array to default after removing an appended item', () => {
    const form = new InternalFormApi({
      defaultValues: { items: ['a', 'b', 'c'] },
    })
    const items = form._getOrCreateFieldApi({ name: 'items' })

    expect(items.meta.isDefaultValue).toBe(true)

    items.pushValue('d')

    expect(items.value).toEqual(['a', 'b', 'c', 'd'])
    expect(items.meta.isDefaultValue).toBe(false)

    items.removeValue(3)

    expect(items.value).toEqual(['a', 'b', 'c'])
    expect(items.meta.isDefaultValue).toBe(true)
  })

  it('returns a cleared array to default after reset and reports later changes as non-default', () => {
    const form = new InternalFormApi({
      defaultValues: { items: ['a', 'b', 'c'] },
    })
    const items = form._getOrCreateFieldApi({ name: 'items' })

    expect(items.meta.isDefaultValue).toBe(true)

    items.clearValues()

    expect(items.value).toEqual([])
    expect(items.meta.isDefaultValue).toBe(false)

    items.reset()

    expect(items.value).toEqual(['a', 'b', 'c'])
    expect(items.meta.isDefaultValue).toBe(true)

    items.pushValue('d')

    expect(items.value).toEqual(['a', 'b', 'c', 'd'])
    expect(items.meta.isDefaultValue).toBe(false)
  })
})

describe('InternalFieldApi - reset', () => {
  it('aborts active validation, ignores its late result, and allows validation to run again', async ({
    onTestFinished,
  }) => {
    const request = Promise.withResolvers<string>()
    onTestFinished(() => request.resolve('Late error'))
    const onAbort = vi.fn()
    const validator = vi.fn(() => request.promise)
    const form = new InternalFormApi({ defaultValues: { name: '' } })
    const field = form._getOrCreateFieldApi({
      name: 'name',
      validators: [
        {
          triggers: [],
          run: ({ signal }: { signal: AbortSignal }) => {
            signal.addEventListener('abort', onAbort, { once: true })
            return validator()
          },
        },
      ],
    })
    field._register()

    const submission = form.handleSubmit()
    await expect.poll(() => validator).toHaveBeenCalledOnce()
    expect(field.meta.isValidating).toBe(true)

    field.reset()

    expect(onAbort).toHaveBeenCalledOnce()
    await expect(submission).resolves.toEqual([])
    request.resolve('Late error')
    await request.promise

    expect(field.errors).toEqual([])
    expect(field.meta.isValidating).toBe(false)

    validator.mockResolvedValue('Current error')
    await form.handleSubmit()

    expect(field.errors).toEqual([{ message: 'Current error' }])
  })

  it('cancels a pending listener callback and allows subsequent changes to notify it', async () => {
    vi.useFakeTimers()
    const listener = vi.fn()
    const form = new InternalFormApi({ defaultValues: { name: '' } })
    const field = form._getOrCreateFieldApi({
      name: 'name',
      listeners: [
        { run: listener, triggers: ['change'], triggerDebounceMs: 100 },
      ],
    })

    field.handleChange('initial')
    await vi.advanceTimersByTimeAsync(100)
    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({ value: 'initial' }),
    )
    listener.mockClear()

    field.handleChange('pending')
    field.reset()
    await vi.advanceTimersByTimeAsync(100)

    expect(listener).not.toHaveBeenCalled()
    expect(field.value).toBe('')

    field.handleChange('after reset')
    await vi.advanceTimersByTimeAsync(100)

    expect(listener).toHaveBeenCalledOnce()
    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({ value: 'after reset' }),
    )
  })
})

describe('InternalFieldApi - _kill', () => {
  it('does not run an unmounted field validator when a watched field is deleted and recreated', async () => {
    vi.useFakeTimers()
    const validator = vi.fn(() => null)
    const form = new InternalFormApi({
      defaultValues: { source: '', target: 'target' },
    })
    const source = form._getOrCreateFieldApi({ name: 'source' })
    const target = form._getOrCreateFieldApi({
      name: 'target',
      validators: [
        { triggers: ['change'], watchFields: ['source'], run: validator },
      ],
    })
    source._register()
    const unregisterTarget = target._register()

    source.handleChange('first')
    await vi.runOnlyPendingTimersAsync()
    expect(validator).toHaveBeenCalledWith(
      expect.objectContaining({ value: 'target', event: 'change' }),
    )
    validator.mockClear()

    unregisterTarget()
    await vi.runOnlyPendingTimersAsync()
    form.deleteField('source')

    form.setFieldValue('source', 'replacement')
    await vi.runOnlyPendingTimersAsync()

    expect(validator).not.toHaveBeenCalled()
    expect(form.getFieldValue('target')).toBe('target')
    expect(form.state.isValid).toBe(true)
  })

  it('keeps a registered watcher usable after deleting its source and detaches the old dependency', () => {
    const listener = vi.fn()
    const form = new InternalFormApi({
      defaultValues: { source: '', target: 'target' },
    })
    const source = form._getOrCreateFieldApi({ name: 'source' })
    const target = form._getOrCreateFieldApi({
      name: 'target',
      listeners: [
        { triggers: ['change'], watchFields: ['source'], run: listener },
      ],
    })
    source._register()
    target._register()

    source.handleChange('first')
    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({ value: 'target' }),
    )
    listener.mockClear()

    form.deleteField('source')
    form.setFieldValue('source', 'replacement')

    expect(listener).not.toHaveBeenCalled()

    target.handleChange('direct edit')

    expect(listener).toHaveBeenCalledOnce()
    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({ value: 'direct edit' }),
    )
    expect(form.getFieldValue('target')).toBe('direct edit')
  })

  it('ignores array edits made through a deleted field', () => {
    const form = new InternalFormApi({
      defaultValues: { items: ['a', 'b'] },
    })
    const field = form._getOrCreateFieldApi({ name: 'items' })
    field._register()
    field.pushValue('active')

    const beforeDelete = form.getFieldValue('items')
    expect(beforeDelete).toEqual(['a', 'b', 'active'])

    form.deleteField('items')

    field.swapValues(0, 1)
    expect(form.getFieldValue('items')).toEqual(beforeDelete)
    field.moveValue(0, 1)
    expect(form.getFieldValue('items')).toEqual(beforeDelete)
    field.clearValues()
    expect(form.getFieldValue('items')).toEqual(beforeDelete)
    field.pushValue('ignored')
    expect(form.getFieldValue('items')).toEqual(beforeDelete)
    field.insertValue(1, 'ignored')
    expect(form.getFieldValue('items')).toEqual(beforeDelete)
    field.removeValue(0)
    expect(form.getFieldValue('items')).toEqual(beforeDelete)
    field.replaceValue(0, 'ignored')
    expect(form.getFieldValue('items')).toEqual(beforeDelete)
    field.filterValues(() => false)
    expect(form.getFieldValue('items')).toEqual(beforeDelete)
  })

  it('ignores blur events made through a deleted field', () => {
    const onBlur = vi.fn()
    const form = new InternalFormApi({
      defaultValues: { name: '' },
      listeners: [{ triggers: ['blur'], run: onBlur }],
    })
    const field = form._getOrCreateFieldApi({ name: 'name' })
    field._register()
    field.handleBlur()
    expect(onBlur).toHaveBeenCalledWith(
      expect.objectContaining({ triggerFieldApi: field }),
    )
    onBlur.mockClear()

    form.deleteField('name')
    field.handleBlur()

    expect(onBlur).not.toHaveBeenCalled()
    expect(form.getFieldMeta('name')).toBeUndefined()
  })

  it('aborts active validation when deleted and ignores late results and subsequent interactions', async ({
    onTestFinished,
  }) => {
    const request = Promise.withResolvers<string>()
    onTestFinished(() => request.resolve('Late error'))
    const onAbort = vi.fn()
    const validator = vi.fn(() => request.promise)
    const form = new InternalFormApi({ defaultValues: { name: '' } })
    const field = form._getOrCreateFieldApi({
      name: 'name',
      validators: [
        {
          triggers: ['change'],
          run: ({ signal }: { signal: AbortSignal }) => {
            signal.addEventListener('abort', onAbort, { once: true })
            return validator()
          },
        },
      ],
    })
    field._register()

    const submission = form.handleSubmit()
    await expect.poll(() => validator).toHaveBeenCalledOnce()
    expect(field.meta.isValidating).toBe(true)

    form.deleteField('name')

    expect(onAbort).toHaveBeenCalledOnce()
    await expect(submission).resolves.toEqual([])
    request.resolve('Late error')
    await request.promise
    validator.mockClear()

    field.handleChange('ignored')
    await expect(form.handleSubmit()).resolves.toEqual([])

    expect(validator).not.toHaveBeenCalled()
    expect(form.getFieldValue('name')).toBe('')
    expect(form.state.isValid).toBe(true)
    expect(form.state.isValidating).toBe(false)
    expect(field.errors).toEqual([])
  })

  it('cancels pending listener callbacks when deleted and ignores subsequent changes', async () => {
    vi.useFakeTimers()
    const listener = vi.fn()
    const form = new InternalFormApi({ defaultValues: { name: '' } })
    const field = form._getOrCreateFieldApi({
      name: 'name',
      listeners: [
        { run: listener, triggers: ['change'], triggerDebounceMs: 100 },
      ],
    })

    field.handleChange('initial')
    await vi.advanceTimersByTimeAsync(100)
    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({ value: 'initial' }),
    )
    listener.mockClear()

    field.handleChange('pending')
    form.deleteField('name')
    await vi.advanceTimersByTimeAsync(100)

    expect(listener).not.toHaveBeenCalled()

    field.handleChange('ignored')
    await vi.advanceTimersByTimeAsync(100)

    expect(listener).not.toHaveBeenCalled()
    expect(form.getFieldValue('name')).toBe('pending')
  })
})

describe('InternalFieldApi - _register', () => {
  it('ignores registration and cleanup callbacks for a deleted field', () => {
    const listener = vi.fn()
    const form = new InternalFormApi({ defaultValues: { name: '' } })
    const field = form._getOrCreateFieldApi({
      name: 'name',
      listeners: [{ triggers: ['mount', 'unmount'], run: listener }],
    })
    const unregister = field._register()
    expect(listener).toHaveBeenCalledOnce()
    listener.mockClear()

    form.deleteField('name')
    const unregisterAfterDeletion = field._register()
    unregisterAfterDeletion()
    unregister()

    expect(listener).not.toHaveBeenCalled()
    expect(form.getFieldMeta('name')).toBeUndefined()
  })
})

describe('InternalFieldApi - _unregister', () => {
  it('notifies unmount listeners with the last field value', async () => {
    vi.useFakeTimers()
    const listener = vi.fn()
    const form = new InternalFormApi({ defaultValues: { name: 'Alice' } })
    const field = form._getOrCreateFieldApi({
      name: 'name',
      listeners: [{ triggers: ['unmount'], run: listener }],
    })
    const unregister = field._register()
    field.handleChange('Bob')
    expect(listener).not.toHaveBeenCalled()

    unregister()

    expect(listener).toHaveBeenCalledOnce()
    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({ value: 'Bob', fieldApi: field, formApi: form }),
    )
    await vi.runOnlyPendingTimersAsync()
  })

  it('continues validating a field while another consumer remains registered', async () => {
    vi.useFakeTimers()
    const form = new InternalFormApi({ defaultValues: { name: '' } })
    const field = form._getOrCreateFieldApi({
      name: 'name',
      validators: [{ triggers: [], run: () => 'Name is required' }],
    })
    const unregisterFirst = field._register()
    const unregisterSecond = field._register()

    unregisterFirst()
    await vi.runOnlyPendingTimersAsync()

    await form.handleSubmit()

    expect(field.errors).toEqual([{ message: 'Name is required' }])
    expect(form.state.canSubmit).toBe(false)

    unregisterSecond()
    await vi.runOnlyPendingTimersAsync()
  })

  it('preserves nested default values and field interactions after unmounting and remounting', async () => {
    vi.useFakeTimers()
    const form = new InternalFormApi({
      defaultValues: { user: { name: 'Alice' } },
    })
    const parent = form._getOrCreateFieldApi({ name: 'user' })
    const child = form._getOrCreateFieldApi({ name: 'user.name' })
    const unregisterParent = parent._register()
    const unregisterChild = child._register()
    expect(parent.value).toEqual({ name: 'Alice' })
    expect(child.value).toBe('Alice')

    unregisterChild()
    unregisterParent()
    await vi.runOnlyPendingTimersAsync()

    const remountedParent = form._getOrCreateFieldApi({ name: 'user' })
    const remountedChild = form._getOrCreateFieldApi({ name: 'user.name' })
    remountedParent._register()
    remountedChild._register()

    expect(remountedChild.value).toBe('Alice')
    expect(remountedChild.meta).toMatchObject({
      isTouched: false,
      isDirty: false,
      errors: [],
    })

    remountedChild.handleChange('Bob')

    expect(form.state.values).toEqual({ user: { name: 'Bob' } })
    expect(remountedParent.value).toEqual({ name: 'Bob' })
    expect(remountedParent.meta.isTouched).toBe(true)
  })

  it('preserves edited values and interaction state after unmounting and remounting', async () => {
    vi.useFakeTimers()
    const form = new InternalFormApi({ defaultValues: { name: 'Alice' } })
    const field = form._getOrCreateFieldApi({ name: 'name' })
    const unregister = field._register()
    field.handleChange('Bob')
    field.handleBlur()
    expect(field.meta).toMatchObject({
      isTouched: true,
      isDirty: true,
      isBlurred: true,
    })

    unregister()
    await vi.runOnlyPendingTimersAsync()

    const remounted = form._getOrCreateFieldApi({ name: 'name' })
    remounted._register()

    expect(remounted.value).toBe('Bob')
    expect(remounted.meta).toMatchObject({
      isTouched: true,
      isDirty: true,
      isBlurred: true,
    })
    expect(form.state.isTouched).toBe(true)
  })

  it('keeps linked validation working after both field components unregister', async ({
    annotate,
  }) => {
    await annotate(
      'https://github.com/TanStack/form/issues/2296',
      'GitHub RFC link. Its decision affects the outcome of this test.',
    )
    vi.useFakeTimers()
    const validator = vi.fn(() => 'Target is invalid')
    const form = new InternalFormApi({
      defaultValues: { source: '', target: 'target' },
    })
    const source = form._getOrCreateFieldApi({ name: 'source' })
    const target = form._getOrCreateFieldApi({
      name: 'target',
      validators: [
        { triggers: ['change'], watchFields: ['source'], run: validator },
      ],
    })
    const unregisterSource = source._register()
    const unregisterTarget = target._register()

    unregisterSource()
    unregisterTarget()
    await vi.runOnlyPendingTimersAsync()

    form.setFieldValue('source', 'changed')
    await vi.runOnlyPendingTimersAsync()

    expect(validator).toHaveBeenCalledWith(
      expect.objectContaining({ value: 'target', event: 'change' }),
    )
    expect(form.getFieldMeta('target')?.errors).toEqual([
      { message: 'Target is invalid' },
    ])
    expect(form.state.isValid).toBe(false)
  })
})

describe('InternalFieldApi - pushValue', () => {
  it('appends an item through pushFieldValue', ({ onTestFinished }) => {
    const form = new InternalFormApi({
      defaultValues: { items: ['a'] },
    })
    const field = form._getOrCreateFieldApi({ name: 'items' })
    const pushFieldValue = vi.spyOn(form, 'pushFieldValue')
    onTestFinished(() => pushFieldValue.mockRestore())

    field.pushValue('b')

    expect(pushFieldValue).toHaveBeenCalledOnce()
    expect(field.value).toEqual(['a', 'b'])
  })
})

describe('InternalFieldApi - insertValue', () => {
  it('inserts an item through insertFieldValue', ({ onTestFinished }) => {
    const form = new InternalFormApi({
      defaultValues: { items: ['a', 'b'] },
    })
    const field = form._getOrCreateFieldApi({ name: 'items' })
    const insertFieldValue = vi.spyOn(form, 'insertFieldValue')
    onTestFinished(() => insertFieldValue.mockRestore())

    field.insertValue(1, 'x')

    expect(insertFieldValue).toHaveBeenCalledOnce()
    expect(field.value).toEqual(['a', 'x', 'b'])
  })
})

describe('InternalFieldApi - clearValues', () => {
  it('empties the array through clearFieldValues', ({ onTestFinished }) => {
    const form = new InternalFormApi({
      defaultValues: { items: ['a', 'b', 'c'] },
    })
    const field = form._getOrCreateFieldApi({ name: 'items' })
    const clearFieldValues = vi.spyOn(form, 'clearFieldValues')
    onTestFinished(() => clearFieldValues.mockRestore())

    field.clearValues()

    expect(clearFieldValues).toHaveBeenCalledOnce()
    expect(field.value).toEqual([])
  })
})

describe('InternalFieldApi - swapValues', () => {
  it('swaps two items through swapFieldValues', ({ onTestFinished }) => {
    const form = new InternalFormApi({
      defaultValues: { items: ['a', 'b', 'c'] },
    })
    const field = form._getOrCreateFieldApi({ name: 'items' })
    const swapFieldValues = vi.spyOn(form, 'swapFieldValues')
    onTestFinished(() => swapFieldValues.mockRestore())

    field.swapValues(0, 2)

    expect(swapFieldValues).toHaveBeenCalledOnce()
    expect(field.value).toEqual(['c', 'b', 'a'])
  })
})

describe('InternalFieldApi - moveValue', () => {
  it('moves an item through moveFieldValue', ({ onTestFinished }) => {
    const form = new InternalFormApi({
      defaultValues: { items: ['a', 'b', 'c', 'd'] },
    })
    const field = form._getOrCreateFieldApi({ name: 'items' })
    const moveFieldValue = vi.spyOn(form, 'moveFieldValue')
    onTestFinished(() => moveFieldValue.mockRestore())

    field.moveValue(0, 2)

    expect(moveFieldValue).toHaveBeenCalledOnce()
    expect(field.value).toEqual(['b', 'c', 'a', 'd'])
  })
})

describe('InternalFieldApi - removeValue', () => {
  it('removes an item through removeFieldValue', ({ onTestFinished }) => {
    const form = new InternalFormApi({
      defaultValues: { items: ['a', 'b', 'c'] },
    })
    const field = form._getOrCreateFieldApi({ name: 'items' })
    const removeFieldValue = vi.spyOn(form, 'removeFieldValue')
    onTestFinished(() => removeFieldValue.mockRestore())

    field.removeValue(1)

    expect(removeFieldValue).toHaveBeenCalledOnce()
    expect(field.value).toEqual(['a', 'c'])
  })
})

describe('InternalFieldApi - replaceValue', () => {
  it('replaces an item through replaceFieldValue', ({ onTestFinished }) => {
    const form = new InternalFormApi({
      defaultValues: { items: ['a', 'b', 'c'] },
    })
    const field = form._getOrCreateFieldApi({ name: 'items' })
    const replaceFieldValue = vi.spyOn(form, 'replaceFieldValue')
    onTestFinished(() => replaceFieldValue.mockRestore())

    field.replaceValue(1, 'x')

    expect(replaceFieldValue).toHaveBeenCalledOnce()
    expect(field.value).toEqual(['a', 'x', 'c'])
  })
})

describe('InternalFieldApi - filterValues', () => {
  it('filters items with the supplied predicate context through filterFieldValues', ({
    onTestFinished,
  }) => {
    const form = new InternalFormApi({
      defaultValues: { items: ['a', 'b', 'c'] },
    })
    const field = form._getOrCreateFieldApi({ name: 'items' })
    const filterFieldValues = vi.spyOn(form, 'filterFieldValues')
    onTestFinished(() => filterFieldValues.mockRestore())
    const thisArg = { excluded: 'b' }

    field.filterValues(
      function (this: { excluded: string }, value) {
        return value !== this.excluded
      },
      { thisArg },
    )

    expect(filterFieldValues).toHaveBeenCalledOnce()
    expect(field.value).toEqual(['a', 'c'])
  })
})

describe('InternalFieldApi - handleChange', () => {
  it('sets the value through setFieldValue and marks the field and form touched and dirty', ({
    onTestFinished,
  }) => {
    const form = new InternalFormApi({ defaultValues: { name: '' } })
    const field = form._getOrCreateFieldApi({ name: 'name' })
    const setFieldValue = vi.spyOn(form, 'setFieldValue')
    onTestFinished(() => setFieldValue.mockRestore())

    field.handleChange('Alice')

    expect(setFieldValue).toHaveBeenCalledOnce()
    expect(field.value).toBe('Alice')
    expect(field.meta).toMatchObject({
      isTouched: true,
      isDirty: true,
    })
    expect(form.state).toMatchObject({
      values: { name: 'Alice' },
      isTouched: true,
      isDirty: true,
    })
  })

  it('updates the value through setFieldValue with an updater function', ({
    onTestFinished,
  }) => {
    const form = new InternalFormApi({ defaultValues: { count: 1 } })
    const field = form._getOrCreateFieldApi({ name: 'count' })
    const setFieldValue = vi.spyOn(form, 'setFieldValue')
    onTestFinished(() => setFieldValue.mockRestore())

    field.handleChange((count: number) => count + 1)

    expect(setFieldValue).toHaveBeenCalledOnce()
    expect(field.value).toBe(2)
  })

  it('updates the value and touched state while keeping the field and form pristine when markAsDirty is false', ({
    onTestFinished,
  }) => {
    const form = new InternalFormApi({ defaultValues: { name: '' } })
    const field = form._getOrCreateFieldApi({ name: 'name' })
    const setFieldValue = vi.spyOn(form, 'setFieldValue')
    onTestFinished(() => setFieldValue.mockRestore())

    field.handleChange('Alice', { markAsDirty: false })

    expect(setFieldValue).toHaveBeenCalledOnce()
    expect(field.value).toBe('Alice')
    expect(field.meta).toMatchObject({
      isTouched: true,
      isDirty: false,
      isPristine: true,
    })
    expect(form.state).toMatchObject({
      values: { name: 'Alice' },
      isTouched: true,
      isDirty: false,
      isPristine: true,
    })
  })

  it('updates the value and dirty state while keeping the field and form untouched when markAsTouched is false', ({
    onTestFinished,
  }) => {
    const form = new InternalFormApi({ defaultValues: { name: '' } })
    const field = form._getOrCreateFieldApi({ name: 'name' })
    const setFieldValue = vi.spyOn(form, 'setFieldValue')
    onTestFinished(() => setFieldValue.mockRestore())

    field.handleChange('Alice', { markAsTouched: false })

    expect(setFieldValue).toHaveBeenCalledOnce()
    expect(field.value).toBe('Alice')
    expect(field.meta).toMatchObject({
      isTouched: false,
      isDirty: true,
    })
    expect(form.state).toMatchObject({
      values: { name: 'Alice' },
      isTouched: false,
      isDirty: true,
    })
  })
})

describe('InternalFieldApi - _notifyListener', () => {
  it('notifies a listener when either of its watched fields changes', () => {
    const listener = vi.fn()
    const form = new InternalFormApi({
      defaultValues: { source: 'source', other: 'other', target: 'target' },
    })
    const target = form._getOrCreateFieldApi({
      name: 'target',
      listeners: [
        {
          triggers: ['change'],
          watchFields: ['source', 'other'],
          run: listener,
        },
      ],
    })
    const source = form._getOrCreateFieldApi({ name: 'source' })
    const other = form._getOrCreateFieldApi({ name: 'other' })

    source.handleChange('source changed')

    expect(listener).toHaveBeenCalledOnce()
    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({
        value: 'target',
        fieldApi: target,
        formApi: form,
      }),
    )
    listener.mockClear()

    other.handleChange('other changed')

    expect(listener).toHaveBeenCalledOnce()
    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({
        value: 'target',
        fieldApi: target,
        formApi: form,
      }),
    )
  })

  it('warns about a field watching itself and runs its listener only once', ({
    onTestFinished,
  }) => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    onTestFinished(() => warn.mockRestore())
    const listener = vi.fn()
    const form = new InternalFormApi({ defaultValues: { name: '' } })
    const field = form._getOrCreateFieldApi({
      name: 'name',
      listeners: [
        { triggers: ['change'], watchFields: ['name'], run: listener },
      ],
    })

    field.handleChange('Alice')

    expect(listener).toHaveBeenCalledOnce()
    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({
        value: 'Alice',
        fieldApi: field,
        formApi: form,
      }),
    )
    expect(warn.mock.calls).toContainEqual(
      expect.arrayContaining([
        expect.stringContaining('cyclical listener cycle detected'),
      ]),
    )
    expect(field.value).toBe('Alice')
  })

  it('runs every listener watching a source without running direct-only listeners', () => {
    const firstListener = vi.fn()
    const directListener = vi.fn()
    const secondListener = vi.fn()
    const form = new InternalFormApi({
      defaultValues: { source: 'source', target: 'target' },
    })
    const target = form._getOrCreateFieldApi({
      name: 'target',
      listeners: [
        { triggers: ['change'], watchFields: ['source'], run: firstListener },
        { triggers: ['change'], run: directListener },
        { triggers: ['change'], watchFields: ['source'], run: secondListener },
      ],
    })
    const source = form._getOrCreateFieldApi({ name: 'source' })

    source.handleChange('changed source')

    expect(firstListener).toHaveBeenCalledOnce()
    expect(firstListener).toHaveBeenCalledWith(
      expect.objectContaining({
        value: 'target',
        fieldApi: target,
        formApi: form,
      }),
    )
    expect(secondListener).toHaveBeenCalledOnce()
    expect(secondListener).toHaveBeenCalledWith(
      expect.objectContaining({
        value: 'target',
        fieldApi: target,
        formApi: form,
      }),
    )
    expect(directListener).not.toHaveBeenCalled()

    target.handleChange('direct edit')

    expect(directListener).toHaveBeenCalledOnce()
    expect(directListener).toHaveBeenCalledWith(
      expect.objectContaining({
        value: 'direct edit',
        fieldApi: target,
        formApi: form,
      }),
    )
  })

  it('debounces watched listeners independently', async () => {
    vi.useFakeTimers()
    const firstListener = vi.fn()
    const secondListener = vi.fn()
    const form = new InternalFormApi({
      defaultValues: { firstSource: '', secondSource: '', target: 'target' },
    })
    const target = form._getOrCreateFieldApi({
      name: 'target',
      listeners: [
        {
          triggers: ['change'],
          watchFields: ['firstSource'],
          triggerDebounceMs: 100,
          run: firstListener,
        },
        {
          triggers: ['change'],
          watchFields: ['secondSource'],
          triggerDebounceMs: 100,
          run: secondListener,
        },
      ],
    })
    const firstSource = form._getOrCreateFieldApi({ name: 'firstSource' })
    const secondSource = form._getOrCreateFieldApi({ name: 'secondSource' })

    secondSource.handleChange('second')
    await vi.advanceTimersByTimeAsync(50)
    firstSource.handleChange('first')
    await vi.advanceTimersByTimeAsync(49)

    expect(firstListener).not.toHaveBeenCalled()
    expect(secondListener).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(1)

    expect(firstListener).not.toHaveBeenCalled()
    expect(secondListener).toHaveBeenCalledOnce()
    expect(secondListener).toHaveBeenCalledWith(
      expect.objectContaining({
        value: 'target',
        fieldApi: target,
        formApi: form,
      }),
    )

    await vi.advanceTimersByTimeAsync(50)

    expect(firstListener).toHaveBeenCalledOnce()
    expect(firstListener).toHaveBeenCalledWith(
      expect.objectContaining({
        value: 'target',
        fieldApi: target,
        formApi: form,
      }),
    )
    expect(secondListener).toHaveBeenCalledOnce()
  })

  it('notifies only matching change and blur listeners watching the affected field', () => {
    const changeListener = vi.fn()
    const blurListener = vi.fn()
    const unrelatedListener = vi.fn()
    const form = new InternalFormApi({
      defaultValues: { source: 'source', other: 'other', target: 'target' },
    })
    const target = form._getOrCreateFieldApi({
      name: 'target',
      listeners: [
        { triggers: ['change'], watchFields: ['source'], run: changeListener },
        { triggers: ['blur'], watchFields: ['source'], run: blurListener },
        {
          triggers: ['change', 'blur'],
          watchFields: ['other'],
          run: unrelatedListener,
        },
      ],
    })
    const source = form._getOrCreateFieldApi({ name: 'source' })
    target._register()
    source._register()

    source.handleChange('updated source')

    expect(changeListener).toHaveBeenCalledOnce()
    expect(changeListener).toHaveBeenCalledWith(
      expect.objectContaining({
        value: 'target',
        fieldApi: target,
        formApi: form,
      }),
    )
    expect(blurListener).not.toHaveBeenCalled()
    expect(unrelatedListener).not.toHaveBeenCalled()

    source.handleBlur()

    expect(changeListener).toHaveBeenCalledOnce()
    expect(blurListener).toHaveBeenCalledOnce()
    expect(blurListener).toHaveBeenCalledWith(
      expect.objectContaining({
        value: 'target',
        fieldApi: target,
        formApi: form,
      }),
    )
    expect(unrelatedListener).not.toHaveBeenCalled()
  })

  it('notifies only listeners watching a field being registered', () => {
    const listener = vi.fn()
    const unrelatedListener = vi.fn()
    const form = new InternalFormApi({
      defaultValues: { source: 'source', other: 'other', target: 'target' },
    })
    const target = form._getOrCreateFieldApi({
      name: 'target',
      listeners: [
        { triggers: ['mount'], watchFields: ['source'], run: listener },
        { triggers: ['mount'], watchFields: ['other'], run: unrelatedListener },
      ],
    })
    const source = form._getOrCreateFieldApi({ name: 'source' })
    target._register()
    listener.mockClear()
    unrelatedListener.mockClear()

    source._register()

    expect(listener).toHaveBeenCalledOnce()
    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({
        value: 'target',
        fieldApi: target,
        formApi: form,
      }),
    )
    expect(unrelatedListener).not.toHaveBeenCalled()
  })

  it('notifies only listeners watching a field being unregistered', async () => {
    vi.useFakeTimers()
    const listener = vi.fn()
    const unrelatedListener = vi.fn()
    const form = new InternalFormApi({
      defaultValues: { source: 'source', other: 'other', target: 'target' },
    })
    const target = form._getOrCreateFieldApi({
      name: 'target',
      listeners: [
        { triggers: ['unmount'], watchFields: ['source'], run: listener },
        {
          triggers: ['unmount'],
          watchFields: ['other'],
          run: unrelatedListener,
        },
      ],
    })
    const source = form._getOrCreateFieldApi({ name: 'source' })
    target._register()
    const unregisterSource = source._register()
    expect(listener).not.toHaveBeenCalled()

    unregisterSource()

    expect(listener).toHaveBeenCalledOnce()
    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({
        value: 'target',
        fieldApi: target,
        formApi: form,
      }),
    )
    expect(unrelatedListener).not.toHaveBeenCalled()
    await vi.runOnlyPendingTimersAsync()
  })
})

describe('InternalFieldApi - _clearEventErrors', () => {
  it('clears submit-only validator errors only for the field that changes', async () => {
    const form = new InternalFormApi({
      defaultValues: { name: '', email: '' },
    })
    const nameField = form._getOrCreateFieldApi({
      name: 'name',
      validators: [{ run: () => 'Name is required', triggers: [] }],
    })
    const emailField = form._getOrCreateFieldApi({
      name: 'email',
      validators: [{ run: () => 'Email is required', triggers: [] }],
    })
    nameField._register()
    emailField._register()

    await form.handleSubmit()
    expect(nameField.errors).toEqual([{ message: 'Name is required' }])
    expect(emailField.errors).toEqual([{ message: 'Email is required' }])

    nameField.handleChange('Alice')
    await expect.poll(() => form.state.isValidating).toBe(false)

    expect(nameField.errors).toEqual([])
    expect(emailField.errors).toEqual([{ message: 'Email is required' }])
    expect(form.state.isValid).toBe(false)
  })

  it('clears submit errors when the field validator only listens for blur', async () => {
    const form = new InternalFormApi({
      defaultValues: { name: '', email: '' },
    })
    const nameField = form._getOrCreateFieldApi({
      name: 'name',
      validators: [{ run: () => 'Name is required', triggers: ['blur'] }],
    })
    const emailField = form._getOrCreateFieldApi({
      name: 'email',
      validators: [{ run: () => 'Email is required', triggers: ['blur'] }],
    })
    nameField._register()
    emailField._register()

    await form.handleSubmit()
    expect(nameField.errors).toEqual([{ message: 'Name is required' }])
    expect(emailField.errors).toEqual([{ message: 'Email is required' }])

    nameField.handleChange('Alice')
    await expect.poll(() => form.state.isValidating).toBe(false)

    expect(nameField.errors).toEqual([])
    expect(emailField.errors).toEqual([{ message: 'Email is required' }])
    expect(form.state.isValid).toBe(false)
  })

  it('preserves errors produced by blur validation when the field changes', async () => {
    const form = new InternalFormApi({ defaultValues: { name: '' } })
    const field = form._getOrCreateFieldApi({
      name: 'name',
      validators: [{ run: () => 'Name is required', triggers: ['blur'] }],
    })
    field._register()

    field.handleBlur()
    await expect.poll(() => form.state.isValidating).toBe(false)
    expect(field.errors).toEqual([{ message: 'Name is required' }])

    field.handleChange('Alice')
    await expect.poll(() => form.state.isValidating).toBe(false)

    expect(field.errors).toEqual([{ message: 'Name is required' }])
  })

  it('replaces submit errors with the result of field change validation', async () => {
    const validator = vi
      .fn()
      .mockReturnValueOnce('Submit field validator failed')
      .mockReturnValue('Change field validator failed')
    const form = new InternalFormApi({ defaultValues: { name: '' } })
    const field = form._getOrCreateFieldApi({
      name: 'name',
      validators: [{ run: validator, triggers: ['change'] }],
    })
    field._register()

    await form.handleSubmit()
    expect(field.errors).toEqual([{ message: 'Submit field validator failed' }])
    expect(validator).toHaveBeenLastCalledWith(
      expect.objectContaining({ event: 'submit' }),
    )

    field.handleChange('Alice')
    await expect.poll(() => form.state.isValidating).toBe(false)

    expect(field.errors).toEqual([{ message: 'Change field validator failed' }])
    expect(validator).toHaveBeenLastCalledWith(
      expect.objectContaining({ event: 'change' }),
    )
  })

  it('clears submit errors when field change validation is disabled by its predicate', async () => {
    const validator = vi.fn(() => 'Submit field validator failed')
    const form = new InternalFormApi({ defaultValues: { name: '' } })
    const field = form._getOrCreateFieldApi({
      name: 'name',
      validators: [
        {
          run: validator,
          triggers: [{ trigger: 'change', when: false }],
        },
      ],
    })
    field._register()

    await form.handleSubmit()
    expect(field.errors).toEqual([{ message: 'Submit field validator failed' }])
    validator.mockClear()

    field.handleChange('Alice')
    await expect.poll(() => form.state.isValidating).toBe(false)

    expect(field.errors).toEqual([])
    expect(validator).not.toHaveBeenCalled()
  })
})
