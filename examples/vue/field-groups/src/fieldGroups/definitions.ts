import { defineFieldGroup } from '@tanstack/vue-form'

// Each group declares virtual names. Callers bind them to their own paths.
export const lowerBound = defineFieldGroup(({ strict }) => ({
  value: strict<string>(),
}))

export const upperBound = defineFieldGroup(({ strict }) => ({
  value: strict<string>(),
  lowerBound: strict<string>(),
}))

export const numberRange = defineFieldGroup(({ strict }) => ({
  minimum: strict<string>(),
  maximum: strict<string>(),
}))

export const dateRange = defineFieldGroup(({ strict }) => ({
  start: strict<string>(),
  end: strict<string>(),
}))
