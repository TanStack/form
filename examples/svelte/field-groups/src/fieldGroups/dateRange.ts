import { defineFieldGroup } from '@tanstack/svelte-form'
import DateRangeFields from './DateRangeFields.svelte'

const dateRangeFieldGroup = defineFieldGroup(({ strict }) => ({
  start: strict<string>(),
  end: strict<string>(),
}))

export const dateRangeFields = dateRangeFieldGroup.fields

export const DateRangeField = dateRangeFieldGroup.bindComponent(
  DateRangeFields,
  'fields',
)
