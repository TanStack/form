import { describe, expect, it, vi } from 'vitest'
import { InternalFormApi } from '../../src/FormApi/FormApi.lib'
import { installDevtoolsBridge } from '../../src/devtoolsBridge.lib'
import { defaultInternalBaseFieldMeta } from '../../src/FieldApi/fieldState.lib'

describe('form - lifecycle', () => {
  describe('initial state', () => {
    it('state.values matches defaultValues', () => {
      const form = new InternalFormApi({
        defaultValues: { name: 'Alice', age: 30 },
      })
      expect(form.state.values).toEqual({ name: 'Alice', age: 30 })
    })

    it('state.isTouched starts as false', () => {
      const form = new InternalFormApi({ defaultValues: { name: '' } })
      expect(form.state.isTouched).toBe(false)
    })

    it('state.canSubmit starts as true', () => {
      const form = new InternalFormApi({ defaultValues: { name: '' } })
      expect(form.state.canSubmit).toBe(true)
    })

    it('uses a supplied formId', () => {
      const form = new InternalFormApi({
        formId: 'profile-form',
        defaultValues: { name: '' },
      })

      expect(form.formId).toBe('profile-form')
    })

    it('generates and preserves a formId when one is not supplied', () => {
      const form = new InternalFormApi({ defaultValues: { name: '' } })
      const formId = form.formId

      expect(formId).toBeTypeOf('string')
      expect(formId.length).toBeGreaterThan(0)

      form._update({ defaultValues: { name: 'async' } })

      expect(form.formId).toBe(formId)
    })

    it('supports changing a supplied formId during update', () => {
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

    it('notifies an installed devtools bridge during form lifecycle hooks', () => {
      const form = new InternalFormApi({
        formId: 'profile-form',
        defaultValues: { name: '' },
      })
      const mountForm = vi.fn()
      const unmountForm = vi.fn()
      const updateForm = vi.fn()
      const uninstallBridge = installDevtoolsBridge({
        mountForm,
        unmountForm,
        updateForm,
      })

      try {
        const unmount = form.mount()
        expect(mountForm).toHaveBeenCalledWith(form)

        form._update({
          formId: 'renamed-profile-form',
          defaultValues: { name: '' },
        })
        expect(updateForm).toHaveBeenCalledWith(form)

        unmount()
        expect(unmountForm).toHaveBeenCalledWith(form)
      } finally {
        uninstallBridge()
      }
    })

    it('stops notifying a devtools bridge after it uninstalls', () => {
      const form = new InternalFormApi({
        formId: 'profile-form',
        defaultValues: { name: '' },
      })
      const mountForm = vi.fn()
      const unmountForm = vi.fn()
      const updateForm = vi.fn()
      const uninstallBridge = installDevtoolsBridge({
        mountForm,
        unmountForm,
        updateForm,
      })
      uninstallBridge()

      const unmount = form.mount()
      form._update({
        formId: 'renamed-profile-form',
        defaultValues: { name: '' },
      })
      unmount()

      expect(mountForm).not.toHaveBeenCalled()
      expect(updateForm).not.toHaveBeenCalled()
      expect(unmountForm).not.toHaveBeenCalled()
    })

    it('supports updating defaultValues after initialization', () => {
      const form = new InternalFormApi({ defaultValues: { name: '' } })
      expect(form.state.values).toEqual({ name: '' })
      expect(form.state.isTouched).toBe(false)
      form._update({ defaultValues: { name: 'async' } })

      expect(form.state.isTouched).toBe(false)
      expect(form.state.values).toEqual({ name: 'async' })
    })

    it('preserves touched field values when defaultValues update', () => {
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
    })

    it('warns when the validator array length changes after initialization', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const form = new InternalFormApi<any, any, any>({
        defaultValues: { name: '' },
        validators: [{ run: () => null, triggers: [] }],
      })

      form._update({
        defaultValues: { name: '' },
        validators: [
          { run: () => null, triggers: [] },
          { run: () => null, triggers: [] },
        ],
      })

      expect(warn).toHaveBeenCalled()
      warn.mockRestore()
    })

    it('keeps form validator instances stable by slot across updates', () => {
      const firstDefinition = { run: () => null, triggers: [] }
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        validators: [firstDefinition],
      })
      const instance = form._validatorInstances?.[0]
      const nextDefinition = { run: () => null, triggers: [] }

      form._update({
        defaultValues: { name: '' },
        validators: [nextDefinition],
      })

      expect(form._validatorInstances?.[0]).toBe(instance)
      expect(instance?.definition).toBe(nextDefinition)
      expect(instance?.owner).toBe(form)
      expect(instance?.scope).toBe('form')
      expect(instance?.revision).toBe(1)
    })

    it('resets form validator runtime without replacing its instance', () => {
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        validators: [{ run: () => null, triggers: [] }],
      })
      const instance = form._validatorInstances?.[0]
      const abortController = new AbortController()
      instance?.setAbortController(abortController)
      instance?.setSchemaOutput('output')

      form.reset()

      expect(form._validatorInstances?.[0]).toBe(instance)
      expect(abortController.signal.aborted).toBe(true)
      expect(instance?.hasSchemaOutput).toBe(false)
      expect(instance?.disposed).toBe(false)
    })

    it('should only apply options to the leaf node', async () => {
      vi.useFakeTimers()
      const listener = vi.fn()
      const form = new InternalFormApi({
        defaultValues: { foo: { bar: '' } },
      })
      const field = form._getOrCreateFieldApi({
        name: 'foo.bar',
        listeners: [{ run: listener, triggers: ['change'] }],
      })

      field.handleChange('New value')

      await vi.runAllTimersAsync()

      expect(listener).toHaveBeenCalledOnce()
    })

    // TODO extend with default state
  })

  describe('reset', () => {
    it('resets form state', () => {
      const form = new InternalFormApi({ defaultValues: { name: '' } })
      const field = form._getOrCreateFieldApi({ name: 'name' })
      field._register()

      field.handleChange('bye')
      form.reset()
      expect(form.state.values).toEqual({ name: '' })
    })

    it('resets form state and updated default values', () => {
      const form = new InternalFormApi({ defaultValues: { name: '' } })
      const field = form._getOrCreateFieldApi({ name: 'name' })
      field._register()

      field.handleChange('bye')
      form.reset({ name: 'reset default' })
      expect(form.state.values).toEqual({ name: 'reset default' })
      expect(form.defaultValues).toEqual({ name: 'reset default' })
    })

    it('resets form state and does not update default values', () => {
      const form = new InternalFormApi({ defaultValues: { name: '' } })
      const field = form._getOrCreateFieldApi({ name: 'name' })
      field._register()

      field.handleChange('bye')
      form.reset({ name: 'reset state' }, { updateDefaultValues: false })
      expect(form.state.values).toEqual({ name: 'reset state' })
      expect(form.defaultValues).toEqual({ name: '' })
    })

    it('does not let a repeated _update default overwrite reset values', () => {
      const form = new InternalFormApi({ defaultValues: { name: '' } })

      form._update({ defaultValues: { name: 'async' } })
      form.reset({ name: 'reset default' })
      form._update({ defaultValues: { name: 'async' } })

      expect(form.state.values).toEqual({ name: 'reset default' })
      expect(form.defaultValues).toEqual({ name: 'reset default' })
      expect(form.state.isDefaultValue).toBe(true)

      form._update({ defaultValues: { name: 'new async' } })

      expect(form.state.values).toEqual({ name: 'new async' })
      expect(form.defaultValues).toEqual({ name: 'new async' })
      expect(form.state.isDefaultValue).toBe(true)
    })

    it('resets meta and kills fields', async () => {
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        validators: [
          {
            run: () => 'Submit error',
            triggers: [],
          },
        ],
      })
      const field = form._getOrCreateFieldApi({ name: 'name' })
      field._register()
      field.handleChange('dirty')

      await form.handleSubmit()
      form.reset()

      expect(form.state.values).toEqual({ name: '' })
      expect(form.state.isDirty).toBe(false)
      expect(form.state.isTouched).toBe(false)
      expect(form.state.errors).toEqual([])
      expect(form.state.submissionAttempts).toBe(0)
      expect(form.getFieldMeta('name')).toBeUndefined()
    })

    it('cancels pending form validators on reset', async () => {
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

      const validatePromise = form.validate('change')
      form.reset()
      await vi.advanceTimersByTimeAsync(100)
      const result = await validatePromise

      expect(result).toEqual([])
      expect(validator).not.toHaveBeenCalled()
      expect(form.state.errors).toEqual([])
    })

    it('cancels pending field listeners on reset', async () => {
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

      field.handleChange('dirty')
      form.reset()
      await vi.advanceTimersByTimeAsync(100)

      expect(listener).not.toHaveBeenCalled()
    })

    it('ignores submit cleanup and submit errors after reset', async () => {
      let finishSubmit!: () => void
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        onSubmit: ({ createValidationError }) =>
          new Promise((resolve) => {
            finishSubmit = () =>
              resolve(createValidationError('Late submit error'))
          }),
      })

      const submitPromise = form.handleSubmit()
      await vi.waitFor(() => {
        expect(finishSubmit).toBeTypeOf('function')
      })

      form.reset({ name: 'reset value' }, { updateDefaultValues: false })
      finishSubmit()
      const result = await submitPromise

      expect(result).toEqual([])
      expect(form.state.values).toEqual({ name: 'reset value' })
      expect(form.state.errors).toEqual([])
      expect(form.state.isSubmitting).toBe(false)
      expect(form.state.submissionAttempts).toBe(0)
    })
  })

  // field methods

  describe('resetField', () => {
    it('should reset field', () => {
      const form = new InternalFormApi({ defaultValues: { name: 'hi' } })
      const field = form._getOrCreateFieldApi({ name: 'name' })
      field.handleChange('bye')
      field.handleBlur()
      field._setMeta((prev) => ({
        ...prev,
        isValidating: true,
        _validationCount: 1,
        _arrayVersion: 1,
        _fieldValidatorErrors: [[{ message: 'Reset me' }]],
        _fieldValidatorErrorSourceEvents: ['change'],
      }))

      expect(field._getBaseMeta()).not.toBe(defaultInternalBaseFieldMeta)

      form.resetField('name')

      expect(form.getFieldValue('name')).toEqual('hi')
      expect(field._getBaseMeta()).toBe(defaultInternalBaseFieldMeta)
    })

    it('recursively resets descendant fields without replacing them', () => {
      const form = new InternalFormApi({
        defaultValues: { person: { name: 'Alice' } },
      })
      const parent = form._getOrCreateFieldApi({ name: 'person' })
      const child = form._getOrCreateFieldApi({ name: 'person.name' })
      parent._register()
      child._register()

      child.handleChange('Bob')
      child.handleBlur()

      expect(parent._getBaseMeta()).not.toBe(defaultInternalBaseFieldMeta)
      expect(child._getBaseMeta()).not.toBe(defaultInternalBaseFieldMeta)

      form.resetField('person')

      expect(form.getFieldValue('person')).toEqual({ name: 'Alice' })
      expect(form._tryGetFieldApi('person')).toBe(parent)
      expect(form._tryGetFieldApi('person.name')).toBe(child)
      expect(parent._isKilled).toBe(false)
      expect(child._isKilled).toBe(false)
      expect(parent._isMounted).toBe(true)
      expect(child._isMounted).toBe(true)
      expect(parent._getBaseMeta()).toBe(defaultInternalBaseFieldMeta)
      expect(child._getBaseMeta()).toBe(defaultInternalBaseFieldMeta)
      expect(form.state.isTouched).toBe(false)
    })

    it('deletes a field through an explicit field override', () => {
      const form = new InternalFormApi({ defaultValues: { name: '' } })
      const field = form._getOrCreateFieldApi({ name: 'name' })

      form.deleteField('name', { fieldApiOverride: field })

      expect(form._tryGetFieldApi('name')).toBeNull()
    })

    it('ignores deleting a field that has not been created', () => {
      const form = new InternalFormApi({ defaultValues: { name: '' } })

      form.deleteField('name')

      expect(form.state.values).toEqual({ name: '' })
    })
  })

  describe('event error cleanup', () => {
    it('clears form-level submit errors when any field changes', async () => {
      const form = new InternalFormApi({
        defaultValues: { name: '', email: '' },
        onSubmit: ({ createValidationError }) =>
          createValidationError('Submission failed'),
      })
      const field = form._getOrCreateFieldApi({ name: 'name' })

      await form.handleSubmit()
      expect(form.state.errors).toEqual([
        expect.objectContaining({ message: 'Submission failed' }),
      ])

      field.handleChange('Alice')

      expect(form.state.errors).toEqual([])
    })

    it('clears form-level submit errors when any field blurs', async () => {
      const form = new InternalFormApi({
        defaultValues: { name: '', email: '' },
        onSubmit: ({ createValidationError }) =>
          createValidationError('Submission failed'),
      })
      const field = form._getOrCreateFieldApi({ name: 'name' })

      await form.handleSubmit()
      expect(form.state.errors).toEqual([
        expect.objectContaining({ message: 'Submission failed' }),
      ])

      field.handleBlur()

      expect(form.state.errors).toEqual([])
    })

    it('clears form-level submit-only validator errors when any field changes', async () => {
      const form = new InternalFormApi({
        defaultValues: { name: '', email: '' },
        validators: [
          {
            run: () => 'Submit-only validator failed',
            triggers: [],
          },
        ],
      })
      const field = form._getOrCreateFieldApi({ name: 'name' })

      await form.handleSubmit()
      expect(form.state.errors).toEqual([
        { message: 'Submit-only validator failed' },
      ])

      field.handleChange('Alice')

      expect(form.state.errors).toEqual([])
    })

    it('clears form-level submit validator errors when the validator does not run on change', async () => {
      const form = new InternalFormApi({
        defaultValues: { name: '', email: '' },
        validators: [
          {
            run: () => 'Submit or blur validator failed',
            triggers: ['blur'],
          },
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

    it('does not clear non-submit-sourced validator errors on change', async () => {
      const form = new InternalFormApi({
        defaultValues: { name: '', email: '' },
        validators: [
          {
            run: () => 'Blur validator failed',
            triggers: ['blur'],
          },
        ],
      })
      const field = form._getOrCreateFieldApi({ name: 'name' })

      await form.validate('blur')
      expect(form.state.errors).toEqual([{ message: 'Blur validator failed' }])

      field.handleChange('Alice')

      expect(form.state.errors).toEqual([{ message: 'Blur validator failed' }])
    })

    it('does not event-clear submit errors when the validator runs on change', async () => {
      const form = new InternalFormApi({
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
      const field = form._getOrCreateFieldApi({ name: 'name' })

      await form.handleSubmit()
      expect(form.state.errors).toEqual([
        { message: 'Submit validator failed' },
      ])

      field.handleChange('Alice')

      await vi.waitFor(() => {
        expect(form.state.errors).toEqual([
          { message: 'Change validator failed' },
        ])
      })
    })

    it('clears submit errors when the validator conditionally does not run on change', async () => {
      const form = new InternalFormApi({
        defaultValues: { name: '', email: '' },
        validators: [
          {
            run: () => 'Submit validator failed',
            triggers: [{ trigger: 'change', when: false }],
          },
        ],
      })
      const field = form._getOrCreateFieldApi({ name: 'name' })

      await form.handleSubmit()
      expect(form.state.errors).toEqual([
        { message: 'Submit validator failed' },
      ])

      field.handleChange('Alice')

      expect(form.state.errors).toEqual([])
    })

    it('only clears field-level submit errors for the field that changes', async () => {
      const form = new InternalFormApi({
        defaultValues: { name: '', email: '' },
        onSubmit: ({ createValidationError }) =>
          createValidationError({
            fields: {
              name: 'Name is required',
              email: 'Email is required',
            },
          }),
      })
      const nameField = form._getOrCreateFieldApi({ name: 'name' })
      const emailField = form._getOrCreateFieldApi({ name: 'email' })
      void nameField.atom
      void emailField.atom

      await form.handleSubmit()
      expect(nameField.errors).toEqual([{ message: 'Name is required' }])
      expect(emailField.errors).toEqual([{ message: 'Email is required' }])

      nameField.handleChange('Alice')

      expect(nameField.errors).toEqual([])
      expect(emailField.errors).toEqual([{ message: 'Email is required' }])
    })

    it('only clears field-level submit errors for the field that blurs', async () => {
      const form = new InternalFormApi({
        defaultValues: { name: '', email: '' },
        onSubmit: ({ createValidationError }) =>
          createValidationError({
            fields: {
              name: 'Name is required',
              email: 'Email is required',
            },
          }),
      })
      const nameField = form._getOrCreateFieldApi({ name: 'name' })
      const emailField = form._getOrCreateFieldApi({ name: 'email' })

      await form.handleSubmit()
      expect(nameField.errors).toEqual([{ message: 'Name is required' }])
      expect(emailField.errors).toEqual([{ message: 'Email is required' }])

      nameField.handleBlur()

      expect(nameField.errors).toEqual([])
      expect(emailField.errors).toEqual([{ message: 'Email is required' }])
    })

    it('clears field-level submit-only validator errors for the field that changes', async () => {
      const form = new InternalFormApi({
        defaultValues: { name: '', email: '' },
      })
      const nameField = form._getOrCreateFieldApi({
        name: 'name',
        validators: [
          {
            run: () => 'Name is required',
            triggers: [],
          },
        ],
      })
      const emailField = form._getOrCreateFieldApi({
        name: 'email',
        validators: [
          {
            run: () => 'Email is required',
            triggers: [],
          },
        ],
      })
      void nameField.atom
      void emailField.atom

      await form.handleSubmit()
      expect(nameField.errors).toEqual([{ message: 'Name is required' }])
      expect(emailField.errors).toEqual([{ message: 'Email is required' }])

      nameField.handleChange('Alice')

      expect(nameField.errors).toEqual([])
      expect(emailField.errors).toEqual([{ message: 'Email is required' }])
    })

    it('clears field-level submit validator errors when the validator does not run on change', async () => {
      const form = new InternalFormApi({
        defaultValues: { name: '', email: '' },
      })
      const nameField = form._getOrCreateFieldApi({
        name: 'name',
        validators: [
          {
            run: () => 'Name is required',
            triggers: ['blur'],
          },
        ],
      })
      const emailField = form._getOrCreateFieldApi({
        name: 'email',
        validators: [
          {
            run: () => 'Email is required',
            triggers: ['blur'],
          },
        ],
      })
      void nameField.atom
      void emailField.atom

      await form.handleSubmit()
      expect(nameField.errors).toEqual([{ message: 'Name is required' }])
      expect(emailField.errors).toEqual([{ message: 'Email is required' }])

      nameField.handleChange('Alice')

      expect(nameField.errors).toEqual([])
      expect(emailField.errors).toEqual([{ message: 'Email is required' }])
    })

    it('does not clear non-submit-sourced field validator errors on change', async () => {
      const form = new InternalFormApi({
        defaultValues: { name: '' },
      })
      const field = form._getOrCreateFieldApi({
        name: 'name',
        validators: [
          {
            run: () => 'Name is required',
            triggers: ['blur'],
          },
        ],
      })
      void field.atom

      await field._runFieldValidation('blur')
      expect(field.errors).toEqual([{ message: 'Name is required' }])

      field.handleChange('Alice')

      expect(field.errors).toEqual([{ message: 'Name is required' }])
    })

    it('does not event-clear field validator errors when the validator runs on change', async () => {
      const form = new InternalFormApi({
        defaultValues: { name: '' },
      })
      const field = form._getOrCreateFieldApi({
        name: 'name',
        validators: [
          {
            run: ({ event }: { event: string }) =>
              event === 'submit'
                ? 'Submit field validator failed'
                : 'Change field validator failed',
            triggers: ['change'],
          },
        ],
      })
      void field.atom

      await form.handleSubmit()
      expect(field.errors).toEqual([
        { message: 'Submit field validator failed' },
      ])

      field.handleChange('Alice')

      await vi.waitFor(() => {
        expect(field.errors).toEqual([
          { message: 'Change field validator failed' },
        ])
      })
    })

    it('clears field submit errors when the validator conditionally does not run on change', async () => {
      const form = new InternalFormApi({
        defaultValues: { name: '' },
      })
      const field = form._getOrCreateFieldApi({
        name: 'name',
        validators: [
          {
            run: () => 'Submit field validator failed',
            triggers: [{ trigger: 'change', when: false }],
          },
        ],
      })
      void field.atom

      await form.handleSubmit()
      expect(field.errors).toEqual([
        { message: 'Submit field validator failed' },
      ])

      field.handleChange('Alice')

      expect(field.errors).toEqual([])
    })
  })

  describe('deleteField ', () => {
    it('unmounts the field atom', () => {
      const form = new InternalFormApi({ defaultValues: { name: '' } })
      const field = form._getOrCreateFieldApi({ name: 'name' })
      field._register()
      expect(field._isMounted).toBe(true)
      form.deleteField('name', { fieldApiOverride: field })
      expect(field._isMounted).toBe(false)
    })

    it('also unmounts child field atoms', () => {
      const form = new InternalFormApi({ defaultValues: { a: { b: '' } } })
      const parent = form._getOrCreateFieldApi({ name: 'a' })
      const child = form._getOrCreateFieldApi({ name: 'a.b' })
      void parent.atom
      void child.atom
      form.deleteField('a', { fieldApiOverride: parent })
      expect(parent._isMounted).toBe(false)
      expect(child._isMounted).toBe(false)
    })
  })
})
