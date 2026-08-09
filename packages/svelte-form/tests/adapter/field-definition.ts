import { defineFieldGroup } from '../../src/index.js'

export const nameFieldGroup = defineFieldGroup(({ strict }) => ({
  name: strict<string>(),
}))

export const nameFields = nameFieldGroup.fields
