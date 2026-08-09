import { defineFieldGroup } from '@tanstack/svelte-form'
import { z } from 'zod'
import LowerBoundFields from './LowerBoundFields.svelte'
import UpperBoundFields from './UpperBoundFields.svelte'

export const boundsSchema = z.coerce.number<string>().int()

const lowerBoundFieldGroup = defineFieldGroup(({ strict }) => ({
  value: strict<string>(),
}))

const upperBoundFieldGroup = defineFieldGroup(({ strict }) => ({
  value: strict<string>(),
  lowerBound: strict<string>(),
}))

export const lowerBoundFields = lowerBoundFieldGroup.fields
export const upperBoundFields = upperBoundFieldGroup.fields

export const LowerBoundField = lowerBoundFieldGroup.bindComponent(
  LowerBoundFields,
  'fields',
)

export const UpperBoundField = upperBoundFieldGroup.bindComponent(
  UpperBoundFields,
  'fields',
)
