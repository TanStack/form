import { describe, expect, it, vi } from 'vitest'
import { z } from 'zod'
import { InternalFormApi } from '../../src/FormApi/FormApi.lib'
import { InternalFormGroupApi } from '../../src/FormGroupApi/FormGroupApi.lib'

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

    resolve('Async group error')
    await vi.waitFor(() => expect(group.state.isValidating).toBe(false))

    expect(group.state.errors).toEqual([{ message: 'Async group error' }])
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

    expect(group.options.onSubmit).toBe(onSubmit)
  })

  it('prefixes field options declared through a group', () => {
    const form = new InternalFormApi({
      defaultValues: { guestDetails: { name: '', age: 0 } },
    })
    const group = new InternalFormGroupApi({
      form,
      name: 'guestDetails',
    })

    const options = group._getFormFieldOptions({
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
    })

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

    const options = group._getFormFieldOptions({
      name: 'name',
    })

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

  it('scopes submit-attempt error visibility to the nearest group', async () => {
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

  it('scopes scalar error visibility state to the nearest group', async () => {
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
    expect(
      nameField._getBaseMeta()._formGroupValidatorErrors.get(group._errorOwner),
    ).toEqual({
      errors: [[{ message: 'Name is required' }]],
      errorSourceEvents: ['submit'],
    })
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
      nameField._getBaseMeta()._formGroupValidatorErrors.get(group._errorOwner),
    ).toEqual({
      errors: [[{ message: 'Group name error' }]],
      errorSourceEvents: ['submit'],
    })
    expect(nameField._getBaseMeta()._formValidatorErrors).toEqual([
      [{ message: 'Root name error' }],
    ])
  })

  it('keeps overlapping group validator errors independently owned', async () => {
    const form = new InternalFormApi({
      defaultValues: { guestDetails: { name: '' } },
    })
    const nameField = form._getOrCreateFieldApi({ name: 'guestDetails.name' })
    const parentGroup = new InternalFormGroupApi({
      form,
      name: 'guestDetails',
      validators: [
        {
          triggers: [],
          run: () => ({ fields: { name: 'Parent error' } }),
        },
      ],
    })
    const childGroup = new InternalFormGroupApi({
      form,
      name: 'guestDetails.name',
      validators: [
        {
          triggers: [],
          run: () => 'Child error',
        },
      ],
    })

    await parentGroup.validate('submit')
    await childGroup.validate('submit')

    expect(nameField.errors).toEqual([
      { message: 'Parent error' },
      { message: 'Child error' },
    ])
    expect(parentGroup.state.isInvalid).toBe(true)
    expect(childGroup.state.isInvalid).toBe(true)

    childGroup.reset()

    expect(nameField.errors).toEqual([{ message: 'Parent error' }])
    expect(parentGroup.state.isInvalid).toBe(true)
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
