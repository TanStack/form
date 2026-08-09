import { html } from 'lit'
import { defineFieldGroup } from '@tanstack/lit-form'
import { stringField } from './string-field'

const dateRangeFieldGroup = defineFieldGroup(({ strict }) => ({
  start: strict<string>(),
  end: strict<string>(),
}))

function dateRangeField(props: {
  fields: typeof dateRangeFieldGroup.fields
  label: string
}) {
  return html`
    <fieldset>
      <legend>${props.label}</legend>
      ${props.fields.field({ name: 'start' }, (field) =>
        stringField(field, 'Start date', 'date'),
      )}
      ${props.fields.field(
        {
          name: 'end',
          validators: [
            {
              triggers: [
                {
                  trigger: 'change',
                  when: ({ value }) => Boolean(value),
                },
              ],
              watchFields: ['start'],
              run: ({ value }) => {
                const start = props.fields.getFieldValue('start')
                if (start && value < start) {
                  return 'End date must be after the start date'
                }
              },
            },
          ],
        },
        (field) => stringField(field, 'End date', 'date'),
      )}
    </fieldset>
  `
}

export const DateRangeField = dateRangeFieldGroup.bindComponent(
  dateRangeField,
  'fields',
)
