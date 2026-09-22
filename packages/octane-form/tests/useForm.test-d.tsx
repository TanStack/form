import { describe, expectTypeOf, it } from 'vitest'
import { formOptions, useForm } from '../src/index'
import type { FormAsyncValidateOrFn, FormValidateOrFn } from '../src/index'
import type { OctaneFormExtendedApi } from '../src/useForm.tsrx'

describe('useForm', () => {
  it('should infer Subscribe selector results and reject incompatible callbacks', () => {
    function Comp() {
      const form = useForm({ defaultValues: { name: '', age: 0 } })

      const invalidInferred = (
        <form.Subscribe
          // @ts-expect-error A number selector cannot be paired with a string callback.
          selector={(state) => state.values.age}
          // @ts-expect-error Static children must not allow an incompatible render callback.
          children={(age: string) => age}
        />
      )
      const invalidExplicit = (
        <form.Subscribe<number>
          selector={(state) => state.values.age}
          // @ts-expect-error Explicit selection types must also enforce the callback type.
          children={(age: string) => age}
        />
      )

      return (
        <>
          <form.Subscribe
            selector={(state) => [state.values.name, state.values.age] as const}
          >
            {([name, age]) => {
              expectTypeOf(name).toEqualTypeOf<string>()
              expectTypeOf(age).toEqualTypeOf<number>()
              // @ts-expect-error The selected age is a number.
              age.toUpperCase()
              return (
                <span>
                  {name}: {age}
                </span>
              )
            }}
          </form.Subscribe>
          {invalidInferred}
          {invalidExplicit}
        </>
      )
    }
  })

  it('should infer the whole form state when Subscribe has no selector', () => {
    function Comp() {
      const form = useForm({ defaultValues: { name: '', age: 0 } })

      return (
        <form.Subscribe>
          {(state) => {
            expectTypeOf(state).toEqualTypeOf<typeof form.state>()
            return <span>{state.values.name}</span>
          }}
        </form.Subscribe>
      )
    }
  })

  it('should accept static Octane children in Subscribe', () => {
    function Comp() {
      const form = useForm({ defaultValues: { name: '' } })

      return (
        <>
          <form.Subscribe>
            <span>Static child</span>
          </form.Subscribe>
          <form.Subscribe selector={(state) => state.values.name}>
            Static text
          </form.Subscribe>
          <form.Subscribe>{42}</form.Subscribe>
          <form.Subscribe>{null}</form.Subscribe>
          <form.Subscribe>
            {[<span>First</span>, 'Second', false]}
          </form.Subscribe>
        </>
      )
    }
  })

  it('should infer Subscribe callbacks combined with static children', () => {
    function Comp({ showAge }: { showAge: boolean }) {
      const form = useForm({ defaultValues: { name: '', age: 0 } })

      return (
        <form.Subscribe selector={(state) => state.values.age}>
          {showAge ? (
            (age) => {
              expectTypeOf(age).toEqualTypeOf<number>()
              return <span>{age}</span>
            }
          ) : (
            <span>Age hidden</span>
          )}
        </form.Subscribe>
      )
    }
  })

  it('should type onSubmit properly', () => {
    function Comp() {
      const form = useForm({
        defaultValues: {
          firstName: 'test',
          age: 84,
          // as const is required here
        } as const,
        onSubmit({ value }) {
          expectTypeOf(value.age).toEqualTypeOf<84>()
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
            expectTypeOf(value.age).toEqualTypeOf<84>()
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
      TOnDynamic extends undefined | FormValidateOrFn<TFormData>,
      TOnDynamicAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
      TOnServer extends undefined | FormAsyncValidateOrFn<TFormData>,
      TSubmitMeta,
    >(
      f: OctaneFormExtendedApi<
        TFormData,
        TOnMount,
        TOnChange,
        TOnChangeAsync,
        TOnBlur,
        TOnBlurAsync,
        TOnSubmit,
        TOnSubmitAsync,
        TOnDynamic,
        TOnDynamicAsync,
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

    expectTypeOf(form.state.values).toEqualTypeOf<Person>()
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

    const form = useForm({
      ...formOpts,
      defaultValues: {
        firstName: 'FirstName',
        lastName: 'LastName',
        age: 10,
      },
    })

    expectTypeOf(form.state.values).toExtend<PersonWithAge>()
  })
})
