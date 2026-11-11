import { defineFieldGroup } from '@tanstack/svelte-form'
import NumberRangeFields from './NumberRangeFields.svelte'

const numberRangeFieldGroup = defineFieldGroup(({ strict }) => ({
  minimum: strict<string>(),
  maximum: strict<string>(),
}))

export const numberRangeFields = numberRangeFieldGroup.fields

export const NumberRangeField = numberRangeFieldGroup.bindComponent(
  NumberRangeFields,
  'fields',
)
