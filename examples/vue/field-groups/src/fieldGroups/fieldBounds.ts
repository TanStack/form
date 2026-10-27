import LowerBoundFieldComponent from './LowerBoundField.vue'
import UpperBoundFieldComponent from './UpperBoundField.vue'
import { lowerBound, upperBound } from './definitions'

export const LowerBoundField = lowerBound.bindComponent(
  LowerBoundFieldComponent,
  'fields',
)
export const UpperBoundField = upperBound.bindComponent(
  UpperBoundFieldComponent,
  'fields',
)
