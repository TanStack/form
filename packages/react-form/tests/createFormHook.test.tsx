import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { createFormHook, createFormHookContext, useForm } from '../src'

describe('createFormHook', () => {
  it('should allow to set default value', () => {
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

    type Person = {
      firstName: string
      lastName: string
    }

    const ChildForm = withForm<Person, { title: string }>(({ form, title }) => {
      return (
        <div>
          <p>{title}</p>
          <form.AppField
            name="firstName"
            children={(field) => <field.TextField label="First Name" />}
          />
        </div>
      )
    })

    function Comp() {
      const form = useAppForm({
        defaultValues: {
          firstName: 'FirstName',
          lastName: 'LastName',
        } as Person,
      })

      return (
        <>
          <ChildForm form={form} title={'Testing'} />
        </>
      )
    }

    const { getByLabelText } = render(<Comp />)
    const input = getByLabelText('Testing')
    expect(input).toHaveValue('FirstName')
  })
})
