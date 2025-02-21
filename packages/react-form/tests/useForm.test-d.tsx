import { assertType, it } from 'vitest'
import { useForm } from '../src/index'
import type { FormAsyncValidateOrFn, FormValidateOrFn } from '../src/index'
import type { ReactFormExtendedApi } from '../src/useForm'

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
      TOnServer
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
