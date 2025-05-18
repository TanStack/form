import { expectTypeOf, it } from 'vitest'
import { z } from 'zod'
import { FormApi } from '../src'
import type {
  DeepKeys,
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

it('should only allow array fields for array-specific methods', () => {
  type FormValues = {
    name: string
    age: number
    startDate: Date
    title: string | null | undefined
    relatives: { name: string }[]
    counts: (number | null | undefined)[]
  }

  const defaultValues: FormValues = {
    name: '',
    age: 0,
    startDate: new Date(),
    title: null,
    relatives: [{ name: '' }],
    counts: [5, null, undefined, 3],
  }

  const form = new FormApi({
    defaultValues,
  })
  form.mount()

  type AllKeys = DeepKeys<FormValues>
  type OnlyArrayKeys = Extract<AllKeys, 'counts' | 'relatives'>
  type RandomKeys = Extract<AllKeys, 'counts' | 'relatives' | 'title'>

  const push1 = form.pushFieldValue<OnlyArrayKeys>
  // @ts-expect-error too wide!
  const push2 = form.pushFieldValue<AllKeys>
  // @ts-expect-error too wide!
  const push3 = form.pushFieldValue<RandomKeys>

  const insert1 = form.insertFieldValue<OnlyArrayKeys>
  // @ts-expect-error too wide!
  const insert2 = form.insertFieldValue<AllKeys>
  // @ts-expect-error too wide!
  const insert3 = form.insertFieldValue<RandomKeys>

  const replace1 = form.replaceFieldValue<OnlyArrayKeys>
  // @ts-expect-error too wide!
  const replace2 = form.replaceFieldValue<AllKeys>
  // @ts-expect-error too wide!
  const replace3 = form.replaceFieldValue<RandomKeys>

  const remove1 = form.removeFieldValue<OnlyArrayKeys>
  // @ts-expect-error too wide!
  const remove2 = form.removeFieldValue<AllKeys>
  // @ts-expect-error too wide!
  const remove3 = form.removeFieldValue<RandomKeys>

  const swap1 = form.swapFieldValues<OnlyArrayKeys>
  // @ts-expect-error too wide!
  const swap2 = form.swapFieldValues<AllKeys>
  // @ts-expect-error too wide!
  const swap3 = form.swapFieldValues<RandomKeys>

  const move1 = form.moveFieldValues<OnlyArrayKeys>
  // @ts-expect-error too wide!
  const move2 = form.moveFieldValues<AllKeys>
  // @ts-expect-error too wide!
  const move3 = form.moveFieldValues<RandomKeys>

  const validate1 = form.validateArrayFieldsStartingFrom<OnlyArrayKeys>
  // @ts-expect-error too wide!
  const validate2 = form.validateArrayFieldsStartingFrom<AllKeys>
  // @ts-expect-error too wide!
  const validate3 = form.validateArrayFieldsStartingFrom<RandomKeys>
})

it('should infer full field name union for form.resetField parameters', () => {
  type FormData = {
    shallow: string
    nested: {
      field: {
        name: string
      }
    }
  }

  const defaultValue = {
    shallow: '',
    nested: {
      field: {
        name: '',
      },
    },
  }

  const form = new FormApi({
    defaultValues: defaultValue as FormData,
  })

  expectTypeOf(form.resetField)
    .parameter(0)
    .toEqualTypeOf<
      'shallow' | 'nested' | 'nested.field' | 'nested.field.name'
    >()
})
