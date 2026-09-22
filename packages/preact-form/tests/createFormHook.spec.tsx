import { render } from 'vitest-browser-preact'
import { describe, expect, it, vi } from 'vitest'
import { createFormHook } from '../src'

describe('createFormHook defaults', () => {
  it('applies form, field, and form group defaults through public components', async () => {
    const formCalls: Array<string> = []
    const fieldCalls: Array<string> = []
    const onSubmitInvalid = vi.fn()
    const { useAppForm } = createFormHook({
      fieldComponents: {},
      formComponents: {},
      defaultFormOptions: {
        listenersMerge: 'append',
        listeners: [
          {
            triggers: ['change'],
            run: () => formCalls.push('default'),
          },
        ],
      },
      defaultFieldOptions: {
        listenersMerge: 'prepend',
        listeners: [
          {
            triggers: ['change'],
            run: ({ fieldApi }) =>
              fieldCalls.push(`default:${String(fieldApi.name)}`),
          },
        ],
      },
      defaultFormGroupOptions: {
        onSubmitInvalid,
      },
    })

    function Component() {
      const form = useAppForm({
        defaultValues: {
          direct: '',
          directArray: ['one'],
          group: {
            field: '',
            array: ['one'],
          },
        },
        listeners: [
          {
            triggers: ['change'],
            run: () => formCalls.push('local'),
          },
        ],
      })

      return (
        <>
          <form.Field
            name="direct"
            listeners={[
              {
                triggers: ['change'],
                run: ({ fieldApi }) =>
                  fieldCalls.push(`local:${String(fieldApi.name)}`),
              },
            ]}
          >
            {(field) => (
              <button onClick={() => field.handleChange('changed')}>
                Change direct field
              </button>
            )}
          </form.Field>
          <form.ArrayField name="directArray">
            {(field) => (
              <button
                onClick={() => field.handleChange([...field.value, 'two'])}
              >
                Change direct array field
              </button>
            )}
          </form.ArrayField>
          <form.FormGroup
            name="group"
            validators={[
              {
                triggers: [],
                run: () => 'Invalid group',
              },
            ]}
          >
            {(group) => (
              <>
                <group.Field name="field">
                  {(field) => (
                    <button onClick={() => field.handleChange('changed')}>
                      Change grouped field
                    </button>
                  )}
                </group.Field>
                <group.ArrayField name="array">
                  {(field) => (
                    <button
                      onClick={() =>
                        field.handleChange([...field.value, 'two'])
                      }
                    >
                      Change grouped array field
                    </button>
                  )}
                </group.ArrayField>
                <button onClick={() => void group.handleSubmit()}>
                  Submit group
                </button>
              </>
            )}
          </form.FormGroup>
        </>
      )
    }

    const view = render(<Component />)

    await view.getByRole('button', { name: 'Change direct field' }).click()
    await view
      .getByRole('button', { name: 'Change direct array field' })
      .click()
    await view.getByRole('button', { name: 'Change grouped field' }).click()
    await view
      .getByRole('button', { name: 'Change grouped array field' })
      .click()

    expect(formCalls).toEqual([
      'default',
      'local',
      'default',
      'local',
      'default',
      'local',
      'default',
      'local',
    ])
    expect(fieldCalls).toEqual([
      'local:direct',
      'default:direct',
      'default:directArray',
      'default:group.field',
      'default:group.array',
    ])

    await view.getByRole('button', { name: 'Submit group' }).click()
    await vi.waitFor(() => expect(onSubmitInvalid).toHaveBeenCalledOnce())
  })
})
