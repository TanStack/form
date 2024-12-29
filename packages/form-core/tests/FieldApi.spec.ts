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

    form.mount()

    const field = new FieldApi({
      form,
      name: 'name',
    })

    field.mount()

    expect(field.getValue()).toBe('test')
  })

  it('should use field default value first', () => {
    const form = new FormApi({
      defaultValues: {
        name: 'test',
      },
    })
    form.mount()

    const field = new FieldApi({
      form,
      defaultValue: 'other',
      name: 'name',
    })

    field.mount()

    expect(field.getValue()).toBe('other')
  })

  it('should get default meta', () => {
    const form = new FormApi()

    form.mount()

    const field = new FieldApi({
      form,
      name: 'name',
    })

    field.mount()

    expect(field.getMeta()).toEqual({
      isTouched: false,
      isBlurred: false,
      isValidating: false,
      isPristine: true,
      isDirty: false,
      errors: [],
      errorMap: {},
    })
  })

  it('should allow to set default meta', () => {
    const form = new FormApi()

    form.mount()

    const field = new FieldApi({
      form,
      name: 'name',
      defaultMeta: {
        isTouched: true,
        isDirty: true,
        isPristine: false,
        isBlurred: true,
      },
    })

    field.mount()

    expect(field.getMeta()).toEqual({
      isTouched: true,
      isBlurred: true,
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

    form.mount()

    const field = new FieldApi({
      form,
      name: 'name',
    })

    field.mount()

    field.setValue('other', {
      dontUpdateMeta: true,
    })

    expect(field.getValue()).toBe('other')
  })

  it('should set isBlurred correctly', () => {
    const form = new FormApi({
      defaultValues: {
        firstName: '',
      },
    })
    form.mount()

    const field = new FieldApi({
      form,
      name: 'firstName',
    })
    field.mount()

    expect(field.getMeta().isBlurred).toBe(false)

    field.setValue('Bob')
    expect(field.getMeta().isBlurred).toBe(false)

    field.handleBlur()
    expect(field.getMeta().isBlurred).toBe(true)
  })

  it('should set isBlurred correctly for arrays', () => {
    const form = new FormApi({
      defaultValues: {
        firstNames: ['Bob'],
      },
    })
    form.mount()

    const field = new FieldApi({
      form,
      name: 'firstNames',
    })
    field.mount()

    expect(field.getMeta().isBlurred).toBe(false)

    field.pushValue('Bill')
    expect(field.getMeta().isBlurred).toBe(false)

    field.handleBlur()
    expect(field.getMeta().isBlurred).toBe(true)
  })

  it('should push an array value correctly', () => {
    const form = new FormApi({
      defaultValues: {
        names: ['one'],
      },
    })

    form.mount()

    const field = new FieldApi({
      form,
      name: 'names',
    })

    field.mount()

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
    expect(field.getMeta().errorMap.onChange).toStrictEqual([
      'At least 3 names are required',
    ])
  })

  it('should insert a value into an array value correctly', () => {
    const form = new FormApi({
      defaultValues: {
        names: ['one', 'two'],
      },
    })

    form.mount()

    const field = new FieldApi({
      form,
      name: 'names',
    })

    field.mount()

    field.insertValue(1, 'other')

    expect(field.getValue()).toStrictEqual(['one', 'other', 'two'])
  })

  it('should replace a value into an array correctly', () => {
    const form = new FormApi({
      defaultValues: {
        names: ['one', 'two', 'three'],
      },
    })

    form.mount()

    const field = new FieldApi({
      form,
      name: 'names',
    })

    field.mount()

    field.replaceValue(1, 'other')

    expect(field.getValue()).toStrictEqual(['one', 'other', 'three'])
  })

  it('should do nothing when replacing a value into an array at an index that does not exist', () => {
    const form = new FormApi({
      defaultValues: {
        names: ['one', 'two', 'three'],
      },
    })

    form.mount()

    const field = new FieldApi({
      form,
      name: 'names',
    })

    field.mount()

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

    form.mount()

    const field = new FieldApi({
      form,
      name: 'names',
    })

    field.mount()

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

    form.mount()
    field.mount()
    subField1.mount()
    subField2.mount()
    subField3.mount()
    subField4.mount()

    await form.handleSubmit()

    expect(subField1.state.meta.errorMap.onChange).toStrictEqual(['Required'])
    expect(subField2.state.meta.errorMap.onChange).toStrictEqual(undefined)
    expect(subField3.state.meta.errorMap.onChange).toStrictEqual(['Required'])
    expect(subField4.state.meta.errorMap.onChange).toStrictEqual(undefined)

    await field.removeValue(0 /* subField1 */)

    expect(subField1.state.value).toBe('hello')
    expect(subField1.state.meta.errorMap.onChange).toStrictEqual(undefined)
    expect(subField2.state.value).toBe('')
    expect(subField2.state.meta.errorMap.onChange).toStrictEqual(['Required'])
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

    form.mount()
    field.mount()
    subField1.mount()

    await form.handleSubmit()

    expect(subField1.state.meta.errorMap.onChange).toStrictEqual(['Required'])

    await field.removeValue(0 /* subField1 */)

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

    form.mount()

    const field = new FieldApi({
      form,
      name: 'names',
    })

    field.mount()

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

    form.mount()

    const field = new FieldApi({
      form,
      name: 'names',
    })

    field.mount()

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

  it('should add a field when the key is numeric but the parent is not an array', () => {
    const form = new FormApi({
      defaultValues: {
        items: {} as Record<number, { quantity: number }>,
      },
    })

    form.mount()

    const field = new FieldApi({
      form,
      name: 'items.2.quantity',
    })

    field.setValue(10)

    expect(form.state.values).toStrictEqual({
      items: {
        2: {
          quantity: 10,
        },
      },
    })
  })

  it('should not throw errors when no meta info is stored on a field and a form re-renders', async () => {
    const form = new FormApi({
      defaultValues: {
        name: 'test',
      },
    })

    form.mount()

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

    form.mount()

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
    field.setValue('other')
    expect(field.getMeta().errors).toContain('Please enter a different value')
    expect(field.getMeta().errorMap).toMatchObject({
      onChange: ['Please enter a different value'],
    })
    field.setValue('nothing')
    expect(field.getMeta().errors.length).toBe(0)
  })

  it('should run async validation onChange', async () => {
    vi.useFakeTimers()

    const form = new FormApi({
      defaultValues: {
        name: 'test',
      },
    })

    form.mount()

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
    field.setValue('other')
    await vi.runAllTimersAsync()
    expect(field.getMeta().errors).toContain('Please enter a different value')
    expect(field.getMeta().errorMap).toMatchObject({
      onChange: ['Please enter a different value'],
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

    form.mount()

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
    field.setValue('other')
    field.setValue('other', {
      dontUpdateMeta: true,
    })
    await vi.runAllTimersAsync()
    // sleepMock will have been called 2 times without onChangeAsyncDebounceMs
    expect(sleepMock).toHaveBeenCalledTimes(1)
    expect(field.getMeta().errors).toContain('Please enter a different value')
    expect(field.getMeta().errorMap).toMatchObject({
      onChange: ['Please enter a different value'],
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

    form.mount()

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
    field.setValue('other')
    field.setValue('other', {
      dontUpdateMeta: true,
    })
    await vi.runAllTimersAsync()
    // sleepMock will have been called 2 times without asyncDebounceMs
    expect(sleepMock).toHaveBeenCalledTimes(1)
    expect(field.getMeta().errors).toContain('Please enter a different value')
    expect(field.getMeta().errorMap).toMatchObject({
      onChange: ['Please enter a different value'],
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

    form.mount()

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

    field.setValue('123')
    expect(mockOnChange).toHaveBeenCalledTimes(1)
    expect(mockOnChangeAsync).toHaveBeenCalledTimes(0)
    expect(field.getMeta().errors).toStrictEqual([])

    // Change value while debounced async validation is enqueued
    field.setValue('12')
    expect(mockOnChange).toHaveBeenCalledTimes(2)
    expect(mockOnChangeAsync).toHaveBeenCalledTimes(0)

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

    form.mount()

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
    field.setValue('1234')
    expect(mockOnChange).toHaveBeenCalledTimes(1)
    expect(mockOnChangeAsync).toHaveBeenCalledTimes(0)
    await vi.runAllTimersAsync()
    expect(mockOnChangeAsync).toHaveBeenCalledTimes(1)
    expect(field.getMeta().errors).toStrictEqual([])

    // Input again a valid value
    field.setValue('123')
    expect(mockOnChange).toHaveBeenCalledTimes(2)
    expect(mockOnChangeAsync).toHaveBeenCalledTimes(1)
    expect(field.getMeta().errors).toStrictEqual([])

    // Wait the debounce time, async validation is called
    await vi.advanceTimersByTimeAsync(500)
    expect(mockOnChangeAsync).toHaveBeenCalledTimes(2)

    // Input an invalid value before async validation resolves
    field.setValue('12')
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

    form.mount()

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

    field.setValue('other')
    field.validate('blur')
    expect(field.getMeta().errors).toContain('Please enter a different value')
    expect(field.getMeta().errorMap).toMatchObject({
      onBlur: ['Please enter a different value'],
    })
  })

  it('should run async validation onBlur', async () => {
    vi.useFakeTimers()

    const form = new FormApi({
      defaultValues: {
        name: 'test',
      },
    })

    form.mount()

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
    field.setValue('other')
    field.validate('blur')
    await vi.runAllTimersAsync()
    expect(field.getMeta().errors).toContain('Please enter a different value')
    expect(field.getMeta().errorMap).toMatchObject({
      onBlur: ['Please enter a different value'],
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

    form.mount()

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
    field.setValue('other')
    field.validate('blur')
    field.validate('blur')
    await vi.runAllTimersAsync()
    // sleepMock will have been called 2 times without onBlurAsyncDebounceMs
    expect(sleepMock).toHaveBeenCalledTimes(1)
    expect(field.getMeta().errors).toContain('Please enter a different value')
    expect(field.getMeta().errorMap).toMatchObject({
      onBlur: ['Please enter a different value'],
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

    form.mount()

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
    field.setValue('other')
    field.validate('blur')
    field.validate('blur')
    await vi.runAllTimersAsync()
    // sleepMock will have been called 2 times without asyncDebounceMs
    expect(sleepMock).toHaveBeenCalledTimes(1)
    expect(field.getMeta().errors).toContain('Please enter a different value')
    expect(field.getMeta().errorMap).toMatchObject({
      onBlur: ['Please enter a different value'],
    })
  })

  it('should run async validation onSubmit', async () => {
    vi.useFakeTimers()

    const form = new FormApi({
      defaultValues: {
        name: 'test',
      },
    })

    form.mount()

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
    field.setValue('other')
    field.validate('submit')
    await vi.runAllTimersAsync()
    expect(field.getMeta().errors).toContain('Please enter a different value')
    expect(field.getMeta().errorMap).toMatchObject({
      onSubmit: ['Please enter a different value'],
    })
  })

  it("should be able to return an array of errors from a validator's validate function", () => {
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
          return value === 'other'
            ? ['Please enter a different value', 'another error']
            : undefined
        },
      },
    })

    field.mount()

    field.setValue('other')
    expect(field.getMeta().errorMap).toEqual({
      onChange: ['Please enter a different value', 'another error'],
    })
    expect(field.getMeta().errors).toStrictEqual([
      'Please enter a different value',
      'another error',
    ])
  })

  it('should merge array of validation errors from different validators', () => {
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
          return value === 'other'
            ? ['Please enter a different value', 'another error']
            : undefined
        },
        onBlur: () => {
          return 'blurError'
        },
      },
    })

    field.mount()

    field.setValue('other')
    expect(field.getMeta().errorMap).toStrictEqual({
      onChange: ['Please enter a different value', 'another error'],
      onMount: undefined,
    })
    expect(field.getMeta().errors).toStrictEqual([
      'Please enter a different value',
      'another error',
    ])

    field.handleBlur()

    expect(field.getMeta().errorMap).toStrictEqual({
      onBlur: ['blurError'],
      onChange: ['Please enter a different value', 'another error'],
      onMount: undefined,
    })

    expect(field.getMeta().errors).toStrictEqual([
      'Please enter a different value',
      'another error',
      'blurError',
    ])
  })

  it('should run listener onChange', () => {
    const form = new FormApi({
      defaultValues: {
        name: 'test',
      },
    })

    form.mount()

    let triggered!: string
    const field = new FieldApi({
      form,
      name: 'name',
      listeners: {
        onChange: ({ value }) => {
          triggered = value
        },
      },
    })

    field.mount()

    field.setValue('other')
    expect(triggered).toStrictEqual('other')
  })

  it('should not run the listener onChange on mount', () => {
    const form = new FormApi({
      defaultValues: {
        name: 'test',
      },
    })

    let triggered!: string
    const field = new FieldApi({
      form,
      name: 'name',
      listeners: {
        onChange: ({ value }) => {
          triggered = value
        },
      },
    })

    field.mount()

    expect(triggered).toStrictEqual(undefined)
  })

  it('should change the form state when running listener onChange', () => {
    const form = new FormApi({
      defaultValues: {
        name: 'foo',
        greet: 'bar',
      },
    })

    form.mount()

    const field = new FieldApi({
      form,
      name: 'name',
      listeners: {
        onChange: ({ value }) => {
          form.setFieldValue('greet', `hello ${value}`)
        },
      },
    })

    field.mount()

    field.setValue('baz')
    expect(form.getFieldValue('name')).toStrictEqual('baz')
    expect(form.getFieldValue('greet')).toStrictEqual('hello baz')
  })

  it('should reset the form on a listener', () => {
    const form = new FormApi({
      defaultValues: {
        name: 'foo',
        greet: 'bar',
      },
    })

    form.mount()

    const field = new FieldApi({
      form,
      name: 'name',
      listeners: {
        onChange: () => {
          form.reset({
            ...form.state.values,
            greet: '',
          })
        },
      },
    })

    field.mount()

    field.setValue('other')
    expect(form.getFieldValue('name')).toStrictEqual('other')
    expect(form.getFieldValue('greet')).toStrictEqual('')
  })

  it('should run listener onBlur', () => {
    const form = new FormApi({
      defaultValues: {
        name: 'test',
      },
    })

    let triggered!: string
    const field = new FieldApi({
      form,
      name: 'name',
      listeners: {
        onBlur: ({ value }) => {
          triggered = value
        },
      },
    })

    field.mount()

    field.handleBlur()
    expect(triggered).toStrictEqual('test')
  })

  it('should run listener onMount', () => {
    const form = new FormApi({
      defaultValues: {
        name: 'test',
      },
    })

    let triggered!: string
    const field = new FieldApi({
      form,
      name: 'name',
      listeners: {
        onMount: ({ value }) => {
          triggered = value
        },
      },
    })

    field.mount()

    expect(triggered).toStrictEqual('test')
  })

  it('should contain multiple errors when running validation onBlur and onChange', () => {
    const form = new FormApi({
      defaultValues: {
        name: 'other',
      },
    })

    form.mount()

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

    field.setValue('other')
    field.validate('blur')
    expect(field.getMeta().errors).toStrictEqual([
      'Please enter a different value',
      'Please enter a different value',
    ])
    expect(field.getMeta().errorMap).toEqual({
      onBlur: ['Please enter a different value'],
      onChange: ['Please enter a different value'],
    })
  })

  it('should reset onChange errors when the issue is resolved', () => {
    const form = new FormApi({
      defaultValues: {
        name: 'other',
      },
    })

    form.mount()

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

    field.setValue('other')
    expect(field.getMeta().errors).toStrictEqual([
      'Please enter a different value',
    ])
    expect(field.getMeta().errorMap).toEqual({
      onChange: ['Please enter a different value'],
    })
    field.setValue('test')
    expect(field.getMeta().errors).toStrictEqual([])
    expect(field.getMeta().errorMap).toEqual({})
  })

  it('should handle default value on field using state.value', async () => {
    interface Form {
      name: string
    }
    const form = new FormApi<Form>()

    form.mount()

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

    form.mount()

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

    form.mount()

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

  it('should disable submit with onMount errors', async () => {
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

    expect(form.state.canSubmit).toBe(false)
  })

  it('should remove onMount errors on a field when its value changes', async () => {
    const form = new FormApi({
      defaultValues: {
        firstName: '',
        lastName: '',
      },
    })

    const firstName = new FieldApi({
      form,
      name: 'firstName',
      validators: {
        onMount: ({ value }) =>
          value.length > 0 ? undefined : 'first name is required',
        onChange: ({ value }) =>
          value.length > 3 ? undefined : 'first name must be at least 4 chars',
      },
    })

    const lastName = new FieldApi({
      form,
      name: 'lastName',
      validators: {
        onMount: ({ value }) =>
          value.length > 0 ? undefined : 'last name is required',
        onChange: ({ value }) =>
          value.length > 3 ? undefined : 'last name must be at least 4 chars',
      },
    })

    form.mount()
    firstName.mount()
    lastName.mount()

    expect(firstName.getMeta().errorMap.onMount).toStrictEqual([
      'first name is required',
    ])
    expect(firstName.getMeta().errors).toStrictEqual(['first name is required'])
    expect(lastName.getMeta().errors).toStrictEqual(['last name is required'])
    expect(lastName.getMeta().errorMap.onMount).toStrictEqual([
      'last name is required',
    ])

    firstName.setValue('firstName')
    expect(firstName.getMeta().errors).toStrictEqual([])
    expect(firstName.getMeta().errorMap.onMount).toStrictEqual(undefined)
    expect(lastName.getMeta().errors).toStrictEqual(['last name is required'])
    expect(lastName.getMeta().errorMap.onMount).toStrictEqual([
      'last name is required',
    ])

    firstName.setValue('f')
    expect(firstName.getMeta().errors).toStrictEqual([
      'first name must be at least 4 chars',
    ])
    expect(firstName.getMeta().errorMap.onMount).toStrictEqual(undefined)
    expect(firstName.getMeta().errorMap.onChange).toStrictEqual([
      'first name must be at least 4 chars',
    ])
  })

  it('should cancel previous functions from an async validator with an abort signal', async () => {
    vi.useFakeTimers()

    const form = new FormApi({
      defaultValues: {
        firstName: '',
      },
    })

    form.mount()

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

    field.setValue('one')
    await vi.runAllTimersAsync()
    field.setValue('two')
    resolve()
    await vi.runAllTimersAsync()
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('should run onChange on a linked field', () => {
    const form = new FormApi({
      defaultValues: {
        password: '',
        confirm_password: '',
      },
    })

    form.mount()

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

    passField.setValue('one')
    expect(passconfirmField.state.meta.errors).toStrictEqual([
      'Passwords do not match',
    ])
    passconfirmField.setValue('one')
    expect(passconfirmField.state.meta.errors).toStrictEqual([])
    passField.setValue('two')
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

    form.mount()

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

    passField.setValue('one')
    expect(passconfirmField.state.meta.errors).toStrictEqual([])
    passField.handleBlur()
    expect(passconfirmField.state.meta.errors).toStrictEqual([
      'Passwords do not match',
    ])
    passconfirmField.setValue('one')
    expect(passconfirmField.state.meta.errors).toStrictEqual([
      'Passwords do not match',
    ])
    passField.handleBlur()
    expect(passconfirmField.state.meta.errors).toStrictEqual([])
    passField.setValue('two')
    passField.handleBlur()
    expect(passconfirmField.state.meta.errors).toStrictEqual([
      'Passwords do not match',
    ])
  })

  it('should run onChangeAsync on a linked field', async () => {
    vi.useFakeTimers()
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

    form.mount()

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

    passField.setValue('one')
    resolve()
    await vi.runAllTimersAsync()
    expect(passconfirmField.state.meta.errors).toStrictEqual([
      'Passwords do not match',
    ])
    promise = new Promise((r) => {
      resolve = r as never
    })
    passconfirmField.setValue('one')
    resolve()
    await vi.runAllTimersAsync()
    expect(passconfirmField.state.meta.errors).toStrictEqual([])
    promise = new Promise((r) => {
      resolve = r as never
    })
    passField.setValue('two')
    resolve()
    await vi.runAllTimersAsync()
    expect(passconfirmField.state.meta.errors).toStrictEqual([
      'Passwords do not match',
    ])
  })

  it('should add  a new value to the fieldApi errorMap', () => {
    interface Form {
      name: string
    }
    const form = new FormApi<Form>()
    form.mount()
    const nameField = new FieldApi({
      form,
      name: 'name',
    })
    nameField.mount()
    nameField.setErrorMap({
      onChange: ["name can't be Josh"],
    })
    expect(nameField.getMeta().errorMap.onChange).toEqual([
      "name can't be Josh",
    ])
  })
  it('should preserve other values in the fieldApi errorMap when adding other values', () => {
    interface Form {
      name: string
    }
    const form = new FormApi<Form>()
    form.mount()
    const nameField = new FieldApi({
      form,
      name: 'name',
    })
    nameField.mount()
    nameField.setErrorMap({
      onChange: ["name can't be Josh"],
    })
    expect(nameField.getMeta().errorMap.onChange).toEqual([
      "name can't be Josh",
    ])
    nameField.setErrorMap({
      onBlur: ['name must begin with uppercase'],
    })
    expect(nameField.getMeta().errorMap.onChange).toEqual([
      "name can't be Josh",
    ])
    expect(nameField.getMeta().errorMap.onBlur).toEqual([
      'name must begin with uppercase',
    ])
  })
  it('should replace errorMap value if it exists in the fieldApi object', () => {
    interface Form {
      name: string
    }
    const form = new FormApi<Form>()
    form.mount()
    const nameField = new FieldApi({
      form,
      name: 'name',
    })
    nameField.mount()
    nameField.setErrorMap({
      onChange: ["name can't be Josh"],
    })
    expect(nameField.getMeta().errorMap.onChange).toEqual([
      "name can't be Josh",
    ])
    nameField.setErrorMap({
      onChange: ['other validation error'],
    })
    expect(nameField.getMeta().errorMap.onChange).toEqual([
      'other validation error',
    ])
  })

  it('should have derived state on first render given defaultMeta', () => {
    const form = new FormApi({
      defaultValues: {
        name: '',
      },
    })
    form.mount()

    const nameField = new FieldApi({
      form,
      name: 'name',
      defaultMeta: {
        errorMap: {
          onChange: ['THERE IS AN ERROR'],
        },
      },
    })

    nameField.mount()
    expect(nameField.getMeta().errors).toEqual(['THERE IS AN ERROR'])
  })
})
