import DateRangeFieldComponent from './DateRangeField.vue'
import { dateRange } from './definitions'

export const DateRangeField = dateRange.bindComponent(
  DateRangeFieldComponent,
  'fields',
)
