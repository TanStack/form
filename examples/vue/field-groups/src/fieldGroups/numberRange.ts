import NumberRangeFieldComponent from './NumberRangeField.vue'
import { numberRange } from './definitions'

export const NumberRangeField = numberRange.bindComponent(
  NumberRangeFieldComponent,
  'fields',
)
