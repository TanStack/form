import { render } from 'vitest-browser-vue'
import { Fragment, defineComponent, h } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import { createFormHook } from '../src'
import type { AnyFieldApi } from '../src'

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
            run: () => formCalls.push('form'),
          },
        ],
      },
      defaultFieldOptions: {
        listenersMerge: 'prepend',
        listeners: [
          {
            triggers: ['change'],
            run: ({ fieldApi }) => fieldCalls.push(String(fieldApi.name)),
          },
        ],
      },
      defaultFormGroupOptions: {
        onSubmitInvalid,
      },
    })

    const Component = defineComponent(() => {
      const form = useAppForm({
        defaultValues: {
          direct: '',
          directArray: ['one'],
          group: {
            field: '',
            array: ['one'],
          },
        },
      })

      return () => (
        <>
          <form.Field name="direct">
            {({ field }: { field: AnyFieldApi }) => (
              <button onClick={() => field.handleChange('changed')}>
                Change direct field
              </button>
            )}
          </form.Field>
          <form.ArrayField name="directArray">
            {({ field }: { field: AnyFieldApi }) => (
              <button
                onClick={() =>
                  field.handleChange([...(field.value as Array<string>), 'two'])
                }
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
            {({ group }: { group: any }) => (
              <>
                <group.Field name="field">
                  {({ field }: { field: AnyFieldApi }) => (
                    <button onClick={() => field.handleChange('changed')}>
                      Change grouped field
                    </button>
                  )}
                </group.Field>
                <group.ArrayField name="array">
                  {({ field }: { field: AnyFieldApi }) => (
                    <button
                      onClick={() =>
                        field.handleChange([
                          ...(field.value as Array<string>),
                          'two',
                        ])
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
    })

    const view = await render(Component)

    await view.getByRole('button', { name: 'Change direct field' }).click()
    await view
      .getByRole('button', { name: 'Change direct array field' })
      .click()
    await view.getByRole('button', { name: 'Change grouped field' }).click()
    await view
      .getByRole('button', { name: 'Change grouped array field' })
      .click()

    expect(formCalls).toEqual(['form', 'form', 'form', 'form'])
    expect(fieldCalls).toEqual([
      'direct',
      'directArray',
      'group.field',
      'group.array',
    ])

    await view.getByRole('button', { name: 'Submit group' }).click()
    await vi.waitFor(() => expect(onSubmitInvalid).toHaveBeenCalledOnce())
  })
})
