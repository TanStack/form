import { describe, expect, it, vi } from 'vitest'
import { z } from 'zod'
import { InternalFormApi } from '../../src/FormApi/FormApi.lib'
import { InternalFormGroupApi } from '../../src/FormGroupApi/FormGroupApi.lib'
import { validationSourceScopes } from '../../src/ValidationSourceInstance.lib'

describe('FormGroupApi', () => {
  it('runs synchronous mount validators and stores group errors', () => {
    const validator = vi.fn(() => 'Group is invalid')
    const form = new InternalFormApi({
      defaultValues: { guestDetails: { name: 'Tony' } },
    })
    const group = new InternalFormGroupApi({
      form,
      name: 'guestDetails',
      validators: [
        {
          run: validator,
          runOnMount: true,
          triggers: [],
        },
      ],
    })

    group.mount()

    expect(validator).toHaveBeenCalledWith(
      expect.objectContaining({
        event: 'mount',
        formApi: form,
        groupApi: group,
        value: { name: 'Tony' },
      }),
    )
    expect(group.state.errors).toEqual([{ message: 'Group is invalid' }])
    expect(group.state.isValidating).toBe(false)
  })

  it('keeps flattened group errors stable while their bucket is unchanged', async () => {
    const form = new InternalFormApi({
      defaultValues: { guestDetails: { name: '' } },
    })
    const group = new InternalFormGroupApi({
      form,
      name: 'guestDetails',
      validators: [
        {
          triggers: [],
          run: () => 'Group error',
        },
      ],
    })

    await group.validate('submit')

    const previousState = group.state
    const previousErrors = previousState.errors

    group._groupFieldVersion.set((version) => version + 1)

    expect(group.state).toBe(previousState)
    expect(group.state.errors).toBe(previousErrors)

    group._isSubmitting.set(true)

    expect(group.state).not.toBe(previousState)
    expect(group.state.errors).toBe(previousErrors)
  })

  it('tracks async group mount validation', async () => {
    let resolve!: (value: string) => void
    const result = new Promise<string>((res) => {
      resolve = res
    })
    const form = new InternalFormApi({
      defaultValues: { guestDetails: { name: 'Tony' } },
    })
    const group = new InternalFormGroupApi({
      form,
      name: 'guestDetails',
      validators: [
        {
          run: () => result,
          runOnMount: true,
          triggers: [],
        },
      ],
    })

    group.mount()
    expect(group.state.isValidating).toBe(true)
    expect(group._groupField.meta.isSelfValidating).toBe(true)
    expect(group._groupField.meta.isValidating).toBe(true)
    expect(form.state.isValidating).toBe(true)

    resolve('Async group error')
    await vi.waitFor(() => expect(group.state.isValidating).toBe(false))

    expect(group._groupField.meta.isSelfValidating).toBe(false)
    expect(group._groupField.meta.isValidating).toBe(false)
    expect(form.state.isValidating).toBe(false)
    expect(group.state.errors).toEqual([{ message: 'Async group error' }])
  })

  it('tracks overlapping group validation on the backing node and form', async () => {
    const resolvers: Array<(value: null) => void> = []
    const validator = vi.fn(
      () =>
        new Promise<null>((resolve) => {
          resolvers.push(resolve)
        }),
    )
    const form = new InternalFormApi({
      defaultValues: { guestDetails: { name: '' } },
    })
    const group = new InternalFormGroupApi({
      form,
      name: 'guestDetails',
      validators: [{ triggers: [], run: validator }],
    })

    const firstValidation = group.validate('submit')
    await vi.waitFor(() => expect(validator).toHaveBeenCalledOnce())

    const secondValidation = group.validate('submit')
    await vi.waitFor(() => expect(validator).toHaveBeenCalledTimes(2))
    await firstValidation

    expect(group._groupField._getBaseMeta()._validationCount).toBe(1)
    expect(group._groupField.meta.isSelfValidating).toBe(true)
    expect(group.state.isValidating).toBe(true)
    expect(form.state.isValidating).toBe(true)

    resolvers[1]!(null)
    await secondValidation

    expect(group._groupField._getBaseMeta()._validationCount).toBe(0)
    expect(group._groupField.meta.isSelfValidating).toBe(false)
    expect(group.state.isValidating).toBe(false)
    expect(form.state.isValidating).toBe(false)
  })

  it('does not let validation canceled by group reset clear a newer run', async () => {
    const resolvers: Array<(value: null) => void> = []
    const validator = vi.fn(
      () =>
        new Promise<null>((resolve) => {
          resolvers.push(resolve)
        }),
    )
    const form = new InternalFormApi({
      defaultValues: { guestDetails: { name: '' } },
    })
    const group = new InternalFormGroupApi({
      form,
      name: 'guestDetails',
      validators: [{ triggers: [], run: validator }],
    })

    const canceledValidation = group.validate('submit')
    await vi.waitFor(() => expect(validator).toHaveBeenCalledOnce())

    group.reset()

    expect(group.state.isValidating).toBe(false)
    expect(form.state.isValidating).toBe(false)

    const currentValidation = group.validate('submit')
    await vi.waitFor(() => expect(validator).toHaveBeenCalledTimes(2))
    await canceledValidation

    expect(group._groupField._getBaseMeta()._validationCount).toBe(1)
    expect(group.state.isValidating).toBe(true)
    expect(form.state.isValidating).toBe(true)

    resolvers[1]!(null)
    await currentValidation

    expect(group._groupField._getBaseMeta()._validationCount).toBe(0)
    expect(group.state.isValidating).toBe(false)
    expect(form.state.isValidating).toBe(false)
  })

  it('only removes group-owned validation counts when canceled', async () => {
    const resolvers: Array<(value: null) => void> = []
    const fieldValidator = vi.fn(
      () =>
        new Promise<null>((resolve) => {
          resolvers.push(resolve)
        }),
    )
    const form = new InternalFormApi({
      defaultValues: { guestDetails: { name: '' } },
    })
    const groupField = form._getOrCreateFieldApi({
      name: 'guestDetails',
      validators: [{ triggers: [], run: fieldValidator }],
    })
    const group = new InternalFormGroupApi({
      form,
      name: 'guestDetails',
      validators: [{ triggers: [], run: () => null }],
    })

    const groupValidation = group.validate('submit')
    await vi.waitFor(() => expect(fieldValidator).toHaveBeenCalledOnce())
    const independentValidation = groupField._runFieldValidation('submit')
    await vi.waitFor(() => expect(fieldValidator).toHaveBeenCalledTimes(2))

    expect(groupField._getBaseMeta()._validationCount).toBe(3)

    group.reset()

    expect(groupField._getBaseMeta()._validationCount).toBe(1)
    expect(groupField.meta.isSelfValidating).toBe(true)
    expect(groupField.meta.isValidating).toBe(true)
    expect(form.state.isValidating).toBe(true)

    resolvers[0]!(null)
    await groupValidation

    expect(groupField._getBaseMeta()._validationCount).toBe(1)
    expect(groupField.meta.isSelfValidating).toBe(true)
    expect(groupField.meta.isValidating).toBe(true)

    resolvers[1]!(null)
    await independentValidation

    expect(groupField._getBaseMeta()._validationCount).toBe(0)
    expect(groupField.meta.isValidating).toBe(false)
    expect(form.state.isValidating).toBe(false)
  })

  it('cancels group validation before replacing trie nodes on form reset', async () => {
    const resolvers: Array<(value: null) => void> = []
    const validator = vi.fn(
      () =>
        new Promise<null>((resolve) => {
          resolvers.push(resolve)
        }),
    )
    const form = new InternalFormApi({
      defaultValues: { guestDetails: { name: '' } },
    })
    const group = new InternalFormGroupApi({
      form,
      name: 'guestDetails',
      validators: [{ triggers: [], run: validator }],
    })

    const canceledValidation = group.validate('submit')
    await vi.waitFor(() => expect(validator).toHaveBeenCalledOnce())
    const previousGroupField = group._groupField

    form.reset()

    expect(group._groupField).not.toBe(previousGroupField)
    expect(group.state.isValidating).toBe(false)
    expect(form.state.isValidating).toBe(false)

    const currentValidation = group.validate('submit')
    await vi.waitFor(() => expect(validator).toHaveBeenCalledTimes(2))
    await canceledValidation

    expect(group._groupField._getBaseMeta()._validationCount).toBe(1)
    expect(group.state.isValidating).toBe(true)
    expect(form.state.isValidating).toBe(true)

    resolvers[1]!(null)
    await currentValidation

    expect(group._groupField._getBaseMeta()._validationCount).toBe(0)
    expect(group.state.isValidating).toBe(false)
    expect(form.state.isValidating).toBe(false)
  })

  it('skips group mount validation when no validator opts in', () => {
    const validator = vi.fn()
    const form = new InternalFormApi({
      defaultValues: { guestDetails: { name: 'Tony' } },
    })
    const group = new InternalFormGroupApi({
      form,
      name: 'guestDetails',
      validators: [
        {
          run: validator,
          triggers: [],
        },
      ],
    })

    group.mount()

    expect(validator).not.toHaveBeenCalled()
    expect(group.state.isValidating).toBe(false)
  })

  it('updates group options after construction', () => {
    const onSubmit = vi.fn()
    const form = new InternalFormApi({
      defaultValues: { guestDetails: { name: 'Tony' } },
    })
    const group = new InternalFormGroupApi({
      form,
      name: 'guestDetails',
    })

    group.update({
      form,
      name: 'guestDetails',
      onSubmit,
    })

    expect(group._options.onSubmit).toBe(onSubmit)
  })

  it('keeps group validator instances stable by slot across updates', () => {
    const form = new InternalFormApi({
      defaultValues: { guestDetails: { name: 'Tony' } },
    })
    const firstDefinition = { run: () => null, triggers: [] }
    const group = new InternalFormGroupApi({
      form,
      name: 'guestDetails',
      validators: [firstDefinition],
    })
    const instance = group._validatorInstances?.[0]
    const nextDefinition = { run: () => null, triggers: [] }

    group.update({
      form,
      name: 'guestDetails',
      validators: [nextDefinition],
    })

    expect(group._validatorInstances?.[0]).toBe(instance)
    expect(instance?.definition).toBe(nextDefinition)
    expect(instance?.owner).toBe(group)
    expect(instance?.scope).toBe(validationSourceScopes.group)
    expect(instance?.revision).toBe(1)
  })

  it('warns when the group validator array length changes after initialization', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const form = new InternalFormApi({
      defaultValues: { guestDetails: { name: 'Tony' } },
    })
    const group = new InternalFormGroupApi({
      form,
      name: 'guestDetails',
    })

    group.update({
      form,
      name: 'guestDetails',
      validators: [{ run: () => null, triggers: [] }],
    })

    expect(warn).toHaveBeenCalled()
    warn.mockRestore()
  })

  it('resets validator runtime during cleanup and preserves remount identity', () => {
    const form = new InternalFormApi({
      defaultValues: { guestDetails: { name: 'Tony' } },
    })
    const group = new InternalFormGroupApi({
      form,
      name: 'guestDetails',
      validators: [{ run: () => null, triggers: [] }],
    })
    const instance = group._validatorInstances?.[0]
    const abortController = new AbortController()
    instance?.setAbortController(abortController)
    instance?.setSchemaOutput({
      schemaResult: 'output',
      hasSchemaResult: true,
    })

    group._cleanup()
    group.mount()

    expect(group._validatorInstances?.[0]).toBe(instance)
    expect(abortController.signal.aborted).toBe(true)
    expect(instance?.hasSchemaOutput).toBe(false)
    expect(instance?.disposed).toBe(false)
  })

  it('stores the group on its trie node and follows that node when it moves', () => {
    const form = new InternalFormApi({
      defaultValues: {
        items: [{ name: 'first' }, { name: 'second' }],
      },
    })
    const group = new InternalFormGroupApi({
      form,
      name: 'items[1]',
    })
    const groupField = form._tryGetFieldApi('items[1]')

    expect(groupField).toBe(group._groupField)
    expect(groupField?._formGroup).toBe(group)

    form.moveFieldValue('items', 1, 0)

    expect(group._groupField).toBe(groupField)
    expect(group.name).toBe('items[0]')
    expect(group.value).toEqual({ name: 'second' })
    expect(form._tryGetFieldApi('items[0]')?._formGroup).toBe(group)
  })

  it('detaches and reattaches its trie node across cleanup and remount', () => {
    const form = new InternalFormApi({
      defaultValues: { guestDetails: { name: '' } },
    })
    const group = new InternalFormGroupApi({
      form,
      name: 'guestDetails',
    })
    const initialGroupField = group._groupField

    group._cleanup()

    expect(initialGroupField._formGroup).toBeNull()
    expect(form._tryGetFieldApi('guestDetails')).toBeNull()

    group.mount()

    expect(group._groupField).not.toBe(initialGroupField)
    expect(group._groupField._formGroup).toBe(group)
    expect(form._tryGetFieldApi('guestDetails')).toBe(group._groupField)
  })

  it('reattaches its trie node when the backing field is deleted', async () => {
    const validator = vi.fn(() => null)
    const form = new InternalFormApi({
      defaultValues: { guestDetails: { name: '' } },
    })
    const group = new InternalFormGroupApi({
      form,
      name: 'guestDetails',
      validators: [{ triggers: ['change'], run: validator }],
    })
    const initialGroupField = group._groupField

    form.deleteField('guestDetails')

    expect(initialGroupField._isKilled).toBe(true)
    expect(initialGroupField._formGroup).toBeNull()
    expect(group._groupField).not.toBe(initialGroupField)
    expect(group._groupField._isKilled).toBe(false)
    expect(group._groupField._formGroup).toBe(group)
    expect(form._tryGetFieldApi('guestDetails')).toBe(group._groupField)

    const nameField = form._getOrCreateFieldApi({
      name: 'guestDetails.name',
    })
    nameField.handleChange('Tony')

    await vi.waitFor(() => expect(validator).toHaveBeenCalledOnce())
  })

  it('drops killed routed fields while preserving live routed fields', async () => {
    const form = new InternalFormApi({
      defaultValues: { guestDetails: { name: '', email: '' } },
    })
    const nameField = form._getOrCreateFieldApi({
      name: 'guestDetails.name',
    })
    const emailField = form._getOrCreateFieldApi({
      name: 'guestDetails.email',
    })
    const group = new InternalFormGroupApi({
      form,
      name: 'guestDetails',
      validators: [
        {
          triggers: [],
          run: () => ({
            fields: {
              name: 'Name is required',
              email: 'Email is required',
            },
          }),
        },
      ],
    })

    await group.validate('submit')
    const validatorInstance = group._validatorInstances![0]!
    expect(validatorInstance.errorTargets).toEqual(
      new Set([nameField, emailField]),
    )

    form.deleteField('guestDetails.name')

    expect(nameField._isKilled).toBe(true)
    expect(validatorInstance.errorTargets).toEqual(new Set([emailField]))
  })

  it('clears backing-node validation when cleanup cancels a group run', async () => {
    const validator = vi.fn(() => new Promise<null>(() => {}))
    const form = new InternalFormApi({
      defaultValues: { guestDetails: { name: '' } },
    })
    const group = new InternalFormGroupApi({
      form,
      name: 'guestDetails',
      validators: [{ triggers: [], run: validator }],
    })
    const groupField = group._groupField
    const validation = group.validate('submit')
    await vi.waitFor(() => expect(validator).toHaveBeenCalledOnce())

    group._cleanup()
    await validation

    expect(groupField._getBaseMeta()._validationCount).toBe(0)
    expect(group.state.isValidating).toBe(false)
    expect(form.state.isValidating).toBe(false)
    expect(form._tryGetFieldApi('guestDetails')).toBeNull()
  })

  it('prefixes field options declared through a group', () => {
    const form = new InternalFormApi({
      defaultValues: { guestDetails: { name: '', age: 0 } },
    })
    const group = new InternalFormGroupApi({
      form,
      name: 'guestDetails',
    })

    const options = group._getFormFieldOptions(
      {
        name: 'name',
        validators: [
          { triggers: ['change'], watchFields: ['age'], run: (): null => null },
          { triggers: ['blur'], run: (): null => null },
        ],
        listeners: [
          {
            triggers: ['change'],
            watchFields: ['age'],
            run: (): undefined => undefined,
          },
          { triggers: ['blur'], run: (): undefined => undefined },
        ],
      },
      (props, overrides) => ({ ...props, ...overrides }),
    )

    expect(options.name).toBe('guestDetails.name')
    expect(options.validators?.[0]?.watchFields).toEqual(['guestDetails.age'])
    expect(options.validators?.[1]).not.toHaveProperty('watchFields')
    expect(options.listeners?.[0]?.watchFields).toEqual(['guestDetails.age'])
    expect(options.listeners?.[1]).not.toHaveProperty('watchFields')
  })

  it('leaves absent watched-field lists undefined when prefixing field options', () => {
    const form = new InternalFormApi({
      defaultValues: { guestDetails: { name: '' } },
    })
    const group = new InternalFormGroupApi({
      form,
      name: 'guestDetails',
    })

    const options = group._getFormFieldOptions(
      {
        name: 'name',
      },
      (props, overrides) => ({ ...props, ...overrides }),
    )

    expect(options.name).toBe('guestDetails.name')
    expect(options.validators).toBeUndefined()
    expect(options.listeners).toBeUndefined()
  })

  it('exposes subtree values and field meta', () => {
    const form = new InternalFormApi({
      defaultValues: {
        guestDetails: { name: 'Tony', email: 'tony@example.com' },
        budget: 100,
      },
    })
    const field = form._getOrCreateFieldApi({ name: 'guestDetails.name' })
    const group = new InternalFormGroupApi({
      form,
      name: 'guestDetails',
    })

    field.handleChange('Tony Hawk')

    expect(group.state.values).toEqual({
      name: 'Tony Hawk',
      email: 'tony@example.com',
    })
    expect(group.state.meta).toMatchObject({ isDirty: true })
  })

  it('derives touched and dirty state from only the group subtree', () => {
    const form = new InternalFormApi({
      defaultValues: {
        guestDetails: { name: '' },
        billingDetails: { name: '' },
      },
    })
    const guestField = form._getOrCreateFieldApi({ name: 'guestDetails.name' })
    const billingField = form._getOrCreateFieldApi({
      name: 'billingDetails.name',
    })
    const guestGroup = new InternalFormGroupApi({
      form,
      name: 'guestDetails',
    })
    const billingGroup = new InternalFormGroupApi({
      form,
      name: 'billingDetails',
    })

    guestField.handleChange('Tony')

    expect(guestGroup.state).toMatchObject({
      isTouched: true,
      isDirty: true,
      isPristine: false,
    })
    expect(billingGroup.state).toMatchObject({
      isTouched: false,
      isDirty: false,
      isPristine: true,
    })

    billingField.handleChange('Alice', { markAsDirty: false })

    expect(billingGroup.state.isTouched).toBe(true)
    expect(billingGroup.state.isDirty).toBe(false)
    expect(guestGroup.state.isDirty).toBe(true)
  })

  it('submits without calling the root form submit handler or incrementing root attempts', async () => {
    const onSubmit = vi.fn()
    const onGroupSubmit = vi.fn()
    const form = new InternalFormApi({
      defaultValues: { guestDetails: { name: 'Tony' } },
      onSubmit,
    })
    const group = new InternalFormGroupApi({
      form,
      name: 'guestDetails',
      onSubmit: onGroupSubmit,
    })

    await group.handleSubmit()

    expect(onGroupSubmit).toHaveBeenCalledOnce()
    expect(onSubmit).not.toHaveBeenCalled()
    expect(group.state.submissionAttempts).toBe(1)
    expect(form.state.submissionAttempts).toBe(0)
  })

  it('awaits onSubmitInvalid with only the group invalid context', async () => {
    let finishInvalidSubmit!: () => void
    const onSubmit = vi.fn()
    const onSubmitInvalid = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          finishInvalidSubmit = resolve
        }),
    )
    const form = new InternalFormApi({
      defaultValues: { guestDetails: { name: '' } },
    })
    const group = new InternalFormGroupApi({
      form,
      name: 'guestDetails',
      validators: [
        {
          run: () => 'Group is invalid',
          triggers: [],
        },
      ],
      onSubmit,
      onSubmitInvalid,
    })

    const submitPromise = group.handleSubmit()
    await vi.waitFor(() => {
      expect(finishInvalidSubmit).toBeTypeOf('function')
    })

    expect(onSubmit).not.toHaveBeenCalled()
    expect(onSubmitInvalid).toHaveBeenCalledWith({
      value: { name: '' },
      formApi: form,
      groupApi: group,
    })
    expect(group.state.isSubmitting).toBe(true)
    expect(group.state.isSubmitSuccessful).toBe(false)

    finishInvalidSubmit()
    await expect(submitPromise).resolves.toEqual(['Group is invalid'])
    expect(group.state.isSubmitting).toBe(false)
  })

  it('calls onSubmitInvalid when a group validator throws', async () => {
    const error = new Error('Group validator failed')
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const onSubmit = vi.fn()
    const onSubmitInvalid = vi.fn()
    const form = new InternalFormApi({
      defaultValues: { guestDetails: { name: '' } },
    })
    const group = new InternalFormGroupApi({
      form,
      name: 'guestDetails',
      validators: [
        {
          run: () => {
            throw error
          },
          triggers: [],
        },
      ],
      onSubmit,
      onSubmitInvalid,
    })

    try {
      await expect(group.handleSubmit()).resolves.toEqual([])

      expect(onSubmit).not.toHaveBeenCalled()
      expect(onSubmitInvalid).toHaveBeenCalledWith({
        value: { name: '' },
        formApi: form,
        groupApi: group,
      })
      expect(group.state.isSubmitSuccessful).toBe(false)
      expect(consoleSpy).toHaveBeenCalledWith(
        'Validator threw an error:',
        error,
      )
    } finally {
      consoleSpy.mockRestore()
    }
  })

  it('calls onSubmitInvalid when a grouped field validator throws', async () => {
    const error = new Error('Field validator failed')
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const onSubmit = vi.fn()
    const onSubmitInvalid = vi.fn()
    const form = new InternalFormApi({
      defaultValues: { guestDetails: { name: '' } },
    })
    form._getOrCreateFieldApi({
      name: 'guestDetails.name',
      validators: [
        {
          run: () => {
            throw error
          },
          triggers: [],
        },
      ],
    })
    const group = new InternalFormGroupApi({
      form,
      name: 'guestDetails',
      onSubmit,
      onSubmitInvalid,
    })

    try {
      await expect(group.handleSubmit()).resolves.toEqual([])

      expect(onSubmit).not.toHaveBeenCalled()
      expect(onSubmitInvalid).toHaveBeenCalledOnce()
      expect(group.state.isSubmitSuccessful).toBe(false)
      expect(consoleSpy).toHaveBeenCalledWith(
        'Validator threw an error:',
        error,
      )
    } finally {
      consoleSpy.mockRestore()
    }
  })

  it('calls onSubmitInvalid and preserves a rejected group onSubmit', async () => {
    const error = new Error('Group submit failed')
    const onSubmitInvalid = vi.fn()
    const form = new InternalFormApi({
      defaultValues: { guestDetails: { name: 'Tony' } },
    })
    const group = new InternalFormGroupApi({
      form,
      name: 'guestDetails',
      onSubmit: () => Promise.reject(error),
      onSubmitInvalid,
    })

    await expect(group.handleSubmit()).rejects.toBe(error)

    expect(onSubmitInvalid).toHaveBeenCalledWith({
      value: { name: 'Tony' },
      formApi: form,
      groupApi: group,
    })
    expect(group.state.isSubmitting).toBe(false)
    expect(group.state.isSubmitSuccessful).toBe(false)
  })

  it('passes group validator schema outputs to onSubmit', async () => {
    const onSubmit = vi.fn()
    const form = new InternalFormApi({
      defaultValues: { guestDetails: { name: 'Tony' } },
    })
    const group = new InternalFormGroupApi({
      form,
      name: 'guestDetails',
      validators: [
        {
          triggers: [],
          run: z
            .object({
              name: z.string(),
            })
            .transform(({ name }) => ({ nameLength: name.length })),
        },
      ],
      onSubmit,
    })

    await group.handleSubmit()

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        schemaOutputs: [{ nameLength: 4 }],
        value: { name: 'Tony' },
      }),
    )
  })

  it('clears prior group schema output when a dynamic submit predicate skips the validator', async () => {
    let shouldRunOnSubmit = true
    const onSubmit = vi.fn()
    const form = new InternalFormApi({
      defaultValues: { guestDetails: { name: 'Tony' } },
    })
    const group = new InternalFormGroupApi({
      form,
      name: 'guestDetails',
      validators: [
        {
          run: z.object({ name: z.string() }),
          runOnSubmit: () => shouldRunOnSubmit,
          triggers: [],
        },
      ],
      onSubmit,
    })

    await group.handleSubmit()
    expect(onSubmit).toHaveBeenLastCalledWith(
      expect.objectContaining({ schemaOutputs: [{ name: 'Tony' }] }),
    )

    shouldRunOnSubmit = false
    await group.handleSubmit()

    expect(onSubmit).toHaveBeenLastCalledWith(
      expect.objectContaining({ schemaOutputs: [undefined] }),
    )
    expect(group._validatorInstances?.[0]?.hasSchemaOutput).toBe(false)
  })

  it('keeps submission lifecycle independent between sibling groups', async () => {
    let resolveSubmit!: () => void
    const submitting = new Promise<void>((resolve) => {
      resolveSubmit = resolve
    })
    const form = new InternalFormApi({
      defaultValues: {
        guestDetails: { name: 'Tony' },
        billingDetails: { name: 'Alice' },
      },
    })
    const guestGroup = new InternalFormGroupApi({
      form,
      name: 'guestDetails',
      onSubmit: () => submitting,
    })
    const billingGroup = new InternalFormGroupApi({
      form,
      name: 'billingDetails',
    })

    const submit = guestGroup.handleSubmit()

    await vi.waitFor(() => expect(guestGroup.state.isSubmitting).toBe(true))
    expect(billingGroup.state).toMatchObject({
      isSubmitting: false,
      isSubmitSuccessful: false,
      submissionAttempts: 0,
    })
    expect(form.state.isSubmitting).toBe(false)

    resolveSubmit()
    await submit

    expect(guestGroup.state.isSubmitSuccessful).toBe(true)
    expect(billingGroup.state.isSubmitSuccessful).toBe(false)
  })

  it('exposes group submission lifecycle through scoped state overrides', async () => {
    let resolveSubmit!: () => void
    const submitting = new Promise<void>((resolve) => {
      resolveSubmit = resolve
    })
    const form = new InternalFormApi({
      defaultValues: { guestDetails: { name: 'Tony' } },
    })
    const group = new InternalFormGroupApi({
      form,
      name: 'guestDetails',
      onSubmit: () => submitting,
    })
    // Feel free to adjust this unit test, since this does kinda tinker with internal accessing.
    const overrides = group._getScopedFormStateOverrides()

    expect(overrides.isSubmitting?.()).toBe(false)
    expect(overrides.isSubmitSuccessful?.()).toBe(false)

    const submit = group.handleSubmit()
    await vi.waitFor(() => expect(overrides.isSubmitting?.()).toBe(true))

    resolveSubmit()
    await submit

    expect(overrides.isSubmitting?.()).toBe(false)
    expect(overrides.isSubmitSuccessful?.()).toBe(true)
  })

  it('scoped state overrides fall back when the group field has not been created', () => {
    const form = new InternalFormApi({
      defaultValues: { guestDetails: { name: 'Tony' } },
    })
    const group = new InternalFormGroupApi({
      form,
      name: 'guestDetails',
    })
    const overrides = group._getScopedFormStateOverrides()

    expect(overrides.isTouched?.()).toBe(false)
    expect(overrides.isDirty?.()).toBe(false)
    expect(overrides.isPristine?.()).toBe(true)
    expect(overrides.isValid?.()).toBe(true)
    expect(overrides.isInvalid?.()).toBe(false)
    expect(overrides.canSubmit?.()).toBe(true)
    expect(overrides.isValidating?.()).toBe(false)
  })

  it('scopes isDefaultValue overrides to the group subtree', () => {
    const form = new InternalFormApi({
      defaultValues: {
        guestDetails: { name: '' },
        billingDetails: { name: '' },
      },
    })
    const guestField = form._getOrCreateFieldApi({ name: 'guestDetails.name' })
    const billingField = form._getOrCreateFieldApi({
      name: 'billingDetails.name',
    })
    const group = new InternalFormGroupApi({
      form,
      name: 'guestDetails',
    })
    const overrides = group._getScopedFormStateOverrides()

    expect(overrides.isDefaultValue?.()).toBe(true)

    billingField.handleChange('Alice')
    expect(overrides.isDefaultValue?.()).toBe(true)

    guestField.handleChange('Tony')
    expect(overrides.isDefaultValue?.()).toBe(false)
  })

  it('scopes submit-attempt error visibility to the containing group', async () => {
    const form = new InternalFormApi({
      defaultValues: { guestDetails: { name: '' } },
      errorVisibility: ({ state }) => state.submissionAttempts > 0,
    })
    const nameField = form._getOrCreateFieldApi({ name: 'guestDetails.name' })
    const group = new InternalFormGroupApi({
      form,
      name: 'guestDetails',
      validators: [
        {
          triggers: [],
          run: () => ({
            fields: {
              name: 'Name is required',
            },
          }),
        },
      ],
    })

    await group.validate('submit')

    expect(nameField.errors).toEqual([])
    expect(nameField.meta.original.errors).toEqual([
      { message: 'Name is required' },
    ])

    await form.handleSubmit()

    expect(form.state.submissionAttempts).toBe(1)
    expect(group.state.submissionAttempts).toBe(0)
    expect(nameField.errors).toEqual([])

    await group.handleSubmit()

    expect(form.state.submissionAttempts).toBe(1)
    expect(group.state.submissionAttempts).toBe(1)
    expect(nameField.errors).toEqual([{ message: 'Name is required' }])
  })

  it('scopes scalar error visibility state to the containing group', async () => {
    const states: Array<Record<string, boolean>> = []
    const form = new InternalFormApi({
      defaultValues: {
        guestDetails: { name: '' },
        billingDetails: { name: '' },
      },
      errorVisibility: ({ state }) => {
        states.push({
          isTouched: state.isTouched,
          isDirty: state.isDirty,
          isPristine: state.isPristine,
          isValid: state.isValid,
          isInvalid: state.isInvalid,
          canSubmit: state.canSubmit,
          isValidating: state.isValidating,
        })
        return true
      },
    })
    const guestField = form._getOrCreateFieldApi({ name: 'guestDetails.name' })
    const billingField = form._getOrCreateFieldApi({
      name: 'billingDetails.name',
      validators: [{ triggers: [], run: () => 'Billing error' }],
    })
    new InternalFormGroupApi({ form, name: 'guestDetails' })
    new InternalFormGroupApi({ form, name: 'billingDetails' })

    guestField.handleChange('Tony')
    await billingField._runFieldValidation('submit')
    states.length = 0

    void guestField.meta

    expect(states.at(-1)).toEqual({
      isTouched: true,
      isDirty: true,
      isPristine: false,
      isValid: true,
      isInvalid: false,
      canSubmit: true,
      isValidating: false,
    })
  })

  it('keeps routed group field errors compact after repeated validation', async () => {
    const form = new InternalFormApi({
      defaultValues: {
        first: { name: '' },
        second: { name: '' },
        third: { name: '' },
        fourth: { name: '' },
        fifth: { name: '' },
        sixth: { name: '' },
      },
    })
    new InternalFormGroupApi({
      form,
      name: 'first',
    })
    new InternalFormGroupApi({
      form,
      name: 'second',
    })
    new InternalFormGroupApi({
      form,
      name: 'third',
    })
    new InternalFormGroupApi({
      form,
      name: 'fourth',
    })
    new InternalFormGroupApi({
      form,
      name: 'fifth',
    })
    const nameField = form._getOrCreateFieldApi({ name: 'sixth.name' })
    const group = new InternalFormGroupApi({
      form,
      name: 'sixth',
      validators: [
        {
          triggers: [],
          run: () => ({
            fields: {
              name: 'Name is required',
            },
          }),
        },
      ],
    })

    await group.validate('submit')
    await group.validate('submit')

    expect(nameField.errors).toEqual([{ message: 'Name is required' }])
    const validatorInstance = group._validatorInstances![0]!
    expect(
      nameField._getBaseMeta()._validationSourceErrors?.get(validatorInstance),
    ).toEqual({
      errors: [{ message: 'Name is required' }],
      sourceEvent: 'submit',
    })
    expect(nameField._getBaseMeta()._validationSourceErrors?.size).toBe(1)
    expect(nameField.meta.isInvalid).toBe(true)
  })

  it('keeps field, group, and root form errors separate and ordered', async () => {
    const form = new InternalFormApi({
      defaultValues: { guestDetails: { name: '' } },
      validators: [
        {
          triggers: [],
          run: () => ({
            fields: {
              'guestDetails.name': 'Root name error',
            },
          }),
        },
      ],
    })
    const nameField = form._getOrCreateFieldApi({
      name: 'guestDetails.name',
      validators: [
        {
          triggers: [],
          run: () => 'Field name error',
        },
      ],
    })
    const group = new InternalFormGroupApi({
      form,
      name: 'guestDetails',
      validators: [
        {
          triggers: [],
          run: () => ({
            fields: {
              name: 'Group name error',
            },
          }),
        },
      ],
    })

    await group.validate('submit')

    expect(nameField.errors).toEqual([
      { message: 'Field name error' },
      { message: 'Group name error' },
    ])

    await form.validate('submit')

    expect(nameField.errors).toEqual([
      { message: 'Field name error' },
      { message: 'Group name error' },
      { message: 'Root name error' },
    ])
    expect(
      nameField
        ._getBaseMeta()
        ._validationSourceErrors?.get(group._validatorInstances![0]!),
    ).toEqual({
      errors: [{ message: 'Group name error' }],
      sourceEvent: 'submit',
    })
    expect(
      nameField
        ._getBaseMeta()
        ._validationSourceErrors?.get(form._validatorInstances![0]!),
    ).toEqual({
      errors: [{ message: 'Root name error' }],
      sourceEvent: 'submit',
    })
  })

  it('keeps sibling group validator errors independently owned', async () => {
    const form = new InternalFormApi({
      defaultValues: {
        guestDetails: { name: '' },
        billingDetails: { name: '' },
      },
    })
    const guestName = form._getOrCreateFieldApi({
      name: 'guestDetails.name',
    })
    const billingName = form._getOrCreateFieldApi({
      name: 'billingDetails.name',
    })
    const guestGroup = new InternalFormGroupApi({
      form,
      name: 'guestDetails',
      validators: [
        {
          triggers: [],
          run: () => ({ fields: { name: 'Guest error' } }),
        },
      ],
    })
    const billingGroup = new InternalFormGroupApi({
      form,
      name: 'billingDetails',
      validators: [
        {
          triggers: [],
          run: () => ({ fields: { name: 'Billing error' } }),
        },
      ],
    })

    await guestGroup.validate('submit')
    await billingGroup.validate('submit')

    expect(guestName.errors).toEqual([{ message: 'Guest error' }])
    expect(billingName.errors).toEqual([{ message: 'Billing error' }])
    expect(guestGroup.state.isInvalid).toBe(true)
    expect(billingGroup.state.isInvalid).toBe(true)

    guestGroup.reset()

    expect(guestName.errors).toEqual([])
    expect(billingName.errors).toEqual([{ message: 'Billing error' }])
    expect(billingGroup.state.isInvalid).toBe(true)
  })

  it('routes group-level errors to the field at the group name', async () => {
    let result: any = 'Group error'
    const form = new InternalFormApi({
      defaultValues: { guestDetails: { name: '', email: '' } },
    })
    const groupField = form._getOrCreateFieldApi({ name: 'guestDetails' })
    const nameField = form._getOrCreateFieldApi({ name: 'guestDetails.name' })
    const emailField = form._getOrCreateFieldApi({ name: 'guestDetails.email' })
    nameField._register()
    emailField._register()
    const group = new InternalFormGroupApi({
      form,
      name: 'guestDetails',
      validators: [
        {
          triggers: [],
          run: () => result,
        },
      ],
    })

    await group.validate('submit')

    expect(groupField.errors).toEqual([{ message: 'Group error' }])
    expect(group.state.errors).toEqual([{ message: 'Group error' }])

    result = {
      form: 'Group error from error map',
      fields: { name: 'Name error' },
    }
    await group.validate('submit')

    expect(groupField.errors).toEqual([
      { message: 'Group error from error map' },
    ])
    expect(nameField.errors).toEqual([{ message: 'Name error' }])
    expect(group.state.errors).toEqual([
      { message: 'Group error from error map' },
    ])

    result = { fields: { email: 'Email error' } }
    await group.validate('submit')

    expect(groupField.errors).toEqual([])
    expect(nameField.errors).toEqual([])
    expect(emailField.errors).toEqual([{ message: 'Email error' }])
    expect(group.state.errors).toEqual([])
  })

  it('routes descendant Standard Schema issues to a field error boundary', async () => {
    const form = new InternalFormApi({
      defaultValues: {
        stayDates: {
          dateRange: { from: '', to: '' },
          arrivalTime: '',
        },
      },
    })
    const dateRangeField = form._getOrCreateFieldApi({
      name: 'stayDates.dateRange',
      errorBoundary: true,
    })
    const arrivalTimeField = form._getOrCreateFieldApi({
      name: 'stayDates.arrivalTime',
    })
    const group = new InternalFormGroupApi({
      form,
      name: 'stayDates',
      validators: [
        {
          triggers: [],
          run: z.object({
            dateRange: z.object({
              from: z.string().min(1, 'Start date is required'),
              to: z.string().min(1, 'End date is required'),
            }),
            arrivalTime: z.string().min(1, 'Arrival time is required'),
          }),
        },
      ],
    })

    await group.validate('submit')

    expect(dateRangeField.errors).toEqual([
      expect.objectContaining({ message: 'Start date is required' }),
      expect.objectContaining({ message: 'End date is required' }),
    ])
    expect(arrivalTimeField.errors).toEqual([
      expect.objectContaining({ message: 'Arrival time is required' }),
    ])
    expect(form._tryGetFieldApi('stayDates.dateRange.from')).toBeNull()
    expect(form._tryGetFieldApi('stayDates.dateRange.to')).toBeNull()
    expect(group.state.isInvalid).toBe(true)

    dateRangeField.handleChange(
      { from: '2026-08-10', to: '2026-08-12' },
      { causeValidation: false },
    )
    arrivalTimeField.handleChange('15:00', { causeValidation: false })
    await group.validate('submit')

    expect(dateRangeField.errors).toEqual([])
    expect(arrivalTimeField.errors).toEqual([])
    expect(group.state.isInvalid).toBe(false)
  })

  it('combines group self and descendant errors at a group root error boundary', async () => {
    const form = new InternalFormApi({
      defaultValues: {
        stayDates: {
          dateRange: { from: '', to: '' },
        },
      },
    })
    const groupField = form._getOrCreateFieldApi({
      name: 'stayDates',
      errorBoundary: true,
    })
    const group = new InternalFormGroupApi({
      form,
      name: 'stayDates',
      validators: [
        {
          triggers: [],
          run: () => ({
            form: 'Stay dates are invalid',
            fields: {
              'dateRange.from': 'Start date is required',
              'dateRange.to': 'End date is required',
            },
          }),
        },
      ],
    })

    await group.validate('submit')

    expect(groupField.errors).toEqual([
      { message: 'Stay dates are invalid' },
      { message: 'Start date is required' },
      { message: 'End date is required' },
    ])
    expect(group.state.errors).toEqual(groupField.errors)
    expect(form._tryGetFieldApi('stayDates.dateRange.from')).toBeNull()
    expect(form._tryGetFieldApi('stayDates.dateRange.to')).toBeNull()
  })

  it('does not route group errors to a boundary outside the group', async () => {
    const form = new InternalFormApi({
      defaultValues: {
        booking: {
          stayDates: {
            dateRange: { to: '' },
          },
        },
      },
    })
    const bookingField = form._getOrCreateFieldApi({
      name: 'booking',
      errorBoundary: true,
    })
    const group = new InternalFormGroupApi({
      form,
      name: 'booking.stayDates',
      validators: [
        {
          triggers: [],
          run: () => ({
            fields: {
              'dateRange.to': 'End date is required',
            },
          }),
        },
      ],
    })

    await group.validate('submit')

    expect(bookingField.errors).toEqual([])
    expect(
      form._tryGetFieldApi('booking.stayDates.dateRange.to')?.errors,
    ).toEqual([{ message: 'End date is required' }])
    expect(group.state.isInvalid).toBe(true)
  })

  it('clears routed group field errors when validation later passes', async () => {
    let shouldError = true
    const form = new InternalFormApi({
      defaultValues: { guestDetails: { name: '' } },
    })
    const nameField = form._getOrCreateFieldApi({ name: 'guestDetails.name' })
    const group = new InternalFormGroupApi({
      form,
      name: 'guestDetails',
      validators: [
        {
          triggers: [],
          run: () =>
            shouldError
              ? {
                  fields: {
                    name: 'Name is required',
                  },
                }
              : { fields: {} },
        },
      ],
    })

    await group.validate('submit')
    expect(nameField.errors).toEqual([{ message: 'Name is required' }])

    shouldError = false
    await group.validate('submit')

    expect(nameField.errors).toEqual([])
    expect(group.state.errors).toEqual([])
  })

  it('validates descendant fields without validating fields outside the group', async () => {
    const guestValidator = vi.fn(() => 'Guest required')
    const budgetValidator = vi.fn(() => 'Budget required')
    const form = new InternalFormApi({
      defaultValues: {
        guestDetails: { name: '' },
        budget: '',
      },
    })
    const guestField = form._getOrCreateFieldApi({
      name: 'guestDetails.name',
      validators: [{ triggers: [], run: guestValidator }],
    })
    const budgetField = form._getOrCreateFieldApi({
      name: 'budget',
      validators: [{ triggers: [], run: budgetValidator }],
    })
    const group = new InternalFormGroupApi({
      form,
      name: 'guestDetails',
    })

    await group.handleSubmit()

    expect(guestValidator).toHaveBeenCalledOnce()
    expect(budgetValidator).not.toHaveBeenCalled()
    expect(guestField.errors).toEqual([{ message: 'Guest required' }])
    expect(budgetField.errors).toEqual([])
    expect(group.state.isInvalid).toBe(true)
  })

  it('tracks validation running in descendant fields', async () => {
    let resolveValidation!: () => void
    const validation = new Promise<void>((resolve) => {
      resolveValidation = resolve
    })
    const form = new InternalFormApi({
      defaultValues: { guestDetails: { name: '' } },
    })
    const nameField = form._getOrCreateFieldApi({
      name: 'guestDetails.name',
      validators: [
        {
          triggers: [],
          run: async () => {
            await validation
            return null
          },
        },
      ],
    })
    const group = new InternalFormGroupApi({
      form,
      name: 'guestDetails',
    })

    const validating = nameField._runFieldValidation('submit')

    await vi.waitFor(() => expect(group.state.isValidating).toBe(true))
    expect(group._groupField.meta.isSelfValidating).toBe(false)
    expect(group._groupField.meta.isValidating).toBe(true)
    resolveValidation()
    await validating
    expect(group.state.isValidating).toBe(false)
  })

  it('passes group values to validators and validator predicates', async () => {
    const run = vi.fn(() => null)
    const when = vi.fn(() => true)
    const form = new InternalFormApi({
      defaultValues: {
        guestDetails: { name: 'Tony' },
        budget: 100,
      },
    })
    const group = new InternalFormGroupApi({
      form,
      name: 'guestDetails',
      validators: [
        {
          triggers: [{ trigger: 'change', when }],
          run,
        },
      ],
    })

    await group.validate('change')

    expect(when).toHaveBeenCalledWith(
      expect.objectContaining({
        scope: 'group',
        groupApi: group,
        value: { name: 'Tony' },
      }),
    )
    expect(run).toHaveBeenCalledWith(
      expect.objectContaining({ value: { name: 'Tony' } }),
    )
  })

  it('passes the group context to predicates triggered by descendant fields', async () => {
    const when = vi.fn(() => true)
    const run = vi.fn(() => null)
    const form = new InternalFormApi({
      defaultValues: { guestDetails: { name: '' } },
    })
    const nameField = form._getOrCreateFieldApi({
      name: 'guestDetails.name',
    })
    const group = new InternalFormGroupApi({
      form,
      name: 'guestDetails',
      validators: [
        {
          triggers: [{ trigger: 'change', when }],
          run,
        },
      ],
    })

    nameField.handleChange('Tony')

    await vi.waitFor(() => expect(run).toHaveBeenCalledOnce())
    expect(when).toHaveBeenCalledWith(
      expect.objectContaining({
        scope: 'group',
        formApi: form,
        fieldApi: nameField,
        groupApi: group,
        value: { name: 'Tony' },
      }),
    )
  })

  it('can enable change validation after the group submits', async () => {
    const run = vi.fn(() => null)
    const form = new InternalFormApi({
      defaultValues: { guestDetails: { name: '' } },
    })
    const nameField = form._getOrCreateFieldApi({
      name: 'guestDetails.name',
    })
    const group = new InternalFormGroupApi({
      form,
      name: 'guestDetails',
      validators: [
        {
          triggers: [
            {
              trigger: 'change',
              when: ({ groupApi }) => groupApi.state.submissionAttempts > 0,
            },
          ],
          run,
        },
      ],
    })

    nameField.handleChange('before submit')
    await new Promise((resolve) => setTimeout(resolve, 0))
    expect(run).not.toHaveBeenCalled()

    await group.handleSubmit()
    expect(run).toHaveBeenCalledOnce()
    run.mockClear()

    nameField.handleChange('after submit')
    await vi.waitFor(() => expect(run).toHaveBeenCalledOnce())
  })

  it('captures field-triggered validation inside the group without running root validation', async () => {
    const rootValidator = vi.fn(() => null)
    const groupValidator = vi.fn(() => null)
    const form = new InternalFormApi({
      defaultValues: {
        guestDetails: { name: '' },
        budget: '',
      },
      validators: [
        {
          triggers: ['change'],
          run: rootValidator,
        },
      ],
    })
    const guestField = form._getOrCreateFieldApi({
      name: 'guestDetails.name',
    })
    const budgetField = form._getOrCreateFieldApi({
      name: 'budget',
    })
    const group = new InternalFormGroupApi({
      form,
      name: 'guestDetails',
      validators: [
        {
          triggers: ['change'],
          run: groupValidator,
        },
      ],
    })

    guestField.handleChange('Tony')

    await vi.waitFor(() => expect(groupValidator).toHaveBeenCalledOnce())
    expect(rootValidator).not.toHaveBeenCalled()

    budgetField.handleChange('100')

    await vi.waitFor(() => expect(rootValidator).toHaveBeenCalledOnce())

    group._cleanup()
    guestField.handleChange('Tony Hawk')

    await vi.waitFor(() => expect(rootValidator).toHaveBeenCalledTimes(2))
  })

  it('reattaches active groups after a form reset', async () => {
    const rootValidator = vi.fn(() => null)
    const groupValidator = vi.fn(() => 'Group error')
    const form = new InternalFormApi({
      defaultValues: { guestDetails: { name: '' } },
      validators: [{ triggers: ['change'], run: rootValidator }],
    })
    const group = new InternalFormGroupApi({
      form,
      name: 'guestDetails',
      validators: [{ triggers: ['change'], run: groupValidator }],
    })
    const initialGroupField = group._groupField

    await group.validate('submit')
    expect(group.state.isInvalid).toBe(true)

    form.reset()

    expect(initialGroupField._isKilled).toBe(true)
    expect(group._groupField).not.toBe(initialGroupField)
    expect(group._groupField._formGroup).toBe(group)
    expect(group.state.isValid).toBe(true)

    const nameField = form._getOrCreateFieldApi({
      name: 'guestDetails.name',
    })
    nameField.handleChange('Tony')

    await vi.waitFor(() => expect(groupValidator).toHaveBeenCalledTimes(2))
    expect(rootValidator).not.toHaveBeenCalled()
  })

  it('only clears the changed field when a group validator conditionally skips change', async () => {
    const form = new InternalFormApi({
      defaultValues: {
        guestDetails: { name: '', email: '', phoneNumber: '' },
      },
    })
    const nameField = form._getOrCreateFieldApi({ name: 'guestDetails.name' })
    const emailField = form._getOrCreateFieldApi({ name: 'guestDetails.email' })
    const phoneField = form._getOrCreateFieldApi({
      name: 'guestDetails.phoneNumber',
    })
    nameField._register()
    emailField._register()
    phoneField._register()
    const group = new InternalFormGroupApi({
      form,
      name: 'guestDetails',
      validators: [
        {
          triggers: [
            {
              trigger: 'change',
              when: ({ fieldApi }) => fieldApi?.meta.isInvalid ?? false,
            },
          ],
          run: z.object({
            name: z.string().min(1, 'Name is required'),
            email: z.email('Email is invalid'),
            phoneNumber: z.string().min(1, 'Phone is required'),
          }),
        },
      ],
    })

    await group.handleSubmit()

    expect(nameField.errors).toEqual([
      expect.objectContaining({ message: 'Name is required' }),
    ])
    expect(emailField.errors).toEqual([
      expect.objectContaining({ message: 'Email is invalid' }),
    ])
    expect(phoneField.errors).toEqual([
      expect.objectContaining({ message: 'Phone is required' }),
    ])

    emailField.handleChange('tony@example.com')
    await vi.waitFor(() => expect(emailField.errors).toEqual([]))

    expect(nameField.errors).toEqual([
      expect.objectContaining({ message: 'Name is required' }),
    ])
    expect(phoneField.errors).toEqual([
      expect.objectContaining({ message: 'Phone is required' }),
    ])

    phoneField.handleChange('1')
    await vi.waitFor(() => expect(phoneField.errors).toEqual([]))
    phoneField.handleChange('12')

    expect(nameField.errors).toEqual([
      expect.objectContaining({ message: 'Name is required' }),
    ])
  })

  it('clears group-level submit errors when a skipped validator receives a field event', async () => {
    const form = new InternalFormApi({
      defaultValues: { guestDetails: { name: '' } },
    })
    const groupField = form._getOrCreateFieldApi({ name: 'guestDetails' })
    const nameField = form._getOrCreateFieldApi({ name: 'guestDetails.name' })
    const group = new InternalFormGroupApi({
      form,
      name: 'guestDetails',
      validators: [
        {
          triggers: [],
          run: () => 'Group error',
        },
      ],
    })

    await group.handleSubmit()
    expect(groupField.errors).toEqual([{ message: 'Group error' }])
    expect(group.state.errors).toEqual([{ message: 'Group error' }])

    nameField.handleChange('Tony')

    expect(groupField.errors).toEqual([])
    expect(group.state.errors).toEqual([])
  })

  it('only clears the blurred field when a group validator skips blur', async () => {
    const form = new InternalFormApi({
      defaultValues: { guestDetails: { name: '', email: '' } },
    })
    const nameField = form._getOrCreateFieldApi({ name: 'guestDetails.name' })
    const emailField = form._getOrCreateFieldApi({ name: 'guestDetails.email' })
    nameField._register()
    emailField._register()
    const group = new InternalFormGroupApi({
      form,
      name: 'guestDetails',
      validators: [
        {
          triggers: [],
          run: () => ({
            fields: {
              name: 'Name is required',
              email: 'Email is required',
            },
          }),
        },
      ],
    })

    await group.handleSubmit()
    emailField.handleBlur()

    expect(nameField.errors).toEqual([{ message: 'Name is required' }])
    expect(emailField.errors).toEqual([])
  })

  it('replaces submit errors when the group validator runs on change', async () => {
    const form = new InternalFormApi({
      defaultValues: { guestDetails: { name: '', email: '' } },
    })
    const nameField = form._getOrCreateFieldApi({ name: 'guestDetails.name' })
    const emailField = form._getOrCreateFieldApi({ name: 'guestDetails.email' })
    nameField._register()
    emailField._register()
    const group = new InternalFormGroupApi({
      form,
      name: 'guestDetails',
      validators: [
        {
          triggers: ['change'],
          run: ({ event }) =>
            event === 'submit'
              ? {
                  fields: {
                    name: 'Submit name error',
                    email: 'Submit email error',
                  },
                }
              : { fields: { email: 'Change email error' } },
        },
      ],
    })

    await group.handleSubmit()
    expect(nameField.errors).toEqual([{ message: 'Submit name error' }])
    expect(emailField.errors).toEqual([{ message: 'Submit email error' }])

    nameField.handleChange('Tony')

    await vi.waitFor(() => {
      expect(nameField.errors).toEqual([])
      expect(emailField.errors).toEqual([{ message: 'Change email error' }])
    })
  })

  it('preserves non-submit-sourced group errors across unrelated events', async () => {
    const form = new InternalFormApi({
      defaultValues: { guestDetails: { name: '', email: '' } },
    })
    const nameField = form._getOrCreateFieldApi({ name: 'guestDetails.name' })
    const emailField = form._getOrCreateFieldApi({ name: 'guestDetails.email' })
    nameField._register()
    emailField._register()
    const group = new InternalFormGroupApi({
      form,
      name: 'guestDetails',
      validators: [
        {
          triggers: ['blur'],
          run: () => ({
            form: 'Blur group error',
            fields: {
              name: 'Blur name error',
              email: 'Blur email error',
            },
          }),
        },
      ],
    })

    await group.validate('blur')
    expect(group.state.errors).toEqual([{ message: 'Blur group error' }])
    expect(nameField.errors).toEqual([{ message: 'Blur name error' }])
    expect(emailField.errors).toEqual([{ message: 'Blur email error' }])

    nameField.handleChange('Tony')

    expect(group.state.errors).toEqual([{ message: 'Blur group error' }])
    expect(nameField.errors).toEqual([{ message: 'Blur name error' }])
    expect(emailField.errors).toEqual([{ message: 'Blur email error' }])
  })

  it('routes Standard Schema errors to descendant fields and clears them on reset', async () => {
    const form = new InternalFormApi({
      defaultValues: {
        guestDetails: { name: '' },
      },
      validators: [
        {
          triggers: [],
          run: () => ({
            fields: {
              'guestDetails.name': 'Root name error',
            },
          }),
        },
      ],
    })
    const nameField = form._getOrCreateFieldApi({ name: 'guestDetails.name' })
    const group = new InternalFormGroupApi({
      form,
      name: 'guestDetails',
      validators: [
        {
          triggers: [],
          run: z.object({
            name: z.string().min(1, 'Name is required'),
          }),
        },
      ],
    })

    await group.handleSubmit()
    await form.validate('submit')

    expect(nameField.errors).toEqual([
      expect.objectContaining({ message: 'Name is required' }),
      { message: 'Root name error' },
    ])
    expect(group.state.isInvalid).toBe(true)

    group.reset()

    expect(nameField.errors).toEqual([{ message: 'Root name error' }])
    expect(group.state.errors).toEqual([])
  })

  it('parses Standard Schema issues from group validators', async () => {
    const schema = z.object({
      name: z.string().min(1, 'Name is required'),
    })
    const form = new InternalFormApi({
      defaultValues: { guestDetails: { name: '' } },
    })
    const nameField = form._getOrCreateFieldApi({
      name: 'guestDetails.name',
    })
    const group = new InternalFormGroupApi({
      form,
      name: 'guestDetails',
      validators: [
        {
          triggers: [],
          run: ({ value, parseIssues }) => {
            const result = schema.safeParse(value)

            if (!result.success) {
              return parseIssues(result.error.issues)
            }

            return null
          },
        },
      ],
    })

    await group.validate('submit')

    expect(group.state.errors).toEqual([
      expect.objectContaining({ message: 'Name is required' }),
    ])
    expect(nameField.errors).toEqual([
      expect.objectContaining({ message: 'Name is required' }),
    ])
  })

  it('resets group interaction and lifecycle state without resetting siblings', async () => {
    const form = new InternalFormApi({
      defaultValues: {
        guestDetails: { name: '' },
        billingDetails: { name: '' },
      },
    })
    const guestField = form._getOrCreateFieldApi({ name: 'guestDetails.name' })
    const billingField = form._getOrCreateFieldApi({
      name: 'billingDetails.name',
    })
    const group = new InternalFormGroupApi({
      form,
      name: 'guestDetails',
    })

    guestField.handleChange('Tony')
    billingField.handleChange('Alice')
    await group.handleSubmit()

    expect(group.state).toMatchObject({
      isTouched: true,
      isDirty: true,
      isPristine: false,
      isSubmitSuccessful: true,
      submissionAttempts: 1,
    })

    group.reset()

    expect(group.state).toMatchObject({
      isTouched: false,
      isDirty: false,
      isPristine: true,
      isSubmitSuccessful: false,
      submissionAttempts: 0,
    })
    expect(group.state.values).toEqual({ name: '' })
    expect(billingField.value).toBe('Alice')
    expect(billingField.meta.isDirty).toBe(true)
    expect(form.state.isDirty).toBe(true)
  })
})
