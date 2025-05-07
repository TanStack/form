import { expectTypeOf, it } from 'vitest'
import { z } from 'zod'
import { FormApi } from '../src'
import type {
  GlobalFormValidationError,
  StandardSchemaV1Issue,
  ValidationError,
  ValidationErrorMap,
} from '../src'

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

  expectTypeOf(errors.form.errorMap).toEqualTypeOf<{
    onBlur?: { onBlur: true; onBlurNumber: number } | 'onBlurAsync'
    onChange?: readonly ['onChange'] | 'onChangeAsync'
    onMount?: 10
    onSubmit?: 'onSubmit' | 'onSubmitAsync'
    onServer?: undefined
  }>()

  expectTypeOf(errors.form.errors).toEqualTypeOf<
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
  >()

  expectTypeOf(errors.fields).toEqualTypeOf<{
    firstName: {
      errors: ValidationError[]
      errorMap: ValidationErrorMap
    }
    lastName: {
      errors: ValidationError[]
      errorMap: ValidationErrorMap
    }
  }>()
})

it('should type handleSubmit as never when onSubmitMeta is not passed', () => {
  const form = new FormApi({
    defaultValues: {
      name: 'test',
    },
  } as const)

  expectTypeOf(form.handleSubmit).toEqualTypeOf<{
    (): Promise<void>
    (submitMeta: never): Promise<void>
  }>()
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

  expectTypeOf(form.handleSubmit).toEqualTypeOf<{
    (): Promise<void>
    (submitMeta: OnSubmitMeta): Promise<void>
  }>()
})

type FormLevelStandardSchemaIssue = {
  form: Record<string, StandardSchemaV1Issue[]>
  fields: Record<string, StandardSchemaV1Issue[]>
}

it('should only have form-level error types returned from parseFieldValuesWithSchema and parseFieldValuesWithSchemaAsync', () => {
  const form = new FormApi({
    defaultValues: { name: '' },
  })
  form.mount()

  const schema = z.object({
    name: z.string(),
  })
  // assert that it doesn't think it's a field-level error
  expectTypeOf(form.parseValuesWithSchema(schema)).toEqualTypeOf<
    FormLevelStandardSchemaIssue | undefined
  >()
  expectTypeOf(form.parseValuesWithSchemaAsync(schema)).toEqualTypeOf<
    Promise<FormLevelStandardSchemaIssue | undefined>
  >()
})

it("should allow setting manual errors according to the validator's return type", () => {
  type FormData = {
    firstName: string
    lastName: string
  }

  const form = new FormApi({
    defaultValues: {} as FormData,
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

  form.setErrorMap({
    onMount: 10,
    onChange: ['onChange'],
  })

  expectTypeOf(form.setErrorMap).parameter(0).toEqualTypeOf<{
    onMount: 10 | undefined | GlobalFormValidationError<FormData>
    onChange:
      | readonly ['onChange']
      | 'onChangeAsync'
      | undefined
      | GlobalFormValidationError<FormData>
    onBlur:
      | { onBlur: true; onBlurNumber: number }
      | 'onBlurAsync'
      | undefined
      | GlobalFormValidationError<FormData>
    onSubmit:
      | 'onSubmit'
      | 'onSubmitAsync'
      | undefined
      | GlobalFormValidationError<FormData>
    onServer: undefined
  }>
})

it('should allow setting field errors from the global form error map', () => {
  type FormData = {
    firstName: string
    lastName: string
  }

  const form = new FormApi({
    defaultValues: {} as FormData,
  })

  form.setErrorMap({
    onChange: {
      fields: {
        firstName: 'error',
        // @ts-expect-error
        nonExistentField: 'error',
      },
    },
  })
})

it('should not allow setting manual errors if no validator is specified', () => {
  type FormData = {
    firstName: string
    lastName: string
  }
  const form = new FormApi({
    defaultValues: {} as FormData,
  })

  expectTypeOf(form.setErrorMap).parameter(0).toEqualTypeOf<{
    onMount: undefined | GlobalFormValidationError<FormData>
    onChange: undefined | GlobalFormValidationError<FormData>
    onBlur: undefined | GlobalFormValidationError<FormData>
    onSubmit: undefined | GlobalFormValidationError<FormData>
    onServer: undefined
  }>
})
