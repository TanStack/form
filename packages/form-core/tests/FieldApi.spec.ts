import { describe, expect, it, vi } from 'vitest'
import { FieldApi, FormApi } from '../src/index'
import { sleep } from './utils'

describe('field api', () => {
  it('should have an initial value', () => {
    const form = new FormApi({
      defaultValues: {
        name: 'test',
      },
    })

    const field = new FieldApi({
      form,
      name: 'name',
    })

    expect(field.getValue()).toBe('test')
  })

  it('should use field default value first', () => {
    const form = new FormApi({
      defaultValues: {
        name: 'test',
      },
    })

    const field = new FieldApi({
      form,
      defaultValue: 'other',
      name: 'name',
    })

    expect(field.getValue()).toBe('other')
  })

  it('should get default meta', () => {
    const form = new FormApi()
    const field = new FieldApi({
      form,
      name: 'name',
    })

    expect(field.getMeta()).toEqual({
      isTouched: false,
      isValidating: false,
      isPristine: true,
      isDirty: false,
      errors: [],
      errorMap: {},
    })
  })

  it('should allow to set default meta', () => {
    const form = new FormApi()
    const field = new FieldApi({
      form,
      name: 'name',
      defaultMeta: { isTouched: true, isDirty: true, isPristine: false },
    })

    expect(field.getMeta()).toEqual({
      isTouched: true,
      isValidating: false,
      isDirty: true,
      isPristine: false,
      errors: [],
      errorMap: {},
    })
  })

  it('should set a value correctly', () => {
    const form = new FormApi({
      defaultValues: {
        name: 'test',
      },
    })

    const field = new FieldApi({
      form,
      name: 'name',
    })

    field.setValue('other')

    expect(field.getValue()).toBe('other')
  })

  it('should push an array value correctly', () => {
    const form = new FormApi({
      defaultValues: {
        names: ['one'],
      },
    })

    const field = new FieldApi({
      form,
      name: 'names',
    })

    field.pushValue('other')

    expect(field.getValue()).toStrictEqual(['one', 'other'])
  })

  it('should run onChange validation when pushing an array fields value', async () => {
    const form = new FormApi({
      defaultValues: {
        names: ['test'],
      },
    })
    form.mount()

    const field = new FieldApi({
      form,
      name: 'names',
      validators: {
        onChange: ({ value }) => {
          if (value.length < 3) {
            return 'At least 3 names are required'
          }
          return
        },
      },
    })
    field.mount()

    field.pushValue('other')

    expect(field.getMeta().errors).toStrictEqual([
      'At least 3 names are required',
    ])
  })

  it('should insert a value into an array value correctly', () => {
    const form = new FormApi({
      defaultValues: {
        names: ['one', 'two'],
      },
    })

    const field = new FieldApi({
      form,
      name: 'names',
    })

    field.insertValue(1, 'other')

    expect(field.getValue()).toStrictEqual(['one', 'other', 'two'])
  })

  it('should replace a value into an array correctly', () => {
    const form = new FormApi({
      defaultValues: {
        names: ['one', 'two', 'three'],
      },
    })

    const field = new FieldApi({
      form,
      name: 'names',
    })

    field.replaceValue(1, 'other')

    expect(field.getValue()).toStrictEqual(['one', 'other', 'three'])
  })

  it('should do nothing when replacing a value into an array at an index that does not exist', () => {
    const form = new FormApi({
      defaultValues: {
        names: ['one', 'two', 'three'],
      },
    })

    const field = new FieldApi({
      form,
      name: 'names',
    })

    field.replaceValue(10, 'other')

    expect(field.getValue()).toStrictEqual(['one', 'two', 'three'])
  })

  it('should run onChange validation when inserting an array fields value', () => {
    const form = new FormApi({
      defaultValues: {
        names: ['test'],
      },
    })
    form.mount()

    const field = new FieldApi({
      form,
      name: 'names',
      validators: {
        onChange: ({ value }) => {
          if (value.length < 3) {
            return 'At least 3 names are required'
          }
          return
        },
      },
      defaultMeta: {
        isTouched: true,
      },
    })
    field.mount()

    field.insertValue(1, 'other')

    expect(field.getMeta().errors).toStrictEqual([
      'At least 3 names are required',
    ])
  })

  it('should remove a value from an array value correctly', () => {
    const form = new FormApi({
      defaultValues: {
        names: ['one', 'two'],
      },
    })

    const field = new FieldApi({
      form,
      name: 'names',
    })

    field.removeValue(1)

    expect(field.getValue()).toStrictEqual(['one'])
  })

  it('should run onChange validation when removing an array fields value', async () => {
    const form = new FormApi({
      defaultValues: {
        names: ['test'],
      },
    })
    form.mount()

    const field = new FieldApi({
      form,
      name: 'names',
      validators: {
        onChange: ({ value }) => {
          if (value.length < 3) {
            return 'At least 3 names are required'
          }
          return
        },
      },
      defaultMeta: {
        isTouched: true,
      },
    })
    field.mount()

    await field.removeValue(0)

    expect(field.getMeta().errors).toStrictEqual([
      'At least 3 names are required',
    ])
  })

  it('should remove a subfield from an array field correctly', async () => {
    const form = new FormApi({
      defaultValues: {
        people: [] as Array<{ name: string }>,
      },
    })

    const field = new FieldApi({
      form,
      name: 'people',
    })

    const subFieldValidators = {
      onChange: ({ value }: { value: string }) =>
        value.length === 0 ? 'Required' : null,
    }

    const subField1 = new FieldApi({
      form: field.form,
      name: 'people[0].name',
      defaultValue: '',
      validators: subFieldValidators,
    })

    const subField2 = new FieldApi({
      form: field.form,
      name: 'people[1].name',
      defaultValue: 'hello',
      validators: subFieldValidators,
    })

    const subField3 = new FieldApi({
      form: field.form,
      name: 'people[2].name',
      defaultValue: '',
      validators: subFieldValidators,
    })

    const subField4 = new FieldApi({
      form: field.form,
      name: 'people[3].name',
      defaultValue: 'world',
      validators: subFieldValidators,
    })

    ;[form, field, subField1, subField2, subField3, subField4].forEach((f) =>
      f.mount(),
    )

    await form.handleSubmit()

    expect(subField1.state.meta.errorMap.onChange).toStrictEqual('Required')
    expect(subField2.state.meta.errorMap.onChange).toStrictEqual(undefined)
    expect(subField3.state.meta.errorMap.onChange).toStrictEqual('Required')
    expect(subField4.state.meta.errorMap.onChange).toStrictEqual(undefined)

    await field.removeValue(0 /* subField1 */, { touch: true })

    expect(subField1.state.value).toBe('hello')
    expect(subField1.state.meta.errorMap.onChange).toStrictEqual(undefined)
    expect(subField2.state.value).toBe('')
    expect(subField2.state.meta.errorMap.onChange).toStrictEqual('Required')
    expect(subField3.state.value).toBe('world')
    expect(subField3.state.meta.errorMap.onChange).toStrictEqual(undefined)
    expect(form.getFieldInfo('people[0].name').instance?.state.value).toBe(
      'hello',
    )
    expect(form.getFieldInfo('people[1].name').instance?.state.value).toBe('')
    expect(form.getFieldInfo('people[2].name').instance?.state.value).toBe(
      'world',
    )
  })

  it('should remove remove the last subfield from an array field correctly', async () => {
    const form = new FormApi({
      defaultValues: {
        people: [] as Array<{ name: string }>,
      },
    })

    const field = new FieldApi({
      form,
      name: 'people',
    })

    const subFieldValidators = {
      onChange: ({ value }: { value: string }) =>
        value.length === 0 ? 'Required' : null,
    }

    const subField1 = new FieldApi({
      form: field.form,
      name: 'people[0].name',
      defaultValue: '',
      validators: subFieldValidators,
    })

    ;[form, field, subField1].forEach((f) => f.mount())

    await form.handleSubmit()

    expect(subField1.state.meta.errorMap.onChange).toStrictEqual('Required')

    await field.removeValue(0 /* subField1 */, { touch: true })

    expect(subField1.state.value).toBe(undefined)
    expect(subField1.state.meta.errorMap.onChange).toStrictEqual(undefined)

    expect(form.state.canSubmit).toBe(true)
  })

  it('should swap a value from an array value correctly', () => {
    const form = new FormApi({
      defaultValues: {
        names: ['one', 'two'],
      },
    })

    const field = new FieldApi({
      form,
      name: 'names',
    })

    field.swapValues(0, 1)

    expect(field.getValue()).toStrictEqual(['two', 'one'])
  })

  it('should run onChange validation when swapping an array fields value', () => {
    const form = new FormApi({
      defaultValues: {
        names: ['test', 'test2'],
      },
    })
    form.mount()

    const field = new FieldApi({
      form,
      name: 'names',
      validators: {
        onChange: ({ value }) => {
          if (value.length < 3) {
            return 'At least 3 names are required'
          }
          return
        },
      },
      defaultMeta: {
        isTouched: true,
      },
    })
    field.mount()

    field.swapValues(0, 1)

    expect(field.getMeta().errors).toStrictEqual([
      'At least 3 names are required',
    ])
  })

  it('should move a value from an array value correctly', () => {
    const form = new FormApi({
      defaultValues: {
        names: ['one', 'two', 'three', 'four'],
      },
    })

    const field = new FieldApi({
      form,
      name: 'names',
    })

    field.moveValue(2, 0)

    expect(field.getValue()).toStrictEqual(['three', 'one', 'two', 'four'])
  })

  it('should run onChange validation when moving an array fields value', () => {
    const form = new FormApi({
      defaultValues: {
        names: ['test', 'test2'],
      },
    })
    form.mount()

    const field = new FieldApi({
      form,
      name: 'names',
      validators: {
        onChange: ({ value }) => {
          if (value.length < 3) {
            return 'At least 3 names are required'
          }
          return
        },
      },
      defaultMeta: {
        isTouched: true,
      },
    })
    field.mount()

    field.moveValue(0, 1)

    expect(field.getMeta().errors).toStrictEqual([
      'At least 3 names are required',
    ])
  })

  it('should not throw errors when no meta info is stored on a field and a form re-renders', async () => {
    const form = new FormApi({
      defaultValues: {
        name: 'test',
      },
    })

    const field = new FieldApi({
      form,
      name: 'name',
    })

    field.mount()

    expect(() =>
      form.update({
        defaultValues: {
          name: 'other',
        },
      }),
    ).not.toThrow()
  })

  it('should run validation onChange', () => {
    const form = new FormApi({
      defaultValues: {
        name: 'test',
      },
    })

    const field = new FieldApi({
      form,
      name: 'name',
      validators: {
        onChange: ({ value }) => {
          if (value === 'other') return 'Please enter a different value'
          return
        },
      },
    })

    field.mount()

    expect(field.getMeta().errors.length).toBe(0)
    field.setValue('other', { touch: true })
    expect(field.getMeta().errors).toContain('Please enter a different value')
    expect(field.getMeta().errorMap).toMatchObject({
      onChange: 'Please enter a different value',
    })
  })

  it('should run async validation onChange', async () => {
    vi.useFakeTimers()

    const form = new FormApi({
      defaultValues: {
        name: 'test',
      },
    })

    const field = new FieldApi({
      form,
      name: 'name',
      validators: {
        onChangeAsync: async ({ value }) => {
          await sleep(1000)
          if (value === 'other') return 'Please enter a different value'
          return
        },
      },
    })

    field.mount()

    expect(field.getMeta().errors.length).toBe(0)
    field.setValue('other', { touch: true })
    await vi.runAllTimersAsync()
    expect(field.getMeta().errors).toContain('Please enter a different value')
    expect(field.getMeta().errorMap).toMatchObject({
      onChange: 'Please enter a different value',
    })
  })

  it('should run async validation onChange with debounce', async () => {
    vi.useFakeTimers()
    const sleepMock = vi.fn().mockImplementation(sleep)

    const form = new FormApi({
      defaultValues: {
        name: 'test',
      },
    })

    const field = new FieldApi({
      form,
      name: 'name',
      validators: {
        onChangeAsyncDebounceMs: 1000,
        onChangeAsync: async ({ value }) => {
          await sleepMock(1000)
          if (value === 'other') return 'Please enter a different value'
          return
        },
      },
    })

    field.mount()

    expect(field.getMeta().errors.length).toBe(0)
    field.setValue('other', { touch: true })
    field.setValue('other')
    await vi.runAllTimersAsync()
    // sleepMock will have been called 2 times without onChangeAsyncDebounceMs
    expect(sleepMock).toHaveBeenCalledTimes(1)
    expect(field.getMeta().errors).toContain('Please enter a different value')
    expect(field.getMeta().errorMap).toMatchObject({
      onChange: 'Please enter a different value',
    })
  })

  it('should run async validation onChange with asyncDebounceMs', async () => {
    vi.useFakeTimers()
    const sleepMock = vi.fn().mockImplementation(sleep)

    const form = new FormApi({
      defaultValues: {
        name: 'test',
      },
    })

    const field = new FieldApi({
      form,
      name: 'name',
      asyncDebounceMs: 1000,
      validators: {
        onChangeAsync: async ({ value }) => {
          await sleepMock(1000)
          if (value === 'other') return 'Please enter a different value'
          return
        },
      },
    })

    field.mount()

    expect(field.getMeta().errors.length).toBe(0)
    field.setValue('other', { touch: true })
    field.setValue('other')
    await vi.runAllTimersAsync()
    // sleepMock will have been called 2 times without asyncDebounceMs
    expect(sleepMock).toHaveBeenCalledTimes(1)
    expect(field.getMeta().errors).toContain('Please enter a different value')
    expect(field.getMeta().errorMap).toMatchObject({
      onChange: 'Please enter a different value',
    })
  })

  it('should abort enqueued debounced async validation if sync validation fails in the meantime', async () => {
    vi.useFakeTimers()

    const mockOnChange = vi.fn().mockImplementation(({ value }) => {
      if (value.length < 3) {
        return 'First name must be at least 3 characters'
      }
      return
    })

    const mockOnChangeAsync = vi.fn().mockImplementation(async ({ value }) => {
      return value.includes('error') && 'No "error" allowed in first name'
    })

    const form = new FormApi({
      defaultValues: {
        name: 'test',
      },
    })

    const field = new FieldApi({
      form,
      name: 'name',
      validators: {
        onChange: mockOnChange,
        onChangeAsyncDebounceMs: 500,
        onChangeAsync: mockOnChangeAsync,
      },
    })

    field.mount()

    field.setValue('123', { touch: true })
    expect(mockOnChange).toHaveBeenCalledTimes(1)
    expect(mockOnChangeAsync).toHaveBeenCalledTimes(0)
    expect(field.getMeta().errors).toStrictEqual([])

    // Change value while debounced async validation is enqueued
    field.setValue('12', { touch: true })
    expect(mockOnChange).toHaveBeenCalledTimes(2)
    expect(mockOnChangeAsync).toHaveBeenCalledTimes(0)

    await vi.runAllTimersAsync()

    // Async validation never got called because sync validation failed in the meantime and aborted the async
    expect(mockOnChangeAsync).toHaveBeenCalledTimes(0)
    expect(field.getMeta().errors).toStrictEqual([
      'First name must be at least 3 characters',
    ])
  })

  it("should not remove sync validation errors when async validation doesn't return an error", async () => {
    vi.useFakeTimers()

    const mockOnChange = vi.fn().mockImplementation(({ value }) => {
      if (value.length < 3) {
        return 'First name must be at least 3 characters'
      }
      return
    })

    const mockOnChangeAsync = vi.fn().mockImplementation(async ({ value }) => {
      await sleep(1000)
      return value.includes('error') && 'No "error" allowed in first name'
    })

    const form = new FormApi({
      defaultValues: {
        name: 'test',
      },
    })

    const field = new FieldApi({
      form,
      name: 'name',
      validators: {
        onChange: mockOnChange,
        onChangeAsyncDebounceMs: 500,
        onChangeAsync: mockOnChangeAsync,
      },
    })

    field.mount()

    // Input a valid value, triggers both validations after debounce + sleep
    field.setValue('1234', { touch: true })
    expect(mockOnChange).toHaveBeenCalledTimes(1)
    expect(mockOnChangeAsync).toHaveBeenCalledTimes(0)
    await vi.runAllTimersAsync()
    expect(mockOnChangeAsync).toHaveBeenCalledTimes(1)
    expect(field.getMeta().errors).toStrictEqual([])

    // Input again a valid value
    field.setValue('123', { touch: true })
    expect(mockOnChange).toHaveBeenCalledTimes(2)
    expect(mockOnChangeAsync).toHaveBeenCalledTimes(1)
    expect(field.getMeta().errors).toStrictEqual([])

    // Wait the debounce time, async validation is called
    await vi.advanceTimersByTimeAsync(500)
    expect(mockOnChangeAsync).toHaveBeenCalledTimes(2)

    // Input an invalid value before async validation resolves
    field.setValue('12', { touch: true })
    expect(mockOnChange).toHaveBeenCalledTimes(3)
    expect(field.getMeta().errors).toStrictEqual([
      'First name must be at least 3 characters',
    ])

    // Wait for async validation to resolve
    await vi.runAllTimersAsync()
    expect(field.getMeta().errors).toStrictEqual([
      'First name must be at least 3 characters',
    ])
  })

  it('should run validation onBlur', () => {
    const form = new FormApi({
      defaultValues: {
        name: 'other',
      },
    })

    const field = new FieldApi({
      form,
      name: 'name',
      validators: {
        onBlur: ({ value }) => {
          if (value === 'other') return 'Please enter a different value'
          return
        },
      },
    })

    field.mount()

    field.setValue('other', { touch: true })
    field.validate('blur')
    expect(field.getMeta().errors).toContain('Please enter a different value')
    expect(field.getMeta().errorMap).toMatchObject({
      onBlur: 'Please enter a different value',
    })
  })

  it('should run async validation onBlur', async () => {
    vi.useFakeTimers()

    const form = new FormApi({
      defaultValues: {
        name: 'test',
      },
    })

    const field = new FieldApi({
      form,
      name: 'name',
      validators: {
        onBlurAsync: async ({ value }) => {
          await sleep(1000)
          if (value === 'other') return 'Please enter a different value'
          return
        },
      },
    })

    field.mount()

    expect(field.getMeta().errors.length).toBe(0)
    field.setValue('other', { touch: true })
    field.validate('blur')
    await vi.runAllTimersAsync()
    expect(field.getMeta().errors).toContain('Please enter a different value')
    expect(field.getMeta().errorMap).toMatchObject({
      onBlur: 'Please enter a different value',
    })
  })

  it('should run async validation onBlur with debounce', async () => {
    vi.useFakeTimers()
    const sleepMock = vi.fn().mockImplementation(sleep)

    const form = new FormApi({
      defaultValues: {
        name: 'test',
      },
    })

    const field = new FieldApi({
      form,
      name: 'name',
      validators: {
        onBlurAsyncDebounceMs: 1000,
        onBlurAsync: async ({ value }) => {
          await sleepMock(10)
          if (value === 'other') return 'Please enter a different value'
          return
        },
      },
    })

    field.mount()

    expect(field.getMeta().errors.length).toBe(0)
    field.setValue('other', { touch: true })
    field.validate('blur')
    field.validate('blur')
    await vi.runAllTimersAsync()
    // sleepMock will have been called 2 times without onBlurAsyncDebounceMs
    expect(sleepMock).toHaveBeenCalledTimes(1)
    expect(field.getMeta().errors).toContain('Please enter a different value')
    expect(field.getMeta().errorMap).toMatchObject({
      onBlur: 'Please enter a different value',
    })
  })

  it('should run async validation onBlur with asyncDebounceMs', async () => {
    vi.useFakeTimers()
    const sleepMock = vi.fn().mockImplementation(sleep)

    const form = new FormApi({
      defaultValues: {
        name: 'test',
      },
    })

    const field = new FieldApi({
      form,
      name: 'name',
      asyncDebounceMs: 1000,
      validators: {
        onBlurAsync: async ({ value }) => {
          await sleepMock(10)
          if (value === 'other') return 'Please enter a different value'
          return
        },
      },
    })

    field.mount()

    expect(field.getMeta().errors.length).toBe(0)
    field.setValue('other', { touch: true })
    field.validate('blur')
    field.validate('blur')
    await vi.runAllTimersAsync()
    // sleepMock will have been called 2 times without asyncDebounceMs
    expect(sleepMock).toHaveBeenCalledTimes(1)
    expect(field.getMeta().errors).toContain('Please enter a different value')
    expect(field.getMeta().errorMap).toMatchObject({
      onBlur: 'Please enter a different value',
    })
  })

  it('should run async validation onSubmit', async () => {
    vi.useFakeTimers()

    const form = new FormApi({
      defaultValues: {
        name: 'test',
      },
    })

    const field = new FieldApi({
      form,
      name: 'name',
      validators: {
        onSubmitAsync: async ({ value }) => {
          await sleep(1000)
          if (value === 'other') return 'Please enter a different value'
          return
        },
      },
    })

    field.mount()

    expect(field.getMeta().errors.length).toBe(0)
    field.setValue('other', { touch: true })
    field.validate('submit')
    await vi.runAllTimersAsync()
    expect(field.getMeta().errors).toContain('Please enter a different value')
    expect(field.getMeta().errorMap).toMatchObject({
      onSubmit: 'Please enter a different value',
    })
  })

  it('should contain multiple errors when running validation onBlur and onChange', () => {
    const form = new FormApi({
      defaultValues: {
        name: 'other',
      },
    })

    const field = new FieldApi({
      form,
      name: 'name',
      validators: {
        onBlur: ({ value }) => {
          if (value === 'other') return 'Please enter a different value'
          return
        },
        onChange: ({ value }) => {
          if (value === 'other') return 'Please enter a different value'
          return
        },
      },
    })

    field.mount()

    field.setValue('other', { touch: true })
    field.validate('blur')
    expect(field.getMeta().errors).toStrictEqual([
      'Please enter a different value',
      'Please enter a different value',
    ])
    expect(field.getMeta().errorMap).toEqual({
      onBlur: 'Please enter a different value',
      onChange: 'Please enter a different value',
    })
  })

  it('should reset onChange errors when the issue is resolved', () => {
    const form = new FormApi({
      defaultValues: {
        name: 'other',
      },
    })

    const field = new FieldApi({
      form,
      name: 'name',
      validators: {
        onChange: ({ value }) => {
          if (value === 'other') return 'Please enter a different value'
          return
        },
      },
    })

    field.mount()

    field.setValue('other', { touch: true })
    expect(field.getMeta().errors).toStrictEqual([
      'Please enter a different value',
    ])
    expect(field.getMeta().errorMap).toEqual({
      onChange: 'Please enter a different value',
    })
    field.setValue('test', { touch: true })
    expect(field.getMeta().errors).toStrictEqual([])
    expect(field.getMeta().errorMap).toEqual({})
  })

  it('should handle default value on field using state.value', async () => {
    interface Form {
      name: string
    }
    const form = new FormApi<Form>()

    const field = new FieldApi({
      form,
      name: 'name',
      defaultValue: 'test',
    })

    field.mount()

    expect(field.state.value).toBe('test')
  })

  // test the unmounting of the fieldAPI
  it('should preserve value on unmount', () => {
    const form = new FormApi({
      defaultValues: {
        name: 'test',
      },
    })

    const field = new FieldApi({
      form,
      name: 'name',
    })

    const unmount = field.mount()
    unmount()
    expect(form.getFieldInfo(field.name).instance).toBeDefined()
    expect(form.getFieldInfo(field.name)).toBeDefined()
  })

  it('should show onSubmit errors', async () => {
    const form = new FormApi({
      defaultValues: {
        firstName: '',
      },
    })

    const field = new FieldApi({
      form,
      name: 'firstName',
      validators: {
        onSubmit: ({ value }) =>
          value.length > 0 ? undefined : 'first name is required',
      },
    })

    field.mount()

    await form.handleSubmit()
    expect(field.getMeta().errors).toStrictEqual(['first name is required'])
  })

  it('should show onMount errors', async () => {
    const form = new FormApi({
      defaultValues: {
        firstName: '',
      },
    })

    const field = new FieldApi({
      form,
      name: 'firstName',
      validators: {
        onMount: ({ value }) =>
          value.length > 0 ? undefined : 'first name is required',
      },
    })

    form.mount()
    field.mount()

    expect(field.getMeta().errors).toStrictEqual(['first name is required'])
  })

  it('should cancel previous functions from an async validator with an abort signal', async () => {
    vi.useRealTimers()
    const form = new FormApi({
      defaultValues: {
        firstName: '',
      },
    })

    let resolve!: () => void
    const promise = new Promise((r) => {
      resolve = r as never
    })

    const fn = vi.fn()

    const field = new FieldApi({
      form,
      name: 'firstName',
      validators: {
        onChangeAsyncDebounceMs: 0,
        onChangeAsync: async ({ signal }) => {
          await promise
          if (signal.aborted) return
          fn()
          return undefined
        },
      },
    })

    field.mount()

    field.setValue('one', { touch: true })
    // Allow for a micro-tick to allow the promise to resolve
    await sleep(1)
    field.setValue('two', { touch: true })
    resolve()
    await sleep(1)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('should run onChange on a linked field', () => {
    const form = new FormApi({
      defaultValues: {
        password: '',
        confirm_password: '',
      },
    })

    const passField = new FieldApi({
      form,
      name: 'password',
    })

    const passconfirmField = new FieldApi({
      form,
      name: 'confirm_password',
      validators: {
        onChangeListenTo: ['password'],
        onChange: ({ value, fieldApi }) => {
          if (value !== fieldApi.form.getFieldValue('password')) {
            return 'Passwords do not match'
          }
          return undefined
        },
      },
    })

    passField.mount()
    passconfirmField.mount()

    passField.setValue('one', { touch: true })
    expect(passconfirmField.state.meta.errors).toStrictEqual([
      'Passwords do not match',
    ])
    passconfirmField.setValue('one', { touch: true })
    expect(passconfirmField.state.meta.errors).toStrictEqual([])
    passField.setValue('two', { touch: true })
    expect(passconfirmField.state.meta.errors).toStrictEqual([
      'Passwords do not match',
    ])
  })

  it('should run onBlur on a linked field', () => {
    const form = new FormApi({
      defaultValues: {
        password: '',
        confirm_password: '',
      },
    })

    const passField = new FieldApi({
      form,
      name: 'password',
    })

    const passconfirmField = new FieldApi({
      form,
      name: 'confirm_password',
      validators: {
        onBlurListenTo: ['password'],
        onBlur: ({ value, fieldApi }) => {
          if (value !== fieldApi.form.getFieldValue('password')) {
            return 'Passwords do not match'
          }
          return undefined
        },
      },
    })

    passField.mount()
    passconfirmField.mount()

    passField.setValue('one', { touch: true })
    expect(passconfirmField.state.meta.errors).toStrictEqual([])
    passField.handleBlur()
    expect(passconfirmField.state.meta.errors).toStrictEqual([
      'Passwords do not match',
    ])
    passconfirmField.setValue('one', { touch: true })
    expect(passconfirmField.state.meta.errors).toStrictEqual([
      'Passwords do not match',
    ])
    passField.handleBlur()
    expect(passconfirmField.state.meta.errors).toStrictEqual([])
    passField.setValue('two', { touch: true })
    passField.handleBlur()
    expect(passconfirmField.state.meta.errors).toStrictEqual([
      'Passwords do not match',
    ])
  })

  it('should run onChangeAsync on a linked field', async () => {
    vi.useRealTimers()
    let resolve!: () => void
    let promise = new Promise((r) => {
      resolve = r as never
    })

    const fn = vi.fn()

    const form = new FormApi({
      defaultValues: {
        password: '',
        confirm_password: '',
      },
    })

    const passField = new FieldApi({
      form,
      name: 'password',
    })

    const passconfirmField = new FieldApi({
      form,
      name: 'confirm_password',
      validators: {
        onChangeListenTo: ['password'],
        onChangeAsync: async ({ value, fieldApi }) => {
          await promise
          fn()
          if (value !== fieldApi.form.getFieldValue('password')) {
            return 'Passwords do not match'
          }
          return undefined
        },
      },
    })

    passField.mount()
    passconfirmField.mount()

    passField.setValue('one', { touch: true })
    resolve()
    // Allow for a micro-tick to allow the promise to resolve
    await sleep(1)
    expect(passconfirmField.state.meta.errors).toStrictEqual([
      'Passwords do not match',
    ])
    promise = new Promise((r) => {
      resolve = r as never
    })
    passconfirmField.setValue('one', { touch: true })
    resolve()
    // Allow for a micro-tick to allow the promise to resolve
    await sleep(1)
    expect(passconfirmField.state.meta.errors).toStrictEqual([])
    promise = new Promise((r) => {
      resolve = r as never
    })
    passField.setValue('two', { touch: true })
    resolve()
    // Allow for a micro-tick to allow the promise to resolve
    await sleep(1)
    expect(passconfirmField.state.meta.errors).toStrictEqual([
      'Passwords do not match',
    ])
  })
})
