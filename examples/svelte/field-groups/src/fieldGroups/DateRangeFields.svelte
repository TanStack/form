<script lang="ts">
  import { untrack } from 'svelte'
  import { useSelector } from '@tanstack/svelte-form'
  import FieldError from '../FieldError.svelte'
  import type { FieldWithValue } from '@tanstack/svelte-form'
  import type { dateRangeFields } from './dateRange.js'

  export interface Props {
    fields: typeof dateRangeFields
    label: string
  }

  const { fields, label }: Props = $props()
  const start = useSelector(
    untrack(() => fields.atom),
    (values) => values.start,
  )

  function dateFieldProps(field: FieldWithValue<string>, fieldLabel: string) {
    return { field, label: fieldLabel }
  }
</script>

{#snippet dateField(field: FieldWithValue<string>, fieldLabel: string)}
  {@const props = dateFieldProps(field, fieldLabel)}
  <label class:validating={props.field.meta.isValidating}>
    <span>{props.label}</span>
    <input
      name={props.field.name}
      type="date"
      value={props.field.value}
      onblur={props.field.handleBlur}
      oninput={(event) => props.field.handleChange(event.currentTarget.value)}
      aria-invalid={props.field.meta.isInvalid}
    />
    <FieldError field={props.field} />
  </label>
{/snippet}

<fieldset>
  <legend>{label}</legend>
  <fields.Field name="start">
    {#snippet children(field)}
      {@render dateField(field, 'Start date')}
    {/snippet}
  </fields.Field>
  <fields.Field
    name="end"
    validators={[
      {
        triggers: [
          {
            trigger: 'change',
            when: ({ value }) => Boolean(value && start.current),
          },
        ],
        watchFields: ['start'],
        run: ({ value }) => {
          if (value < start.current) {
            return 'End date must be after the start date'
          }
        },
      },
    ]}
  >
    {#snippet children(field)}
      {@render dateField(field, 'End date')}
    {/snippet}
  </fields.Field>
</fieldset>
