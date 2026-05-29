import { describe, expectTypeOf, it } from 'vitest'
import { FormApi, formOptions } from '../src/index'
import type { FormAsyncValidateOrFn, FormValidateOrFn } from '../src/index'

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
      FormAsyncValidateOrFn<FormData> | undefined
    >

    const formOpts = formOptions({
      defaultValues: {
        firstName: '',
        lastName: '',
      } as FormData,
      listeners: {
        onSubmit: ({ formApi, meta }) => {
          expectTypeOf(formApi).toEqualTypeOf<ExpectedShape>()
          expectTypeOf(meta).toEqualTypeOf<never>()
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

    expectTypeOf(form.state.errors).toEqualTypeOf<'I just need an error'[]>()

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

    expectTypeOf(form2.state.errors).toEqualTypeOf<'Too short!'[]>()

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
      ('Too short!' | 'I just need an error')[]
    >()
  })

  it('validators.onSubmit data param should NOT be any when defined in formOptions (#1613)', () => {
    type FormData = {
      description: string
    }

    const formOpts = formOptions({
      defaultValues: {
        description: '',
      } as FormData,
      validators: {
        onSubmit: (data) => {
          // The core of #1613: data.value should be FormData, NOT any
          expectTypeOf(data.value).toEqualTypeOf<FormData>()
          expectTypeOf(data.value).not.toBeAny()

          if (data.value.description.length === 0) {
            return 'Description is required'
          }
          return undefined
        },
      },
    })

    const form = new FormApi(formOpts)
    expectTypeOf(form.state.values).toEqualTypeOf<FormData>()

    // Also verify spreading still works
    const form2 = new FormApi({ ...formOpts })
    expectTypeOf(form2.state.values).toEqualTypeOf<FormData>()
  })

  it('onSubmit handler data param should NOT be any when defined in formOptions (#1613)', () => {
    type FormData = {
      rows: { id: string }[]
    }

    const formOpts = formOptions({
      defaultValues: {
        rows: [] as { id: string }[],
      } as FormData,
      onSubmit: (data) => {
        // Verify the onSubmit handler parameter is typed
        expectTypeOf(data.value).toEqualTypeOf<FormData>()
        expectTypeOf(data.value).not.toBeAny()
      },
      validators: {
        onSubmit: (data) => {
          expectTypeOf(data.value).toEqualTypeOf<FormData>()
          expectTypeOf(data.value).not.toBeAny()
          if (data.value.rows.length < 2) {
            return 'Need at least 2 rows'
          }
          return undefined
        },
      },
    })

    // Should work without type errors when passed to FormApi
    const form = new FormApi(formOpts)
    expectTypeOf(form.state.values).toEqualTypeOf<FormData>()

    // Spreading should also work
    const form2 = new FormApi({ ...formOpts })
    expectTypeOf(form2.state.values).toEqualTypeOf<FormData>()
  })
})

