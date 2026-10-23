import { describe, expect, it, vi } from 'vitest'
import { InternalFormApi } from '../../src/FormApi/FormApi.lib'
import { formOptions } from '../../src'
import { promiseWithResolvers } from '../test-utils'

describe('InternalFormApi - constructor', () => {
  it('initializes default values with untouched, submittable state', () => {
    const form = new InternalFormApi({
      defaultValues: { name: 'Alice', age: 30 },
    })

    expect(form.state).toMatchObject({
      values: { name: 'Alice', age: 30 },
      isTouched: false,
      canSubmit: true,
    })
  })

  it('uses a supplied formId', () => {
    const form = new InternalFormApi({
      formId: 'profile-form',
      defaultValues: { name: '' },
    })

    expect(form.formId).toBe('profile-form')
  })
})

describe('InternalFormApi - mount', () => {
  it('notifies mount listeners with the form values', ({ onTestFinished }) => {
    const listener = vi.fn()
    const form = new InternalFormApi({
      defaultValues: { name: '' },
      listeners: [{ triggers: ['mount'], run: listener }],
    })

    const unmount = form.mount()
    onTestFinished(unmount)

    expect(listener).toHaveBeenCalledOnce()
    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({
        formApi: form,
        triggerFieldApi: undefined,
        value: { name: '' },
      }),
    )
  })
})

describe('InternalFormApi - _update', () => {
  it('changes a supplied formId', () => {
    const form = new InternalFormApi({
      formId: 'profile-form',
      defaultValues: { name: '' },
    })

    form._update({
      formId: 'renamed-profile-form',
      defaultValues: { name: '' },
    })

    expect(form.formId).toBe('renamed-profile-form')
  })

  it('generates a nonempty formId and preserves it when options update', () => {
    const form = new InternalFormApi({ defaultValues: { name: '' } })
    const formId = form.formId

    expect(formId).toBeTypeOf('string')
    expect(formId.length).toBeGreaterThan(0)

    form._update({ defaultValues: { name: 'async' } })

    expect(form.formId).toBe(formId)
  })

  it('applies updated defaults to an untouched field without marking it touched', () => {
    const form = new InternalFormApi({ defaultValues: { name: '' } })
    const field = form._getOrCreateFieldApi({ name: 'name' })

    expect(field.value).toBe('')
    expect(field.meta.isTouched).toBe(false)

    form._update({ defaultValues: { name: 'async' } })

    expect(form.state.values).toEqual({ name: 'async' })
    expect(form.defaultValues).toEqual({ name: 'async' })
    expect(field.value).toBe('async')
    expect(field.meta.isTouched).toBe(false)
    expect(form.state.isTouched).toBe(false)
  })

  it('preserves user edits while applying updated defaults to untouched fields', () => {
    const form = new InternalFormApi({
      defaultValues: { name: '', email: '' },
    })
    const nameField = form._getOrCreateFieldApi({ name: 'name' })
    form._getOrCreateFieldApi({ name: 'email' })

    nameField.handleChange('user edit')
    form._update({
      defaultValues: { name: 'server name', email: 'server@example.com' },
    })

    expect(form.state.values).toEqual({
      name: 'user edit',
      email: 'server@example.com',
    })
    expect(form.defaultValues).toEqual({
      name: 'server name',
      email: 'server@example.com',
    })
  })

  it('warns when the validator array length changes', ({ onTestFinished }) => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    onTestFinished(() => warn.mockRestore())
    const form = new InternalFormApi({
      defaultValues: { name: '' },
      validators: [{ run: () => null, triggers: [] }],
    })

    form._update({
      defaultValues: { name: '' },
      validators: [
        { run: () => null, triggers: [] },
        // @ts-expect-error We're testing this on purpose
        { run: () => null, triggers: [] },
      ],
    })

    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining(
        'length of the validator array should not change',
      ),
    )
  })

  it('uses the updated validator callback on subsequent validation', async () => {
    const form = new InternalFormApi({
      defaultValues: { name: '' },
      validators: [{ run: () => 'Initial error', triggers: ['change'] }],
    })

    await form.validate('change')
    expect(form.state.errors).toEqual([{ message: 'Initial error' }])

    form._update({
      defaultValues: { name: '' },
      validators: [{ run: () => 'Updated error', triggers: ['change'] }],
    })
    await form.validate('change')

    expect(form.state.errors).toEqual([{ message: 'Updated error' }])
  })

  it('uses the updated listener callback and triggers', () => {
    const initialListener = vi.fn()
    const updatedListener = vi.fn()
    const form = new InternalFormApi({
      defaultValues: { name: '' },
      listeners: [{ triggers: ['change'], run: initialListener }],
    })
    const field = form._getOrCreateFieldApi({ name: 'name' })

    field.handleChange('before update')
    expect(initialListener).toHaveBeenCalledOnce()
    initialListener.mockClear()

    form._update({
      defaultValues: { name: '' },
      listeners: [{ triggers: ['blur'], run: updatedListener }],
    })
    field.handleChange('after update')
    expect(initialListener).not.toHaveBeenCalled()
    expect(updatedListener).not.toHaveBeenCalled()

    field.handleBlur()

    expect(updatedListener).toHaveBeenCalledOnce()
    expect(initialListener).not.toHaveBeenCalled()
  })

  it('uses the updated listener when a pending debounce completes', async () => {
    vi.useFakeTimers()
    const initialListener = vi.fn()
    const updatedListener = vi.fn()
    const form = new InternalFormApi({
      defaultValues: { name: '' },
      listeners: [
        {
          triggers: ['change'],
          triggerDebounceMs: 300,
          run: initialListener,
        },
      ],
    })
    const field = form._getOrCreateFieldApi({ name: 'name' })

    field.handleChange('Alice')
    await vi.advanceTimersByTimeAsync(100)

    form._update({
      defaultValues: { name: '' },
      listeners: [
        {
          triggers: ['change'],
          triggerDebounceMs: 300,
          run: updatedListener,
        },
      ],
    })

    await vi.advanceTimersByTimeAsync(199)
    expect(initialListener).not.toHaveBeenCalled()
    expect(updatedListener).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(1)

    expect(initialListener).not.toHaveBeenCalled()
    expect(updatedListener).toHaveBeenCalledOnce()
    expect(updatedListener).toHaveBeenCalledWith(
      expect.objectContaining({
        formApi: form,
        triggerFieldApi: field,
        value: { name: 'Alice' },
      }),
    )
  })

  it('uses the updated onSubmit callback and replaces its previous errors', async () => {
    const form = new InternalFormApi({
      defaultValues: { name: '' },
      onSubmit: ({ createValidationError }) =>
        createValidationError('Initial submit error'),
    })

    await form.handleSubmit()
    expect(form.state.errors).toEqual([{ message: 'Initial submit error' }])

    form._update({
      defaultValues: { name: '' },
      onSubmit: ({ createValidationError }) =>
        createValidationError('Updated submit error'),
    })
    await form.handleSubmit()

    expect(form.state.errors).toEqual([{ message: 'Updated submit error' }])
  })

  it('retains default listeners when incoming listeners update', () => {
    const defaultListener = vi.fn()
    const incomingListener = vi.fn()
    const updatedListener = vi.fn()
    const form = new InternalFormApi(
      {
        defaultValues: { name: '' },
        listeners: [{ triggers: ['change'], run: incomingListener }],
      },
      {
        form: {
          listenersMerge: 'append',
          listeners: [{ triggers: ['change'], run: defaultListener }],
        },
      },
    )

    form.setFieldValue('name', 'initial')
    expect(defaultListener).toHaveBeenCalledOnce()
    expect(incomingListener).toHaveBeenCalledOnce()
    expect(defaultListener).toHaveBeenCalledBefore(incomingListener)

    defaultListener.mockClear()
    incomingListener.mockClear()
    form._update({
      defaultValues: { name: '' },
      listeners: [{ triggers: ['change'], run: updatedListener }],
    })
    form.setFieldValue('name', 'updated')

    expect(defaultListener).toHaveBeenCalledOnce()
    expect(updatedListener).toHaveBeenCalledOnce()
    expect(defaultListener).toHaveBeenCalledBefore(updatedListener)
    expect(incomingListener).not.toHaveBeenCalled()
  })

  it('preserves reset defaults until the incoming defaults change', () => {
    const form = new InternalFormApi({ defaultValues: { name: '' } })

    form._update({ defaultValues: { name: 'async' } })

    expect(form.state.values).toEqual({ name: 'async' })
    expect(form.defaultValues).toEqual({ name: 'async' })
    expect(form.state.isDefaultValue).toBe(true)

    form.reset({ name: 'reset default' })

    expect(form.state.values).toEqual({ name: 'reset default' })
    expect(form.defaultValues).toEqual({ name: 'reset default' })
    expect(form.state.isDefaultValue).toBe(true)

    form._update({ defaultValues: { name: 'async' } })

    expect(form.state.values).toEqual({ name: 'reset default' })
    expect(form.defaultValues).toEqual({ name: 'reset default' })
    expect(form.state.isDefaultValue).toBe(true)

    form._update({ defaultValues: { name: 'new async' } })

    expect(form.state.values).toEqual({ name: 'new async' })
    expect(form.defaultValues).toEqual({ name: 'new async' })
    expect(form.state.isDefaultValue).toBe(true)
  })
})

describe('InternalFormApi - _getOrCreateFieldApi', () => {
  it('attaches nested field listeners only to the requested field', () => {
    const listener = vi.fn()
    const form = new InternalFormApi({
      defaultValues: { foo: { bar: '' } },
    })
    const field = form._getOrCreateFieldApi({
      name: 'foo.bar',
      listeners: [{ run: listener, triggers: ['change'] }],
    })
    const parent = form._getOrCreateFieldApi({ name: 'foo' })

    parent.handleChange({ bar: 'parent edit' })

    expect(listener).not.toHaveBeenCalled()

    field.handleChange('field edit')

    expect(listener).toHaveBeenCalledOnce()
    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({ fieldApi: field, value: 'field edit' }),
    )
  })
})

describe('InternalFormApi - _getIsDefaultValue', () => {
  it('reports restored values as default while the form remains dirty', () => {
    const form = new InternalFormApi({ defaultValues: { name: '' } })

    expect(form.state.isDefaultValue).toBe(true)

    form.setFieldValue('name', 'Alice')

    expect(form.state).toMatchObject({
      values: { name: 'Alice' },
      isDefaultValue: false,
    })

    form.setFieldValue('name', '')

    expect(form.state).toMatchObject({
      values: { name: '' },
      isDefaultValue: true,
      isDirty: true,
      isPristine: false,
    })
  })

  it('reports deeply equal objects and arrays as default values', () => {
    const form = new InternalFormApi({
      defaultValues: { profile: { name: 'Tony', tags: ['skater'] } },
    })

    expect(form.state.isDefaultValue).toBe(true)

    form.setFieldValue('profile', { name: 'Tony', tags: ['skater'] })

    expect(form.state.isDefaultValue).toBe(true)

    form.setFieldValue('profile.tags', ['skater', 'legend'])

    expect(form.state.isDefaultValue).toBe(false)

    form.setFieldValue('profile.tags', ['skater'])

    expect(form.state.isDefaultValue).toBe(true)
  })
})

describe('InternalFormApi - getFieldValue', () => {
  it('reads values through top-level, nested object, and array paths', () => {
    const form = new InternalFormApi({
      defaultValues: {
        name: 'Alice',
        address: { city: 'London' },
        items: ['a', 'b', 'c'],
      },
    })

    const name = form.getFieldValue('name')
    const city = form.getFieldValue('address.city')
    const item = form.getFieldValue('items[1]')

    expect(name).toBe('Alice')
    expect(city).toBe('London')
    expect(item).toBe('b')
  })

  it('returns undefined for missing paths and paths through null', () => {
    const form = new InternalFormApi({ defaultValues: { user: null } })

    const missing = form.getFieldValue('missing')
    const name = form.getFieldValue('user.name')

    expect(missing).toBeUndefined()
    expect(name).toBeUndefined()
  })
})

describe('InternalFormApi - setFieldValue', () => {
  it('notifies change listeners with the updated values and triggering field', () => {
    const listener = vi.fn()
    const form = new InternalFormApi({
      defaultValues: { name: '' },
      listeners: [{ triggers: ['change'], run: listener }],
    })

    form.setFieldValue('name', 'Alice')

    expect(listener).toHaveBeenCalledOnce()
    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({
        formApi: form,
        triggerFieldApi: expect.objectContaining({ name: 'name' }),
        value: { name: 'Alice' },
      }),
    )
  })

  it('updates a nested value without changing unrelated values or defaults', () => {
    const form = new InternalFormApi({
      defaultValues: {
        name: 'Alice',
        address: { city: 'London', country: 'UK' },
      },
    })

    form.setFieldValue('address.city', 'Manchester')

    const city = form.getFieldValue('address.city')
    expect(city).toBe('Manchester')
    expect(form.state.values).toEqual({
      name: 'Alice',
      address: { city: 'Manchester', country: 'UK' },
    })
    expect(form.defaultValues).toEqual({
      name: 'Alice',
      address: { city: 'London', country: 'UK' },
    })
  })

  it('updates a nested array value without changing other items or defaults', () => {
    const form = new InternalFormApi({
      defaultValues: { items: [{ label: 'a' }, { label: 'b' }] },
    })
    const field = form._getOrCreateFieldApi({ name: 'items' })

    form.setFieldValue('items[0].label', 'updated')

    const label = form.getFieldValue('items[0].label')
    expect(label).toBe('updated')
    expect(field.value).toEqual([{ label: 'updated' }, { label: 'b' }])
    expect(form.defaultValues).toEqual({
      items: [{ label: 'a' }, { label: 'b' }],
    })
  })

  it('marks the field and form touched and dirty when a value changes', () => {
    const form = new InternalFormApi({ defaultValues: { name: '' } })
    const field = form._getOrCreateFieldApi({ name: 'name' })

    form.setFieldValue('name', 'Alice')

    expect(field.value).toBe('Alice')
    expect(field.meta).toMatchObject({
      isTouched: true,
      isDirty: true,
      isPristine: false,
    })
    expect(form.state).toMatchObject({
      values: { name: 'Alice' },
      isTouched: true,
      isDirty: true,
      isPristine: false,
    })
  })

  it('keeps the field and form untouched when markAsTouched is false', () => {
    const form = new InternalFormApi({ defaultValues: { name: '' } })
    const field = form._getOrCreateFieldApi({ name: 'name' })

    form.setFieldValue('name', 'Alice', { markAsTouched: false })

    expect(field.value).toBe('Alice')
    expect(field.meta).toMatchObject({
      isTouched: false,
      isDirty: true,
      isPristine: false,
    })
    expect(form.state).toMatchObject({
      values: { name: 'Alice' },
      isTouched: false,
      isDirty: true,
      isPristine: false,
    })
  })

  it('keeps the field and form pristine when markAsDirty is false', () => {
    const form = new InternalFormApi({ defaultValues: { name: '' } })
    const field = form._getOrCreateFieldApi({ name: 'name' })

    form.setFieldValue('name', 'Alice', { markAsDirty: false })

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

  it('reveals field errors when markAsBlurred is true on a value update', async () => {
    const form = new InternalFormApi({
      defaultValues: { name: 'Alice' },
      errorVisibility: ({ fieldState }) => fieldState.meta.isBlurred,
    })
    const field = form._getOrCreateFieldApi({
      name: 'name',
      validators: [
        {
          triggers: ['change'],
          run: ({ value }: { value: string }) =>
            value.length < 3
              ? 'Name must have at least 3 characters'
              : undefined,
        },
      ],
    })
    field._register()

    form.setFieldValue('name', 'A')

    await expect
      .poll(() => field.meta.original.errors)
      .toEqual([{ message: 'Name must have at least 3 characters' }])
    expect(field.meta.isBlurred).toBe(false)
    expect(field.errors).toEqual([])

    form.setFieldValue('name', 'Al', { markAsBlurred: true })

    expect(field.value).toBe('Al')
    expect(field.meta.isBlurred).toBe(true)
    await expect
      .poll(() => field.errors)
      .toEqual([{ message: 'Name must have at least 3 characters' }])
  })

  it('preserves existing touched, dirty, and blurred state when metadata flags are false', () => {
    const form = new InternalFormApi({ defaultValues: { name: '' } })
    const field = form._getOrCreateFieldApi({ name: 'name' })
    field.handleChange('Alice')
    field.handleBlur()

    expect(field.meta).toMatchObject({
      isTouched: true,
      isDirty: true,
      isPristine: false,
      isBlurred: true,
    })
    expect(form.state).toMatchObject({
      isTouched: true,
      isDirty: true,
      isPristine: false,
    })

    form.setFieldValue('name', 'Bob', {
      markAsTouched: false,
      markAsDirty: false,
      markAsBlurred: false,
    })

    expect(field.value).toBe('Bob')
    expect(field.meta).toMatchObject({
      isTouched: true,
      isDirty: true,
      isPristine: false,
      isBlurred: true,
    })
    expect(form.state).toMatchObject({
      values: { name: 'Bob' },
      isTouched: true,
      isDirty: true,
      isPristine: false,
    })
  })

  it('continues field and form validation when all metadata flags are false', async () => {
    const form = new InternalFormApi({
      defaultValues: { name: 'Alice' },
      validators: [
        {
          triggers: ['change'],
          run: ({ value }) =>
            value.name.length < 3 ? 'Form name is too short' : undefined,
        },
      ],
    })
    const field = form._getOrCreateFieldApi({
      name: 'name',
      validators: [
        {
          triggers: ['change'],
          run: ({ value }: { value: string }) =>
            value.length < 3 ? 'Field name is too short' : undefined,
        },
      ],
    })
    field._register()

    form.setFieldValue('name', 'Al', {
      markAsTouched: false,
      markAsDirty: false,
      markAsBlurred: false,
    })

    await expect
      .poll(() => field.errors)
      .toEqual([{ message: 'Field name is too short' }])
    await expect
      .poll(() => form.state.errors)
      .toEqual([{ message: 'Form name is too short' }])
    expect(field.value).toBe('Al')
    expect(field.meta).toMatchObject({
      isTouched: false,
      isDirty: false,
      isPristine: true,
      isBlurred: false,
      isValid: false,
    })
    expect(form.state).toMatchObject({
      values: { name: 'Al' },
      isTouched: false,
      isDirty: false,
      isPristine: true,
      isValid: false,
    })

    form.setFieldValue('name', 'Alice', {
      markAsTouched: false,
      markAsDirty: false,
      markAsBlurred: false,
    })

    await expect.poll(() => field.errors).toEqual([])
    await expect.poll(() => form.state.errors).toEqual([])
    expect(field.value).toBe('Alice')
    expect(field.meta).toMatchObject({
      isTouched: false,
      isDirty: false,
      isPristine: true,
      isBlurred: false,
      isValid: true,
    })
    expect(form.state).toMatchObject({
      values: { name: 'Alice' },
      isTouched: false,
      isDirty: false,
      isPristine: true,
      isValid: true,
    })
  })

  // TODO: Form validation is skipped when disabled metadata updates prevent field creation.
  it.fails(
    'validates form changes before field creation when all metadata flags are false',
    async () => {
      const form = new InternalFormApi({
        defaultValues: { name: 'Alice' },
        validators: [
          {
            triggers: ['change'],
            run: ({ value }) =>
              value.name.length < 3 ? 'Name is too short' : undefined,
          },
        ],
      })

      form.setFieldValue('name', 'Al', {
        markAsTouched: false,
        markAsDirty: false,
        markAsBlurred: false,
      })

      await expect
        .poll(() => form.state.errors)
        .toEqual([{ message: 'Name is too short' }])
    },
  )

  it('applies updater functions to the current field value', () => {
    const form = new InternalFormApi({ defaultValues: { count: 1 } })

    form.setFieldValue('count', (count: number) => count + 1)

    const firstUpdate = form.getFieldValue('count')
    expect(firstUpdate).toBe(2)

    form.setFieldValue('count', (count: number) => count + 1)

    const secondUpdate = form.getFieldValue('count')
    expect(secondUpdate).toBe(3)
  })

  it('replaces array values directly and through an updater', () => {
    const form = new InternalFormApi({ defaultValues: { items: ['a'] } })
    const field = form._getOrCreateFieldApi({ name: 'items' })

    form.setFieldValue('items', ['b'])

    const replacement = form.getFieldValue('items')
    expect(replacement).toEqual(['b'])
    expect(field.value).toEqual(['b'])

    form.setFieldValue('items', (items: Array<string>) =>
      items.map((item) => item.toUpperCase()),
    )

    const updated = form.getFieldValue('items')
    expect(updated).toEqual(['B'])
    expect(field.value).toEqual(['B'])
    expect(form.defaultValues).toEqual({ items: ['a'] })
  })
})

describe('InternalFormApi - reset', () => {
  it('discards old watched fields and allows rebuilt fields to establish new listeners', () => {
    const discardedListener = vi.fn()
    const currentListener = vi.fn()
    const form = new InternalFormApi({
      defaultValues: { source: 'source', target: 'target' },
    })
    const oldTarget = form._getOrCreateFieldApi({
      name: 'target',
      listeners: [
        {
          triggers: ['change'],
          watchFields: ['source'],
          run: discardedListener,
        },
      ],
    })
    const oldSource = form._getOrCreateFieldApi({ name: 'source' })
    oldSource._register()
    oldTarget._register()

    oldSource.handleChange('before reset')
    expect(discardedListener).toHaveBeenCalledWith(
      expect.objectContaining({ value: 'target' }),
    )
    discardedListener.mockClear()

    form.reset()

    const target = form._getOrCreateFieldApi({
      name: 'target',
      listeners: [
        { triggers: ['change'], watchFields: ['source'], run: currentListener },
      ],
    })
    const source = form._getOrCreateFieldApi({ name: 'source' })
    source._register()
    target._register()

    oldSource.handleChange('discarded source')
    oldTarget.handleChange('discarded target')

    expect(discardedListener).not.toHaveBeenCalled()
    expect(currentListener).not.toHaveBeenCalled()
    expect(form.state.values).toEqual({ source: 'source', target: 'target' })

    source.handleChange('after reset')

    expect(currentListener).toHaveBeenCalledOnce()
    expect(currentListener).toHaveBeenCalledWith(
      expect.objectContaining({
        value: 'target',
        fieldApi: target,
        formApi: form,
      }),
    )
    expect(discardedListener).not.toHaveBeenCalled()
    expect(form.state.values).toEqual({
      source: 'after reset',
      target: 'target',
    })
  })

  it('notifies form reset listeners after restoring the default values', () => {
    const listener = vi.fn()
    const form = new InternalFormApi({
      defaultValues: { name: '' },
      listeners: [{ triggers: ['reset'], run: listener }],
    })
    const field = form._getOrCreateFieldApi({ name: 'name' })
    field.handleChange('Alice')

    form.reset()

    expect(listener).toHaveBeenCalledOnce()
    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({
        formApi: form,
        triggerFieldApi: undefined,
        value: { name: '' },
      }),
    )
  })

  it('aborts active validation on reset and allows validation to run again', async ({
    onTestFinished,
  }) => {
    const request = promiseWithResolvers<string>()
    onTestFinished(() => request.resolve('Late error'))
    const onAbort = vi.fn()
    const validator = vi.fn(() => request.promise)
    const options = formOptions({
      defaultValues: { name: '' },
      validators: [
        {
          triggers: ['change'],
          run: ({ signal }) => {
            signal.addEventListener('abort', onAbort, { once: true })
            return validator()
          },
        },
      ],
    })
    const form = new InternalFormApi(options)

    const validation = form.validate('change')
    expect(validator).toHaveBeenCalledOnce()
    expect(form.state.isValidating).toBe(true)

    form.reset()

    expect(onAbort).toHaveBeenCalledOnce()
    await expect(validation).resolves.toEqual([])
    request.resolve('Late error')
    await request.promise

    expect(form.state.errors).toEqual([])
    expect(form.state.isValidating).toBe(false)

    validator.mockResolvedValue('Current error')
    await form.validate('change')

    expect(form.state.errors).toEqual([{ message: 'Current error' }])
  })

  it('ignores the result of a submission that finishes after reset', async ({
    onTestFinished,
  }) => {
    const { promise: request, resolve: finishRequest } = promiseWithResolvers()
    onTestFinished(() => finishRequest())
    const options = formOptions({
      defaultValues: { name: '' },
      onSubmit: async ({ createValidationError }) => {
        await request
        return createValidationError('Late submit error')
      },
    })
    const onSubmit = vi.spyOn(options, 'onSubmit')
    const form = new InternalFormApi(options)

    const submission = form.handleSubmit()
    await vi.waitFor(() => {
      expect(onSubmit).toHaveBeenCalled()
    })
    expect(form.state.isSubmitting).toBe(true)

    form.reset({ name: 'reset value' }, { updateDefaultValues: false })
    expect(form.state.isSubmitting).toBe(false)

    finishRequest()

    await expect(submission).resolves.toEqual([])
    expect(form.state).toMatchObject({
      values: { name: 'reset value' },
      errors: [],
      isSubmitting: false,
      isSubmitSuccessful: false,
      submissionAttempts: 0,
    })
  })

  it('restores values and clears field, validation, and submission state', async () => {
    const form = new InternalFormApi({
      defaultValues: { name: '' },
      validators: [{ run: () => 'Validation error', triggers: ['change'] }],
    })
    const field = form._getOrCreateFieldApi({ name: 'name' })
    field._register()
    field.handleChange('dirty')
    await form.validate('change')
    await form.handleSubmit()

    expect(form.state).toMatchObject({
      values: { name: 'dirty' },
      isDefaultValue: false,
      isDirty: true,
      isTouched: true,
      errors: [{ message: 'Validation error' }],
      submissionAttempts: 1,
    })

    form.reset()

    expect(form.state).toMatchObject({
      values: { name: '' },
      isDefaultValue: true,
      isDirty: false,
      isTouched: false,
      errors: [],
      submissionAttempts: 0,
      canSubmit: true,
    })
    expect(form.getFieldMeta('name')).toBeUndefined()
  })

  it('cancels pending form validation without applying late errors', async () => {
    vi.useFakeTimers()
    const validator = vi.fn(() => 'Late error')
    const form = new InternalFormApi({
      defaultValues: { name: '' },
      validators: [
        {
          triggers: ['change'],
          triggerDebounceMs: 100,
          run: validator,
        },
      ],
    })

    const validation = form.validate('change')
    expect(form.state.isValidating).toBe(true)

    form.reset()
    await vi.advanceTimersByTimeAsync(100)

    await expect(validation).resolves.toEqual([])
    expect(validator).not.toHaveBeenCalled()
    expect(form.state.errors).toEqual([])
    expect(form.state.isValidating).toBe(false)
  })

  it('cancels pending field listener callbacks', async () => {
    vi.useFakeTimers()
    const listener = vi.fn()
    const form = new InternalFormApi({ defaultValues: { name: '' } })
    const field = form._getOrCreateFieldApi({
      name: 'name',
      listeners: [
        {
          triggers: ['change'],
          triggerDebounceMs: 100,
          run: listener,
        },
      ],
    })
    field._register()

    field.handleChange('first edit')
    await vi.advanceTimersByTimeAsync(100)
    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({ value: 'first edit' }),
    )
    listener.mockClear()

    field.handleChange('pending edit')
    form.reset()
    await vi.advanceTimersByTimeAsync(100)

    expect(listener).not.toHaveBeenCalled()
    expect(form.state.values).toEqual({ name: '' })
  })
})

describe('InternalFormApi - resetField', () => {
  it('restores the field default and clears touched state and validation errors', async () => {
    const form = new InternalFormApi({ defaultValues: { name: 'hi' } })
    const field = form._getOrCreateFieldApi({
      name: 'name',
      validators: [{ run: () => 'Reset me', triggers: [] }],
    })
    field._register()

    field.handleChange('bye')
    await form.handleSubmit()

    expect(field.value).toBe('bye')
    expect(field.meta.isTouched).toBe(true)
    expect(field.errors).toEqual([{ message: 'Reset me' }])
    expect(form.state.isDefaultValue).toBe(false)
    expect(form.state.isValid).toBe(false)

    form.resetField('name')

    expect(field.value).toBe('hi')
    expect(field.meta.isTouched).toBe(false)
    expect(field.errors).toEqual([])
    expect(form.state.isTouched).toBe(false)
    expect(form.state.isDefaultValue).toBe(true)
    expect(form.state.isValid).toBe(true)
  })

  it('resets descendant values and touched state while keeping fields usable', () => {
    const form = new InternalFormApi({
      defaultValues: { person: { name: 'Alice' } },
    })
    const parent = form._getOrCreateFieldApi({ name: 'person' })
    const child = form._getOrCreateFieldApi({ name: 'person.name' })
    parent._register()
    child._register()

    child.handleChange('Bob')
    child.handleBlur()

    expect(parent.meta.isTouched).toBe(true)
    expect(child.meta.isTouched).toBe(true)

    form.resetField('person')

    expect(parent.value).toEqual({ name: 'Alice' })
    expect(child.value).toBe('Alice')
    expect(parent.meta.isTouched).toBe(false)
    expect(child.meta.isTouched).toBe(false)
    expect(form.state.isTouched).toBe(false)

    child.handleChange('Carol')

    expect(form.state.values).toEqual({ person: { name: 'Carol' } })
    expect(form.state.isTouched).toBe(true)
  })
})

describe('InternalFormApi - deleteField', () => {
  it('clears routed errors from a deleted subtree while preserving errors on other fields', async () => {
    const form = new InternalFormApi({
      defaultValues: { user: { name: '' }, email: '' },
      validators: [
        {
          triggers: [],
          run: ({ createErrorMap }) =>
            createErrorMap({
              fields: {
                'user.name': 'Name is required',
                email: 'Email is required',
              },
            }),
        },
      ],
    })
    const parent = form._getOrCreateFieldApi({ name: 'user' })
    const name = form._getOrCreateFieldApi({ name: 'user.name' })
    const email = form._getOrCreateFieldApi({ name: 'email' })
    parent._register()
    name._register()
    email._register()

    await form.handleSubmit()
    expect(name.errors).toEqual([{ message: 'Name is required' }])
    expect(email.errors).toEqual([{ message: 'Email is required' }])
    expect(form.state.canSubmit).toBe(false)

    form.deleteField('user')

    expect(form.getFieldMeta('user.name')).toBeUndefined()
    expect(email.errors).toEqual([{ message: 'Email is required' }])
    expect(form.state.isValid).toBe(false)
    expect(form.state.canSubmit).toBe(false)

    form.deleteField('email')

    expect(form.state.isValid).toBe(true)
    expect(form.state.canSubmit).toBe(true)
  })

  it('clears errors returned by onSubmit when their field is deleted', async () => {
    const form = new InternalFormApi({
      defaultValues: { name: '' },
      onSubmit: ({ createErrorMap }) =>
        createErrorMap({ fields: { name: 'Name is required' } }),
    })
    const field = form._getOrCreateFieldApi({ name: 'name' })
    field._register()

    await form.handleSubmit()
    expect(field.errors).toEqual([{ message: 'Name is required' }])
    expect(form.state.isValid).toBe(false)
    expect(form.state.canSubmit).toBe(false)

    form.deleteField('name')

    expect(form.getFieldMeta('name')).toBeUndefined()
    expect(form.state.isValid).toBe(true)
    expect(form.state.canSubmit).toBe(true)
  })

  it('removes field metadata and prevents further updates through the deleted field', () => {
    const listener = vi.fn()
    const form = new InternalFormApi({ defaultValues: { name: '' } })
    const field = form._getOrCreateFieldApi({
      name: 'name',
      listeners: [{ run: listener, triggers: ['change'] }],
    })
    field._register()
    field.handleChange('Alice')

    expect(form.getFieldMeta('name')).toMatchObject({ isTouched: true })
    expect(form.state.isTouched).toBe(true)
    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({ value: 'Alice' }),
    )
    listener.mockClear()

    form.deleteField('name')
    field.handleChange('Bob')

    expect(listener).not.toHaveBeenCalled()
    expect(form.getFieldMeta('name')).toBeUndefined()
    expect(form.state.values).toEqual({ name: 'Alice' })
    expect(form.state.isTouched).toBe(false)
  })

  it('leaves other values and touched state intact when the field does not exist', () => {
    const form = new InternalFormApi({
      defaultValues: { name: '', email: '' },
    })
    const emailField = form._getOrCreateFieldApi({ name: 'email' })
    emailField.handleChange('alice@example.com')
    expect(form.getFieldMeta('name')).toBeUndefined()

    form.deleteField('name')

    expect(form.state.values).toEqual({ name: '', email: 'alice@example.com' })
    expect(emailField.meta.isTouched).toBe(true)
    expect(form.state.isTouched).toBe(true)
  })

  it('removes descendant metadata and prevents updates through deleted fields', () => {
    const listener = vi.fn()
    const form = new InternalFormApi({
      defaultValues: { person: { name: 'Alice' } },
    })
    const parent = form._getOrCreateFieldApi({ name: 'person' })
    const child = form._getOrCreateFieldApi({
      name: 'person.name',
      listeners: [{ run: listener, triggers: ['change'] }],
    })
    parent._register()
    child._register()
    child.handleChange('Bob')

    expect(parent.meta.isTouched).toBe(true)
    expect(child.meta.isTouched).toBe(true)
    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({ value: 'Bob' }),
    )
    listener.mockClear()

    form.deleteField('person')
    child.handleChange('Carol')
    parent.handleChange({ name: 'Dana' })

    expect(listener).not.toHaveBeenCalled()
    expect(form.getFieldMeta('person')).toBeUndefined()
    expect(form.getFieldMeta('person.name')).toBeUndefined()
    expect(form.state.values).toEqual({ person: { name: 'Bob' } })
    expect(form.state.isTouched).toBe(false)
  })
})

describe('InternalFormApi - _notifyFormListener', () => {
  it('notifies the matching form listeners as a field changes and blurs', () => {
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
    expect(changeListener).toHaveBeenCalledWith(
      expect.objectContaining({
        formApi: form,
        triggerFieldApi: field,
        value: { name: 'Alice' },
      }),
    )
    expect(blurListener).not.toHaveBeenCalled()
    changeListener.mockClear()

    field.handleBlur()

    expect(blurListener).toHaveBeenCalledOnce()
    expect(blurListener).toHaveBeenCalledWith(
      expect.objectContaining({
        formApi: form,
        triggerFieldApi: field,
        value: { name: 'Alice' },
      }),
    )
    expect(changeListener).not.toHaveBeenCalled()
  })
})

describe('InternalFormApi - handleSubmit', () => {
  it('notifies submit listeners when submission starts without a triggering field', async () => {
    const listener = vi.fn()
    const form = new InternalFormApi({
      defaultValues: { name: '' },
      listeners: [{ triggers: ['submit'], run: listener }],
    })

    const submission = form.handleSubmit()

    expect(listener).toHaveBeenCalledOnce()
    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({
        formApi: form,
        triggerFieldApi: undefined,
        value: { name: '' },
      }),
    )
    await expect(submission).resolves.toEqual([])
  })
})

describe('InternalFormApi - _clearEventErrors', () => {
  it('clears submit errors when change validation is disabled by its predicate', async () => {
    const validator = vi.fn(() => 'Submit validator failed')
    const form = new InternalFormApi({
      defaultValues: { name: '' },
      validators: [
        {
          run: validator,
          triggers: [{ trigger: 'change', when: false }],
        },
      ],
    })
    const field = form._getOrCreateFieldApi({ name: 'name' })

    await form.handleSubmit()
    expect(form.state.errors).toEqual([{ message: 'Submit validator failed' }])
    validator.mockClear()

    field.handleChange('Alice')
    await expect.poll(() => form.state.isValidating).toBe(false)

    expect(form.state.errors).toEqual([])
    expect(validator).not.toHaveBeenCalled()
  })

  it('clears onSubmit field errors only for the field that changes', async () => {
    const form = new InternalFormApi({
      defaultValues: { name: '', email: '' },
      onSubmit: ({ createErrorMap }) =>
        createErrorMap({
          fields: {
            name: 'Name is required',
            email: 'Email is required',
          },
        }),
    })
    const nameField = form._getOrCreateFieldApi({ name: 'name' })
    const emailField = form._getOrCreateFieldApi({ name: 'email' })
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

  // TODO: Clearing onSubmit errors on blur is debated and may change.
  it('clears onSubmit field errors only for the field that blurs', async () => {
    const form = new InternalFormApi({
      defaultValues: { name: '', email: '' },
      onSubmit: ({ createErrorMap }) =>
        createErrorMap({
          fields: {
            name: 'Name is required',
            email: 'Email is required',
          },
        }),
    })
    const nameField = form._getOrCreateFieldApi({ name: 'name' })
    const emailField = form._getOrCreateFieldApi({ name: 'email' })
    nameField._register()
    emailField._register()

    await form.handleSubmit()
    expect(nameField.errors).toEqual([{ message: 'Name is required' }])
    expect(emailField.errors).toEqual([{ message: 'Email is required' }])

    nameField.handleBlur()
    await expect.poll(() => form.state.isValidating).toBe(false)

    expect(nameField.errors).toEqual([])
    expect(emailField.errors).toEqual([{ message: 'Email is required' }])
    expect(form.state.isValid).toBe(false)
  })

  it('clears form-level onSubmit errors when a field changes', async () => {
    const form = new InternalFormApi({
      defaultValues: { name: '', email: '' },
      onSubmit: ({ createValidationError }) =>
        createValidationError('Submission failed'),
    })
    const field = form._getOrCreateFieldApi({ name: 'name' })

    await form.handleSubmit()
    expect(form.state.errors).toEqual([{ message: 'Submission failed' }])
    expect(form.state.canSubmit).toBe(false)

    field.handleChange('Alice')

    expect(form.state.errors).toEqual([])
    expect(form.state.canSubmit).toBe(true)
  })

  // TODO clearing onSubmit errors on blur is debated and may change.
  it('clears form-level onSubmit errors when a field blurs', async () => {
    const form = new InternalFormApi({
      defaultValues: { name: '', email: '' },
      onSubmit: ({ createValidationError }) =>
        createValidationError('Submission failed'),
    })
    const field = form._getOrCreateFieldApi({ name: 'name' })

    await form.handleSubmit()
    expect(form.state.errors).toEqual([{ message: 'Submission failed' }])

    field.handleBlur()

    expect(form.state.errors).toEqual([])
  })

  it('clears submit-only validator errors when a field changes', async () => {
    const form = new InternalFormApi({
      defaultValues: { name: '', email: '' },
      validators: [{ run: () => 'Submit-only validator failed', triggers: [] }],
    })
    const field = form._getOrCreateFieldApi({ name: 'name' })

    await form.handleSubmit()
    expect(form.state.errors).toEqual([
      { message: 'Submit-only validator failed' },
    ])

    field.handleChange('Alice')

    expect(form.state.errors).toEqual([])
  })

  it('clears submit validator errors when the validator only listens for blur', async () => {
    const form = new InternalFormApi({
      defaultValues: { name: '', email: '' },
      validators: [
        { run: () => 'Submit or blur validator failed', triggers: ['blur'] },
      ],
    })
    const field = form._getOrCreateFieldApi({ name: 'name' })

    await form.handleSubmit()
    expect(form.state.errors).toEqual([
      { message: 'Submit or blur validator failed' },
    ])

    field.handleChange('Alice')

    expect(form.state.errors).toEqual([])
  })

  it('preserves errors produced by blur validation when a field changes', async () => {
    const form = new InternalFormApi({
      defaultValues: { name: '', email: '' },
      validators: [{ run: () => 'Blur validator failed', triggers: ['blur'] }],
    })
    const field = form._getOrCreateFieldApi({ name: 'name' })

    await form.validate('blur')
    expect(form.state.errors).toEqual([{ message: 'Blur validator failed' }])

    field.handleChange('Alice')

    expect(form.state.errors).toEqual([{ message: 'Blur validator failed' }])
  })

  it('replaces submit errors with the result of change validation', async () => {
    const options = formOptions({
      defaultValues: { name: '', email: '' },
      validators: [
        {
          run: ({ event }) =>
            event === 'submit'
              ? 'Submit validator failed'
              : 'Change validator failed',
          triggers: ['change'],
        },
      ],
    })
    const form = new InternalFormApi(options)
    const field = form._getOrCreateFieldApi({ name: 'name' })

    await form.handleSubmit()
    expect(form.state.errors).toEqual([{ message: 'Submit validator failed' }])

    field.handleChange('Alice')

    await expect
      .poll(() => form.state.errors)
      .toEqual([{ message: 'Change validator failed' }])
  })
})
