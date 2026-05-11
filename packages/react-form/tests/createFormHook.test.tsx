import { describe, expect, it } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import { formOptions } from '@tanstack/form-core'
import userEvent from '@testing-library/user-event'
import { createFormHook, createFormHookContexts, useStore } from '../src'

const user = userEvent.setup()

const { fieldContext, useFieldContext, formContext, useFormContext } =
  createFormHookContexts()

function TextField({ label }: { label: string }) {
  const field = useFieldContext<string>()
  return (
    <label>
      <div>{label}</div>
      <input
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
      />
    </label>
  )
}

function SubscribeButton({ label }: { label: string }) {
  const form = useFormContext()
  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => <button disabled={isSubmitting}>{label}</button>}
    </form.Subscribe>
  )
}

const { useAppForm, withForm, withFieldGroup, useTypedAppFormContext } =
  createFormHook({
    fieldComponents: {
      TextField,
    },
    formComponents: {
      SubscribeButton,
    },
    fieldContext,
    formContext,
  })

describe('createFormHook', () => {
  it('should allow to set default value', () => {
    type Person = {
      firstName: string
      lastName: string
    }

    function Comp() {
      const form = useAppForm({
        defaultValues: {
          firstName: 'FirstName',
          lastName: 'LastName',
        } as Person,
      })

      return (
        <>
          <form.AppField
            name="firstName"
            children={(field) => <field.TextField label="Testing" />}
          />
        </>
      )
    }

    const { getByLabelText } = render(<Comp />)
    const input = getByLabelText('Testing')
    expect(input).toHaveValue('FirstName')
  })

  it('should handle withForm types properly', () => {
    const formOpts = formOptions({
      defaultValues: {
        firstName: 'John',
        lastName: 'Doe',
      },
    })

    const ChildForm = withForm({
      ...formOpts,
      // Optional, but adds props to the `render` function outside of `form`
      props: {
        title: 'Child Form',
      },
      render: ({ form, title }) => {
        return (
          <div>
            <p>{title}</p>
            <form.AppField
              name="firstName"
              children={(field) => <field.TextField label="First Name" />}
            />
            <form.AppForm>
              <form.SubscribeButton label="Submit" />
            </form.AppForm>
          </div>
        )
      },
    })

    const Parent = () => {
      const form = useAppForm({
        ...formOpts,
      })

      return <ChildForm form={form} title={'Testing'} />
    }

    const { getByLabelText, getByText } = render(<Parent />)
    const input = getByLabelText('First Name')
    expect(input).toHaveValue('John')
    expect(getByText('Testing')).toBeInTheDocument()
  })

  it('should handle withFieldGroup types properly', () => {
    const formOpts = formOptions({
      defaultValues: {
        person: {
          firstName: 'John',
          lastName: 'Doe',
        },
      },
    })

    const ChildForm = withFieldGroup({
      defaultValues: formOpts.defaultValues.person,
      // Optional, but adds props to the `render` function outside of `form`
      props: {
        title: 'Child Form',
      },
      render: ({ group, title }) => {
        return (
          <div>
            <p>{title}</p>
            <group.AppField
              name="firstName"
              children={(field) => <field.TextField label="First Name" />}
            />
            <group.AppForm>
              <group.SubscribeButton label="Submit" />
            </group.AppForm>
          </div>
        )
      },
    })

    const Parent = () => {
      const form = useAppForm({
        ...formOpts,
      })

      return <ChildForm form={form} fields="person" title={'Testing'} />
    }

    const { getByLabelText, getByText } = render(<Parent />)
    const input = getByLabelText('First Name')
    expect(input).toHaveValue('John')
    expect(getByText('Testing')).toBeInTheDocument()
  })

  it('should use the correct field name in Field with withFieldGroup', () => {
    const formOpts = formOptions({
      defaultValues: {
        person: {
          firstName: 'John',
          lastName: 'Doe',
        },
        people: [
          {
            firstName: 'Jane',
            lastName: 'Doe',
          },
          {
            firstName: 'Robert',
            lastName: 'Doe',
          },
        ],
      },
    })

    const ChildFormAsField = withFieldGroup({
      defaultValues: formOpts.defaultValues.person,
      render: ({ group }) => {
        return (
          <div>
            <group.AppField
              name="firstName"
              children={(field) => <field.TextField label={field.name} />}
            />
            <group.AppForm>
              <group.SubscribeButton label="Submit" />
            </group.AppForm>
          </div>
        )
      },
    })
    const ChildFormAsArray = withFieldGroup({
      defaultValues: [formOpts.defaultValues.person],
      props: {
        title: '',
      },
      render: ({ group, title }) => {
        return (
          <div>
            <p>{title}</p>
            <group.AppField
              name="[0].firstName"
              children={(field) => <field.TextField label={field.name} />}
            />
            <group.AppForm>
              <group.SubscribeButton label="Submit" />
            </group.AppForm>
          </div>
        )
      },
    })

    const Parent = () => {
      const form = useAppForm({
        ...formOpts,
      })

      return (
        <>
          <ChildFormAsField form={form} fields="person" />
          <ChildFormAsArray form={form} fields="people" title="Testing" />
          <ChildFormAsField form={form} fields="people[1]" />
        </>
      )
    }

    const { getByLabelText, getByText } = render(<Parent />)
    const inputField1 = getByLabelText('person.firstName')
    const inputArray = getByLabelText('people[0].firstName')
    const inputField2 = getByLabelText('people[1].firstName')
    expect(inputField1).toHaveValue('John')
    expect(inputArray).toHaveValue('Jane')
    expect(inputField2).toHaveValue('Robert')
    expect(getByText('Testing')).toBeInTheDocument()
  })

  it('should forward Field and Subscribe to the form', () => {
    const formOpts = formOptions({
      defaultValues: {
        person: {
          firstName: 'John',
          lastName: 'Doe',
        },
      },
    })

    const ChildFormAsField = withFieldGroup({
      defaultValues: formOpts.defaultValues.person,
      render: ({ group }) => {
        return (
          <div>
            <group.Field
              name="firstName"
              children={(field) => (
                <label>
                  <div>{field.name}</div>
                  <input
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </label>
              )}
            />
            <group.Subscribe selector={(state) => state.values.lastName}>
              {(lastName) => <p>{lastName}</p>}
            </group.Subscribe>
          </div>
        )
      },
    })

    const Parent = () => {
      const form = useAppForm({
        ...formOpts,
      })
      return <ChildFormAsField form={form} fields="person" />
    }

    const { getByLabelText, getByText } = render(<Parent />)
    const input = getByLabelText('person.firstName')
    expect(input).toHaveValue('John')
    expect(getByText('Doe')).toBeInTheDocument()
  })

  it('should not lose focus on update with withFieldGroup', async () => {
    const formOpts = formOptions({
      defaultValues: {
        person: {
          firstName: 'John',
          lastName: 'Doe',
        },
      },
    })

    const ChildForm = withFieldGroup({
      defaultValues: formOpts.defaultValues.person,
      render: function Render({ group }) {
        const firstName = useStore(
          group.store,
          (state) => state.values.firstName,
        )
        return (
          <div>
            <p>{firstName}</p>
            <group.Field
              name="firstName"
              children={(field) => (
                <label>
                  <div>{field.name}</div>
                  <input
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </label>
              )}
            />
            <group.Subscribe selector={(state) => state.values.lastName}>
              {(lastName) => <p>{lastName}</p>}
            </group.Subscribe>
          </div>
        )
      },
    })

    const Parent = () => {
      const form = useAppForm({
        ...formOpts,
      })
      return <ChildForm form={form} fields="person" />
    }

    const { getByLabelText } = render(<Parent />)

    const input = getByLabelText('person.firstName')
    input.focus()
    expect(input).toHaveFocus()

    await user.clear(input)
    await user.type(input, 'Something')

    expect(input).toHaveFocus()
  })

  it('should allow nesting withFieldGroup in other withFieldGroups', () => {
    type Nested = {
      firstName: string
    }
    type Wrapper = {
      field: Nested
    }
    type FormValues = {
      form: Wrapper
      unrelated: { something: { lastName: string } }
    }

    const defaultValues: FormValues = {
      form: {
        field: {
          firstName: 'Test',
        },
      },
      unrelated: {
        something: {
          lastName: '',
        },
      },
    }

    const LensNested = withFieldGroup({
      defaultValues: defaultValues.form.field,
      render: function Render({ group }) {
        return (
          <group.Field name="firstName">
            {(field) => <p>{field.name}</p>}
          </group.Field>
        )
      },
    })
    const LensWrapper = withFieldGroup({
      defaultValues: defaultValues.form,
      render: function Render({ group }) {
        return (
          <div>
            <LensNested form={group} fields="field" />
          </div>
        )
      },
    })

    const Parent = () => {
      const form = useAppForm({
        defaultValues,
      })
      return <LensWrapper form={form} fields="form" />
    }

    const { getByText } = render(<Parent />)

    expect(getByText('form.field.firstName')).toBeInTheDocument()
  })

  it('should allow mapping withFieldGroup to different values', () => {
    const formOpts = formOptions({
      defaultValues: {
        unrelated: 'John',
        values: '',
      },
    })

    const ChildFormAsField = withFieldGroup({
      defaultValues: { firstName: '', lastName: '' },
      render: ({ group }) => {
        return (
          <div>
            <group.AppField
              name="firstName"
              children={(field) => <field.TextField label={field.name} />}
            />
          </div>
        )
      },
    })

    const Parent = () => {
      const form = useAppForm({
        ...formOpts,
      })

      return (
        <ChildFormAsField
          form={form}
          fields={{
            firstName: 'unrelated',
            lastName: 'values',
          }}
        />
      )
    }

    const { getByLabelText } = render(<Parent />)
    const inputField1 = getByLabelText('unrelated')
    expect(inputField1).toHaveValue('John')
  })

  it('should remap FieldGroupApi.Field validators to the correct names', () => {
    const FieldGroupString = withFieldGroup({
      defaultValues: { password: '', confirmPassword: '' },
      render: function Render({ group }) {
        return (
          <group.Field
            name="password"
            validators={{
              onChange: () => null,
              onChangeListenTo: ['password'],
              onBlur: () => null,
              onBlurListenTo: ['confirmPassword'],
            }}
          >
            {(field) => {
              expect(field.options.validators?.onChangeListenTo).toStrictEqual([
                'account.password',
              ])
              expect(field.options.validators?.onBlurListenTo).toStrictEqual([
                'account.confirmPassword',
              ])
              return <></>
            }}
          </group.Field>
        )
      },
    })

    const FieldGroupObject = withFieldGroup({
      defaultValues: { password: '', confirmPassword: '' },
      render: function Render({ group }) {
        return (
          <group.Field
            name="password"
            validators={{
              onChange: () => null,
              onChangeListenTo: ['password'],
              onBlur: () => null,
              onBlurListenTo: ['confirmPassword'],
            }}
          >
            {(field) => {
              expect(field.options.validators?.onChangeListenTo).toStrictEqual([
                'userPassword',
              ])
              expect(field.options.validators?.onBlurListenTo).toStrictEqual([
                'userConfirmPassword',
              ])
              return <></>
            }}
          </group.Field>
        )
      },
    })

    const Parent = () => {
      const form = useAppForm({
        defaultValues: {
          account: {
            password: '',
            confirmPassword: '',
          },
          userPassword: '',
          userConfirmPassword: '',
        },
      })

      return (
        <>
          <FieldGroupString form={form} fields="account" />
          <FieldGroupObject
            form={form}
            fields={{
              password: 'userPassword',
              confirmPassword: 'userConfirmPassword',
            }}
          />
        </>
      )
    }

    render(<Parent />)
  })

  it('should accept formId and return it', async () => {
    function Submit() {
      const form = useFormContext()

      return (
        <button type="submit" form={form.formId} data-testid="formId-target">
          {form.formId}
        </button>
      )
    }

    function Comp() {
      const form = useAppForm({
        formId: 'test',
      })

      return (
        <form.AppForm>
          <form
            id={form.formId}
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
          ></form>

          <form.Subscribe
            selector={(state) => state.submissionAttempts}
            children={(submissionAttempts) => (
              <span data-testid="formId-result">{submissionAttempts}</span>
            )}
          />

          <Submit />
        </form.AppForm>
      )
    }

    const { getByTestId } = render(<Comp />)
    const target = getByTestId('formId-target')
    const result = getByTestId('formId-result')

    await user.click(target)
    expect(result).toHaveTextContent('1')
  })

  it('should allow using typed app form', () => {
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

    function Child() {
      const form = useTypedAppFormContext(formOpts)

      return (
        <form.AppField
          name="firstName"
          children={(field) => <field.TextField label="Testing" />}
        />
      )
    }

    function Parent() {
      const form = useAppForm({
        defaultValues: {
          firstName: 'FirstName',
          lastName: 'LastName',
        } as Person,
      })

      return (
        <form.AppForm>
          <Child />
        </form.AppForm>
      )
    }

    const { getByLabelText } = render(<Parent />)
    const input = getByLabelText('Testing')
    expect(input).toHaveValue('FirstName')
  })

  it('should throw if `useTypedAppFormContext` is used without AppForm', () => {
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

    function Child() {
      const form = useTypedAppFormContext(formOpts)

      return (
        <form.AppField
          name="firstName"
          children={(field) => <field.TextField label="Testing" />}
        />
      )
    }

    function Parent() {
      const form = useAppForm({
        defaultValues: {
          firstName: 'FirstName',
          lastName: 'LastName',
        } as Person,
      })

      return <Child />
    }

    expect(() => render(<Parent />)).toThrow()
  })

  it('should allow using typed app form with form components', () => {
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

    function Child() {
      const form = useTypedAppFormContext(formOpts)

      return <form.SubscribeButton label="Testing" />
    }

    function Parent() {
      const form = useAppForm({
        defaultValues: {
          firstName: 'FirstName',
          lastName: 'LastName',
        } as Person,
      })

      return (
        <form.AppForm>
          <Child />
        </form.AppForm>
      )
    }

    const { getByText } = render(<Parent />)
    const button = getByText('Testing')
    expect(button).toBeInTheDocument()
  })

  describe('extendForm', () => {
    it('should include both parent and extended field components', () => {
      function ExtendedTextField({ label }: { label: string }) {
        const field = useFieldContext<string>()
        return (
          <label>
            <div>{label}</div>
            <input
              data-testid="extended-input"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          </label>
        )
      }

      const { useAppForm: useExtendedForm } = createFormHook({
        fieldComponents: { TextField },
        formComponents: { SubscribeButton },
        fieldContext,
        formContext,
      }).extendForm({
        fieldComponents: { ExtendedTextField },
      })

      function Comp() {
        const form = useExtendedForm({
          defaultValues: { firstName: 'John', lastName: 'Doe' },
        })

        return (
          <>
            <form.AppField
              name="firstName"
              children={(field) => <field.TextField label="First Name" />}
            />
            <form.AppField
              name="lastName"
              children={(field) => (
                <field.ExtendedTextField label="Last Name" />
              )}
            />
          </>
        )
      }

      const { getByLabelText, getByTestId } = render(<Comp />)
      expect(getByLabelText('First Name')).toHaveValue('John')
      expect(getByTestId('extended-input')).toHaveValue('Doe')
    })

    it('should include both parent and extended form components', () => {
      function ExtendedSubmit({ label }: { label: string }) {
        const form = useFormContext()
        return (
          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <button
                data-testid="extended-submit"
                disabled={isSubmitting}
                type="button"
              >
                {label}
              </button>
            )}
          </form.Subscribe>
        )
      }

      const { useAppForm: useExtendedForm } = createFormHook({
        fieldComponents: { TextField },
        formComponents: { SubscribeButton },
        fieldContext,
        formContext,
      }).extendForm({
        formComponents: { ExtendedSubmit },
      })

      function Comp() {
        const form = useExtendedForm({
          defaultValues: { firstName: 'John' },
        })

        return (
          <form.AppForm>
            <form.SubscribeButton label="Submit" />
            <form.ExtendedSubmit label="Extended Submit" />
          </form.AppForm>
        )
      }

      const { getByText, getByTestId } = render(<Comp />)
      expect(getByText('Submit')).toBeInTheDocument()
      expect(getByTestId('extended-submit')).toHaveTextContent(
        'Extended Submit',
      )
    })

    it('should support chaining multiple extendForm calls', () => {
      function FieldA({ label }: { label: string }) {
        const field = useFieldContext<string>()
        return (
          <label>
            <div>{label}</div>
            <input
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          </label>
        )
      }

      function FieldB({ label }: { label: string }) {
        const field = useFieldContext<string>()
        return (
          <label>
            <div>{label}</div>
            <input
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          </label>
        )
      }

      const base = createFormHook({
        fieldComponents: { TextField },
        formComponents: {},
        fieldContext,
        formContext,
      })

      const { useAppForm: useChainedForm } = base
        .extendForm({ fieldComponents: { FieldA } })
        .extendForm({ fieldComponents: { FieldB } })

      function Comp() {
        const form = useChainedForm({
          defaultValues: { a: 'valueA', b: 'valueB', c: 'valueC' },
        })

        return (
          <>
            <form.AppField
              name="a"
              children={(field) => <field.TextField label="A" />}
            />
            <form.AppField
              name="b"
              children={(field) => <field.FieldA label="B" />}
            />
            <form.AppField
              name="c"
              children={(field) => <field.FieldB label="C" />}
            />
          </>
        )
      }

      const { getByLabelText } = render(<Comp />)
      expect(getByLabelText('A')).toHaveValue('valueA')
      expect(getByLabelText('B')).toHaveValue('valueB')
      expect(getByLabelText('C')).toHaveValue('valueC')
    })

    it('should work with withForm after extendForm', () => {
      function ExtendedTextField({ label }: { label: string }) {
        const field = useFieldContext<string>()
        return (
          <label>
            <div>{label}</div>
            <input
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          </label>
        )
      }

      const { useAppForm: useExtendedForm, withForm: withExtendedForm } =
        createFormHook({
          fieldComponents: { TextField },
          formComponents: { SubscribeButton },
          fieldContext,
          formContext,
        }).extendForm({
          fieldComponents: { ExtendedTextField },
        })

      const ChildForm = withExtendedForm({
        defaultValues: { firstName: 'Jane', lastName: 'Smith' },
        render: function Render({ form }) {
          return (
            <>
              <form.AppField
                name="firstName"
                children={(field) => <field.TextField label="First Name" />}
              />
              <form.AppField
                name="lastName"
                children={(field) => (
                  <field.ExtendedTextField label="Last Name" />
                )}
              />
            </>
          )
        },
      })

      function Parent() {
        const form = useExtendedForm({
          defaultValues: { firstName: 'Jane', lastName: 'Smith' },
        })
        return <ChildForm form={form} />
      }

      const { getByLabelText } = render(<Parent />)
      expect(getByLabelText('First Name')).toHaveValue('Jane')
      expect(getByLabelText('Last Name')).toHaveValue('Smith')
    })

    it('should return a new extendForm from the extended hook', () => {
      function ExtendedTextField({ label }: { label: string }) {
        const field = useFieldContext<string>()
        return (
          <label>
            <div>{label}</div>
            <input
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          </label>
        )
      }

      const base = createFormHook({
        fieldComponents: { TextField },
        formComponents: { SubscribeButton },
        fieldContext,
        formContext,
      })

      const extended = base.extendForm({
        fieldComponents: { ExtendedTextField },
      })

      // extendForm should itself expose extendForm
      expect(typeof extended.extendForm).toBe('function')
    })
  })

  it('should render FieldGroup Subscribe without selector (default identity)', async () => {
    const formOpts = formOptions({
      defaultValues: {
        person: {
          firstName: 'FirstName',
          lastName: 'LastName',
        },
      },
    })

    const ChildFormAsField = withFieldGroup({
      defaultValues: formOpts.defaultValues.person,
      render: ({ group }) => {
        return (
          <div>
            <group.Field
              name="lastName"
              children={(field) => (
                <label>
                  Last Name:
                  <input
                    data-testid="lastName"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </label>
              )}
            />
            <group.Subscribe
              children={(state) => (
                <span data-testid="state-lastName">
                  {state.values.lastName}
                </span>
              )}
            />
          </div>
        )
      },
    })

    const Parent = () => {
      const form = useAppForm({
        ...formOpts,
      })
      return <ChildFormAsField form={form} fields="person" />
    }

    const { getByTestId } = render(<Parent />)
    const input = getByTestId('lastName')
    const stateLastName = getByTestId('state-lastName')

    expect(stateLastName).toHaveTextContent('LastName')

    await user.clear(input)
    await user.type(input, 'Updated')
    await waitFor(() => expect(stateLastName).toHaveTextContent('Updated'))
  })
})
