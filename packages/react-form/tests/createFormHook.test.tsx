import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { formOptions } from '@tanstack/form-core'
import { createFormHook, createFormHookContext, useForm } from '../src'

const { context, useFieldContext } = createFormHookContext()

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

const { useAppForm, withForm } = createFormHook({
  components: {
    TextField,
  },
  context,
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
})
