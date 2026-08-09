import { getFieldGroupHelpers } from '@tanstack/svelte-form'
import DateRangeFields from './DateRangeFields.svelte'

const { defineFields, helper, withFields } = getFieldGroupHelpers()

export const dateRangeFields = defineFields({
  start: helper.strict<string>(),
  end: helper.strict<string>(),
})

export const DateRangeField = withFields(
  dateRangeFields,
  DateRangeFields,
  'fields',
)
