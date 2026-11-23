import React from 'react'
import { Subscribe, createFormHook } from '../../../src'

const { useAppForm } = createFormHook({
  fieldComponents: {},
  formComponents: {},
  defaultFieldOptions: { errorBoundary: true },
})

export function DefaultFieldBoundaries() {
  const form = useAppForm({
    defaultValues: {
      direct: { value: '' },
      directArray: [''],
      overridden: { value: '' },
      cleared: { value: '' },
      group: { field: { value: '' }, array: [''] },
    },
    validators: [
      {
        triggers: [],
        run: () => ({
          fields: {
            'direct.value': 'Direct error',
            'directArray[0]': 'Array error',
            'overridden.value': 'Overridden error',
            'cleared.value': 'Cleared error',
            'group.field.value': 'Group field error',
            'group.array[0]': 'Group array error',
          },
        }),
      },
    ],
  })

  return (
    <>
      <form.Field name="direct">
        {(field) => (
          <output aria-label="Direct errors">
            {field.errors.map((error) => error.message).join(', ') || 'None'}
          </output>
        )}
      </form.Field>
      <form.ArrayField name="directArray">
        {(field) => (
          <Subscribe
            source={field.atom}
            selector={(state) => state.meta.errors}
          >
            {(errors) => (
              <output aria-label="Array errors">
                {errors.map((error) => error.message).join(', ') || 'None'}
              </output>
            )}
          </Subscribe>
        )}
      </form.ArrayField>
      <form.Field name="overridden" errorBoundary={false}>
        {(field) => (
          <output aria-label="Overridden errors">
            {field.errors.map((error) => error.message).join(', ') || 'None'}
          </output>
        )}
      </form.Field>
      <form.Field name="cleared" errorBoundary={undefined}>
        {(field) => (
          <output aria-label="Cleared errors">
            {field.errors.map((error) => error.message).join(', ') || 'None'}
          </output>
        )}
      </form.Field>
      <form.FormGroup name="group">
        {(group) => (
          <>
            <group.Field name="field">
              {(field) => (
                <output aria-label="Group field errors">
                  {field.errors.map((error) => error.message).join(', ') ||
                    'None'}
                </output>
              )}
            </group.Field>
            <group.ArrayField name="array">
              {(field) => (
                <Subscribe
                  source={field.atom}
                  selector={(state) => state.meta.errors}
                >
                  {(errors) => (
                    <output aria-label="Group array errors">
                      {errors.map((error) => error.message).join(', ') ||
                        'None'}
                    </output>
                  )}
                </Subscribe>
              )}
            </group.ArrayField>
          </>
        )}
      </form.FormGroup>
      <button onClick={() => form.handleSubmit()}>Submit form</button>
    </>
  )
}
