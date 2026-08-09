import { getFieldGroupHelpers } from '@tanstack/svelte-form'
import { z } from 'zod'
import LowerBoundFields from './LowerBoundFields.svelte'
import UpperBoundFields from './UpperBoundFields.svelte'

export const boundsSchema = z.coerce.number<string>().int()

const { defineFields, helper, withFields } = getFieldGroupHelpers()

export const lowerBoundFields = defineFields({
  value: helper.strict<string>(),
})

export const upperBoundFields = defineFields({
  value: helper.strict<string>(),
  lowerBound: helper.strict<string>(),
})

export const LowerBoundField = withFields(
  lowerBoundFields,
  LowerBoundFields,
  'fields',
)

export const UpperBoundField = withFields(
  upperBoundFields,
  UpperBoundFields,
  'fields',
)
