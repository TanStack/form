import { describe, expectTypeOf, it } from 'vitest'
import { FieldApi, FormApi, formOptions } from '../src/index'
import type {
  AnyFieldApi,
  FormAsyncValidateOrFn,
  FormValidateOrFn,
} from '../src/index'

describe('formOptions', () => {
  it('types should be properly inferred', () => {
    type Person = {
      firstName: string
      lastName: string
    }

    const formOpts = formOptions({
      defaultValues: {
        firstName: 'FirstName',
        lastName: 'LastName',
      } as Person,
    })

    const form1 = new FormApi(formOpts)
    const form2 = new FormApi({
      ...formOpts,
    })

    expectTypeOf(form1.state.values).toEqualTypeOf<Person>()
    expectTypeOf(form2.state.values).toEqualTypeOf<Person>()
  })

  it('types should be properly inferred when passing args alongside formOptions', () => {
    type Person = {
      firstName: string
      lastName: string
    }

    const formOpts = formOptions({
      defaultValues: {
        firstName: 'FirstName',
        lastName: 'LastName',
      } as Person,
    })

    const form = new FormApi({
      ...formOpts,
      onSubmitMeta: {
        test: 'test',
      },
    })

    expectTypeOf(form.handleSubmit).toEqualTypeOf<{
      (): Promise<void>
      (submitMeta: { test: string }): Promise<void>
    }>()
  })

  it('types should be properly inferred when formOptions are being overridden', () => {
    type Person = {
      firstName: string
      lastName: string
    }

    type PersonWithAge = Person & {
      age: number
    }

    const formOpts = formOptions({
      defaultValues: {
        firstName: 'FirstName',
        lastName: 'LastName',
      } as Person,
    })

    const formOnly = new FormApi(formOpts)
    expectTypeOf(formOnly.state.values).toEqualTypeOf<Person>()

    const form = new FormApi({
      ...formOpts,
      defaultValues: {
        firstName: 'FirstName',
        lastName: 'LastName',
        age: 10,
      },
    })

    expectTypeOf(form.state.values).toExtend<PersonWithAge>()
  })

  it('types should infer submitMeta', () => {
    type FormData = {
      firstName: string
      lastName: string
    }

    type SubmitMeta = { bool: boolean }

    type ExpectedShape = FormApi<
      FormData,
      FormValidateOrFn<FormData> | undefined,
      FormValidateOrFn<FormData> | undefined,
      FormAsyncValidateOrFn<FormData> | undefined,
      FormValidateOrFn<FormData> | undefined,
      FormAsyncValidateOrFn<FormData> | undefined,
      FormValidateOrFn<FormData> | undefined,
      FormAsyncValidateOrFn<FormData> | undefined,
      FormValidateOrFn<FormData> | undefined,
      FormAsyncValidateOrFn<FormData> | undefined,
      FormAsyncValidateOrFn<FormData> | undefined,
      SubmitMeta
    >

    const formOpts = formOptions({
      defaultValues: {
        firstName: '',
        lastName: '',
      } as FormData,
      onSubmitMeta: { bool: false } as SubmitMeta,
      onSubmit: ({ meta }) => {
        expectTypeOf(meta).toEqualTypeOf<SubmitMeta>()
      },
    })

    const form = new FormApi(formOpts)
    expectTypeOf(form).toEqualTypeOf<ExpectedShape>()

    const form2 = new FormApi({ ...formOpts })
    expectTypeOf(form2).toEqualTypeOf<ExpectedShape>()
  })

  it('types should infer validator types', () => {
    type FormData = {
      firstName: string
      lastName: string
    }

    type AnyFormApi = FormApi<
      FormData,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any
    >

    type ExpectedShape = FormApi<
      FormData,
      FormValidateOrFn<FormData> | undefined,
      ({ value, formApi }: { value: FormData; formApi: AnyFormApi }) => void,
      FormAsyncValidateOrFn<FormData> | undefined,
      FormValidateOrFn<FormData> | undefined,
      FormAsyncValidateOrFn<FormData> | undefined,
      FormValidateOrFn<FormData> | undefined,
      FormAsyncValidateOrFn<FormData> | undefined,
      FormValidateOrFn<FormData> | undefined,
      FormAsyncValidateOrFn<FormData> | undefined,
      FormAsyncValidateOrFn<FormData> | undefined,
      never
    >

    const formOpts = formOptions({
      defaultValues: {
        firstName: '',
        lastName: '',
      } as FormData,
      validators: {
        onChange: ({ value, formApi }) => {
          expectTypeOf(value).toEqualTypeOf<FormData>()
          expectTypeOf(formApi).toEqualTypeOf<AnyFormApi>()
        },
      },
    })

    const form = new FormApi(formOpts)
    expectTypeOf(form).toEqualTypeOf<ExpectedShape>()

    const form2 = new FormApi({ ...formOpts })
    expectTypeOf(form2).toEqualTypeOf<ExpectedShape>()
  })

  it('types should infer listeners types', () => {
    type FormData = {
      firstName: string
      lastName: string
    }

    type ExpectedShape = FormApi<
      FormData,
      FormValidateOrFn<FormData> | undefined,
      FormValidateOrFn<FormData> | undefined,
      FormAsyncValidateOrFn<FormData> | undefined,
      FormValidateOrFn<FormData> | undefined,
      FormAsyncValidateOrFn<FormData> | undefined,
      FormValidateOrFn<FormData> | undefined,
      FormAsyncValidateOrFn<FormData> | undefined,
      FormValidateOrFn<FormData> | undefined,
      FormAsyncValidateOrFn<FormData> | undefined,
      FormAsyncValidateOrFn<FormData> | undefined,
      unknown
    >

    const formOpts = formOptions({
      defaultValues: {
        firstName: '',
        lastName: '',
      } as FormData,
      listeners: {
        onSubmit: ({ formApi, meta }) => {
          expectTypeOf(formApi).toEqualTypeOf<ExpectedShape>()
          expectTypeOf(meta).toEqualTypeOf<unknown>()
        },
      },
    })

    const form = new FormApi(formOpts)
    expectTypeOf(form).toEqualTypeOf<ExpectedShape>()

    const form2 = new FormApi({ ...formOpts })
    expectTypeOf(form2).toEqualTypeOf<ExpectedShape>()
  })

  it('types should infer listeners types with submitMeta', () => {
    type FormData = {
      firstName: string
      lastName: string
    }
    type SubmitMeta = { bool: boolean }

    type ExpectedShape = FormApi<
      FormData,
      FormValidateOrFn<FormData> | undefined,
      FormValidateOrFn<FormData> | undefined,
      FormAsyncValidateOrFn<FormData> | undefined,
      FormValidateOrFn<FormData> | undefined,
      FormAsyncValidateOrFn<FormData> | undefined,
      FormValidateOrFn<FormData> | undefined,
      FormAsyncValidateOrFn<FormData> | undefined,
      FormValidateOrFn<FormData> | undefined,
      FormAsyncValidateOrFn<FormData> | undefined,
      FormAsyncValidateOrFn<FormData> | undefined,
      SubmitMeta
    >

    const formOpts = formOptions({
      defaultValues: {
        firstName: '',
        lastName: '',
      } as FormData,
      onSubmitMeta: { bool: false } as SubmitMeta,
      listeners: {
        onSubmit: ({ formApi, meta }) => {
          expectTypeOf(formApi).toEqualTypeOf<ExpectedShape>()
          expectTypeOf(meta).toEqualTypeOf<SubmitMeta>()
        },
      },
    })

    const form = new FormApi(formOpts)
    expectTypeOf(form).toEqualTypeOf<ExpectedShape>()

    const form2 = new FormApi({ ...formOpts })
    expectTypeOf(form2).toEqualTypeOf<ExpectedShape>()
  })

  it('should allow overriding formOptions values', () => {
    type FormData = {
      firstName: string
      lastName: string
    }

    const formOpts = formOptions({
      defaultValues: {
        firstName: '',
        lastName: '',
      } as FormData,
      validators: {
        onSubmit: ({ formApi }) => {
          if (formApi.formId) {
            return 'I just need an error'
          }
          return undefined
        },
      },
    })

    const form = new FormApi(formOpts)

    expectTypeOf(form.state.errors).toEqualTypeOf<
      ('I just need an error' | undefined)[]
    >()

    const form2 = new FormApi({
      ...formOpts,
      validators: {
        onChange: (params) => {
          if (params.value.firstName.length === 0) {
            return 'Too short!'
          }
          return undefined
        },
      },
    })

    expectTypeOf(form2.state.errors).toEqualTypeOf<
      (undefined | 'Too short!')[]
    >()

    const form3 = new FormApi({
      ...formOpts,
      validators: {
        ...formOpts.validators,
        onChange: (params) => {
          if (params.value.firstName.length === 0) {
            return 'Too short!'
          }
          return undefined
        },
      },
    })

    expectTypeOf(form3.state.errors).toEqualTypeOf<
      (undefined | 'Too short!' | 'I just need an error')[]
    >()
  })

  it('should allow listeners', () => {
    const options = formOptions({
      defaultValues: { name: '' },
      validators: {
        onChange: () => 'Error',
      },
      listeners: {
        onChange: ({ formApi }) => {
          expectTypeOf(formApi.state.values).toEqualTypeOf<{ name: string }>()
        },
      },
    })
  })

  it('should prevent overwriting onSubmitMeta if used', () => {
    type FormData = {
      firstName: string
      lastName: string
    }
    type SubmitMeta = { bool: boolean }

    const optsWithUsedMeta = formOptions({
      defaultValues: { firstName: '', lastName: '' } as FormData,
      onSubmitMeta: { bool: false } as SubmitMeta,
      onSubmit: ({ meta }) => {
        expectTypeOf(meta).toEqualTypeOf<SubmitMeta>()
      },
    })

    const form1 = new FormApi(optsWithUsedMeta)
    expectTypeOf(form1.handleSubmit).toBeCallableWith({ bool: true })
    const form2 = new FormApi({
      ...optsWithUsedMeta,
      // @ts-expect-error cannot overwrite used submitMeta
      onSubmitMeta: { change: 'value' },
    })
    expectTypeOf(form2.handleSubmit).toBeCallableWith({ bool: true })
  })

  it('should allow overwriting onSubmitMeta if unused', () => {
    type FormData = {
      firstName: string
      lastName: string
    }
    type SubmitMeta = { bool: boolean }

    const optsWithUnusedMeta = formOptions({
      defaultValues: { firstName: '', lastName: '' } as FormData,
      onSubmitMeta: { bool: false } as SubmitMeta,
    })

    const form1 = new FormApi({
      ...optsWithUnusedMeta,
    })

    const form2 = new FormApi({
      ...optsWithUnusedMeta,
      onSubmitMeta: { change: 'value' },
      onSubmit: ({ meta }) => {
        expectTypeOf(meta).toEqualTypeOf<{ change: string }>()
      },
    })

    expectTypeOf(form1.handleSubmit).toBeCallableWith({ bool: true })
    // @ts-expect-error wrong meta shape
    expectTypeOf(form2.handleSubmit).toBeCallableWith({ bool: true })
    expectTypeOf(form2.handleSubmit).toBeCallableWith({ change: 'test' })
  })

  it('should allow assigning fields to be assignable to AnyFieldApi', () => {
    const formOpts = formOptions({
      defaultValues: { firstName: '' },
      onSubmit: async ({ value }) => {
        console.log(value)
      },
    })

    const form = new FormApi({ ...formOpts })
    const field = new FieldApi({
      form,
      name: 'firstName',
      validators: {
        onChange: ({ value }) =>
          !value
            ? 'A first name is required'
            : value.length < 3
              ? 'First name must be at least 3 characters'
              : undefined,
      },
    })

    expectTypeOf(field).toExtend<AnyFieldApi>()
  })
})
