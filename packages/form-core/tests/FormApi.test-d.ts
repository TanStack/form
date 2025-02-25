import { assertType, it } from 'vitest'
import { FormApi } from '../src'
import type { ValidationError, ValidationErrorMap } from '../src'

it('should return all errors matching the right type from getAllErrors', () => {
  const form = new FormApi({
    defaultValues: {
      firstName: '',
      lastName: '',
    },
    validators: {
      onChange: () => ['onChange'] as const,
      onMount: () => 10 as const,
      onBlur: () => ({ onBlur: true as const, onBlurNumber: 1 }),
      onSubmit: () => 'onSubmit' as const,
      onBlurAsync: () => Promise.resolve('onBlurAsync' as const),
      onChangeAsync: () => Promise.resolve('onChangeAsync' as const),
      onSubmitAsync: () => Promise.resolve('onSubmitAsync' as const),
    },
  })

  const errors = form.getAllErrors()

  errors.form.errorMap.onChange

  assertType<{
    onBlur?: { onBlur: true; onBlurNumber: number } | 'onBlurAsync'
    onChange?: readonly ['onChange'] | 'onChangeAsync'
    onMount?: 10
    onSubmit?: 'onSubmit' | 'onSubmitAsync'
    onServer?: undefined
  }>(errors.form.errorMap)

  assertType<
    (
      | readonly ['onChange']
      | 'onChangeAsync'
      | 10
      | 'onSubmit'
      | 'onSubmitAsync'
      | { onBlur: true; onBlurNumber: number }
      | 'onBlurAsync'
      | undefined
    )[]
  >(errors.form.errors)

  assertType<{
    firstName: {
      errors: ValidationError[]
      errorMap: ValidationErrorMap
    }
    lastName: {
      errors: ValidationError[]
      errorMap: ValidationErrorMap
    }
  }>(errors.fields)
})

it('should type handleSubmit as never when onSubmitMeta is not passed', () => {
  const form = new FormApi({
    defaultValues: {
      name: 'test',
    },
  } as const)

  assertType<() => Promise<void>>(form.handleSubmit)
})

type OnSubmitMeta = {
  group: string
}

it('should type handleChange correctly', () => {
  const form = new FormApi({
    defaultValues: {
      name: 'test',
    },
    onSubmitMeta: {} as OnSubmitMeta,
  } as const)

  form.handleSubmit({ group: 'track' })

  assertType<(submitMeta: { group: string }) => Promise<void>>(
    form.handleSubmit,
  )
})
