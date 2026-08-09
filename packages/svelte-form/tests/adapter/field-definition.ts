import { getFieldGroupHelpers } from '../../src/index.js'

const { defineFields, helper } = getFieldGroupHelpers()

export const nameFields = defineFields({
  name: helper.strict<string>(),
})
