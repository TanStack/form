import { describe, expect, it, vi } from 'vitest'
import { z } from 'zod'
import { InternalFormApi } from '../../src/FormApi/FormApi.lib'
import { formOptions } from '../../src'
import { sleep } from '../../src/pipeline/utils.lib'
import { promiseWithResolvers } from '../test-utils'

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

  it('uses updated listener callbacks and triggers, retains omitted listeners, and removes listeners with an empty array', ({
    onTestFinished,
  }) => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    onTestFinished(() => warn.mockRestore())
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

    field._update({ listeners: [] })
    field.handleBlur()

    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('length of the listener array should not change'),
    )
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
  it('cancels pending mount validation before its waiting validator can start', async ({
    onTestFinished,
  }) => {
    vi.useFakeTimers()
    const waitingValidator = vi.fn(() => 'Late mount error')
    let signal: AbortSignal | undefined
    const form = new InternalFormApi({ defaultValues: { name: '' } })
    const field = form._getOrCreateFieldApi({
      name: 'name',
      validators: [
        {
          triggers: ['mount'],
          run: (context) => {
            signal = context.signal
            return sleep(100).then(() => null)
          },
        },
        { triggers: ['mount'], bailIfInvalid: true, run: waitingValidator },
      ],
    })
    onTestFinished(field._register())
    expect(signal?.aborted).toBe(false)
    expect(field.meta.isValidating).toBe(true)
    expect(waitingValidator).not.toHaveBeenCalled()

    field.reset()

    expect(signal?.aborted).toBe(true)
    expect(field.meta.isValidating).toBe(false)
    expect(form.state.isValidating).toBe(false)

    await vi.advanceTimersByTimeAsync(100)

    expect(waitingValidator).not.toHaveBeenCalled()
    expect(field.errors).toEqual([])
    expect(field.meta.isValidating).toBe(false)
    expect(form.state.isValidating).toBe(false)
  })

  it('ignores cancelled validation results and keeps new validation running after reset', async () => {
    vi.useFakeTimers()
    let oldSignal: AbortSignal | undefined
    let currentSignal: AbortSignal | undefined
    const form = new InternalFormApi({ defaultValues: { name: '' } })
    const field = form._getOrCreateFieldApi({
      name: 'name',
      validators: [
        {
          triggers: ['change'],
          run: ({ value, signal }) => {
            if (value === 'old') {
              oldSignal = signal
              return sleep(100).then(() => 'Stale error')
            }
            currentSignal = signal
            return sleep(200).then(() => 'Current error')
          },
        },
      ],
    })

    field.handleChange('old')
    expect(oldSignal?.aborted).toBe(false)
    expect(field.meta.isValidating).toBe(true)

    field.reset()

    expect(oldSignal?.aborted).toBe(true)
    expect(field.meta.isValidating).toBe(false)

    field.handleChange('new')
    expect(currentSignal?.aborted).toBe(false)
    expect(field.meta.isValidating).toBe(true)

    await vi.advanceTimersByTimeAsync(100)

    expect(currentSignal?.aborted).toBe(false)
    expect(field.value).toBe('new')
    expect(field.errors).toEqual([])
    expect(field.meta.isValidating).toBe(true)
    expect(form.state.isValidating).toBe(true)

    await vi.advanceTimersByTimeAsync(100)

    expect(field.errors).toEqual([{ message: 'Current error' }])
    expect(field.meta.isValidating).toBe(false)
    expect(form.state.isValidating).toBe(false)
  })

  it('aborts active validation, ignores its late result, and allows validation to run again', async ({
    onTestFinished,
  }) => {
    const request = promiseWithResolvers<string>()
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

    field.handleChange('')
    await expect.poll(() => validator).toHaveBeenCalledOnce()
    expect(field.meta.isValidating).toBe(true)

    field.reset()

    expect(onAbort).toHaveBeenCalledOnce()
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
  it('cancels pending mount validation and its waiting validator when the field is deleted', async ({
    onTestFinished,
  }) => {
    vi.useFakeTimers()
    const waitingValidator = vi.fn(() => 'Late mount error')
    let signal: AbortSignal | undefined
    const form = new InternalFormApi({ defaultValues: { name: '' } })
    const field = form._getOrCreateFieldApi({
      name: 'name',
      validators: [
        {
          triggers: ['mount'],
          run: (context) => {
            signal = context.signal
            return sleep(100).then(() => null)
          },
        },
        { triggers: ['mount'], bailIfInvalid: true, run: waitingValidator },
      ],
    })
    onTestFinished(field._register())
    expect(signal?.aborted).toBe(false)
    expect(field.meta.isValidating).toBe(true)
    expect(waitingValidator).not.toHaveBeenCalled()

    form.deleteField('name')

    expect(signal?.aborted).toBe(true)
    expect(form.getFieldMeta('name')).toBeUndefined()
    expect(form.state.isValidating).toBe(false)

    await vi.advanceTimersByTimeAsync(100)

    expect(waitingValidator).not.toHaveBeenCalled()
    expect(form.getFieldMeta('name')).toBeUndefined()
    expect(form.state.isValid).toBe(true)
    expect(form.state.isValidating).toBe(false)
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
    const request = promiseWithResolvers<string>()
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

    field.handleChange('')
    await expect.poll(() => validator).toHaveBeenCalledOnce()
    expect(field.meta.isValidating).toBe(true)

    form.deleteField('name')

    expect(onAbort).toHaveBeenCalledOnce()
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
  it('applies synchronous mount errors immediately', ({ onTestFinished }) => {
    const validator = vi.fn(() => 'Name is required')
    const form = new InternalFormApi({ defaultValues: { name: '' } })
    const field = form._getOrCreateFieldApi({
      name: 'name',
      validators: [{ triggers: ['mount'], run: validator }],
    })

    onTestFinished(field._register())

    expect(validator).toHaveBeenCalledWith(
      expect.objectContaining({
        event: 'mount',
        value: '',
        fieldApi: field,
        formApi: form,
      }),
    )
    expect(field.errors).toEqual([{ message: 'Name is required' }])
    expect(field.meta.isValidating).toBe(false)
    expect(form.state.isValid).toBe(false)
    expect(form.state.isValidating).toBe(false)
  })

  it('skips mount validation when no field validator has a mount trigger', ({
    onTestFinished,
  }) => {
    const validator = vi.fn(() => 'Should not run')
    const form = new InternalFormApi({ defaultValues: { name: '' } })
    const field = form._getOrCreateFieldApi({
      name: 'name',
      validators: [{ triggers: ['change', 'blur'], run: validator }],
    })

    onTestFinished(field._register())

    expect(validator).not.toHaveBeenCalled()
    expect(field.errors).toEqual([])
    expect(field.meta.isValidating).toBe(false)
    expect(form.state.isValid).toBe(true)
    expect(form.state.isValidating).toBe(false)
  })

  it('tracks asynchronous mount validation on the field and form until its error arrives', async ({
    onTestFinished,
  }) => {
    const result = promiseWithResolvers<string>()
    onTestFinished(() => result.resolve('Name is required'))
    const form = new InternalFormApi({ defaultValues: { name: '' } })
    const field = form._getOrCreateFieldApi({
      name: 'name',
      validators: [{ triggers: ['mount'], run: () => result.promise }],
    })

    onTestFinished(field._register())

    expect(field.errors).toEqual([])
    expect(field.meta.isValidating).toBe(true)
    expect(form.state.isValidating).toBe(true)

    result.resolve('Name is required')
    await expect.poll(() => field.meta.isValidating).toBe(false)

    expect(field.errors).toEqual([{ message: 'Name is required' }])
    expect(form.state.isValid).toBe(false)
    expect(form.state.isValidating).toBe(false)
  })

  it('ignores mount debounce and skips only validators whose bail condition fails', async ({
    onTestFinished,
  }) => {
    vi.useFakeTimers()
    const result = promiseWithResolvers<string>()
    onTestFinished(() => result.resolve('Deferred error'))
    const pendingValidator = vi.fn(() => result.promise)
    const skippedValidator = vi.fn(() => 'Should not run')
    const form = new InternalFormApi({ defaultValues: { name: '' } })
    const field = form._getOrCreateFieldApi({
      name: 'name',
      validators: [
        {
          triggers: ['mount'],
          triggerDebounceMs: 100,
          run: pendingValidator,
        },
        { triggers: ['mount'], run: () => 'Immediate error' },
        { triggers: ['mount'], bailIfInvalid: true, run: skippedValidator },
        { triggers: ['mount'], run: () => 'After skipped validator' },
      ],
    })

    onTestFinished(field._register())

    expect(pendingValidator).toHaveBeenCalledOnce()
    expect(field.errors).toEqual([{ message: 'Immediate error' }])
    expect(field.meta.isValidating).toBe(true)

    result.resolve('Deferred error')
    await vi.advanceTimersByTimeAsync(0)

    expect(skippedValidator).not.toHaveBeenCalled()
    expect(field.errors).toEqual([
      { message: 'Deferred error' },
      { message: 'Immediate error' },
      { message: 'After skipped validator' },
    ])
    expect(field.meta.isValidating).toBe(false)
    expect(form.state.isValidating).toBe(false)
  })

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

type ArrayItemForm = InternalFormApi<{ items: Array<{ name: string }> }>

describe('InternalFieldApi - validation after array changes', () => {
  it.for([
    {
      operation: 'insert',
      mutate: (form: ArrayItemForm) =>
        form.insertFieldValue('items', 0, { name: 'new' }),
      name: 'items[2].name',
    },
    {
      operation: 'remove',
      mutate: (form: ArrayItemForm) => form.removeFieldValue('items', 0),
      name: 'items[0].name',
    },
    {
      operation: 'swap',
      mutate: (form: ArrayItemForm) => form.swapFieldValues('items', 0, 1),
      name: 'items[0].name',
    },
    {
      operation: 'move forward',
      mutate: (form: ArrayItemForm) => form.moveFieldValue('items', 0, 2),
      name: 'items[0].name',
    },
    {
      operation: 'move backward',
      mutate: (form: ArrayItemForm) => form.moveFieldValue('items', 2, 0),
      name: 'items[2].name',
    },
    {
      operation: 'filter',
      mutate: (form: ArrayItemForm) =>
        form.filterFieldValues('items', (value) => value.name !== 'first'),
      name: 'items[0].name',
    },
    {
      operation: 'swap without validation',
      mutate: (form: ArrayItemForm) =>
        form.swapFieldValues('items', 0, 1, { causeValidation: false }),
      name: 'items[0].name',
    },
  ])(
    "$operation cancels the moved field's pending validation and preserves its errors",
    async ({ mutate, name }) => {
      vi.useFakeTimers()
      let shouldWait = false
      let signal: AbortSignal | undefined
      const validator = vi.fn(() =>
        shouldWait ? sleep(100).then(() => 'Late error') : 'Stored error',
      )
      const form = new InternalFormApi({
        defaultValues: {
          items: [{ name: 'first' }, { name: 'moved' }, { name: 'third' }],
        },
      })
      const field = form._getOrCreateFieldApi({
        name: 'items[1].name',
        validators: [
          {
            triggers: ['blur', 'change'],
            run: (context) => {
              signal = context.signal
              return validator()
            },
          },
        ],
      })
      field.handleBlur()
      const previousMeta = field.meta
      expect(field.errors).toEqual([{ message: 'Stored error' }])

      shouldWait = true
      field.handleBlur()
      expect(signal?.aborted).toBe(false)
      expect(field.meta.isValidating).toBe(true)
      expect(form.state.isValidating).toBe(true)

      mutate(form)

      expect(signal?.aborted).toBe(true)
      expect(field.name).toBe(name)
      expect(field.value).toBe('moved')
      expect(form.getFieldValue(name)).toBe('moved')
      expect(form.getFieldMeta(name)).toMatchObject({
        isValidating: false,
        isSelfValidating: false,
        isSelfTouched: previousMeta.isSelfTouched,
        isSelfDirty: previousMeta.isSelfDirty,
        isBlurred: previousMeta.isBlurred,
        errors: [{ message: 'Stored error' }],
      })
      expect(form.state.isValidating).toBe(false)
      expect(validator).toHaveBeenCalledTimes(2)

      await vi.advanceTimersByTimeAsync(100)

      expect(field.errors).toEqual([{ message: 'Stored error' }])
      expect(field.meta.isValidating).toBe(false)
      expect(form.state.isValidating).toBe(false)
    },
  )
})

describe('InternalFieldApi - error visibility', () => {
  it('keeps errors hidden after blur when the policy requires a submit attempt', async () => {
    const form = new InternalFormApi({
      defaultValues: { name: '' },
      errorVisibility: ({ state }) => state.submissionAttempts > 0,
      validators: [
        {
          triggers: ['change'],
          run: ({ createErrorMap }) =>
            createErrorMap({ fields: { name: 'Name is required' } }),
        },
      ],
    })
    const field = form._getOrCreateFieldApi({ name: 'name' })
    field.handleBlur()

    await form.validate('change')

    expect(field.errors).toEqual([])
    expect(field.meta.original.errors).toEqual([
      { message: 'Name is required' },
    ])

    await form.handleSubmit()

    expect(field.errors).toEqual([{ message: 'Name is required' }])
  })

  it('provides current values and interaction state to the error visibility policy', ({
    onTestFinished,
  }) => {
    const options = formOptions({
      defaultValues: { name: '' },
      errorVisibility: ({ state, fieldState }) =>
        state.values.name === 'Alice' &&
        fieldState.value === 'Alice' &&
        fieldState.meta.isTouched &&
        fieldState.meta.isDirty,
      validators: [
        {
          triggers: ['change'],
          run: ({ createErrorMap }) =>
            createErrorMap({ fields: { name: 'Name error' } }),
        },
      ],
    })
    const policy = vi.spyOn(options, 'errorVisibility')
    onTestFinished(() => policy.mockRestore())
    const form = new InternalFormApi(options)
    const field = form._getOrCreateFieldApi({ name: 'name' })

    field.handleChange('Alice')

    expect(field.errors).toEqual([{ message: 'Name error' }])
    expect(policy).toHaveBeenCalledWith(
      expect.objectContaining({
        state: expect.objectContaining({ values: { name: 'Alice' } }),
        fieldState: expect.objectContaining({
          value: 'Alice',
          meta: expect.objectContaining({
            isTouched: true,
            isSelfTouched: true,
            isDirty: true,
            isSelfDirty: true,
            isPristine: false,
          }),
        }),
      }),
    )
    const fieldMeta = policy.mock.lastCall?.[0].fieldState.meta
    expect(fieldMeta).not.toHaveProperty('errors')
    expect(fieldMeta).not.toHaveProperty('isValid')
  })

  it('provides form errors and validity to the error visibility policy', async ({
    onTestFinished,
  }) => {
    const options = formOptions({
      defaultValues: { name: '' },
      errorVisibility: ({ state }) =>
        state.errors[0]?.message === 'Form error' &&
        !state.isValid &&
        state.isInvalid &&
        !state.canSubmit,
      validators: [
        {
          triggers: ['change'],
          run: ({ createErrorMap }) =>
            createErrorMap({
              form: 'Form error',
              fields: { name: 'Name error' },
            }),
        },
      ],
    })
    const policy = vi.spyOn(options, 'errorVisibility')
    onTestFinished(() => policy.mockRestore())
    const form = new InternalFormApi(options)
    const field = form._getOrCreateFieldApi({ name: 'name' })

    await form.validate('change')

    expect(field.errors).toEqual([{ message: 'Name error' }])
    expect(policy).toHaveBeenCalledWith(
      expect.objectContaining({
        state: expect.objectContaining({
          errors: [{ message: 'Form error' }],
          isValid: false,
          isInvalid: true,
          canSubmit: false,
        }),
      }),
    )
  })

  it('hides untouched field errors without discarding validation failures', async () => {
    const form = new InternalFormApi({
      defaultValues: { name: '', age: 0 },
      errorVisibility: ({ fieldState }) => fieldState.meta.isTouched,
      validators: [
        {
          triggers: ['change'],
          run: ({ createErrorMap }) =>
            createErrorMap({
              fields: { name: 'Name is required', age: 'Age is required' },
            }),
        },
      ],
    })
    const name = form._getOrCreateFieldApi({ name: 'name' })
    const age = form._getOrCreateFieldApi({ name: 'age' })
    name.handleBlur()

    await form.validate('change')

    expect(name.errors).toEqual([{ message: 'Name is required' }])
    expect(name.meta.isValid).toBe(false)
    expect(name.meta.original).toMatchObject({
      errors: [{ message: 'Name is required' }],
      isValid: false,
    })
    expect(age.errors).toEqual([])
    expect(age.meta.isValid).toBe(true)
    expect(age.meta.original).toMatchObject({
      errors: [{ message: 'Age is required' }],
      isValid: false,
    })
    expect(form.state.isValid).toBe(false)
    expect(form.state.canSubmit).toBe(false)
  })

  it('uses the field error visibility policy in place of the form policy', async () => {
    const form = new InternalFormApi({
      defaultValues: { name: '' },
      errorVisibility: () => false,
      validators: [
        {
          triggers: ['change'],
          run: ({ createErrorMap }) =>
            createErrorMap({ fields: { name: 'Name is required' } }),
        },
      ],
    })
    const field = form._getOrCreateFieldApi({
      name: 'name',
      errorVisibility: () => true,
    })

    await form.validate('change')

    expect(field.meta.isTouched).toBe(false)
    expect(field.errors).toEqual([{ message: 'Name is required' }])
    expect(field.meta.isValid).toBe(false)
    expect(field.meta.original).toMatchObject({
      errors: [{ message: 'Name is required' }],
      isValid: false,
    })
  })

  it('reveals errors when a field is blurred or the form is submitted', async () => {
    const form = new InternalFormApi({
      defaultValues: { name: '', email: '' },
      errorVisibility: ({ state, fieldState }) =>
        fieldState.meta.isBlurred || state.submissionAttempts > 0,
      validators: [
        {
          triggers: ['change'],
          run: ({ createErrorMap }) =>
            createErrorMap({
              fields: { name: 'Name is required', email: 'Email is required' },
            }),
        },
      ],
    })
    const name = form._getOrCreateFieldApi({ name: 'name' })
    const email = form._getOrCreateFieldApi({ name: 'email' })
    await form.validate('change')
    expect(name.errors).toEqual([])
    expect(email.errors).toEqual([])

    name.handleBlur()

    expect(name.errors).toEqual([{ message: 'Name is required' }])
    expect(email.errors).toEqual([])

    await form.handleSubmit()

    expect(email.errors).toEqual([{ message: 'Email is required' }])
    expect(form.state.canSubmit).toBe(false)
  })
})

describe('InternalFieldApi - validation state', () => {
  it('marks the parent as validating while a subfield validator is pending', async () => {
    vi.useFakeTimers()
    const form = new InternalFormApi({
      defaultValues: { user: { name: '' } },
    })
    const parent = form._getOrCreateFieldApi({ name: 'user' })
    const child = form._getOrCreateFieldApi({
      name: 'user.name',
      validators: [
        { triggers: ['blur'], run: () => sleep(100).then(() => null) },
      ],
    })

    child.handleBlur()

    expect(child.meta).toMatchObject({
      isValidating: true,
      isSelfValidating: true,
      subfields: { isSomeValidating: false },
    })
    expect(parent.meta).toMatchObject({
      isValidating: true,
      isSelfValidating: false,
      subfields: { isSomeValidating: true },
    })
    expect(form.state.isValidating).toBe(true)

    await vi.advanceTimersByTimeAsync(100)

    expect(child.meta.isValidating).toBe(false)
    expect(parent.meta).toMatchObject({
      isValidating: false,
      isSelfValidating: false,
      subfields: { isSomeValidating: false },
    })
    expect(form.state.isValidating).toBe(false)
  })

  it('distinguishes a parent with no errors of its own from its invalid subfield', () => {
    const form = new InternalFormApi({
      defaultValues: { user: { name: '' } },
    })
    const parent = form._getOrCreateFieldApi({ name: 'user' })
    const child = form._getOrCreateFieldApi({
      name: 'user.name',
      validators: [{ triggers: ['blur'], run: () => 'Name is required' }],
    })

    child.handleBlur()

    expect(child.meta).toMatchObject({
      errors: [{ message: 'Name is required' }],
      isSelfValid: false,
      isValid: false,
      isInvalid: true,
      subfields: { isEveryValid: true, isAnyInvalid: false },
    })
    expect(parent.meta).toMatchObject({
      errors: [],
      isSelfValid: true,
      isValid: false,
      isInvalid: true,
      subfields: { isEveryValid: false, isAnyInvalid: true },
    })
    expect(form.state.isValid).toBe(false)
    expect(form.state.canSubmit).toBe(false)
  })

  it('returns the parent and form to valid only after every subfield error clears', () => {
    let reportErrors = true
    const form = new InternalFormApi({
      defaultValues: { user: { name: '', email: '' } },
    })
    const parent = form._getOrCreateFieldApi({ name: 'user' })
    const name = form._getOrCreateFieldApi({
      name: 'user.name',
      validators: [
        { triggers: ['blur'], run: () => reportErrors && 'Name is required' },
      ],
    })
    const email = form._getOrCreateFieldApi({
      name: 'user.email',
      validators: [
        { triggers: ['blur'], run: () => reportErrors && 'Email is required' },
      ],
    })
    name.handleBlur()
    email.handleBlur()
    expect(parent.meta.isValid).toBe(false)

    reportErrors = false
    name.handleBlur()

    expect(name.errors).toEqual([])
    expect(email.errors).toEqual([{ message: 'Email is required' }])
    expect(parent.meta.subfields.isAnyInvalid).toBe(true)
    expect(form.state.isValid).toBe(false)

    email.handleBlur()

    expect(parent.meta).toMatchObject({
      isSelfValid: true,
      isValid: true,
      isInvalid: false,
      subfields: { isEveryValid: true, isAnyInvalid: false },
    })
    expect(form.state.isValid).toBe(true)
    expect(form.state.canSubmit).toBe(true)
    expect(parent.value).toEqual({ name: '', email: '' })
  })

  it('keeps the parent invalid while either its own validation or a subfield reports an error', () => {
    let parentInvalid = true
    let childInvalid = true
    const form = new InternalFormApi({
      defaultValues: { user: { name: '' } },
    })
    const parent = form._getOrCreateFieldApi({
      name: 'user',
      validators: [
        { triggers: ['blur'], run: () => parentInvalid && 'Parent error' },
      ],
    })
    const child = form._getOrCreateFieldApi({
      name: 'user.name',
      validators: [
        { triggers: ['blur'], run: () => childInvalid && 'Child error' },
      ],
    })
    child.handleBlur()
    expect(parent.meta).toMatchObject({
      isSelfValid: false,
      isValid: false,
      subfields: { isAnyInvalid: true },
    })

    parentInvalid = false
    parent.handleBlur()

    expect(parent.meta).toMatchObject({
      errors: [],
      isSelfValid: true,
      isValid: false,
      subfields: { isAnyInvalid: true },
    })
    expect(child.errors).toEqual([{ message: 'Child error' }])

    parentInvalid = true
    parent.handleBlur()
    childInvalid = false
    child.handleBlur()

    expect(child.errors).toEqual([])
    expect(parent.meta).toMatchObject({
      errors: [{ message: 'Parent error' }],
      isSelfValid: false,
      isValid: false,
      subfields: { isEveryValid: true, isAnyInvalid: false },
    })
    expect(form.state.isValid).toBe(false)

    parentInvalid = false
    parent.handleBlur()

    expect(parent.meta.isValid).toBe(true)
    expect(form.state.isValid).toBe(true)
  })
})

describe('InternalFieldApi - validator results', () => {
  it('preserves schema issues returned by a field validator and clears them when the value becomes valid', () => {
    const schema = z.string().min(3, 'Name is too short')
    const form = new InternalFormApi({ defaultValues: { name: '' } })
    const field = form._getOrCreateFieldApi({
      name: 'name',
      validators: [
        {
          triggers: ['change'],
          run: ({ value }) => {
            const result = schema.safeParse(value)
            return result.success ? null : result.error.issues
          },
        },
      ],
    })

    field.handleChange('a')

    expect(field.errors).toEqual([
      expect.objectContaining({
        message: 'Name is too short',
        code: 'too_small',
        path: [],
      }),
    ])
    expect(form.state.canSubmit).toBe(false)

    field.handleChange('Alice')

    expect(field.errors).toEqual([])
    expect(form.state.canSubmit).toBe(true)
  })

  it('ignores outputs from field validators in form submit', async () => {
    const onSubmit = vi.fn()
    const form = new InternalFormApi({
      defaultValues: { name: '' },
      onSubmit,
    })
    const field = form._getOrCreateFieldApi({
      name: 'name',
      validators: [
        {
          triggers: ['change'],
          run: z.string().transform((value) => value.toUpperCase()),
        },
      ],
    })

    field.handleChange('Alice')

    expect(field.value).toBe('Alice')
    expect(form.state.values).toEqual({ name: 'Alice' })
    expect(field.errors).toEqual([])

    await form.handleSubmit()

    expect(field.value).toBe('Alice')
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        value: { name: 'Alice' },
        validatorOutputs: [],
      }),
    )
  })

  it('combines errors from field and form validators and clears each source independently', () => {
    const form = new InternalFormApi({
      defaultValues: { name: '' },
      validators: [
        {
          triggers: ['blur'],
          run: ({ value, createErrorMap }) =>
            createErrorMap({
              fields: { name: value.name.length < 5 ? 'Form error' : null },
            }),
        },
      ],
    })
    const field = form._getOrCreateFieldApi({
      name: 'name',
      validators: [
        {
          triggers: ['change'],
          run: ({ value }) => (value.length < 3 ? 'Field error' : null),
        },
      ],
    })

    field.handleChange('a')
    field.handleBlur()

    expect(field.errors).toEqual([
      { message: 'Field error' },
      { message: 'Form error' },
    ])

    field.handleChange('Ali')

    expect(field.errors).toEqual([{ message: 'Form error' }])
    expect(form.state.isValid).toBe(false)

    field.handleChange('Alice')
    field.handleBlur()

    expect(field.errors).toEqual([])
    expect(form.state.isValid).toBe(true)
  })
})

describe('InternalFieldApi - handleChange', () => {
  it('updates the value without running validators when causeValidation is false', () => {
    const formValidator = vi.fn(() => 'Form error')
    const parentValidator = vi.fn(() => 'Parent error')
    const fieldValidator = vi.fn(() => 'Field error')
    const watchedValidator = vi.fn(() => 'Watched error')
    const form = new InternalFormApi({
      defaultValues: { user: { name: '' }, confirmation: '' },
      validators: [{ triggers: ['change'], run: formValidator }],
    })
    const parent = form._getOrCreateFieldApi({
      name: 'user',
      validators: [{ triggers: ['change'], run: parentValidator }],
    })
    const field = form._getOrCreateFieldApi({
      name: 'user.name',
      validators: [{ triggers: ['change'], run: fieldValidator }],
    })
    const confirmation = form._getOrCreateFieldApi({
      name: 'confirmation',
      validators: [
        {
          triggers: ['change'],
          watchFields: ['user.name'],
          run: watchedValidator,
        },
      ],
    })

    field.handleChange('Alice', { causeValidation: false })

    expect(field.value).toBe('Alice')
    expect(field.meta).toMatchObject({ isTouched: true, isDirty: true })
    expect(fieldValidator).not.toHaveBeenCalled()
    expect(parentValidator).not.toHaveBeenCalled()
    expect(watchedValidator).not.toHaveBeenCalled()
    expect(formValidator).not.toHaveBeenCalled()
    expect(field.errors).toEqual([])
    expect(parent.errors).toEqual([])
    expect(confirmation.errors).toEqual([])
    expect(form.state.isValid).toBe(true)
  })

  it('uses the current value and touched state for conditional change validation', () => {
    const validator = vi.fn(() => 'Change error')
    const form = new InternalFormApi({ defaultValues: { name: '' } })
    const field = form._getOrCreateFieldApi({
      name: 'name',
      validators: [
        {
          triggers: [
            {
              trigger: 'change',
              when: ({ value, fieldApi, formApi }) =>
                fieldApi.form === formApi &&
                value === 'Alice' &&
                fieldApi.meta.isTouched,
            },
          ],
          run: validator,
        },
      ],
    })

    field.handleChange('Alice', { markAsTouched: false })

    expect(validator).not.toHaveBeenCalled()
    expect(field.errors).toEqual([])

    field.handleChange('Alice')

    expect(validator).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({
        event: 'change',
        value: 'Alice',
        fieldApi: field,
        formApi: form,
      }),
    )
    expect(field.errors).toEqual([{ message: 'Change error' }])
  })

  it('cancels an obsolete change run before its waiting validator can use the new value', async () => {
    vi.useFakeTimers()
    const waitingValidator = vi.fn(() => 'Current error')
    let oldSignal: AbortSignal | undefined
    const form = new InternalFormApi({ defaultValues: { name: '' } })
    const field = form._getOrCreateFieldApi({
      name: 'name',
      validators: [
        {
          triggers: ['change'],
          run: ({ value, signal }) => {
            if (value === 'old') {
              oldSignal = signal
              return sleep(100).then(() => null)
            }
            return null
          },
        },
        { triggers: ['change'], bailIfInvalid: true, run: waitingValidator },
      ],
    })

    field.handleChange('old')
    expect(oldSignal?.aborted).toBe(false)
    expect(field.meta.isValidating).toBe(true)
    expect(waitingValidator).not.toHaveBeenCalled()

    field.handleChange('new')

    expect(oldSignal?.aborted).toBe(true)
    expect(waitingValidator).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({ event: 'change', value: 'new' }),
    )
    expect(field.errors).toEqual([{ message: 'Current error' }])
    expect(field.meta.isValidating).toBe(false)
    expect(form.state.isValidating).toBe(false)

    await vi.advanceTimersByTimeAsync(100)

    expect(waitingValidator).toHaveBeenCalledOnce()
    expect(field.value).toBe('new')
    expect(field.errors).toEqual([{ message: 'Current error' }])
    expect(field.meta.isValidating).toBe(false)
    expect(form.state.isValidating).toBe(false)
  })

  it('applies synchronous function and schema errors before change returns', () => {
    const form = new InternalFormApi({ defaultValues: { name: '' } })
    const field = form._getOrCreateFieldApi({
      name: 'name',
      validators: [
        { triggers: ['change'], run: () => 'Function error' },
        { triggers: ['change'], run: z.string().min(3, 'Schema error') },
      ],
    })

    field.handleChange('a')

    expect(field.errors.map(({ message }) => message)).toEqual([
      'Function error',
      'Schema error',
    ])
    expect(field.meta.isValidating).toBe(false)
    expect(form.state.isValidating).toBe(false)
  })

  it('displays asynchronous errors as they arrive in validator order', async ({
    onTestFinished,
  }) => {
    const first = promiseWithResolvers<string>()
    const second = promiseWithResolvers<string>()
    onTestFinished(() => {
      first.resolve('First error')
      second.resolve('Second error')
    })
    const form = new InternalFormApi({ defaultValues: { name: '' } })
    const field = form._getOrCreateFieldApi({
      name: 'name',
      validators: [
        { triggers: ['change'], run: () => first.promise },
        { triggers: ['change'], run: () => second.promise },
      ],
    })

    field.handleChange('value')

    expect(field.errors).toEqual([])
    expect(field.meta.isValidating).toBe(true)
    expect(field.meta.isSelfValidating).toBe(true)
    expect(field.meta.subfields.isSomeValidating).toBe(false)
    expect(form.state.isValidating).toBe(true)

    second.resolve('Second error')
    await expect.poll(() => field.errors).toEqual([{ message: 'Second error' }])

    expect(field.meta.isValidating).toBe(true)
    expect(form.state.isValidating).toBe(true)

    first.resolve('First error')
    await expect.poll(() => field.meta.isValidating).toBe(false)

    expect(field.errors).toEqual([
      { message: 'First error' },
      { message: 'Second error' },
    ])
    expect(field.meta.isSelfValidating).toBe(false)
    expect(form.state.isValidating).toBe(false)
  })

  it.for([true, false])(
    'cancels pending mount validation when the value changes, regardless of causeValidation (%s)',
    async (causeValidation, { onTestFinished }) => {
      vi.useFakeTimers()
      const pending = promiseWithResolvers<string>()
      onTestFinished(() => pending.resolve('Late mount error'))
      const waitingValidator = vi.fn(() => 'Should not run')
      let signal: AbortSignal | undefined
      const form = new InternalFormApi({ defaultValues: { name: '' } })
      const field = form._getOrCreateFieldApi({
        name: 'name',
        validators: [
          {
            triggers: ['mount'],
            run: (context) => {
              signal = context.signal
              return pending.promise
            },
          },
          { triggers: ['mount'], bailIfInvalid: true, run: waitingValidator },
        ],
      })
      onTestFinished(field._register())
      expect(signal?.aborted).toBe(false)
      expect(field.meta.isValidating).toBe(true)

      field.handleChange('new value', { causeValidation })

      expect(field.value).toBe('new value')
      expect(signal?.aborted).toBe(true)
      expect(field.meta.isValidating).toBe(false)
      expect(form.state.isValidating).toBe(false)

      pending.resolve('Late mount error')
      await vi.advanceTimersByTimeAsync(0)

      expect(waitingValidator).not.toHaveBeenCalled()
      expect(field.errors).toEqual([])
      expect(field.meta.isValidating).toBe(false)
      expect(form.state.isValidating).toBe(false)
    },
  )

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

describe('InternalFieldApi - validator failures', () => {
  it.for([
    { event: 'mount', failure: 'synchronous' },
    { event: 'mount', failure: 'asynchronous' },
    { event: 'change', failure: 'synchronous' },
    { event: 'change', failure: 'asynchronous' },
    { event: 'blur', failure: 'synchronous' },
    { event: 'blur', failure: 'asynchronous' },
  ] as const)(
    'logs a $failure $event failure once and preserves the previously applied error',
    async ({ event, failure }, { onTestFinished }) => {
      const error = new Error('Field validation failed')
      const pending = promiseWithResolvers<never>()
      const log = vi.spyOn(console, 'error').mockImplementation(() => {})
      onTestFinished(() => log.mockRestore())
      const form = new InternalFormApi({ defaultValues: { name: '' } })
      const field = form._getOrCreateFieldApi({
        name: 'name',
        validators: [
          {
            triggers: [event],
            run: ({ event: selectedEvent }) => {
              if (selectedEvent === 'submit') return 'Stored error'
              if (failure === 'asynchronous') return pending.promise
              throw error
            },
          },
        ],
      })
      await form.handleSubmit()
      expect(field.errors).toEqual([{ message: 'Stored error' }])

      if (event === 'mount') onTestFinished(field._register())
      else if (event === 'change') field.handleChange('new')
      else field.handleBlur()

      if (failure === 'asynchronous') {
        expect(field.meta.isValidating).toBe(true)
        expect(form.state.isValidating).toBe(true)
        pending.reject(error)
      }

      await expect
        .poll(() => log)
        .toHaveBeenCalledExactlyOnceWith(
          expect.objectContaining({ errors: [error] }),
        )
      expect(field.errors).toEqual([{ message: 'Stored error' }])
      expect(field.meta.isValidating).toBe(false)
      expect(form.state.isValidating).toBe(false)
    },
  )
})

describe('InternalFieldApi - handleBlur', () => {
  it('runs blur validation when its predicate sees the updated blurred state', () => {
    const validator = vi.fn(() => 'Blur error')
    const form = new InternalFormApi({ defaultValues: { name: '' } })
    const field = form._getOrCreateFieldApi({
      name: 'name',
      validators: [
        {
          triggers: [
            {
              trigger: 'change',
              when: ({ fieldApi }) => fieldApi.meta.isBlurred,
            },
            {
              trigger: 'blur',
              when: ({ value, fieldApi, formApi }) =>
                fieldApi.form === formApi &&
                value === 'Alice' &&
                fieldApi.meta.isBlurred,
            },
          ],
          run: validator,
        },
      ],
    })
    field.handleChange('Alice')
    expect(validator).not.toHaveBeenCalled()

    field.handleBlur()

    expect(validator).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({
        event: 'blur',
        value: 'Alice',
        fieldApi: field,
        formApi: form,
      }),
    )
    expect(field.errors).toEqual([{ message: 'Blur error' }])
  })

  it('replaces matching pending validation while preserving change-only validation', async ({
    onTestFinished,
  }) => {
    const oldChange = promiseWithResolvers<string>()
    const blur = promiseWithResolvers<string>()
    const changeOnly = promiseWithResolvers<string>()
    onTestFinished(() => {
      oldChange.resolve('Stale change error')
      blur.resolve('Blur error')
      changeOnly.resolve('Change-only error')
    })
    let oldChangeSignal: AbortSignal | undefined
    let changeOnlySignal: AbortSignal | undefined
    const form = new InternalFormApi({ defaultValues: { name: '' } })
    const field = form._getOrCreateFieldApi({
      name: 'name',
      validators: [
        {
          triggers: ['change', 'blur'],
          run: ({ event, signal }) => {
            if (event === 'change') {
              oldChangeSignal = signal
              return oldChange.promise
            }
            return blur.promise
          },
        },
        {
          triggers: ['change'],
          run: ({ signal }) => {
            changeOnlySignal = signal
            return changeOnly.promise
          },
        },
      ],
    })

    field.handleChange('value')
    expect(oldChangeSignal?.aborted).toBe(false)
    expect(changeOnlySignal?.aborted).toBe(false)

    field.handleBlur()

    expect(oldChangeSignal?.aborted).toBe(true)
    expect(changeOnlySignal?.aborted).toBe(false)

    blur.resolve('Blur error')
    await expect.poll(() => field.errors).toEqual([{ message: 'Blur error' }])

    expect(field.meta.isValidating).toBe(true)
    expect(form.state.isValidating).toBe(true)

    oldChange.resolve('Stale change error')
    changeOnly.resolve('Change-only error')
    await expect.poll(() => field.meta.isValidating).toBe(false)

    expect(field.errors).toEqual([
      { message: 'Blur error' },
      { message: 'Change-only error' },
    ])
    expect(form.state.isValidating).toBe(false)
  })

  it('preserves mount and submit errors whose validators do not run on blur', async ({
    onTestFinished,
  }) => {
    const mountValidator = vi.fn(() => 'Mount error')
    const submitValidator = vi.fn(() => 'Submit error')
    const form = new InternalFormApi({ defaultValues: { name: '' } })
    const field = form._getOrCreateFieldApi({
      name: 'name',
      validators: [
        { triggers: ['mount'], skipOnSubmit: true, run: mountValidator },
        { triggers: [], run: submitValidator },
      ],
    })
    onTestFinished(field._register())
    expect(field.errors).toEqual([{ message: 'Mount error' }])

    await form.handleSubmit()
    expect(field.errors).toEqual([
      { message: 'Mount error' },
      { message: 'Submit error' },
    ])
    mountValidator.mockClear()
    submitValidator.mockClear()

    field.handleBlur()

    expect(mountValidator).not.toHaveBeenCalled()
    expect(submitValidator).not.toHaveBeenCalled()
    expect(field.errors).toEqual([
      { message: 'Mount error' },
      { message: 'Submit error' },
    ])
    expect(field.meta.isValidating).toBe(false)
    expect(form.state.isValidating).toBe(false)
  })
})

describe('InternalFieldApi - _notifyValidator', () => {
  it('validates the watching field with its own value and context when the source changes', () => {
    const validator = vi.fn(() => 'Target is invalid')
    const form = new InternalFormApi({
      defaultValues: { source: '', target: 'target' },
    })
    const target = form._getOrCreateFieldApi({
      name: 'target',
      validators: [
        { triggers: ['change'], watchFields: ['source'], run: validator },
      ],
    })
    const source = form._getOrCreateFieldApi({ name: 'source' })

    source.handleChange('changed source')

    expect(validator).toHaveBeenCalledWith(
      expect.objectContaining({
        event: 'change',
        value: 'target',
        fieldApi: target,
        formApi: form,
      }),
    )
    expect(target.errors).toEqual([{ message: 'Target is invalid' }])
    expect(source.errors).toEqual([])
    expect(target.value).toBe('target')
    expect(form.state.isValid).toBe(false)
  })

  it('runs only validators watching the source with a matching change or blur trigger', () => {
    const changeValidator = vi.fn(() => 'Change error')
    const blurValidator = vi.fn(() => 'Blur error')
    const unrelatedValidator = vi.fn(() => 'Unrelated error')
    const unrelatedValidator2 = vi.fn(() => 'Direct error')
    const form = new InternalFormApi({
      defaultValues: { source: '', other: '', target: '' },
    })
    const target = form._getOrCreateFieldApi({
      name: 'target',
      validators: [
        { triggers: ['change'], watchFields: ['source'], run: changeValidator },
        { triggers: ['blur'], watchFields: ['source'], run: blurValidator },
        {
          triggers: ['change', 'blur'],
          watchFields: ['other'],
          run: unrelatedValidator,
        },
        { triggers: ['change', 'blur'], run: unrelatedValidator2 },
      ],
    })
    const source = form._getOrCreateFieldApi({ name: 'source' })

    source.handleChange('changed source')

    expect(changeValidator).toHaveBeenCalledOnce()
    expect(blurValidator).not.toHaveBeenCalled()
    expect(unrelatedValidator).not.toHaveBeenCalled()
    expect(unrelatedValidator2).not.toHaveBeenCalled()
    expect(target.errors).toEqual([{ message: 'Change error' }])

    source.handleBlur()

    expect(changeValidator).toHaveBeenCalledOnce()
    expect(blurValidator).toHaveBeenCalledOnce()
    expect(unrelatedValidator).not.toHaveBeenCalled()
    expect(unrelatedValidator2).not.toHaveBeenCalled()
    expect(target.errors).toEqual([
      { message: 'Change error' },
      { message: 'Blur error' },
    ])
  })

  it('updates validation errors when either of multiple watched fields changes', () => {
    const form = new InternalFormApi({
      defaultValues: { source: '', other: '', target: '' },
    })
    const target = form._getOrCreateFieldApi({
      name: 'target',
      validators: [
        {
          triggers: ['change'],
          watchFields: ['source', 'other'],
          run: () =>
            form.state.values.source === form.state.values.other
              ? undefined
              : 'Values must match',
        },
      ],
    })
    const source = form._getOrCreateFieldApi({ name: 'source' })
    const other = form._getOrCreateFieldApi({ name: 'other' })

    source.handleChange('matching value')

    expect(target.errors).toEqual([{ message: 'Values must match' }])

    other.handleChange('matching value')

    expect(target.errors).toEqual([])
    expect(form.state.isValid).toBe(true)
  })

  it('replaces selected watched errors in validator order while preserving unselected errors', () => {
    const otherValidator = vi.fn(() => 'Other error')
    const form = new InternalFormApi({
      defaultValues: { source: '', other: '', target: '' },
    })
    const target = form._getOrCreateFieldApi({
      name: 'target',
      validators: [
        { triggers: ['change'], watchFields: ['other'], run: otherValidator },
        {
          triggers: ['change'],
          watchFields: ['source'],
          run: () =>
            form.state.values.source !== 'valid' &&
            `Source: ${form.state.values.source}`,
        },
      ],
    })
    const source = form._getOrCreateFieldApi({ name: 'source' })
    const other = form._getOrCreateFieldApi({ name: 'other' })

    source.handleChange('first')
    expect(otherValidator).not.toHaveBeenCalled()
    expect(target.errors).toEqual([{ message: 'Source: first' }])

    other.handleChange('other value')
    expect(target.errors).toEqual([
      { message: 'Other error' },
      { message: 'Source: first' },
    ])
    otherValidator.mockClear()

    source.handleChange('updated')
    expect(target.errors).toEqual([
      { message: 'Other error' },
      { message: 'Source: updated' },
    ])

    source.handleChange('valid')
    expect(target.errors).toEqual([{ message: 'Other error' }])
    expect(otherValidator).not.toHaveBeenCalled()
  })

  it('warns and stops cyclical validator watches while retaining each field error', ({
    onTestFinished,
  }) => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    onTestFinished(() => warn.mockRestore())
    const firstValidator = vi.fn(() => 'First error')
    const secondValidator = vi.fn(() => 'Second error')
    const form = new InternalFormApi({
      defaultValues: { first: '', second: '' },
    })
    const first = form._getOrCreateFieldApi({
      name: 'first',
      validators: [
        {
          triggers: ['change'],
          watchFields: ['second'],
          run: firstValidator,
        },
      ],
    })
    const second = form._getOrCreateFieldApi({
      name: 'second',
      validators: [
        {
          triggers: ['change'],
          watchFields: ['first'],
          run: secondValidator,
        },
      ],
    })

    first.handleChange('changed first')

    expect(firstValidator).toHaveBeenCalledOnce()
    expect(secondValidator).toHaveBeenCalledOnce()
    expect(first.errors).toEqual([{ message: 'First error' }])
    expect(second.errors).toEqual([{ message: 'Second error' }])
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('cyclical validator cycle detected'),
    )
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

  it('retains submit errors until debounced asynchronous change validation finishes', async ({
    onTestFinished,
  }) => {
    vi.useFakeTimers()
    const pending = promiseWithResolvers<null>()
    onTestFinished(() => pending.resolve(null))
    const changeValidator = vi.fn(() => pending.promise)
    const form = new InternalFormApi({ defaultValues: { name: '' } })
    const field = form._getOrCreateFieldApi({
      name: 'name',
      validators: [
        {
          triggers: ['change'],
          triggerDebounceMs: 100,
          run: ({ event }) =>
            event === 'submit' ? 'Submit error' : changeValidator(),
        },
      ],
    })

    await form.handleSubmit()
    expect(field.errors).toEqual([{ message: 'Submit error' }])

    field.handleChange('new value')

    expect(changeValidator).not.toHaveBeenCalled()
    expect(field.errors).toEqual([{ message: 'Submit error' }])

    await vi.advanceTimersByTimeAsync(100)

    expect(changeValidator).toHaveBeenCalledOnce()
    expect(field.errors).toEqual([{ message: 'Submit error' }])
    expect(field.meta.isValidating).toBe(true)
    expect(form.state.isValidating).toBe(true)

    pending.resolve(null)
    await vi.advanceTimersByTimeAsync(0)

    expect(field.errors).toEqual([])
    expect(field.meta.isValidating).toBe(false)
    expect(form.state.isValidating).toBe(false)
  })

  it('retains a waiting validator error until an earlier error causes it to be skipped', async ({
    onTestFinished,
  }) => {
    const earlier = promiseWithResolvers<string>()
    onTestFinished(() => earlier.resolve('Earlier error'))
    const skippedValidator = vi.fn(() => 'Stored error')
    const form = new InternalFormApi({ defaultValues: { name: '' } })
    const field = form._getOrCreateFieldApi({
      name: 'name',
      validators: [
        {
          triggers: ['change'],
          run: ({ event }) => (event === 'submit' ? null : earlier.promise),
        },
        { triggers: ['change'], bailIfInvalid: true, run: skippedValidator },
        {
          triggers: ['change'],
          run: ({ event }) => (event === 'submit' ? null : 'Later error'),
        },
      ],
    })

    await form.handleSubmit()
    expect(field.errors).toEqual([{ message: 'Stored error' }])
    skippedValidator.mockClear()

    field.handleChange('new value')

    expect(field.errors).toEqual([{ message: 'Stored error' }])
    expect(field.meta.isValidating).toBe(true)

    earlier.resolve('Earlier error')
    await expect.poll(() => field.meta.isValidating).toBe(false)

    expect(skippedValidator).not.toHaveBeenCalled()
    expect(field.errors).toEqual([
      { message: 'Earlier error' },
      { message: 'Later error' },
    ])
    expect(form.state.isValidating).toBe(false)
  })

  it('retains a waiting validator error until its replacement validation finishes', async ({
    onTestFinished,
  }) => {
    const earlier = promiseWithResolvers<null>()
    const replacement = promiseWithResolvers<null>()
    onTestFinished(() => {
      earlier.resolve(null)
      replacement.resolve(null)
    })
    const replacementValidator = vi.fn(() => replacement.promise)
    const form = new InternalFormApi({ defaultValues: { name: '' } })
    const field = form._getOrCreateFieldApi({
      name: 'name',
      validators: [
        {
          triggers: ['change'],
          run: ({ event }) => (event === 'submit' ? null : earlier.promise),
        },
        {
          triggers: ['change'],
          bailIfInvalid: true,
          run: ({ event }) =>
            event === 'submit' ? 'Stored error' : replacementValidator(),
        },
      ],
    })

    await form.handleSubmit()
    expect(field.errors).toEqual([{ message: 'Stored error' }])

    field.handleChange('new value')
    expect(replacementValidator).not.toHaveBeenCalled()
    expect(field.errors).toEqual([{ message: 'Stored error' }])

    earlier.resolve(null)
    await expect.poll(() => replacementValidator).toHaveBeenCalledOnce()

    expect(field.errors).toEqual([{ message: 'Stored error' }])
    expect(field.meta.isValidating).toBe(true)
    expect(form.state.isValidating).toBe(true)

    replacement.resolve(null)
    await expect.poll(() => field.meta.isValidating).toBe(false)

    expect(field.errors).toEqual([])
    expect(form.state.isValid).toBe(true)
    expect(form.state.isValidating).toBe(false)
  })

  it('clears submit errors on the changed field and its parents while preserving sibling errors', async () => {
    const form = new InternalFormApi({
      defaultValues: { parent: { child: '', sibling: '' } },
    })
    const parent = form._getOrCreateFieldApi({
      name: 'parent',
      validators: [{ triggers: [], run: () => 'Parent error' }],
    })
    const child = form._getOrCreateFieldApi({
      name: 'parent.child',
      validators: [{ triggers: [], run: () => 'Child error' }],
    })
    const sibling = form._getOrCreateFieldApi({
      name: 'parent.sibling',
      validators: [{ triggers: [], run: () => 'Sibling error' }],
    })

    await form.handleSubmit()
    expect(parent.errors).toEqual([{ message: 'Parent error' }])
    expect(child.errors).toEqual([{ message: 'Child error' }])
    expect(sibling.errors).toEqual([{ message: 'Sibling error' }])

    child.handleChange('new value', { causeValidation: false })

    expect(parent.errors).toEqual([])
    expect(child.errors).toEqual([])
    expect(sibling.errors).toEqual([{ message: 'Sibling error' }])
    expect(form.state.isValid).toBe(false)
  })

  it('preserves subfield errors when a parent value is replaced until the subfield is edited', async () => {
    // This one could be RFC-worthy. I'm not sure if there's a solid argument for this one.
    // Reach out and let me know ~Luca
    const form = new InternalFormApi({
      defaultValues: { parent: { child: '' } },
    })
    const parent = form._getOrCreateFieldApi({
      name: 'parent',
      validators: [{ triggers: [], run: () => 'Parent error' }],
    })
    const child = form._getOrCreateFieldApi({
      name: 'parent.child',
      validators: [{ triggers: [], run: () => 'Child error' }],
    })

    await form.handleSubmit()
    expect(parent.errors).toEqual([{ message: 'Parent error' }])
    expect(child.errors).toEqual([{ message: 'Child error' }])

    parent.handleChange({ child: 'replacement' }, { causeValidation: false })

    expect(parent.errors).toEqual([])
    expect(child.value).toBe('replacement')
    expect(child.errors).toEqual([{ message: 'Child error' }])
    expect(form.state.isValid).toBe(false)

    child.handleChange('direct edit', { causeValidation: false })

    expect(child.errors).toEqual([])
    expect(form.state.isValid).toBe(true)
  })

  it("clears only the watching validator's submit error when its source changes", async () => {
    const form = new InternalFormApi({
      defaultValues: { source: '', target: 'target' },
    })
    const target = form._getOrCreateFieldApi({
      name: 'target',
      validators: [
        {
          triggers: ['change'],
          watchFields: ['source'],
          run: ({ event }) =>
            event === 'submit' ? 'Watched submit error' : null,
        },
        { triggers: [], run: () => 'Unwatched submit error' },
      ],
    })
    const source = form._getOrCreateFieldApi({ name: 'source' })

    await form.handleSubmit()
    expect(target.errors).toEqual([
      { message: 'Watched submit error' },
      { message: 'Unwatched submit error' },
    ])

    source.handleChange('changed source')

    expect(target.value).toBe('target')
    expect(target.errors).toEqual([{ message: 'Unwatched submit error' }])
    expect(form.state.isValid).toBe(false)
  })
})
