import { expectTypeOf, it } from 'vitest'
import { z } from 'zod'
import { FormApi } from '../src'
import type {
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

  expectTypeOf(form.setErrorMap).parameter(0).toEqualTypeOf<{
    onMount: 10 | undefined
    onChange: readonly ['onChange'] | 'onChangeAsync' | undefined
    onBlur: { onBlur: true; onBlurNumber: number } | 'onBlurAsync' | undefined
    onSubmit: 'onSubmit' | 'onSubmitAsync' | undefined
    onServer: undefined
  }>
})

it('should not allow setting manual errors if no validator is specified', () => {
  const form = new FormApi({
    defaultValues: {
      firstName: '',
      lastName: '',
    },
  })

  expectTypeOf(form.setErrorMap).parameter(0).toEqualTypeOf<{
    onMount: undefined
    onChange: undefined
    onBlur: undefined
    onSubmit: undefined
    onServer: undefined
  }>
})
