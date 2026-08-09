import { defineFieldGroup } from '../../src/index.js'

export const nameFieldGroup = defineFieldGroup(({ strict }) => ({
  name: strict<string>(),
  items: strict<Array<string>>(),
}))

export const nameFields = nameFieldGroup.fields
