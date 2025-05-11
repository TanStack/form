import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { formOptions } from '@tanstack/form-core'
import userEvent from '@testing-library/user-event'
import { createFormHook, createFormHookContexts, useStore } from '../src'

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

const { useAppForm, withForm, createFormGroup, withFormLens } = createFormHook({
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

  it('should handle createFormGroup types properly', () => {
    const formOpts = formOptions({
      defaultValues: {
        firstName: 'John',
        lastName: 'Doe',
      },
    })

    const ChildForm = createFormGroup({
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

  it('should handle withFormLens types properly', () => {
    const formOpts = formOptions({
      defaultValues: {
        person: {
          firstName: 'John',
          lastName: 'Doe',
        },
      },
    })

    const ChildForm = withFormLens({
      defaultValues: formOpts.defaultValues.person,
      // Optional, but adds props to the `render` function outside of `form`
      props: {
        title: 'Child Form',
      },
      render: ({ lens, title }) => {
        return (
          <div>
            <p>{title}</p>
            <lens.AppField
              name="firstName"
              children={(field) => <field.TextField label="First Name" />}
            />
            <lens.AppForm>
              <lens.SubscribeButton label="Submit" />
            </lens.AppForm>
          </div>
        )
      },
    })

    const Parent = () => {
      const form = useAppForm({
        ...formOpts,
      })

      return <ChildForm form={form} name="person" title={'Testing'} />
    }

    const { getByLabelText, getByText } = render(<Parent />)
    const input = getByLabelText('First Name')
    expect(input).toHaveValue('John')
    expect(getByText('Testing')).toBeInTheDocument()
  })

  it('should use the correct field name in Field with withFormLens', () => {
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

    const ChildFormAsField = withFormLens({
      defaultValues: formOpts.defaultValues.person,
      render: ({ lens }) => {
        return (
          <div>
            <p>{lens.name}</p>
            <lens.AppField
              name="firstName"
              children={(field) => <field.TextField label={field.name} />}
            />
            <lens.AppForm>
              <lens.SubscribeButton label="Submit" />
            </lens.AppForm>
          </div>
        )
      },
    })
    const ChildFormAsArray = withFormLens({
      defaultValues: [formOpts.defaultValues.person],
      props: {
        title: '',
      },
      render: ({ lens, title }) => {
        return (
          <div>
            <p>{title}</p>
            <lens.AppField
              name="[0].firstName"
              children={(field) => <field.TextField label={field.name} />}
            />
            <lens.AppForm>
              <lens.SubscribeButton label="Submit" />
            </lens.AppForm>
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
          <ChildFormAsField form={form} name="person" />
          <ChildFormAsArray form={form} name="people" title="Testing" />
          <ChildFormAsField form={form} name="people[1]" />
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

    const ChildFormAsField = withFormLens({
      defaultValues: formOpts.defaultValues.person,
      render: ({ lens }) => {
        return (
          <div>
            <p>{lens.name}</p>
            <lens.Field
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
            <lens.Subscribe selector={(state) => state.values.lastName}>
              {(lastName) => <p>{lastName}</p>}
            </lens.Subscribe>
          </div>
        )
      },
    })

    const Parent = () => {
      const form = useAppForm({
        ...formOpts,
      })
      return <ChildFormAsField form={form} name="person" />
    }

    const { getByLabelText, getByText } = render(<Parent />)
    const input = getByLabelText('person.firstName')
    expect(input).toHaveValue('John')
    expect(getByText('Doe')).toBeInTheDocument()
  })

  it('should not lose focus on update with withFormLens', async () => {
    const formOpts = formOptions({
      defaultValues: {
        person: {
          firstName: 'John',
          lastName: 'Doe',
        },
      },
    })

    const ChildForm = withFormLens({
      defaultValues: formOpts.defaultValues.person,
      render: function Render({ lens }) {
        const firstName = useStore(
          lens.store,
          (state) => state.values.firstName,
        )
        return (
          <div>
            <p>{firstName}</p>
            <lens.Field
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
            <lens.Subscribe selector={(state) => state.values.lastName}>
              {(lastName) => <p>{lastName}</p>}
            </lens.Subscribe>
          </div>
        )
      },
    })

    const Parent = () => {
      const form = useAppForm({
        ...formOpts,
      })
      return <ChildForm form={form} name="person" />
    }

    const { getByLabelText } = render(<Parent />)

    const input = getByLabelText('person.firstName')
    input.focus()
    expect(input).toHaveFocus()

    await userEvent.clear(input)
    await userEvent.type(input, 'Something')

    expect(input).toHaveFocus()
  })
})
