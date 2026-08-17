import { fireEvent, render, waitFor } from '@testing-library/vue'
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
              <button
                aria-label="Change direct field"
                onClick={() => field.handleChange('changed')}
              />
            )}
          </form.Field>
          <form.ArrayField name="directArray">
            {({ field }: { field: AnyFieldApi }) => (
              <button
                aria-label="Change direct array field"
                onClick={() =>
                  field.handleChange([...(field.value as Array<string>), 'two'])
                }
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
            {({ group }: { group: any }) => (
              <>
                <group.Field name="field">
                  {({ field }: { field: AnyFieldApi }) => (
                    <button
                      aria-label="Change grouped field"
                      onClick={() => field.handleChange('changed')}
                    />
                  )}
                </group.Field>
                <group.ArrayField name="array">
                  {({ field }: { field: AnyFieldApi }) => (
                    <button
                      aria-label="Change grouped array field"
                      onClick={() =>
                        field.handleChange([
                          ...(field.value as Array<string>),
                          'two',
                        ])
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
    })

    const view = render(Component)

    await fireEvent.click(view.getByLabelText('Change direct field'))
    await fireEvent.click(view.getByLabelText('Change direct array field'))
    await fireEvent.click(view.getByLabelText('Change grouped field'))
    await fireEvent.click(view.getByLabelText('Change grouped array field'))

    expect(formCalls).toEqual(['form', 'form', 'form', 'form'])
    expect(fieldCalls).toEqual([
      'direct',
      'directArray',
      'group.field',
      'group.array',
    ])

    await fireEvent.click(view.getByLabelText('Submit group'))
    await waitFor(() => expect(onSubmitInvalid).toHaveBeenCalledOnce())
  })
})
