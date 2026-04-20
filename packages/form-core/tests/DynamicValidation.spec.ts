import { describe, expect, it, vi } from 'vitest'
import { z } from 'zod'
import { FieldApi, FormApi } from '../src/index'
import { defaultValidationLogic, revalidateLogic } from '../src/ValidationLogic'
import { sleep } from './utils'
import type {
  ValidationLogicFn,
  ValidationLogicProps,
  ValidationLogicValidatorsFn,
} from '../src/ValidationLogic'

describe('custom validation', () => {
  it('should handle default validation logic', async () => {
    const form = new FormApi({
      defaultValues: {
        name: '',
      },
      validationLogic: defaultValidationLogic,
      validators: {
        onChange: z.object({
          name: z.string().min(3, 'Name must be at least 3 characters long'),
        }),
      },
    })

    form.mount()

    const field = new FieldApi({
      form,
      name: 'name',
    })

    field.mount()

    expect(field.getValue()).toBe('')
    // onChange validation doesn't run on mount, so errorMap should be empty
    expect(field.state.meta.errorMap.onChange).toBe(undefined)

    // Trigger onChange validation by setting a value
    field.setValue('Jo')
    expect(field.state.meta.errorMap.onChange).toMatchObject([
      { message: 'Name must be at least 3 characters long' },
    ])
    await form.handleSubmit()

    expect(field.state.meta.errorMap.onChange).toMatchObject([
      { message: 'Name must be at least 3 characters long' },
    ])

    field.setValue('Joe123')

    expect(field.state.meta.errorMap.onChange).toBe(undefined)
  })

  it('rhf validation should work as-expected', async () => {
    const form = new FormApi({
      defaultValues: {
        name: '',
      },
      validationLogic: revalidateLogic(),
      validators: {
        onDynamic: z.object({
          name: z.string().min(3, 'Name must be at least 3 characters long'),
        }),
      },
    })

    form.mount()

    const field = new FieldApi({
      form,
      name: 'name',
    })

    field.mount()

    expect(field.getValue()).toBe('')
    expect(field.state.meta.errorMap.onDynamic).toBe(undefined)

    field.setValue('Jo')

    // RHF logic: should not validate on change before first submission
    expect(field.state.meta.errorMap.onDynamic).toBe(undefined)

    await form.handleSubmit()

    // After submit, should show validation error
    expect(field.state.meta.errorMap.onDynamic).toMatchObject([
      { message: 'Name must be at least 3 characters long' },
    ])

    field.setValue('Joe123')

    // After submit, should validate on change and clear error
    expect(field.state.meta.errorMap.onDynamic).toBe(undefined)
  })

  it('rhf validation should work as-expected with async validators', async () => {
    let resolve = () => {}
    const promise = new Promise<void>((res) => {
      resolve = res
    })

    const form = new FormApi({
      defaultValues: {
        name: '',
      },
      validationLogic: revalidateLogic(),
      validators: {
        onDynamicAsync: async () => {
          await promise
          return 'There was an error'
        },
      },
    })

    form.mount()

    expect(form.state.errorMap.onDynamic).toBe(undefined)

    const promise2 = form.handleSubmit()

    resolve()
    await promise
    await promise2

    expect(form.state.errorMap.onDynamic).toBe('There was an error')
  })

  it('rhf validation should handle default validators as well', async () => {
    const form = new FormApi({
      defaultValues: {
        name: '',
      },
      validationLogic: revalidateLogic(),
      validators: {
        onChange: z.object({
          name: z.string().min(3, 'Name must be at least 3 characters long'),
        }),
      },
    })

    form.mount()

    const field = new FieldApi({
      form,
      name: 'name',
    })

    field.mount()
    expect(field.getValue()).toBe('')
    expect(field.state.meta.errorMap.onChange).toBe(undefined)
    field.setValue('Jo')
    expect(field.state.meta.errorMap.onChange).toMatchObject([
      { message: 'Name must be at least 3 characters long' },
    ])
  })

  it('rhf validation should handle `mode` and `reValidateMode`', async () => {
    const form = new FormApi({
      defaultValues: {
        name: '',
      },
      validationLogic: revalidateLogic({
        mode: 'change',
        modeAfterSubmission: 'blur',
      }),
      validators: {
        onDynamic: z.object({
          name: z.string().min(3, 'Name must be at least 3 characters long'),
        }),
      },
    })

    form.mount()

    const field = new FieldApi({
      form,
      name: 'name',
    })

    field.mount()
    expect(field.getValue()).toBe('')
    expect(field.state.meta.errorMap.onDynamic).toBe(undefined)
    field.setValue('Jo')
    expect(field.state.meta.errorMap.onDynamic).toMatchObject([
      { message: 'Name must be at least 3 characters long' },
    ])

    await form.handleSubmit()

    expect(field.state.meta.errorMap.onDynamic).toMatchObject([
      { message: 'Name must be at least 3 characters long' },
    ])

    field.setValue('Joe123')

    expect(field.state.meta.errorMap.onDynamic).toMatchObject([
      { message: 'Name must be at least 3 characters long' },
    ])

    field.handleBlur()
    expect(field.state.meta.errorMap.onDynamic).toBe(undefined)
  })

  it('rhf validation should work for fields as well', async () => {
    const form = new FormApi({
      defaultValues: {
        name: '',
      },
      validationLogic: revalidateLogic(),
    })

    form.mount()

    const field = new FieldApi({
      form,
      name: 'name',
      validators: {
        onDynamic: z.string().min(3, 'Name must be at least 3 characters long'),
      },
    })

    field.mount()

    expect(field.getValue()).toBe('')
    expect(field.state.meta.errorMap.onDynamic).toBe(undefined)

    field.setValue('Jo')
    expect(field.state.meta.errorMap.onDynamic).toBe(undefined)

    await form.handleSubmit()

    expect(field.state.meta.errorMap.onDynamic).toMatchObject([
      { message: 'Name must be at least 3 characters long' },
    ])

    field.setValue('Joe123')

    expect(field.state.meta.errorMap.onDynamic).toBe(undefined)
  })

  it('should pass field name to revalidate logic', async () => {
    const changeTarget: (string | undefined)[] = []
    const blurTarget: (string | undefined)[] = []
    const submitTarget: (string | undefined)[] = []
    const mountTarget: (string | undefined)[] = []

    const validationLogic: ValidationLogicFn = (props) => {
      if (props.event.type === 'mount') {
        mountTarget.push(props.event.fieldName)
      } else if (props.event.type === 'change') {
        changeTarget.push(props.event.fieldName)
      } else if (props.event.type === 'blur') {
        blurTarget.push(props.event.fieldName)
      } else if (props.event.type === 'submit') {
        submitTarget.push(props.event.fieldName)
      }

      const validatorNames = Object.keys(props.validators ?? {})
      if (validatorNames.length === 0) {
        // No validators is a valid case, just return
        return props.runValidation({
          validators: [],
          form: props.form,
        })
      }

      return props.runValidation({
        validators: [
          {
            fn: props.event.async
              ? props.validators!['onDynamicAsync']
              : props.validators!['onDynamic'],
            cause: 'dynamic',
          },
        ],
        form: props.form,
      })
    }

    const form = new FormApi({
      defaultValues: {
        one: '',
        two: '',
      },
      validationLogic,
    })

    form.mount()

    const fieldOne = new FieldApi({
      form,
      name: 'one',
    })

    fieldOne.mount()
    expect(mountTarget).toEqual([])

    fieldOne.setValue('test')
    expect(changeTarget).toEqual(expect.arrayContaining(['one']))

    fieldOne.handleBlur()
    expect(blurTarget).toEqual(expect.arrayContaining(['one']))

    await form.handleSubmit()
    expect(submitTarget).toEqual(
      // validate is called twice on submit (validateAllFields, validate)
      expect.arrayContaining(['one', 'one', undefined, undefined]),
    )
  })

  describe('customised field-level validation logic', () => {
    const validationLogic: ValidationLogicFn = (props) => {
      const validatorNames = Object.keys(props.validators ?? {})
      if (validatorNames.length === 0) {
        // No validators is a valid case, just return
        return props.runValidation({
          validators: [],
          form: props.form,
        })
      }

      let validators: ValidationLogicValidatorsFn[] = []
      defaultValidationLogic({
        ...props,
        runValidation: (vProps) => {
          validators =
            vProps.validators.slice() as ValidationLogicValidatorsFn[]
        },
      })

      let addDynamicValidator = props.event.type === 'submit'
      if (!addDynamicValidator) {
        const hasFormSubmitted = props.form.state.submissionAttempts > 0
        const modesToWatch: ValidationLogicProps['event']['type'][] =
          hasFormSubmitted
            ? ['change']
            : props.event.fieldName
              ? props.form.state.fieldMeta[props.event.fieldName]?.isBlurred
                ? ['change', 'blur']
                : ['blur']
              : ['blur']
        addDynamicValidator = modesToWatch.includes(props.event.type)
      }
      if (addDynamicValidator) {
        validators.push({
          fn: props.event.async
            ? props.validators!['onDynamicAsync']
            : props.validators!['onDynamic'],
          cause: 'dynamic',
        })
      }

      return props.runValidation({
        validators,
        form: props.form,
      })
    }

    it('should support sync validation', async () => {
      const form = new FormApi({
        defaultValues: {
          firstName: '',
          lastName: '',
        },
        validationLogic,
      })
      form.mount()

      const fieldFirstName = new FieldApi({
        form,
        name: 'firstName',
        validators: {
          onDynamic: ({ value }) =>
            value.length >= 3
              ? undefined
              : 'First name must be at least 3 characters long',
        },
      })
      fieldFirstName.mount()

      const fieldLastName = new FieldApi({
        form,
        name: 'lastName',
        validators: {
          onDynamic: ({ value }) =>
            value.length >= 3
              ? undefined
              : 'Last name must be at least 3 characters long',
        },
      })
      fieldLastName.mount()

      expect(fieldFirstName.state.value).toBe('')
      expect(fieldFirstName.state.meta.errorMap.onDynamic).toBe(undefined)

      // Should not validate on change initially
      fieldFirstName.handleChange('Jo')
      expect(fieldFirstName.state.meta.errorMap.onDynamic).toBe(undefined)

      // But validation should occur immediately on blur
      fieldFirstName.handleBlur()
      expect(fieldFirstName.state.meta.errorMap.onDynamic).toBe(
        'First name must be at least 3 characters long',
      )

      // And after that point, validation should occur on change
      fieldFirstName.handleChange('Matt')
      expect(fieldFirstName.state.meta.errorMap.onDynamic).toBe(undefined)

      // This field hasn't been touched, so it shouldn't have an error
      expect(fieldLastName.state.value).toBe('')
      expect(fieldLastName.state.meta.errorMap.onDynamic).toBe(undefined)

      // But after form submission, it should immediately have an error
      await form.handleSubmit()
      expect(fieldLastName.state.meta.errorMap.onDynamic).toBe(
        'Last name must be at least 3 characters long',
      )

      // And it should immediately validate on change now
      fieldLastName.handleChange('Smith')
      expect(fieldLastName.state.meta.errorMap.onDynamic).toBe(undefined)
    })

    it('should support async validation', async () => {
      vi.useFakeTimers()

      const form = new FormApi({
        defaultValues: {
          firstName: '',
          lastName: '',
        },
        validationLogic,
      })
      form.mount()

      const fieldFirstName = new FieldApi({
        form,
        name: 'firstName',
        validators: {
          onDynamicAsync: async ({ value }) => {
            await sleep(100)
            return value.length >= 3
              ? undefined
              : 'First name must be at least 3 characters long'
          },
        },
      })
      fieldFirstName.mount()

      const fieldLastName = new FieldApi({
        form,
        name: 'lastName',
        validators: {
          onDynamicAsync: async ({ value }) => {
            await sleep(100)
            return value.length >= 3
              ? undefined
              : 'Last name must be at least 3 characters long'
          },
        },
      })
      fieldLastName.mount()

      expect(fieldFirstName.state.value).toBe('')
      expect(fieldFirstName.state.meta.errorMap.onDynamic).toBe(undefined)

      // Should not validate on change initially
      fieldFirstName.handleChange('Jo')
      expect(fieldFirstName.state.meta.errorMap.onDynamic).toBe(undefined)

      // But validation should occur immediately on blur
      fieldFirstName.handleBlur()
      await vi.runAllTimersAsync()
      expect(fieldFirstName.state.meta.errorMap.onDynamic).toBe(
        'First name must be at least 3 characters long',
      )

      // And after that point, validation should occur on change
      fieldFirstName.handleChange('Matt')
      await vi.runAllTimersAsync()
      expect(fieldFirstName.state.meta.errorMap.onDynamic).toBe(undefined)

      // This field hasn't been touched, so it shouldn't have an error
      expect(fieldLastName.state.value).toBe('')
      expect(fieldLastName.state.meta.errorMap.onDynamic).toBe(undefined)

      // But after form submission, it should immediately have an error
      const submitPromise = form.handleSubmit()
      await vi.runAllTimersAsync()
      await submitPromise
      expect(fieldLastName.state.meta.errorMap.onDynamic).toBe(
        'Last name must be at least 3 characters long',
      )

      // And it should immediately validate on change now
      fieldLastName.handleChange('Smith')
      await vi.runAllTimersAsync()
      expect(fieldLastName.state.meta.errorMap.onDynamic).toBe(undefined)
    })
  })
})
