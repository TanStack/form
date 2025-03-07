import { assertType, describe, it } from 'vitest'
import { formOptions, useForm } from '../src/index'
import type { FormAsyncValidateOrFn, FormValidateOrFn } from '../src/index'
import type { ReactFormExtendedApi } from '../src/useForm'

describe('useForm', () => {
  it('should type onSubmit properly', () => {
    function Comp() {
      const form = useForm({
        defaultValues: {
          firstName: 'test',
          age: 84,
          // as const is required here
        } as const,
        onSubmit({ value }) {
          assertType<84>(value.age)
        },
      })
    }
  })

  it('should type a validator properly', () => {
    function Comp() {
      const form = useForm({
        defaultValues: {
          firstName: 'test',
          age: 84,
          // as const is required here
        } as const,
        validators: {
          onChange({ value }) {
            assertType<84>(value.age)
            return undefined
          },
        },
      })
    }
  })

  it('should not have recursion problems and type register properly', () => {
    const register = <
      TFormData,
      TOnMount extends undefined | FormValidateOrFn<TFormData>,
      TOnChange extends undefined | FormValidateOrFn<TFormData>,
      TOnChangeAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
      TOnBlur extends undefined | FormValidateOrFn<TFormData>,
      TOnBlurAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
      TOnSubmit extends undefined | FormValidateOrFn<TFormData>,
      TOnSubmitAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
      TOnServer extends undefined | FormAsyncValidateOrFn<TFormData>,
      TSubmitMeta,
    >(
      f: ReactFormExtendedApi<
        TFormData,
        TOnMount,
        TOnChange,
        TOnChangeAsync,
        TOnBlur,
        TOnBlurAsync,
        TOnSubmit,
        TOnSubmitAsync,
        TOnServer,
        TSubmitMeta
      >,
    ) => f

    function Comp() {
      const form = useForm({
        defaultValues: {
          name: '',
          title: '',
        },
      })

      const x = register(form)

      return null
    }
  })

  it('types should be properly inferred when using formOptions', () => {
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

    const form = useForm(formOpts)

    assertType<Person>(form.state.values)
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

    const form = useForm({
      ...formOpts,
      onSubmitMeta: {
        test: 'test',
      },
    })

    assertType<(submitMeta: { test: string }) => Promise<void>>(
      form.handleSubmit,
    )
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

    const form = useForm({
      ...formOpts,
      defaultValues: {
        firstName: 'FirstName',
        lastName: 'LastName',
        age: 10,
      } as PersonWithAge,
    })

    assertType<Person>(form.state.values)
  })
})
