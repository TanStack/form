import { fireEvent, render, waitFor } from '@testing-library/preact'
import Preact from 'preact/compat'
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
              <button
                aria-label="Change direct field"
                onClick={() => field.handleChange('changed')}
              />
            )}
          </form.Field>
          <form.ArrayField name="directArray">
            {(field) => (
              <button
                aria-label="Change direct array field"
                onClick={() => field.handleChange([...field.value, 'two'])}
              />
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
                    <button
                      aria-label="Change grouped field"
                      onClick={() => field.handleChange('changed')}
                    />
                  )}
                </group.Field>
                <group.ArrayField name="array">
                  {(field) => (
                    <button
                      aria-label="Change grouped array field"
                      onClick={() =>
                        field.handleChange([...field.value, 'two'])
                      }
                    />
                  )}
                </group.ArrayField>
                <button
                  aria-label="Submit group"
                  onClick={() => void group.handleSubmit()}
                />
              </>
            )}
          </form.FormGroup>
        </>
      )
    }

    const view = render(<Component />)

    fireEvent.click(view.getByLabelText('Change direct field'))
    fireEvent.click(view.getByLabelText('Change direct array field'))
    fireEvent.click(view.getByLabelText('Change grouped field'))
    fireEvent.click(view.getByLabelText('Change grouped array field'))

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

    fireEvent.click(view.getByLabelText('Submit group'))
    await waitFor(() => expect(onSubmitInvalid).toHaveBeenCalledOnce())
  })
})
