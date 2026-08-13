import { describe, expect, it, vi } from 'vitest'
import { InternalFormApi } from '../../src/FormApi/FormApi.lib'

describe('field - mount validators', () => {
  it('runs synchronous mount validators on first registration', () => {
    const validator = vi.fn(() => 'Field is invalid')
    const form = new InternalFormApi({
      defaultValues: { name: '' },
    })
    const field = form._getOrCreateFieldApi({
      name: 'name',
      validators: [
        {
          run: validator,
          runOnMount: true,
          triggers: [],
        },
      ],
    })

    const unregister = field._register()

    expect(validator).toHaveBeenCalledWith(
      expect.objectContaining({
        event: 'mount',
        fieldApi: field,
        formApi: form,
        value: '',
      }),
    )
    expect(field.errors).toEqual([{ message: 'Field is invalid' }])

    unregister()
  })

  it('skips field mount validation when no validator opts in', () => {
    const validator = vi.fn(() => 'Should not run')
    const form = new InternalFormApi({
      defaultValues: { name: '' },
    })
    const field = form._getOrCreateFieldApi({
      name: 'name',
      validators: [
        {
          run: validator,
          triggers: [],
        },
      ],
    })

    const unregister = field._register()

    expect(validator).not.toHaveBeenCalled()
    expect(field.meta.isValidating).toBe(false)

    unregister()
  })

  it('tracks async mount validation on the field', async () => {
    let resolve!: (value: string) => void
    const result = new Promise<string>((res) => {
      resolve = res
    })
    const form = new InternalFormApi({
      defaultValues: { name: '' },
    })
    const field = form._getOrCreateFieldApi({
      name: 'name',
      validators: [
        {
          run: () => result,
          runOnMount: true,
          triggers: [],
        },
      ],
    })

    const unregister = field._register()
    expect(field.meta.isValidating).toBe(true)

    resolve('Async field error')
    await vi.waitFor(() => expect(field.meta.isValidating).toBe(false))

    expect(field.errors).toEqual([{ message: 'Async field error' }])

    unregister()
  })
})

describe('field - linked validators', () => {
  it('runs a watched validator when its watched source field changes', async () => {
    vi.useFakeTimers()
    const validator = vi.fn()

    const form = new InternalFormApi({
      defaultValues: { source: '', target: 'target' },
    })
    const targetField = form._getOrCreateFieldApi({
      name: 'target',
      validators: [
        {
          triggers: ['change'],
          watchFields: ['source'],
          run: validator,
        },
      ],
    })
    const sourceField = form._getOrCreateFieldApi({ name: 'source' })

    sourceField.handleChange('source')

    await vi.runOnlyPendingTimersAsync()

    expect(validator).toHaveBeenCalledOnce()
    expect(validator).toHaveBeenCalledWith(
      expect.objectContaining({
        value: 'target',
        fieldApi: targetField,
        formApi: form,
      }),
    )
  })

  it('does not run unrelated watched validators', async () => {
    vi.useFakeTimers()
    const watchedValidator = vi.fn()
    const unrelatedValidator = vi.fn()

    const form = new InternalFormApi({
      defaultValues: { source: '', other: '', target: '' },
    })
    form._getOrCreateFieldApi({
      name: 'target',
      validators: [
        {
          triggers: ['change'],
          watchFields: ['source'],
          run: watchedValidator,
        },
        {
          triggers: ['change'],
          watchFields: ['other'],
          run: unrelatedValidator,
        },
      ],
    })
    const sourceField = form._getOrCreateFieldApi({ name: 'source' })

    sourceField.handleChange('source')
    await vi.runOnlyPendingTimersAsync()

    expect(watchedValidator).toHaveBeenCalledOnce()
    expect(unrelatedValidator).not.toHaveBeenCalled()
  })

  it("does not run a watched field's validator when the trigger does not match", async () => {
    vi.useFakeTimers()
    const validator = vi.fn()

    const form = new InternalFormApi({
      defaultValues: { source: '', target: '' },
    })
    form._getOrCreateFieldApi({
      name: 'target',
      validators: [
        {
          triggers: ['blur'],
          watchFields: ['source'],
          run: validator,
        },
      ],
    })
    const sourceField = form._getOrCreateFieldApi({ name: 'source' })

    sourceField.handleChange('source')
    await vi.runOnlyPendingTimersAsync()

    expect(validator).not.toHaveBeenCalled()
  })

  it('runs a linked validator when any of multiple watched fields changes', async () => {
    vi.useFakeTimers()
    const validator = vi.fn()

    const form = new InternalFormApi({
      defaultValues: { source: '', other: '', target: '' },
    })
    form._getOrCreateFieldApi({
      name: 'target',
      validators: [
        {
          triggers: ['change'],
          watchFields: ['source', 'other'],
          run: validator,
        },
      ],
    })
    const sourceField = form._getOrCreateFieldApi({ name: 'source' })
    const otherField = form._getOrCreateFieldApi({ name: 'other' })

    sourceField.handleChange('source')
    otherField.handleChange('other')
    await vi.runOnlyPendingTimersAsync()

    expect(validator).toHaveBeenCalledTimes(2)
  })

  it('updates watched fields when the watched name changes without moving a field', async () => {
    vi.useFakeTimers()
    const validator = vi.fn()

    const form = new InternalFormApi({
      defaultValues: { source: '', other: '', target: '' },
    })
    const targetField = form._getOrCreateFieldApi({
      name: 'target',
      validators: [
        {
          triggers: ['change'],
          watchFields: ['source'],
          run: validator,
        },
      ],
    })
    const sourceField = form._getOrCreateFieldApi({ name: 'source' })
    const otherField = form._getOrCreateFieldApi({ name: 'other' })

    targetField._update({
      validators: [
        {
          triggers: ['change'],
          watchFields: ['other'],
          run: validator,
        },
      ],
    })

    sourceField.handleChange('source changed')
    await vi.runOnlyPendingTimersAsync()

    expect(validator).not.toHaveBeenCalled()

    otherField.handleChange('other changed')
    await vi.runOnlyPendingTimersAsync()

    expect(validator).toHaveBeenCalledOnce()
  })

  it('updates a dynamic watched field name after its field moves', async () => {
    vi.useFakeTimers()
    const validator = vi.fn()

    const form = new InternalFormApi({
      defaultValues: { users: ['first', 'second'], target: '' },
    })
    const targetField = form._getOrCreateFieldApi({
      name: 'target',
      validators: [
        {
          triggers: ['change'],
          watchFields: ['users[0]'],
          run: validator,
        },
      ],
    })
    const fieldAt0Before = form._getOrCreateFieldApi({ name: 'users[0]' })
    const fieldAt1Before = form._getOrCreateFieldApi({ name: 'users[1]' })

    form.swapFieldValues('users', 0, 1)
    expect(form._getOrCreateFieldApi({ name: 'users[1]' })).toBe(fieldAt0Before)

    targetField._update({
      validators: [
        {
          triggers: ['change'],
          watchFields: ['users[1]'],
          run: validator,
        },
      ],
    })

    fieldAt1Before.handleChange('first index changed')
    await vi.runOnlyPendingTimersAsync()

    expect(validator).not.toHaveBeenCalled()

    fieldAt0Before.handleChange('second index changed')
    await vi.runOnlyPendingTimersAsync()

    expect(validator).toHaveBeenCalledOnce()
  })

  it('keeps validator result indices stable when running selected watched validators', async () => {
    vi.useFakeTimers()
    const otherValidator = vi.fn(() => 'other error')
    const sourceValidator = vi
      .fn()
      .mockReturnValueOnce('source error')
      .mockReturnValueOnce('updated source error')

    const form = new InternalFormApi({
      defaultValues: { source: '', other: '', target: '' },
    })
    const targetField = form._getOrCreateFieldApi({
      name: 'target',
      validators: [
        {
          triggers: ['change'],
          watchFields: ['other'],
          run: otherValidator,
        },
        {
          triggers: ['change'],
          watchFields: ['source'],
          run: sourceValidator,
        },
      ],
    })
    const unregister = targetField._register()
    const sourceField = form._getOrCreateFieldApi({ name: 'source' })
    const [otherValidatorInstance, sourceValidatorInstance] =
      targetField._validatorInstances!

    sourceField.handleChange('source')
    await vi.runOnlyPendingTimersAsync()

    expect(otherValidator).not.toHaveBeenCalled()
    expect(sourceValidator).toHaveBeenCalledOnce()
    expect(
      targetField.meta._validationSourceErrors?.get(otherValidatorInstance!),
    ).toBeUndefined()
    expect(
      targetField.meta._validationSourceErrors?.get(sourceValidatorInstance!)
        ?.errors,
    ).toEqual([{ message: 'source error' }])
    expect(targetField.errors).toEqual([{ message: 'source error' }])

    sourceField.handleChange('updated source')
    await vi.runOnlyPendingTimersAsync()

    expect(
      targetField.meta._validationSourceErrors?.get(otherValidatorInstance!),
    ).toBeUndefined()
    expect(
      targetField.meta._validationSourceErrors?.get(sourceValidatorInstance!)
        ?.errors,
    ).toEqual([{ message: 'updated source error' }])
    expect(targetField.errors).toEqual([{ message: 'updated source error' }])

    unregister()
    await vi.runOnlyPendingTimersAsync()
  })

  it('warns and stops cyclical validator watch chains', async () => {
    vi.useFakeTimers()
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const firstValidator = vi.fn()
    const secondValidator = vi.fn()

    const form = new InternalFormApi({
      defaultValues: { first: '', second: '' },
    })
    const firstField = form._getOrCreateFieldApi({
      name: 'first',
      validators: [
        {
          triggers: ['change'],
          watchFields: ['second'],
          run: firstValidator,
        },
      ],
    })
    form._getOrCreateFieldApi({
      name: 'second',
      validators: [
        {
          triggers: ['change'],
          watchFields: ['first'],
          run: secondValidator,
        },
      ],
    })

    firstField.handleChange('first')
    await vi.runOnlyPendingTimersAsync()

    expect(firstValidator).toHaveBeenCalledOnce()
    expect(secondValidator).toHaveBeenCalledOnce()
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('cyclical validator cycle detected'),
    )

    warn.mockRestore()
  })

  it('clears watched validator links when a field is killed', () => {
    const form = new InternalFormApi({
      defaultValues: { source: '', target: '' },
    })
    const targetField = form._getOrCreateFieldApi({
      name: 'target',
      validators: [
        { run: vi.fn(), watchFields: ['source'], triggers: ['change'] },
      ],
    })
    const sourceField = form._getOrCreateFieldApi({ name: 'source' })
    const validatorInstance = targetField._validatorInstances![0]!

    expect(sourceField._watchingValidatorFields?.has(targetField)).toBe(true)
    expect(validatorInstance.resolvedWatchFields?.get('source')).toBe(
      sourceField,
    )

    form.deleteField('target')

    expect(sourceField._watchingValidatorFields).toBeNull()
    expect(validatorInstance.resolvedWatchFields).toBeNull()
    expect(targetField._isKilled).toBe(true)
    expect(form._tryGetFieldApi('source')).toBeNull()
    expect(form._tryGetFieldApi('target')).toBeNull()
  })
})
